import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Zap, TrendingUp, FileText, Rocket, ArrowRight } from "lucide-react";
import { formatDate, STATUS_COLORS } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();

  const total  = campaigns?.length ?? 0;
  const active = campaigns?.filter(c => c.status === "active").length ?? 0;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            Good morning{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-slate-400 text-sm">Build and optimize your Meta campaigns with AI + Andromeda intel.</p>
        </div>
        <Link href="/campaigns/new" className="btn-primary">
          <Plus size={16} /> New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Campaigns", value: total,  icon: FileText,   color: "text-brand-400" },
          { label: "Active",          value: active, icon: TrendingUp,  color: "text-green-400" },
          { label: "AI Generations",  value: "∞",    icon: Zap,         color: "text-amber-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-dark p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <div className="text-3xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/campaigns/new", icon: Plus,       label: "New Campaign",       desc: "Start from scratch with AI brief builder",    color: "brand" },
            { href: "/campaigns",     icon: FileText,   label: "All Campaigns",      desc: "Browse, edit and continue saved campaigns",   color: "slate" },
            { href: "#",              icon: TrendingUp, label: "Ideation Studio",    desc: "Jump straight into campaign angle generation", color: "amber" },
            { href: "#",              icon: Rocket,     label: "Launch Checklist",   desc: "Validate before going live on Meta Ads",       color: "teal" },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link key={label} href={href}
              className="card-dark p-5 hover:bg-surface-700 transition-colors group flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-surface-700 group-hover:bg-surface-200/10 flex items-center justify-center shrink-0 transition-colors">
                <Icon size={16} className="text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-0.5">{label}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 mt-0.5 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent campaigns */}
      {!!campaigns?.length && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Recent Campaigns</h2>
            <Link href="/campaigns" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="card-dark overflow-hidden">
            {campaigns.map((c, i) => (
              <Link key={c.id} href={`/campaigns/${c.id}`}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors group ${i > 0 ? "border-t border-white/[0.06]" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium group-hover:text-brand-300 transition-colors truncate">{c.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{c.brief?.product} · {c.brief?.objective}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
                  {c.status}
                </span>
                <span className="text-xs text-slate-600">{formatDate(c.updated_at)}</span>
                <ArrowRight size={13} className="text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {!campaigns?.length && (
        <div className="card-dark p-12 text-center">
          <Zap size={32} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-medium mb-1">No campaigns yet</h3>
          <p className="text-slate-500 text-sm mb-5">Create your first campaign to start generating Andromeda-optimized Meta ads.</p>
          <Link href="/campaigns/new" className="btn-primary mx-auto w-fit">
            <Plus size={15} /> Create first campaign
          </Link>
        </div>
      )}
    </div>
  );
}
