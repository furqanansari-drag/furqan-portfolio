"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }
  return (
    <button onClick={toggle} aria-label="Toggle dark and light mode" className="glass rounded-lg px-3 py-2 text-sm hover:border-indigo-400">
      {dark ? "☀ Light" : "☾ Dark"}
    </button>
  );
}
