import { describe, expect, it } from "vitest";
import { calculateEstimate, formatPln } from "./pricing";

describe("calculateEstimate", () => {
  it.each([
    ["hatchback", ["detail-wash"], 150],
    ["sedan", ["paint-polish", "interior-detail"], 935],
    ["coupe", ["headlight-restoration"], 198],
    ["wagon", ["ceramic-coating"], 1725],
    ["suv", ["paint-correction"], 1125]
  ] as const)("stosuje mnożnik dla %s", (vehicle, serviceIds, expected) => {
    expect(calculateEstimate(vehicle, [...serviceIds]).total).toBe(expected);
  });

  it("zwraca rozbicie pozycji zgodne z sumą", () => {
    const estimate = calculateEstimate("suv", ["wheel-protection", "upholstery-cleaning"]);
    expect(estimate.items.map(({ price }) => price)).toEqual([250, 313]);
    expect(estimate.total).toBe(563);
  });

  it("zwraca zero dla pustego wyboru", () => {
    expect(calculateEstimate("sedan", [])).toEqual({ multiplier: 1.1, items: [], total: 0 });
  });

  it("odrzuca nieznany identyfikator zamiast go cicho pomijać", () => {
    expect(() => calculateEstimate("sedan", ["nie-istnieje"])).toThrow("Nieznana usługa");
  });
});

describe("formatPln", () => {
  it("formatuje ceny po polsku i w PLN", () => {
    expect(formatPln(1500)).toMatch(/^1[\s ]?500,00[\s ]*zł$/);
  });
});
