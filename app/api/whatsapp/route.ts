import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { redisCmd } from "@/lib/store";
import { sendText, notifyOwner } from "@/lib/wa/send";
import { SERVICES, HANDOFF_N, NAME_Q, SAFETY_NOTE, THANKS, HANDOFF_REPLY, UNSUPPORTED, greeting, menuText } from "@/lib/wa/flow";

export const dynamic = "force-dynamic";

type State = { step: "menu" | "ask" | "done"; svc?: number; q?: number; answers?: string[] };
type WaMsg = { from?: string; id?: string; type?: string; text?: { body?: string } };
type WaBody = { entry?: { changes?: { value?: { messages?: WaMsg[]; contacts?: { profile?: { name?: string } }[] } }[] }[] };

// Meta webhook ko pehli baar connect karte waqt verify karta hai
export async function GET(req: Request) {
  const u = new URL(req.url);
  const token = process.env.WHATSAPP_VERIFY_TOKEN;
  if (u.searchParams.get("hub.mode") === "subscribe" && token && u.searchParams.get("hub.verify_token") === token) {
    return new NextResponse(u.searchParams.get("hub.challenge") ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

const loadState = async (from: string): Promise<State | null> => {
  const raw = await redisCmd(["GET", `wa:state:${from}`]);
  if (typeof raw !== "string") return null;
  try { return JSON.parse(raw) as State; } catch { return null; }
};
const saveState = (from: string, s: State) => redisCmd(["SET", `wa:state:${from}`, JSON.stringify(s), "EX", "259200"]);

async function saveLead(from: string, profile: string, service: string, qa: { q: string; a: string }[]) {
  const lead = { at: new Date().toISOString(), from, profile, service, qa };
  await redisCmd(["LPUSH", "wa:leads", JSON.stringify(lead)]);
  await redisCmd(["LTRIM", "wa:leads", "0", "199"]);
  const lines = qa.map((x) => `• ${x.q}\n  ${x.a}`).join("\n");
  await notifyOwner(`🔔 NEW LEAD\nService: ${service}\nWhatsApp: https://wa.me/${from}\n\n${lines}`).catch(() => undefined);
}

async function handle(from: string, raw: string, profile: string) {
  const text = raw.trim().slice(0, 600);
  const cmd = text.toLowerCase();
  const isNum = /^\d+$/.test(text);
  let st = await loadState(from);

  if (!st || cmd === "menu" || cmd === "0" || (st.step === "done" && !isNum)) {
    await saveState(from, { step: "menu" });
    await sendText(from, greeting(profile));
    return;
  }
  if (st.step === "done") st = { step: "menu" };

  if (st.step === "menu") {
    const n = Number(text);
    if (!isNum || n < 1 || n > HANDOFF_N) {
      await sendText(from, `Meherbani karke 1 se ${HANDOFF_N} ke darmiyan number bhejein.\n\n${menuText()}`);
      return;
    }
    if (n === HANDOFF_N) {
      await saveState(from, { step: "done" });
      await notifyOwner(`🙋 Client seedha baat karna chahta hai\nName: ${profile || "-"}\nWhatsApp: https://wa.me/${from}`).catch(() => undefined);
      await sendText(from, HANDOFF_REPLY);
      return;
    }
    const s = SERVICES[n - 1];
    await saveState(from, { step: "ask", svc: n - 1, q: 0, answers: [] });
    await sendText(from, `*${s.label}*\n\n${s.intro}\n\nAb main chand sawal poochta hoon (${s.questions.length + 1} sawal).\n${SAFETY_NOTE}\n\nSawal 1/${s.questions.length + 1}: ${NAME_Q}`);
    return;
  }

  if (st.step === "ask" && st.svc !== undefined && SERVICES[st.svc]) {
    const s = SERVICES[st.svc];
    const qs = [NAME_Q, ...s.questions];
    const q = st.q ?? 0;
    const answers = [...(st.answers ?? []), text];
    if (q + 1 < qs.length) {
      await saveState(from, { step: "ask", svc: st.svc, q: q + 1, answers });
      await sendText(from, `Sawal ${q + 2}/${qs.length}: ${qs[q + 1]}`);
      return;
    }
    const qa = qs.map((question, i) => ({ q: question, a: answers[i] ?? "-" }));
    await saveLead(from, profile, s.label, qa);
    await saveState(from, { step: "done" });
    await sendText(from, `✅ Shukriya ${answers[0]}!\n\n${THANKS}`);
    return;
  }

  await saveState(from, { step: "menu" });
  await sendText(from, greeting(profile));
}

export async function POST(req: Request) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return new NextResponse("Not configured", { status: 503 });

  const rawBody = await req.text();
  const sig = Buffer.from(req.headers.get("x-hub-signature-256") ?? "");
  const expected = Buffer.from("sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex"));
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return new NextResponse("Bad signature", { status: 401 });

  let body: WaBody;
  try { body = JSON.parse(rawBody) as WaBody; } catch { return new NextResponse("Bad request", { status: 400 }); }

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const v = change.value;
      if (!v?.messages) continue;
      const profile = (v.contacts?.[0]?.profile?.name ?? "").slice(0, 40);
      for (const m of v.messages) {
        if (!m.from || !m.id || !/^\d{6,20}$/.test(m.from)) continue;
        try {
          // Meta kabhi kabhi wahi message dobara bhejta hai: dobara jawab nahi dena
          const first = await redisCmd(["SET", `wa:seen:${m.id}`, "1", "EX", "86400", "NX"]);
          if (first !== "OK") continue;
          // spam se bachao: ek number se ek ghante mein 40 se zyada message ignore
          const count = Number(await redisCmd(["INCR", `wa:rate:${m.from}`]));
          if (count === 1) await redisCmd(["EXPIRE", `wa:rate:${m.from}`, "3600"]);
          if (count > 40) continue;
          if (m.type === "text" && m.text?.body) await handle(m.from, m.text.body, profile);
          else await sendText(m.from, UNSUPPORTED);
        } catch (err) {
          console.error("whatsapp handler error:", err instanceof Error ? err.message : "unknown");
        }
      }
    }
  }
  return NextResponse.json({ ok: true });
}
