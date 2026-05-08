"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CampaignBrief, AdObjective, BudgetRange, AdFormat } from "@/types";

const OBJECTIVES: AdObjective[] = [
  "Sales / ROAS","Lead Generation","Traffic","App Installs","Brand Awareness","Video Views",
];
const BUDGETS: BudgetRange[] = [
  "Under $500/mo","$500–2K/mo","$2K–10K/mo","$10K–50K/mo","$50K+/mo",
];
const FORMATS: AdFormat[] = [
  "Single Image","Video","Carousel","Collection","Advantage+ Creative","Stories","Reels",
];
const TONES = ["Professional","Conversational","Bold/Edgy","Playful","Luxury","Urgent"];

interface Props {
  initialTitle?: string;
  initialBrief?: Partial<CampaignBrief>;
  onSave?: (id: string) => void;
}

export function BriefForm({ initialTitle = "", initialBrief, onSave }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle]   = useState(initialTitle);
  const [brief, setBrief]   = useState<CampaignBrief>({
    product:       initialBrief?.product       ?? "",
    url:           initialBrief?.url           ?? "",
    audience:      initialBrief?.audience      ?? "",
    usp:           initialBrief?.usp           ?? "",
    objective:     initialBrief?.objective     ?? "Sales / ROAS",
    budget:        initialBrief?.budget        ?? "$2K–10K/mo",
    target_metric: initialBrief?.target_metric ?? "",
    formats:       initialBrief?.formats       ?? ["Video", "Single Image"],
    competitors:   initialBrief?.competitors   ?? "",
    tone:          initialBrief?.tone          ?? "Conversational",
    extra_context: initialBrief?.extra_context ?? "",
  });

  function set<K extends keyof CampaignBrief>(key: K, value: CampaignBrief[K]) {
    setBrief(p => ({ ...p, [key]: value }));
  }

  function toggleFormat(f: AdFormat) {
    set("formats", brief.formats.includes(f) ? brief.formats.filter(x => x !== f) : [...brief.formats, f]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !brief.product || !brief.audience || !brief.usp) return;
    setSaving(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, brief }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.id) {
      onSave ? onSave(data.id) : router.push(`/campaigns/${data.id}`);
    }
  }

  const Label = ({ children, tip }: { children: React.ReactNode; tip?: string }) => (
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
      {children}
      {tip && <span title={tip}><Info size={11} className="text-slate-600 cursor-help" /></span>}
    </label>
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Campaign name */}
      <div>
        <Label>Campaign Name</Label>
        <input className="input-dark text-base font-medium" placeholder="e.g. Summer Sale — Skincare Q3"
          value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Product / Brand</Label>
          <input className="input-dark" placeholder="e.g. Lumina Organic Skincare"
            value={brief.product} onChange={e => set("product", e.target.value)} required />
        </div>
        <div>
          <Label>Landing Page URL</Label>
          <input className="input-dark" type="url" placeholder="https://yourstore.com/sale"
            value={brief.url} onChange={e => set("url", e.target.value)} />
        </div>
      </div>

      <div>
        <Label tip="Who are you targeting? Be specific — age, interests, behaviors, life stage.">Target Audience</Label>
        <textarea className="input-dark resize-none" rows={2}
          placeholder="e.g. Women 25–40 interested in clean beauty, yoga, wellness, living in Tier 1 cities, household income $60K+"
          value={brief.audience} onChange={e => set("audience", e.target.value)} required />
      </div>

      <div>
        <Label tip="What makes this product uniquely valuable? Include proof points, differentiators, key benefits.">USP / Key Value Proposition</Label>
        <textarea className="input-dark resize-none" rows={3}
          placeholder="e.g. Only Indian brand with clinically-proven 0.1% retinol at ₹999. 50,000+ 5-star reviews. Dermatologist-formulated. Results in 21 days or money back."
          value={brief.usp} onChange={e => set("usp", e.target.value)} required />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <Label>Campaign Objective</Label>
          <select className="input-dark" value={brief.objective}
            onChange={e => set("objective", e.target.value as AdObjective)}>
            {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <Label>Monthly Budget</Label>
          <select className="input-dark" value={brief.budget}
            onChange={e => set("budget", e.target.value as BudgetRange)}>
            {BUDGETS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <Label tip="e.g. 3x ROAS, ₹500 CPA, 1000 leads/month">Target ROAS / CPA / KPI</Label>
          <input className="input-dark" placeholder="e.g. 3.5x ROAS"
            value={brief.target_metric} onChange={e => set("target_metric", e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Ad Formats</Label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map(f => (
            <button type="button" key={f} onClick={() => toggleFormat(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                brief.formats.includes(f)
                  ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                  : "border-white/10 bg-surface-700 text-slate-400 hover:border-white/20 hover:text-slate-300"
              )}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Brand Voice / Tone</Label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button type="button" key={t} onClick={() => set("tone", t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                  brief.tone === t
                    ? "border-purple-500/50 bg-purple-500/15 text-purple-300"
                    : "border-white/10 bg-surface-700 text-slate-400 hover:border-white/20 hover:text-slate-300"
                )}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Competitors (optional)</Label>
          <textarea className="input-dark resize-none" rows={3}
            placeholder="e.g. Minimalist, Dot & Key, Plum — we're cheaper with better ingredients"
            value={brief.competitors} onChange={e => set("competitors", e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Additional Context (optional)</Label>
        <textarea className="input-dark resize-none" rows={2}
          placeholder="Current promotions, seasonal angles, past performance data, anything else Claude should know..."
          value={brief.extra_context} onChange={e => set("extra_context", e.target.value)} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <p className="text-xs text-slate-500">
          {!brief.product || !brief.audience || !brief.usp
            ? "Fill in product, audience, and USP to save"
            : "✓ Ready to save and generate AI content"}
        </p>
        <button type="submit" disabled={saving || !title || !brief.product || !brief.audience || !brief.usp}
          className="btn-primary">
          {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Save Campaign →"}
        </button>
      </div>
    </form>
  );
}
