import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { bookingDateTime, bookingSchema, buildSlotKey } from "@/lib/booking";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/integrations";

function reference() { return `APX-${Date.now().toString(36).toUpperCase()}`; }

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Rezerwacje online są nieaktywne do czasu skonfigurowania PostgreSQL." }, { status: 503 });
  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Sprawdź dane formularza.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const input = parsed.data;
  try {
    const booking = await getPrisma().booking.create({ data: { reference: reference(), slotKey: buildSlotKey(input.date, input.time), scheduledAt: bookingDateTime(input.date, input.time), serviceIds: input.serviceIds, vehicleBrand: input.vehicleBrand, vehicleModel: input.vehicleModel, customerName: input.customerName, phone: input.phone, email: input.email, notes: input.notes || null } });
    const email = await sendTransactionalEmail({ to: booking.email, subject: `ApexDetail — rezerwacja ${booking.reference}`, text: `Otrzymaliśmy rezerwację na ${input.date}, ${input.time}. Studio potwierdzi termin osobno.` });
    if (email.status !== booking.emailStatus) await getPrisma().booking.update({ where: { id: booking.id }, data: { emailStatus: email.status } });
    return NextResponse.json({ id: booking.id, reference: booking.reference, emailStatus: email.status }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "Ten termin został właśnie zajęty. Wybierz inny." }, { status: 409 });
    console.error("Booking persistence failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Nie udało się zapisać rezerwacji. Spróbuj ponownie." }, { status: 500 });
  }
}

