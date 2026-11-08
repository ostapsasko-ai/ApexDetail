import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/session") return NextResponse.next();
  const allowed = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value, process.env.AUTH_SECRET);
  if (allowed) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Brak uprawnień administratora" }, { status: 401 });
  const login = new URL("/admin/login", request.url); login.searchParams.set("next", pathname); return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

