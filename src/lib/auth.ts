import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_COOKIE = "apexdetail_admin";
type SessionPayload = { sub: string; role: "ADMIN" | "CUSTOMER" };

function key(secret: string) { return new TextEncoder().encode(secret); }

export async function createSessionToken(payload: SessionPayload, secret: string) {
  return new SignJWT({ role: payload.role }).setProtectedHeader({ alg: "HS256" }).setSubject(payload.sub).setIssuedAt().setExpirationTime("8h").sign(key(secret));
}

export async function verifyAdminToken(token: string | undefined, secret: string | undefined) {
  if (!token || !secret) return false;
  try { const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] }); return payload.role === "ADMIN" && typeof payload.sub === "string"; }
  catch { return false; }
}

export function tokenFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
}

export async function isAdminRequest(request: Request) { return verifyAdminToken(tokenFromRequest(request), process.env.AUTH_SECRET); }

