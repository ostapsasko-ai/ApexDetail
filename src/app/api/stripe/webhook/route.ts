import Stripe from "stripe";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return new Response("Webhook Stripe nie jest skonfigurowany", { status: 503 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return new Response("Nieprawidłowy podpis webhooka", { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.metadata?.orderId) await getPrisma().order.update({ where: { id: session.metadata.orderId }, data: { status: "PAID", paymentStatus: "SUCCEEDED" } });
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    if (session.metadata?.orderId) await getPrisma().order.update({ where: { id: session.metadata.orderId }, data: { status: "CANCELLED", paymentStatus: "FAILED" } });
  }
  return new Response("ok");
}

