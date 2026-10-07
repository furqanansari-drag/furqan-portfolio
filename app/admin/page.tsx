import type { Metadata } from "next";
import { authConfigured, isAdmin } from "@/lib/auth";
import { getContent, storeReady } from "@/lib/store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminEditor from "@/components/admin/AdminEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!authConfigured()) {
    return (
      <main className="mx-auto max-w-lg px-5 py-20">
        <div className="glass rounded-2xl p-6">
          <h1 className="text-xl font-bold">Admin set up nahi hai</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Vercel mein <code>ADMIN_PASSWORD</code> (kam az kam 8 characters) aur <code>SESSION_SECRET</code> (kam az kam 16 characters) add karke redeploy karo.</p>
        </div>
      </main>
    );
  }
  if (!isAdmin()) return <AdminLogin />;
  const content = await getContent();
  return <AdminEditor initial={content} storeReady={storeReady} />;
}
