import { NextResponse } from "next/server";
import { COOKIE, authConfigured, createToken, passwordOk } from "@/lib/auth";
import { redisCmd, storeReady } from "@/lib/store";

export const dynamic = "force-dynamic";
const FAIL_KEY = "admin-login-fails";

export async function POST(req: Request) {
  if (!authConfigured()) return NextResponse.json({ error: "Admin abhi server par set up nahi hai." }, { status: 503 });
  let body: { password?: unknown } = {};
  try { body = await req.json(); } catch { /* ignore */ }

  if (storeReady) {
    const fails = Number(await redisCmd(["GET", FAIL_KEY]).catch(() => 0));
    if (fails >= 10) return NextResponse.json({ error: "Bohot zyada galat koshishein. 15 minute baad try karo." }, { status: 429 });
  }

  if (typeof body.password !== "string" || !passwordOk(body.password)) {
    if (storeReady) {
      try {
        const n = Number(await redisCmd(["INCR", FAIL_KEY]));
        if (n === 1) await redisCmd(["EXPIRE", FAIL_KEY, "900"]);
      } catch { /* ignore */ }
    }
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ error: "Password galat hai." }, { status: 401 });
  }

  if (storeReady) await redisCmd(["DEL", FAIL_KEY]).catch(() => undefined);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 7 * 24 * 3600 });
  return res;
}
