import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutSchema, priceCheckout, SHIPPING_METHODS } from "@/lib/checkout";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";
import { getIntegrationStates } from "@/lib/integrations";

function orderReference() { return `ORD-${Date.now().toString(36).toUpperCase()}`; }

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Sprawdź dane zamówienia.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  let priced: ReturnType<typeof priceCheckout>;
  try { priced = priceCheckout(parsed.data); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Nieprawidłowy koszyk" }, { status: 409 }); }

  const integrations = getIntegrationStates(process.env);
  if (integrations.stripe === "demo") return NextResponse.json({ mode: "demo", priced, message: "Tryb demonstracyjny: żadna karta nie została obciążona. Dodaj klucze Stripe, aby aktywować płatności." });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Płatność wymaga skonfigurowanej bazy PostgreSQL." }, { status: 503 });

  const input = parsed.data;
  const order = await getPrisma().order.create({ data: {
    reference: orderReference(), email: input.email, customerName: input.customerName, phone: input.phone,
    shippingMethod: input.shippingMethod ?? null, shippingPrice: priced.shipping, shippingAddress: input.address ?? undefined, pickupPoint: input.pickupPoint ?? undefined,
    subtotal: priced.subtotal, total: priced.total,
    items: { create: priced.items.map((item) => ({ ...item })) }
  } });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const shippingName = input.shippingMethod ? SHIPPING_METHODS.find(({ id }) => id === input.shippingMethod)?.name : undefined;
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.items.map((item) => ({ quantity: item.quantity, price_data: { currency: "pln", unit_amount: item.unitPrice * 100, product_data: { name: item.name } } }));
  if (priced.shipping && shippingName) lineItems.push({ quantity: 1, price_data: { currency: "pln", unit_amount: priced.shipping * 100, product_data: { name: `Dostawa — ${shippingName}` } } });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({ mode: "payment", customer_email: input.email, line_items: lineItems, success_url: `${baseUrl}/zamowienie/potwierdzenie?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${baseUrl}/zamowienie?payment=cancelled`, metadata: { orderId: order.id, reference: order.reference } });
  await getPrisma().order.update({ where: { id: order.id }, data: { stripeSessionId: session.id, status: "PENDING_PAYMENT" } });
  return NextResponse.json({ mode: "live", url: session.url });
}

