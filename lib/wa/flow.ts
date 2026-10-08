// WhatsApp agent ka saara text yahan hai. Services ya sawal badalne hon to sirf ye file edit karo.
export type WaService = { label: string; intro: string; questions: string[] };

const BUDGET_Q = "Aap ka budget kitna hai? (optional, na batana chahein to 'skip' likhein)";
export const NAME_Q = "Aap ka naam kya hai?";

export const SERVICES: WaService[] = [
  {
    label: "Business Website",
    intro:
      "Aap ke business ke liye modern, mobile-friendly website. Aam taur par Home, About, Services/Menu aur Contact jaise pages hote hain, aur SEO ki basic tayyari bhi ki ja sakti hai.\n\nKaam ka tareeqa: Requirement → Design → Development → Testing → Live → Handover.",
    questions: [
      "Aap ke business ka naam aur type kya hai?",
      "Kaun kaun se pages chahiye? (maslan Home, Menu, Contact)",
      "Logo, photos aur text aap ke paas tayyar hain?",
      "Domain aur hosting hai, ya uska setup bhi chahiye?",
      "Kab tak chahiye (deadline)?",
      BUDGET_Q,
    ],
  },
  {
    label: "Landing Page",
    intro:
      "Ek hi page ki website jo ek offer ya service ko saaf tareeqe se dikhati hai aur customer ko call, WhatsApp ya form ki taraf le jati hai.\n\nKaam ka tareeqa: Requirement → Draft → Revision → Live.",
    questions: [
      "Kis cheez ya offer ka landing page chahiye?",
      "Aap ka target customer kaun hai?",
      "Text aur photos aap ke paas tayyar hain?",
      "Page par kya action chahiye? (Call, WhatsApp ya form)",
      "Kab tak chahiye (deadline)?",
      BUDGET_Q,
    ],
  },
  {
    label: "Portfolio Website",
    intro:
      "Aap ke liye professional personal portfolio: aap ka kaam, skills, CV aur contact ek jagah.\n\nKaam ka tareeqa: Content jama karna → Design → Build → Live.",
    questions: [
      "Aap kis field mein kaam karte hain?",
      "Kaun se projects ya kaam dikhana hai?",
      "CV, skills aur photo tayyar hain?",
      "Koi pasandida portfolio ya style? (link ho to bhejein)",
      "Kab tak chahiye (deadline)?",
      BUDGET_Q,
    ],
  },
  {
    label: "Canva / Digital Design",
    intro:
      "Poster, social media post, thumbnail ya business material ka professional design.\n\nKaam ka tareeqa: Brief → Draft → Revisions → Final files.",
    questions: [
      "Kis cheez ka design chahiye? (poster, post, thumbnail wagaira)",
      "Size ya platform kaun sa hai? (Instagram, YouTube, print)",
      "Text, logo aur colors/brand ki details?",
      "Koi example design jo pasand ho? (link ya image)",
      "Kab tak chahiye (deadline)?",
      BUDGET_Q,
    ],
  },
  {
    label: "Presentation (PPT)",
    intro:
      "Class, business ya pitch ke liye saaf aur professional presentation.\n\nKaam ka tareeqa: Outline → Draft → Revision → Delivery.",
    questions: [
      "Topic kya hai aur presentation kis ke liye hai? (class, business wagaira)",
      "Taqreeban kitni slides chahiye?",
      "Content aap ke paas tayyar hai ya sirf points hain?",
      "Koi khaas style ya colors?",
      "Kab tak chahiye (deadline)?",
      BUDGET_Q,
    ],
  },
  {
    label: "Resume / CV",
    intro:
      "Saaf, modern aur honest CV jo aap ki skills achi tarah dikhaye.\n\nKaam ka tareeqa: Details → Draft → Revision → PDF.",
    questions: [
      "Aap kis job ya field ke liye CV chahte hain?",
      "Education aur experience ki mukhtasar details?",
      "Purana CV hai? (hai / nahi)",
      "Kis mulk ya company ke liye? (agar maloom ho)",
      "Kab tak chahiye (deadline)?",
    ],
  },
];

export const HANDOFF_N = SERVICES.length + 1;

export const menuText = (): string =>
  SERVICES.map((s, i) => `${i + 1}. ${s.label}`).join("\n") + `\n${HANDOFF_N}. Furqan se seedha baat`;

export const greeting = (name: string): string =>
  `Assalam o Alaikum${name ? " " + name : ""}! 👋\nMain Furqan Ansari ka automatic assistant hoon.\n\nAap kis bare mein baat karna chahte hain? Number bhejein:\n\n${menuText()}\n\nKisi bhi waqt MENU likhein to ye list dobara aayegi.`;

export const SAFETY_NOTE = "Meherbani karke yahan password ya bank/card ki details na bhejein.";
export const THANKS = "Aap ki details Furqan ko bhej di gayi hain. Wo khud price aur time confirm karke jald aap se rabta karega.\n\nDusri service ke baare mein poochna ho to MENU likhein.";
export const HANDOFF_REPLY = "Theek hai, aap ka message Furqan ko bhej diya gaya hai. Wo khud jawab dega.\n\nMenu ke liye MENU likhein.";
export const UNSUPPORTED = "Maaf kijiye, abhi main sirf text message samajh sakta hoon. MENU likhein to list aa jayegi.";
