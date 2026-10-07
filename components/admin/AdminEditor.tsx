"use client";
import { useState } from "react";
import type { Content } from "@/lib/content";

type PForm = { name: string; desc: string; tech: string; github: string; live: string };
type F = {
  wa: string;
  projects: PForm[];
  services: { title: string; desc: string }[];
  tools: string;
  learning: string;
  skills: { title: string; items: string }[];
};

const toF = (c: Content): F => ({
  wa: c.whatsapp.display,
  projects: c.projects.map((p) => ({ name: p.name, desc: p.desc, tech: p.tech.join(", "), github: p.github, live: p.live })),
  services: c.services.map((s) => ({ ...s })),
  tools: c.tools.join("\n"),
  learning: c.learning.join("\n"),
  skills: c.skills.map((g) => ({ title: g.title, items: g.items.join(", ") })),
});
const split = (s: string, sep: string) => s.split(sep).map((x) => x.trim()).filter(Boolean);
const toBody = (f: F) => ({
  whatsapp: { num: f.wa },
  projects: f.projects.map((p) => ({ ...p, tech: split(p.tech, ",") })),
  services: f.services,
  tools: split(f.tools, "\n"),
  learning: split(f.learning, "\n"),
  skills: f.skills.map((g) => ({ title: g.title, items: split(g.items, ",") })),
});

const inp = "field w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 text-sm outline-none dark:border-white/15 dark:bg-white/5";
const lbl = "grid gap-1 text-xs font-medium text-slate-600 dark:text-slate-400";
const box = "glass rounded-2xl p-5 grid gap-4";
const mini = "rounded-lg border border-slate-300 px-2.5 py-1 text-xs hover:border-indigo-400 dark:border-white/15";

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

export default function AdminEditor({ initial, storeReady }: { initial: Content; storeReady: boolean }) {
  const [f, setF] = useState<F>(() => toF(initial));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(true);

  const setProj = (i: number, patch: Partial<PForm>) => setF((p) => ({ ...p, projects: p.projects.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const setServ = (i: number, patch: Partial<F["services"][number]>) => setF((p) => ({ ...p, services: p.services.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const setSkill = (i: number, patch: Partial<F["skills"][number]>) => setF((p) => ({ ...p, skills: p.skills.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));

  async function save() {
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toBody(f)) });
      const j = (await r.json().catch(() => ({}))) as { error?: string; content?: Content };
      if (r.status === 401) { window.location.reload(); return; }
      if (r.ok && j.content) { setF(toF(j.content)); setOk(true); setMsg("✓ Save ho gaya. Site update ho chuki hai."); }
      else { setOk(false); setMsg(j.error ?? "Save nahi hua."); }
    } catch { setOk(false); setMsg("Network error. Dobara try karo."); }
    setBusy(false);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.reload();
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pb-32 pt-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2">View Site</a>
          <button type="button" onClick={logout} className="btn-ghost !px-4 !py-2">Logout</button>
        </div>
      </header>

      {!storeReady && <p role="alert" className="mb-5 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm">Database connect nahi hai, is liye save kaam nahi karega. Vercel mein Storage (Upstash Redis) connect karo.</p>}

      <div className="grid gap-6">
        <section className={box}>
          <h2 className="font-semibold">WhatsApp Number</h2>
          <label className={lbl}>Number (03XX XXXXXXX)
            <input className={inp} value={f.wa} onChange={(e) => setF({ ...f, wa: e.target.value })} inputMode="tel" /></label>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ye number contact section, form, inquiry card aur WhatsApp buttons sab jagah lagega.</p>
        </section>

        <section className={box}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Projects ({f.projects.length})</h2>
            <button type="button" className="btn-primary !px-4 !py-2" onClick={() => setF((p) => ({ ...p, projects: [{ name: "", desc: "", tech: "", github: "", live: "" }, ...p.projects] }))}>+ Add Project</button>
          </div>
          {f.projects.map((p, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <label className={lbl}>Project name<input className={inp} value={p.name} maxLength={80} onChange={(e) => setProj(i, { name: e.target.value })} /></label>
              <label className={lbl}>Description<textarea className={inp} rows={2} maxLength={400} value={p.desc} onChange={(e) => setProj(i, { desc: e.target.value })} /></label>
              <label className={lbl}>Technologies (comma se alag)<input className={inp} value={p.tech} onChange={(e) => setProj(i, { tech: e.target.value })} placeholder="Next.js, Tailwind CSS" /></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={lbl}>GitHub link (khali = button nahi dikhega)<input className={inp} value={p.github} onChange={(e) => setProj(i, { github: e.target.value })} placeholder="https://github.com/..." /></label>
                <label className={lbl}>Live demo link (khali = button nahi dikhega)<input className={inp} value={p.live} onChange={(e) => setProj(i, { live: e.target.value })} placeholder="https://..." /></label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={mini} onClick={() => setF((x) => ({ ...x, projects: move(x.projects, i, -1) }))}>↑ Up</button>
                <button type="button" className={mini} onClick={() => setF((x) => ({ ...x, projects: move(x.projects, i, 1) }))}>↓ Down</button>
                <button type="button" className={`${mini} text-rose-500`} onClick={() => { if (window.confirm("Ye project delete karna hai?")) setF((x) => ({ ...x, projects: x.projects.filter((_, j) => j !== i) })); }}>Delete</button>
              </div>
            </div>
          ))}
        </section>

        <section className={box}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Services ({f.services.length})</h2>
            <button type="button" className="btn-ghost !px-4 !py-2" onClick={() => setF((p) => ({ ...p, services: [...p.services, { title: "", desc: "" }] }))}>+ Add Service</button>
          </div>
          {f.services.map((s, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <label className={lbl}>Title<input className={inp} value={s.title} maxLength={80} onChange={(e) => setServ(i, { title: e.target.value })} /></label>
              <label className={lbl}>Description<textarea className={inp} rows={2} maxLength={300} value={s.desc} onChange={(e) => setServ(i, { desc: e.target.value })} /></label>
              <div className="flex gap-2">
                <button type="button" className={mini} onClick={() => setF((x) => ({ ...x, services: move(x.services, i, -1) }))}>↑ Up</button>
                <button type="button" className={mini} onClick={() => setF((x) => ({ ...x, services: move(x.services, i, 1) }))}>↓ Down</button>
                <button type="button" className={`${mini} text-rose-500`} onClick={() => { if (window.confirm("Ye service delete karni hai?")) setF((x) => ({ ...x, services: x.services.filter((_, j) => j !== i) })); }}>Delete</button>
              </div>
            </div>
          ))}
        </section>

        <section className={box}>
          <h2 className="font-semibold">Skills</h2>
          {f.skills.map((g, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <label className={lbl}>Category<input className={inp} value={g.title} maxLength={80} onChange={(e) => setSkill(i, { title: e.target.value })} /></label>
              <label className={lbl}>Skills (comma se alag)<textarea className={inp} rows={3} value={g.items} onChange={(e) => setSkill(i, { items: e.target.value })} /></label>
              <button type="button" className={`${mini} w-fit text-rose-500`} onClick={() => { if (window.confirm("Ye category delete karni hai?")) setF((x) => ({ ...x, skills: x.skills.filter((_, j) => j !== i) })); }}>Delete category</button>
            </div>
          ))}
          <button type="button" className="btn-ghost w-fit !px-4 !py-2" onClick={() => setF((p) => ({ ...p, skills: [...p.skills, { title: "", items: "" }] }))}>+ Add Category</button>
        </section>

        <section className={box}>
          <h2 className="font-semibold">Tools I Use</h2>
          <label className={lbl}>Har line mein ek tool<textarea className={inp} rows={8} value={f.tools} onChange={(e) => setF({ ...f, tools: e.target.value })} /></label>
        </section>

        <section className={box}>
          <h2 className="font-semibold">Currently Learning</h2>
          <label className={lbl}>Har line mein ek item<textarea className={inp} rows={5} value={f.learning} onChange={(e) => setF({ ...f, learning: e.target.value })} /></label>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-slate-50/90 p-3 backdrop-blur dark:border-white/10 dark:bg-[#070b14]/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <p role="status" className={`text-sm ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>{msg}</p>
          <button type="button" onClick={save} disabled={busy || !storeReady} className="submit-btn btn-primary shrink-0 disabled:opacity-60">{busy ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </main>
  );
}
