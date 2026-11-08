import { describe, expect, it } from "vitest";
import { filterProducts, PRODUCTS } from "./catalog";

describe("filterProducts", () => {
  it("wyszukuje bez rozróżniania wielkości liter", () => {
    expect(filterProducts(PRODUCTS, { query: "MIKROFIBRA", category: "all", sort: "featured" }).map(({ id }) => id)).toEqual(["microfiber-pro"]);
  });

  it("filtruje po kategorii", () => {
    const result = filterProducts(PRODUCTS, { query: "", category: "wheel-care", sort: "featured" });
    expect(result.every(({ category }) => category === "wheel-care")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("sortuje ceny rosnąco i malejąco", () => {
    expect(filterProducts(PRODUCTS, { query: "", category: "all", sort: "price-asc" }).map(({ price }) => price)).toEqual([39, 49, 59, 69, 79, 89, 119, 189]);
    expect(filterProducts(PRODUCTS, { query: "", category: "all", sort: "price-desc" })[0].price).toBe(189);
  });

  it("nie modyfikuje wejściowej tablicy podczas sortowania", () => {
    const before = PRODUCTS.map(({ id }) => id);
    filterProducts(PRODUCTS, { query: "", category: "all", sort: "price-asc" });
    expect(PRODUCTS.map(({ id }) => id)).toEqual(before);
  });
});
