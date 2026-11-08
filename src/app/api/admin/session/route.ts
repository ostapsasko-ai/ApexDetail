import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.AUTH_SECRET) return NextResponse.json({ error: "Logowanie administratora nie jest skonfigurowane." }, { status: 503 });
  const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
  const valid = body?.email?.toLocaleLowerCase() === process.env.ADMIN_EMAIL.toLocaleLowerCase() && typeof body.password === "string" && await bcrypt.compare(body.password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) return NextResponse.json({ error: "Nieprawidłowy e-mail lub hasło." }, { status: 401 });
  const token = await createSessionToken({ sub: process.env.ADMIN_EMAIL, role: "ADMIN" }, process.env.AUTH_SECRET);
  const response = NextResponse.json({ ok: true }); response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 }); return response;
}

export async function DELETE() { const response = NextResponse.json({ ok: true }); response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" }); return response; }

