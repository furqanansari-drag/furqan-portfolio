export const SITE = {
  name: "Furqan Ansari",
  title: "Furqan Ansari | Web Developer & Digital Designer in Pakistan",
  description:
    "Furqan Ansari builds modern business websites, landing pages and digital designs using AI-assisted tools, and is currently learning AI agents and automation. Based in Pakistan.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.your-domain.com").replace(/\/$/, ""),
};

// Only WhatsApp number used on the whole site (wa.me format: 92 + number without leading 0)
export const WHATSAPP = { display: "0314 6690805", num: "923146690805", link: "https://wa.me/923146690805" };

export const NAV = ["Home", "About", "Skills", "Services", "Projects", "Contact"];

export const SKILLS: { title: string; items: string[] }[] = [
  { title: "AI & AI-Assisted Work", items: ["AI-assisted development", "AI-assisted design", "AI APIs (learning)", "Prompt engineering", "AI-powered application concepts"] },
  { title: "Web Development", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "REST APIs", "Responsive websites", "Website deployment"] },
  { title: "Digital Design", items: ["Canva", "AI-assisted design", "Social media designs", "Posters", "Presentations", "Thumbnails", "Resume/CV design", "Business materials"] },
  { title: "Tools & Platforms", items: ["Claude", "ChatGPT", "Canva", "Git/GitHub", "VS Code", "Vercel", "Google Search Console", "Adobe tools (where applicable)"] },
];

export const LEARNING = ["AI Agents", "AI Automation", "n8n Workflow Automation", "WhatsApp AI Agents", "Business Process Automation"];

export const SERVICES: [string, string][] = [
  ["Modern Business Websites", "Fast, responsive, SEO-ready websites for restaurants and local or online businesses."],
  ["Portfolio Websites", "Professional personal sites for freelancers, students and job seekers."],
  ["Landing Pages", "Focused single-page sites built to present one offer clearly and bring enquiries."],
  ["Canva & Digital Designs", "Posters, social media posts, thumbnails and branded business materials."],
  ["Presentation / PPT Design", "Clean, well-structured presentations for business, study and pitching."],
  ["Resume / CV Design", "Clear, modern CV layouts that present your skills honestly and professionally."],
  ["AI-assisted Design", "Use AI tools to speed up design ideas and visuals, then refine them by hand."],
  ["AI-assisted Development", "AI tools speed up the build, while every page is reviewed, tested and customized by me."],
];

export const TOOLS = ["ChatGPT", "Claude", "Canva", "Next.js", "React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "Git", "GitHub", "VS Code", "Vercel", "Google Search Console", "Adobe tools"];

// Jab real URL ho to "" ki jagah paste karo. Khali URL ka button nahi dikhta.
export const PROJECTS = [
  { name: "DRAG AI", desc: "An AI assistant concept focused on practical AI-powered assistance, built step by step as a learning project.", tech: ["Next.js", "TypeScript", "Tailwind CSS", "AI APIs"], github: "", live: "" },
  { name: "WhatsApp AI Agent (Learning Project)", desc: "A learning project exploring AI-powered WhatsApp automation using n8n and AI.", tech: ["n8n", "AI agents", "Webhooks", "WhatsApp"], github: "", live: "" },
  { name: "Restaurant Website Projects", desc: "Modern restaurant and business websites designed as client-ready projects.", tech: ["HTML", "CSS", "JavaScript", "SEO"], github: "", live: "" },
  { name: "Portfolio / Business Websites", desc: "Responsive websites built for individuals and businesses.", tech: ["Next.js", "React", "Tailwind CSS"], github: "", live: "" },
  { name: "Digital Design Projects", desc: "Posters, presentations, thumbnails, resumes and other digital materials.", tech: ["Canva", "AI-assisted design"], github: "", live: "" },
];

export const WORKFLOW: [string, string][] = [
  ["Idea", "We clarify the goal, audience and what success looks like."],
  ["AI Planning", "AI tools help outline structure, features and content quickly."],
  ["Development", "I build with modern tools, using AI to speed up the routine work."],
  ["Testing", "Everything is reviewed, tested and customized by hand."],
  ["Deployment", "The project goes live on reliable hosting."],
  ["Final Delivery", "You get the finished work and a clear handover."],
];

export const WHY = ["Modern AI-first approach", "Practical solutions", "Business-focused thinking", "Clean and responsive websites", "Honest, transparent work", "Fast development workflow", "Continuous learning", "Client-focused communication"];

export const PROJECT_TYPES = ["Business Website", "Portfolio Website", "Landing Page", "Canva / Digital Design", "Presentation (PPT)", "Resume / CV", "AI-assisted Design or Development", "Other"];
