import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./navigation";

describe("NAV_ITEMS", () => {
  it("chroni komplet tras publicznych przed martwymi odnośnikami", () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      "/",
      "/uslugi",
      "/kalkulator",
      "/rezerwacja",
      "/sklep",
      "/koszyk",
      "/zamowienie",
      "/galeria",
      "/o-nas",
      "/kontakt",
      "/admin"
    ]);
  });

  it("nie pozwala na powtórzone etykiety w menu", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
