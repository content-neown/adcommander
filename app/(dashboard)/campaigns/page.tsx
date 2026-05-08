import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, ArrowRight, Inbox } from "lucide-react";
import { formatDate, STATUS_COLORS } from "@/lib/utils";

export const metadata = { title: "Campaigns" };

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Campaigns</h1>
          <p className="text-slate-400 text-sm">{campaigns?.length ?? 0} total campaigns</p>
        </div>
        <Link href="/campaigns/new" className="btn-primary">
          <Plus size={16} /> New Campaign
        </Link>
      </div>

      {!campaigns?.length ? (
        <div className="card-dark p-16 text-center">
          <Inbox size={36} className="text-slate-600 mx-auto mb-3" />
          <h3 className="font-medium mb-2">No campaigns yet</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first campaign to start generating Andromeda-optimized Meta ads.</p>
          <Link href="/campaigns/new" className="btn-primary mx-auto w-fit"><Plus size={15} /> Create campaign</Link>
        </div>
      ) : (
        <div className="card-dark overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_120px_120px_40px] gap-4 px-5 py-3 border-b border-white/[0.06]">
            {["Campaign", "Objective", "Budget", "Updated", ""].map(h => (
              <div key={h} className="text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</div>
            ))}
          </div>
          {campaigns.map((c, i) => (
            <Link key={c.id} href={`/campaigns/${c.id}`}
              className={cn(
                "grid grid-cols-[1fr_140px_120px_120px_40px] gap-4 items-center px-5 py-4 hover:bg-white/[0.03] transition-colors group",
                i > 0 && "border-t border-white/[0.06]"
              )}>
              <div className="min-w-0">
                <div className="text-sm font-medium group-hover:text-brand-300 transition-colors truncate">{c.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">{c.brief?.product}</div>
              </div>
              <span className="text-xs text-slate-400 truncate">{c.brief?.objective}</span>
              <span className="text-xs text-slate-400 truncate">{c.brief?.budget}</span>
              <span className="text-xs text-slate-500">{formatDate(c.updated_at)}</span>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors justify-self-end" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
