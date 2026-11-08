import { describe, expect, it } from "vitest";
import { cartReducer, EMPTY_CART, getCartTotals, type CartItem } from "./cart";

const product: CartItem = { id: "product-shampoo", kind: "product", name: "Szampon Neutral", unitPrice: 69, quantity: 1 };
const service: CartItem = { id: "service-polish", kind: "service", name: "Polerowanie lakieru", unitPrice: 550, quantity: 1, vehicle: "sedan" };

describe("cartReducer", () => {
  it("zwiększa ilość tego samego produktu", () => {
    const once = cartReducer(EMPTY_CART, { type: "add", item: product });
    const twice = cartReducer(once, { type: "add", item: product });
    expect(twice.items).toEqual([{ ...product, quantity: 2 }]);
  });

  it("nie zwiększa ilości usługi i zastępuje jej konfigurację", () => {
    const once = cartReducer(EMPTY_CART, { type: "add", item: service });
    const updated = cartReducer(once, { type: "add", item: { ...service, unitPrice: 625, vehicle: "suv" } });
    expect(updated.items).toEqual([{ ...service, unitPrice: 625, vehicle: "suv", quantity: 1 }]);
  });

  it("usuwa pozycję przy ilości zero i ignoruje ilość ujemną", () => {
    const state = cartReducer(EMPTY_CART, { type: "hydrate", items: [product] });
    expect(cartReducer(state, { type: "setQuantity", id: product.id, quantity: 0 }).items).toEqual([]);
    expect(cartReducer(state, { type: "setQuantity", id: product.id, quantity: -2 })).toEqual(state);
  });
});

describe("getCartTotals", () => {
  it("oddziela produkty od usług i nie nalicza wysyłki usługom", () => {
    const totals = getCartTotals([{ ...product, quantity: 2 }, service]);
    expect(totals).toEqual({ productSubtotal: 138, serviceSubtotal: 550, subtotal: 688, itemCount: 3, needsShipping: true });
    expect(getCartTotals([service]).needsShipping).toBe(false);
  });
});
