import { NextResponse } from "next/server";
import { z } from "zod";
import { getIntegrationStates } from "@/lib/integrations";

const providerResponse = z.object({ points: z.array(z.object({ id: z.string(), name: z.string(), address: z.string(), lat: z.number(), lng: z.number() })) });

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 2) return NextResponse.json({ error: "Podaj miasto lub kod pocztowy" }, { status: 400 });
  if (getIntegrationStates(process.env).pickupPoints !== "live") return NextResponse.json({ mode: "unavailable", message: "Wyszukiwanie punktów wymaga danych oficjalnego API przewoźnika.", points: [] }, { status: 503 });
  const url = new URL(process.env.PICKUP_PROVIDER_API_URL!); url.searchParams.set("q", query);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${process.env.PICKUP_PROVIDER_TOKEN}` }, cache: "no-store" });
  if (!response.ok) return NextResponse.json({ error: "Przewoźnik nie zwrócił punktów odbioru" }, { status: 502 });
  const parsed = providerResponse.safeParse(await response.json());
  if (!parsed.success) return NextResponse.json({ error: "Odpowiedź przewoźnika ma nieobsługiwany format" }, { status: 502 });
  return NextResponse.json({ mode: "live", points: parsed.data.points });
}

