import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-1">Settings</h1>
      <p className="text-slate-400 text-sm mb-8">Manage your account and workspace preferences.</p>

      <div className="space-y-6">
        {/* Profile */}
        <div className="card-dark p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-600/30 flex items-center justify-center text-xl font-semibold text-brand-300">
              {profile?.full_name?.slice(0, 2).toUpperCase() ?? "U"}
            </div>
            <div>
              <div className="font-medium">{profile?.full_name ?? "—"}</div>
              <div className="text-sm text-slate-400">{user.email}</div>
            </div>
          </div>
        </div>

        {/* API Keys info */}
        <div className="card-dark p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Integrations</h2>
          <div className="space-y-3 text-sm">
            {[
              { name: "Anthropic API",    key: "ANTHROPIC_API_KEY",               status: "Configured via .env" },
              { name: "Supabase",         key: "NEXT_PUBLIC_SUPABASE_URL",         status: "Configured via .env" },
              { name: "Brave Search API", key: "BRAVE_SEARCH_API_KEY",            status: "Optional — enables live Meta intel" },
            ].map(({ name, key, status }) => (
              <div key={name} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{key}</div>
                </div>
                <span className="text-xs text-slate-500 bg-surface-700 px-2.5 py-1 rounded-lg">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card-dark p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">About</h2>
          <div className="text-sm text-slate-400 space-y-1.5">
            <div className="flex justify-between"><span>Version</span><span className="text-white">1.0.0</span></div>
            <div className="flex justify-between"><span>AI Model</span><span className="text-white">Claude claude-sonnet-4-20250514</span></div>
            <div className="flex justify-between"><span>Meta Coverage</span><span className="text-white">Andromeda, ASC, CAPI</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
