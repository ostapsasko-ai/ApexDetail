import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/auth";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";

const updateSchema = z.object({ id: z.string().min(1), price: z.number().int().min(0).max(100000) });
export async function GET(request: Request) { if (!await isAdminRequest(request)) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 }); if (!isDatabaseConfigured()) return NextResponse.json({ error: "Brak bazy" }, { status: 503 }); return NextResponse.json(await getPrisma().service.findMany({ orderBy: { name: "asc" } })); }
export async function PATCH(request: Request) { if (!await isAdminRequest(request)) return NextResponse.json({ error: "Brak uprawnień" }, { status: 401 }); if (!isDatabaseConfigured()) return NextResponse.json({ error: "Brak bazy" }, { status: 503 }); const parsed = updateSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Nieprawidłowa cena" }, { status: 400 }); return NextResponse.json(await getPrisma().service.update({ where: { id: parsed.data.id }, data: { price: parsed.data.price } })); }

