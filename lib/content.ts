import { PROJECTS, SERVICES, TOOLS, SKILLS, LEARNING, WHATSAPP } from "./data";

export type Project = { name: string; desc: string; tech: string[]; github: string; live: string };
export type Service = { title: string; desc: string };
export type SkillGroup = { title: string; items: string[] };
export type Content = {
  whatsapp: { display: string; num: string };
  projects: Project[];
  services: Service[];
  tools: string[];
  skills: SkillGroup[];
  learning: string[];
};

// Database khali ho ya band ho to site yehi default content dikhati hai.
export const defaults: Content = {
  whatsapp: { display: WHATSAPP.display, num: WHATSAPP.num },
  projects: PROJECTS.map((p) => ({ name: p.name, desc: p.desc, tech: [...p.tech], github: p.github, live: p.live })),
  services: SERVICES.map(([title, desc]) => ({ title, desc })),
  tools: [...TOOLS],
  skills: SKILLS.map((g) => ({ title: g.title, items: [...g.items] })),
  learning: [...LEARNING],
};

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : [];
// Sirf https:// links allow hain (javascript: jaisi cheezein block)
const link = (v: unknown): string => {
  const s = str(v, 300);
  return /^https:\/\/[^\s]+$/i.test(s) ? s : "";
};

// "0314 6690805", "+92 314 6690805", "3146690805" -> { num: "923146690805", display: "0314 6690805" }
export function normalizePk(input: string): { num: string; display: string } | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0092")) d = d.slice(2);
  else if (d.startsWith("0")) d = "92" + d.slice(1);
  else if (d.length === 10 && d.startsWith("3")) d = "92" + d;
  if (!/^\d{10,15}$/.test(d)) return null;
  if (d.startsWith("92") && d.length === 12) {
    const local = "0" + d.slice(2);
    return { num: d, display: `${local.slice(0, 4)} ${local.slice(4)}` };
  }
  return { num: d, display: "+" + d };
}

export function sanitize(raw: unknown): Content {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const waRaw = (r.whatsapp && typeof r.whatsapp === "object" ? r.whatsapp : {}) as Record<string, unknown>;
  const wa = normalizePk(str(waRaw.num, 25)) ?? defaults.whatsapp;

  const projects = r.projects === undefined ? defaults.projects : (Array.isArray(r.projects) ? r.projects : [])
    .slice(0, 60)
    .map((p: unknown) => {
      const o = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
      return { name: str(o.name, 80), desc: str(o.desc, 400), tech: list(o.tech, 12, 30), github: link(o.github), live: link(o.live) };
    })
    .filter((p) => p.name);

  const services = r.services === undefined ? defaults.services : (Array.isArray(r.services) ? r.services : [])
    .slice(0, 30)
    .map((s: unknown) => {
      const o = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
      return { title: str(o.title, 80), desc: str(o.desc, 300) };
    })
    .filter((s) => s.title);

  const skills = r.skills === undefined ? defaults.skills : (Array.isArray(r.skills) ? r.skills : [])
    .slice(0, 12)
    .map((g: unknown) => {
      const o = (g && typeof g === "object" ? g : {}) as Record<string, unknown>;
      return { title: str(o.title, 80), items: list(o.items, 30, 50) };
    })
    .filter((g) => g.title);

  return {
    whatsapp: wa,
    projects,
    services,
    skills,
    tools: r.tools === undefined ? defaults.tools : list(r.tools, 40, 40),
    learning: r.learning === undefined ? defaults.learning : list(r.learning, 15, 60),
  };
}
