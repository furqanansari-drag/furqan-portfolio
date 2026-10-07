import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { normalizePk, sanitize } from "@/lib/content";
import { saveContent, storeReady } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error: "Login expire ho gaya. Dobara login karo." }, { status: 401 });
  if (!storeReady) return NextResponse.json({ error: "Database connect nahi hai, save nahi ho sakta." }, { status: 503 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Data sahi nahi hai." }, { status: 400 }); }

  const num = (body as { whatsapp?: { num?: unknown } } | null)?.whatsapp?.num;
  if (typeof num !== "string" || !normalizePk(num)) {
    return NextResponse.json({ error: "WhatsApp number sahi nahi hai (maslan 03146690805)." }, { status: 400 });
  }

  const content = sanitize(body);
  if (JSON.stringify(content).length > 100000) return NextResponse.json({ error: "Content bohot bara hai." }, { status: 413 });

  try {
    await saveContent(content);
  } catch {
    return NextResponse.json({ error: "Database mein save nahi hua. Dobara try karo." }, { status: 500 });
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true, content });
}
