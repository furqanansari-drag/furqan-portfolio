import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "fa_admin";
const secret = () => process.env.SESSION_SECRET ?? "";

export const authConfigured = (): boolean => secret().length >= 16 && (process.env.ADMIN_PASSWORD ?? "").length >= 8;

const mac = (msg: string): Buffer => createHmac("sha256", secret()).update(msg).digest();
const same = (a: Buffer, b: Buffer): boolean => a.length === b.length && timingSafeEqual(a, b);

export function passwordOk(input: string): boolean {
  if (!authConfigured()) return false;
  return same(mac("pw:" + input), mac("pw:" + (process.env.ADMIN_PASSWORD ?? "")));
}

export function createToken(): string {
  const exp = String(Date.now() + 7 * 24 * 3600 * 1000);
  return exp + "." + mac("sess:" + exp).toString("hex");
}

export function verifyToken(t?: string): boolean {
  if (!t || !authConfigured()) return false;
  const i = t.indexOf(".");
  if (i < 1) return false;
  const exp = t.slice(0, i);
  const sig = t.slice(i + 1);
  if (!(Number(exp) > Date.now())) return false;
  return same(Buffer.from(sig, "hex"), mac("sess:" + exp));
}

export const isAdmin = (): boolean => verifyToken(cookies().get(COOKIE)?.value);
