"use client";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (r.ok) { window.location.reload(); return; }
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      setErr(j.error ?? "Login nahi hua.");
    } catch { setErr("Network error. Dobara try karo."); }
    setBusy(false);
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-sm place-items-center px-5">
      <form onSubmit={onSubmit} className="glass grid w-full gap-4 rounded-3xl p-8">
        <div className="flex items-center gap-3"><LogoMark size={40} /><h1 className="text-lg font-bold">Admin Login</h1></div>
        <label className="grid gap-1.5 text-sm font-medium">Password
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password"
            className="field w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none dark:border-white/15 dark:bg-white/5" />
        </label>
        {err && <p role="alert" className="text-sm text-rose-500">{err}</p>}
        <button type="submit" disabled={busy} className="submit-btn btn-primary disabled:opacity-70">{busy ? "Checking…" : "Login"}</button>
      </form>
    </main>
  );
}
