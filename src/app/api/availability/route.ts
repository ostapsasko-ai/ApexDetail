import { NextResponse } from "next/server";
import { AVAILABLE_TIMES, buildSlotKey } from "@/lib/booking";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Nieprawidłowa data" }, { status: 400 });
  if (!isDatabaseConfigured()) return NextResponse.json({ mode: "unavailable", message: "Kalendarz wymaga skonfigurowanej bazy PostgreSQL.", slots: [] }, { status: 503 });
  const bookings = await getPrisma().booking.findMany({ where: { slotKey: { startsWith: `${date}|` }, status: { not: "CANCELLED" } }, select: { slotKey: true } });
  const blocked = new Set(bookings.map(({ slotKey }) => slotKey));
  return NextResponse.json({ mode: "live", slots: AVAILABLE_TIMES.map((time) => ({ time, available: !blocked.has(buildSlotKey(date, time)) })) });
}

