import { z } from "zod";
import { PRODUCTS } from "./catalog";
import { calculateEstimate, SERVICES, VEHICLES, type VehicleType } from "./pricing";

export const SHIPPING_METHODS = [
  { id: "inpost-courier", name: "InPost Kurier", price: 17, type: "courier" },
  { id: "inpost-locker", name: "InPost Paczkomat", price: 15, type: "pickup" },
  { id: "dhl", name: "DHL", price: 19, type: "courier" },
  { id: "dpd", name: "DPD", price: 18, type: "courier" },
  { id: "poczta", name: "Poczta Polska", price: 16, type: "courier" }
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

const itemSchema = z.discriminatedUnion("kind", [
  z.object({ id: z.string().min(1), kind: z.literal("product"), quantity: z.number().int().min(1).max(20) }),
  z.object({ id: z.string().min(1), kind: z.literal("service"), quantity: z.literal(1), vehicle: z.enum(VEHICLES.map(({ id }) => id) as [VehicleType, ...VehicleType[]]) })
]);

const addressSchema = z.object({ street: z.string().trim().min(3), postalCode: z.string().trim().regex(/^\d{2}-\d{3}$/), city: z.string().trim().min(2), country: z.literal("PL") });
const pickupSchema = z.object({ id: z.string().min(2), name: z.string().min(2), address: z.string().min(3) });

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(3).max(100),
  email: z.email(),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{7,20}$/),
  consent: z.literal(true),
  items: z.array(itemSchema).min(1),
  shippingMethod: z.enum(SHIPPING_METHODS.map(({ id }) => id) as [ShippingMethodId, ...ShippingMethodId[]]).optional(),
  address: addressSchema.optional(),
  pickupPoint: pickupSchema.optional()
}).superRefine((value, context) => {
  const needsShipping = value.items.some(({ kind }) => kind === "product");
  if (!needsShipping) return;
  if (!value.shippingMethod) { context.addIssue({ code: "custom", message: "Wybierz metodę dostawy", path: ["shippingMethod"] }); return; }
  const method = SHIPPING_METHODS.find(({ id }) => id === value.shippingMethod)!;
  if (method.type === "courier" && !value.address) context.addIssue({ code: "custom", message: "Podaj adres dostawy", path: ["address"] });
  if (method.type === "pickup" && !value.pickupPoint) context.addIssue({ code: "custom", message: "Wybierz prawdziwy punkt odbioru", path: ["pickupPoint"] });
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export function priceCheckout(input: CheckoutInput) {
  const items = input.items.map((item) => {
    if (item.kind === "product") {
      const product = PRODUCTS.find(({ id }) => id === item.id);
      if (!product || product.stock < item.quantity) throw new Error("Produkt jest niedostępny w żądanej ilości");
      return { externalId: product.id, name: product.name, kind: "PRODUCT" as const, unitPrice: product.price, quantity: item.quantity };
    }
    if (!SERVICES.some(({ id }) => id === item.id)) throw new Error("Nieznana usługa");
    const estimate = calculateEstimate(item.vehicle, [item.id]);
    return { externalId: item.id, name: estimate.items[0].name, kind: "SERVICE" as const, unitPrice: estimate.items[0].price, quantity: 1 };
  });
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = input.shippingMethod ? SHIPPING_METHODS.find(({ id }) => id === input.shippingMethod)?.price ?? 0 : 0;
  return { items, subtotal, shipping, total: subtotal + shipping };
}

