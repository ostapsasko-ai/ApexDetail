import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkout";
import { getIntegrationStates } from "./integrations";

const customer = { customerName: "Anna Nowak", email: "anna@example.com", phone: "+48 600 700 800", consent: true };
const serviceItem = { id: "paint-polish", kind: "service" as const, quantity: 1, vehicle: "sedan" as const };
const productItem = { id: "neutral-shampoo", kind: "product" as const, quantity: 1 };

describe("checkoutSchema", () => {
  it("nie wymaga wysyłki dla samych usług", () => {
    expect(checkoutSchema.safeParse({ ...customer, items: [serviceItem] }).success).toBe(true);
  });

  it("wymaga metody wysyłki dla produktu", () => {
    expect(checkoutSchema.safeParse({ ...customer, items: [productItem] }).success).toBe(false);
  });

  it("wymaga pełnego adresu dla kuriera", () => {
    const base = { ...customer, items: [productItem], shippingMethod: "dpd" };
    expect(checkoutSchema.safeParse(base).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, address: { street: "Torowa 24", postalCode: "00-950", city: "Warszawa", country: "PL" } }).success).toBe(true);
  });

  it("wymaga rzeczywiście wybranego punktu dla Paczkomatu", () => {
    const base = { ...customer, items: [productItem], shippingMethod: "inpost-locker" };
    expect(checkoutSchema.safeParse(base).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, pickupPoint: { id: "WAW01A", name: "Paczkomat WAW01A", address: "ul. Testowa 1" } }).success).toBe(true);
  });
});

describe("getIntegrationStates", () => {
  it("jawnie oznacza brak kluczy jako demo lub niedostępne", () => {
    expect(getIntegrationStates({})).toEqual({ stripe: "demo", maps: "unavailable", pickupPoints: "unavailable", email: "unavailable" });
  });
});
