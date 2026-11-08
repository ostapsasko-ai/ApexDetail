import { describe, expect, it } from "vitest";
import { bookingDateTime, bookingSchema, buildSlotKey, isSlotAvailable } from "./booking";

const validBooking = {
  date: "2099-06-15",
  time: "10:00",
  serviceIds: ["paint-polish"],
  vehicleBrand: "Volvo",
  vehicleModel: "V60",
  customerName: "Jan Kowalski",
  phone: "+48 500 600 700",
  email: "jan@example.com",
  notes: "Proszę o kontakt po 16:00.",
  consent: true
};

describe("bookingSchema", () => {
  it("akceptuje kompletną rezerwację", () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("odrzuca pusty zakres usług", () => {
    expect(bookingSchema.safeParse({ ...validBooking, serviceIds: [] }).success).toBe(false);
  });

  it("odrzuca datę w przeszłości", () => {
    expect(bookingSchema.safeParse({ ...validBooking, date: "2020-01-01" }).success).toBe(false);
  });

  it("odrzuca błędny e-mail i brak zgody", () => {
    const result = bookingSchema.safeParse({ ...validBooking, email: "nie-email", consent: false });
    expect(result.success).toBe(false);
  });
});

describe("isSlotAvailable", () => {
  it("blokuje aktywną rezerwację tego samego slotu", () => {
    const slotKey = buildSlotKey("2099-06-15", "10:00");
    expect(isSlotAvailable([{ slotKey, status: "CONFIRMED" }], slotKey)).toBe(false);
  });

  it("pozwala użyć anulowanego slotu", () => {
    const slotKey = buildSlotKey("2099-06-15", "10:00");
    expect(isSlotAvailable([{ slotKey, status: "CANCELLED" }], slotKey)).toBe(true);
  });
});

describe("bookingDateTime", () => {
  it("uwzględnia czas zimowy i letni w Europe/Warsaw", () => {
    expect(bookingDateTime("2099-01-15", "10:00").toISOString()).toBe("2099-01-15T09:00:00.000Z");
    expect(bookingDateTime("2099-06-15", "10:00").toISOString()).toBe("2099-06-15T08:00:00.000Z");
  });
});
