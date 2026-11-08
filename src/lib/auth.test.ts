import { describe, expect, it } from "vitest";
import { createSessionToken, verifyAdminToken } from "./auth";

const secret = "bardzo-dlugi-sekret-testowy-minimum-32-znaki";

describe("verifyAdminToken", () => {
  it("odrzuca brak tokenu", async () => {
    expect(await verifyAdminToken(undefined, secret)).toBe(false);
  });

  it("odrzuca prawidłowo podpisaną sesję bez roli ADMIN", async () => {
    const token = await createSessionToken({ sub: "user-1", role: "CUSTOMER" }, secret);
    expect(await verifyAdminToken(token, secret)).toBe(false);
  });

  it("akceptuje ważną sesję administratora", async () => {
    const token = await createSessionToken({ sub: "admin-1", role: "ADMIN" }, secret);
    expect(await verifyAdminToken(token, secret)).toBe(true);
  });

  it("odrzuca token podpisany innym sekretem", async () => {
    const token = await createSessionToken({ sub: "admin-1", role: "ADMIN" }, secret);
    expect(await verifyAdminToken(token, "inny-bardzo-dlugi-sekret-testowy-123456")).toBe(false);
  });
});
