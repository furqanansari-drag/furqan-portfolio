import ThemeToggle from "@/components/ThemeToggle";
import ContactForm from "@/components/ContactForm";
import Logo, { LogoMark } from "@/components/Logo";
import { NAV, SKILLS, LEARNING, SERVICES, TOOLS, PROJECTS, WORKFLOW, WHY, WHATSAPP } from "@/lib/data";

const card = "glass rounded-2xl p-6 transition hover:-translate-y-0.5 hover:border-indigo-400";
const h2 = "text-3xl font-bold tracking-tight sm:text-4xl";

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <h2 className={h2}>{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/80 backdrop-blur dark:border-white/10 dark:bg-[#070b14]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#home" aria-label="Furqan Ansari — home"><Logo /></a>
          <nav aria-label="Main" className="hidden gap-6 text-sm md:flex">
            {NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="hover:text-indigo-500">{n}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <details className="relative md:hidden">
              <summary className="glass cursor-pointer list-none rounded-lg px-3 py-2 text-sm" aria-label="Open menu">☰ Menu</summary>
              <div className="glass absolute right-0 mt-2 grid w-44 gap-1 rounded-xl bg-white p-2 dark:bg-[#0d1424]">
                {NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="rounded-lg px-3 py-2 text-sm hover:bg-indigo-500/10">{n}</a>)}
              </div>
            </details>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-400/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
            <div className="rise">
              <div className="mb-5"><LogoMark size={56} /></div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI-assisted • Web • Digital</p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                <span className="grad-text">Furqan Ansari</span> — AI-Assisted Web &amp; Digital Solutions
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">
                I build modern websites, landing pages and digital designs using AI-assisted tools, and I'm currently expanding my skills in AI agents and automation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#skills" className="btn-primary">View My Skills</a>
                <a href="#projects" className="btn-ghost">View My Work</a>
                <a href="#contact" className="btn-ghost">Contact Me</a>
              </div>
            </div>
            <div className="rise" role="img" aria-label="Illustration of a code snippet describing an AI-assisted web workflow">
              <div className="glass rounded-2xl p-5 shadow-2xl shadow-indigo-500/10">
                <div className="mb-4 flex gap-1.5"><i className="h-3 w-3 rounded-full bg-rose-400" /><i className="h-3 w-3 rounded-full bg-amber-400" /><i className="h-3 w-3 rounded-full bg-emerald-400" /></div>
                <pre className="overflow-x-auto font-mono text-xs leading-6 text-slate-700 dark:text-slate-300 sm:text-sm">{`const workflow = {
  idea: "your business goal",
  plan: "AI-assisted planning",
  build: "Next.js + Tailwind",
  review: "tested by hand",
  deliver: ["website", "design", "handover"],
};

// idea → plan → build → test → deliver`}</pre>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {["AI-assisted", "Next.js", "Canva", "Responsive"].map((t) => <span key={t} className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-700 dark:text-indigo-300">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section id="about" title="About Me">
          <div className="max-w-3xl space-y-4 text-slate-600 dark:text-slate-400">
            <p>I&apos;m Furqan Ansari from Pakistan. I work with modern AI tools, web technologies and digital design tools to create practical solutions for businesses and individuals.</p>
            <p>My current work is modern websites and digital design, and I'm learning AI engineering, agents and automation alongside it. I learn by building real projects, and I use AI to work faster while reviewing, testing and customizing everything I deliver.</p>
            <p>I&apos;m continuously learning, and I describe my skills honestly based on what I&apos;ve actually worked with.</p>
          </div>
        </Section>

        <Section id="skills" title="My Skills" intro="Skills I work with and am actively developing.">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((g) => (
              <article key={g.title} className={card}>
                <h3 className="text-lg font-semibold">{g.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((i) => <li key={i} className="rounded-full bg-slate-900/5 px-3 py-1 text-xs dark:bg-white/10">{i}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="services" title="Services">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(([t, d]) => (
              <article key={t} className={card}>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{d}</p>
              </article>
            ))}
          </div>
        </Section>

        <section id="learning" className="mx-auto max-w-6xl px-5 py-12">
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/25 to-cyan-400/20 blur-2xl" />
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">In progress</p>
            <h2 className={`${h2} mt-2`}>Currently Learning</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Currently expanding my skills in AI Agents, AI Automation and workflow automation using modern AI tools and platforms. These are skills I&apos;m developing, not services I offer yet.</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {LEARNING.map((l) => <li key={l} className="rounded-xl border border-dashed border-indigo-400/60 bg-indigo-500/5 px-4 py-2 text-sm font-medium">{l}</li>)}
            </ul>
          </div>
        </section>

        <Section id="tools" title="Tools I Use">
          <ul className="flex flex-wrap gap-3">
            {TOOLS.map((t) => <li key={t} className="glass rounded-xl px-4 py-2 text-sm font-medium">{t}</li>)}
          </ul>
        </Section>

        <Section id="projects" title="Projects" intro="Selected project areas. Links are added as projects go public.">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <article key={p.name} className={`${card} flex flex-col`}>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{p.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">{p.tech.map((t) => <li key={t} className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">{t}</li>)}</ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href="#contact" className="btn-primary !px-4 !py-2">View Project</a>
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2">GitHub</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2">Live Demo</a>}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="workflow" title="My Workflow" intro="I use AI tools to accelerate development, then review, test and customize the final result myself.">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORKFLOW.map(([t, d], i) => (
              <li key={t} className={card}>
                <span className="grad-text text-2xl font-bold">0{i + 1}</span>
                <h3 className="mt-1 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{d}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="why" title="Why Work With Me">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => <li key={w} className="glass rounded-xl p-4 text-sm font-medium"><span className="mr-2 text-indigo-500">✓</span>{w}</li>)}
          </ul>
        </Section>

        <Section id="contact" title="Contact" intro="Tell me about your project. I usually reply on WhatsApp.">
          <div className="grid gap-8 lg:grid-cols-2">
            <ContactForm />
            <div className="grid content-start gap-4">
              <a href={`${WHATSAPP.link}?text=${encodeURIComponent("Hello Furqan, I found your portfolio and would like to talk about a project.")}`} target="_blank" rel="noopener noreferrer" className={`${card} block`}>
                <span className="text-sm text-slate-500 dark:text-slate-400">Chat on WhatsApp</span>
                <span className="block text-xl font-semibold">{WHATSAPP.display}</span>
              </a>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <Logo size={40} />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">AI • Web • Digital Solutions</p>
          <nav aria-label="Footer" className="mt-5 flex flex-wrap gap-5 text-sm">
            {NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} className="hover:text-indigo-500">{n}</a>)}
          </nav>
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">© 2026 Furqan Ansari. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
