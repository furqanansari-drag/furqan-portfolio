"use client";
import { useEffect, useRef, useState } from "react";
import { PROJECT_TYPES } from "@/lib/data";
import { drawCard, waLink, type Inquiry } from "@/lib/inquiry";
import { LogoMark } from "./Logo";

const labelCls = "grid gap-1.5 text-sm font-medium";
const fieldCls = "field w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none dark:border-white/15 dark:bg-white/5";

export default function ContactForm({ wa }: { wa: { display: string; num: string } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Inquiry | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  // fade/slide in when the form scrolls into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d: Inquiry = {
      name: String(f.get("name") ?? "").trim(), email: String(f.get("email") ?? "").trim(),
      whatsapp: String(f.get("whatsapp") ?? "").trim(), type: String(f.get("type") ?? ""), message: String(f.get("message") ?? "").trim(),
    };
    setBusy(true); setNote("");
    try {
      const b = await drawCard(d, wa.display);
      setBlob(b); setUrl(URL.createObjectURL(b));
    } catch { setBlob(null); setUrl(""); setNote("The image card could not be generated in this browser, but you can still send the message on WhatsApp."); }
    setData(d); setBusy(false);
  }

  function download() {
    if (!url) return;
    const a = document.createElement("a"); a.href = url; a.download = "furqan-ansari-project-inquiry.png"; a.click();
  }

  async function shareImage() {
    if (!blob || !data) return;
    const file = new File([blob], "project-inquiry.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], text: "New project inquiry for Furqan Ansari" }); return; } catch { return; }
    }
    setNote("Image sharing is not supported in this browser. Download the card and attach it manually in WhatsApp.");
  }

  const reveal = seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <div ref={wrapRef} className={`transition-all duration-700 ease-out ${reveal}`}>
      {!data ? (
        <form onSubmit={onSubmit} className="glass relative grid gap-5 overflow-hidden rounded-3xl p-6 shadow-xl shadow-indigo-500/5 sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <LogoMark size={40} />
            <div><h3 className="text-lg font-semibold">Start a project</h3><p className="text-sm text-slate-500 dark:text-slate-400">Share a few details and I&apos;ll get back to you on WhatsApp.</p></div>
          </div>
          <div className="relative grid gap-5 sm:grid-cols-2">
            <label className={labelCls}>Name<input name="name" required autoComplete="name" maxLength={80} className={fieldCls} placeholder="Your name" /></label>
            <label className={labelCls}>Email<input name="email" type="email" required autoComplete="email" maxLength={120} className={fieldCls} placeholder="you@example.com" /></label>
            <label className={labelCls}>WhatsApp<input name="whatsapp" type="tel" autoComplete="tel" maxLength={25} className={fieldCls} placeholder="03XX XXXXXXX" /></label>
            <label className={labelCls}>Project Type<select name="type" className={fieldCls}>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
          </div>
          <label className={`${labelCls} relative`}>Message<textarea name="message" required rows={5} maxLength={900} className={fieldCls} placeholder="Tell me what you need, your timeline and any examples you like." /></label>
          <button type="submit" disabled={busy} className="submit-btn btn-primary relative !py-3.5 text-base disabled:opacity-70">
            {busy ? <span className="flex items-center gap-2"><i className="spinner" aria-hidden />Preparing your card…</span> : "Send Project Details"}
          </button>
        </form>
      ) : (
        <div className="pop grid gap-5" aria-live="polite">
          <div className="glass rounded-3xl p-4 sm:p-6">
            <p className="mb-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✓ Your inquiry is ready. Review it, then send on WhatsApp.</p>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={`Project inquiry card for ${data.name}`} className="mx-auto w-full max-w-sm rounded-2xl shadow-2xl shadow-indigo-500/20" />
            ) : null}
            {note && <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">{note}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={waLink(data, wa.num)} target="_blank" rel="noopener noreferrer" className="btn-primary sm:col-span-2">Share on WhatsApp ({wa.display})</a>
            {blob && <button type="button" onClick={download} className="btn-ghost">Download Inquiry Card</button>}
            {blob && <button type="button" onClick={shareImage} className="btn-ghost">Share Card Image</button>}
            <button type="button" onClick={() => { setData(null); setBlob(null); setUrl(""); setNote(""); }} className="btn-ghost sm:col-span-2">Edit details</button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">WhatsApp links can only carry text, so the message includes all your details. To include the card image too, download it and attach it in the chat, or use &ldquo;Share Card Image&rdquo; on supported phones.</p>
        </div>
      )}
    </div>
  );
}
