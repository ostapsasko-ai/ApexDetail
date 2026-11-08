import { z } from "zod";
import { SERVICES } from "./pricing";

export const AVAILABLE_TIMES = ["08:00", "09:30", "10:00", "11:00", "12:30", "14:00", "15:30", "17:00"] as const;

function todayInWarsaw() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Wybierz poprawną datę").refine((value) => value >= todayInWarsaw(), "Data nie może być w przeszłości"),
  time: z.enum(AVAILABLE_TIMES, { message: "Wybierz dostępny termin" }),
  serviceIds: z.array(z.string()).min(1, "Wybierz co najmniej jedną usługę").superRefine((ids, context) => {
    ids.forEach((id, index) => { if (!SERVICES.some((service) => service.id === id)) context.addIssue({ code: "custom", message: "Nieznana usługa", path: [index] }); });
  }),
  vehicleBrand: z.string().trim().min(2, "Podaj markę").max(60),
  vehicleModel: z.string().trim().min(1, "Podaj model").max(60),
  customerName: z.string().trim().min(3, "Podaj imię i nazwisko").max(100),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{7,20}$/, "Podaj poprawny numer telefonu"),
  email: z.email("Podaj poprawny adres e-mail"),
  notes: z.string().trim().max(1000).optional().default(""),
  consent: z.literal(true, { message: "Zgoda jest wymagana" })
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type BookingLike = { slotKey: string; status: string };
export function buildSlotKey(date: string, time: string) { return `${date}|${time}`; }
export function isSlotAvailable(bookings: BookingLike[], slotKey: string) { return !bookings.some((booking) => booking.slotKey === slotKey && booking.status !== "CANCELLED"); }
export function bookingDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date(utcGuess));
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const renderedAsUtc = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));
  return new Date(utcGuess - (renderedAsUtc - utcGuess));
}

