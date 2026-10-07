import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/data";
import { getContent } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  keywords: ["Furqan Ansari", "Furqan Ansari AI", "Web Developer Pakistan", "AI Website Development", "Portfolio Website Developer", "Landing Page Design", "Canva Designer Pakistan", "AI-assisted development"],
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" }, // canonical = NEXT_PUBLIC_SITE_URL
  openGraph: { type: "website", url: SITE.url, siteName: SITE.name, title: SITE.title, description: SITE.description, locale: "en_US" },
  twitter: { card: "summary", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
  verification: { google: "tWXldbjL-firN-ab-ibbM5UEp6j3GMdr42Qw0Lbe7o8" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f8fafc" }, { media: "(prefers-color-scheme: dark)", color: "#070b14" }],
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { whatsapp } = await getContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${SITE.url}/#person`, name: SITE.name, url: SITE.url, jobTitle: "Web Developer & Digital Designer", address: { "@type": "PostalAddress", addressCountry: "PK" }, knowsAbout: ["Web development", "Next.js", "Digital design", "AI-assisted development"], alternateName: "DRAG" },
      { "@type": "ProfessionalService", "@id": `${SITE.url}/#service`, name: `${SITE.name} — Web & Digital Solutions`, url: SITE.url, description: SITE.description, areaServed: ["PK", "Worldwide"], telephone: `+${whatsapp.num}`, founder: { "@id": `${SITE.url}/#person` } },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
