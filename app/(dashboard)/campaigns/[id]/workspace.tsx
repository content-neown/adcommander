"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lightbulb, PenLine, LayoutGrid, Image, Rocket,
  ChevronLeft, Check, FileText
} from "lucide-react";
import { StagePanel } from "@/components/campaign/stage-panel";
import { cn, STAGE_COLORS } from "@/lib/utils";
import { STAGE_META } from "@/lib/prompts";
import type { Campaign, CampaignStage } from "@/types";

const STAGE_ICONS: Record<CampaignStage, React.ElementType> = {
  ideation:  Lightbulb,
  scripts:   PenLine,
  structure: LayoutGrid,
  creative:  Image,
  launch:    Rocket,
};

const STAGES: CampaignStage[] = ["ideation", "scripts", "structure", "creative", "launch"];

interface Props {
  campaign:  Campaign;
  outputMap: Record<string, string>;
}

export function CampaignWorkspace({ campaign, outputMap }: Props) {
  const [activeStage, setStage] = useState<CampaignStage>("ideation");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3.5 border-b border-white/[0.06] bg-surface-900 shrink-0">
        <Link href="/campaigns" className="text-slate-500 hover:text-slate-300 transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">{campaign.title}</h1>
          <p className="text-xs text-slate-500 truncate">
            {campaign.brief.product} · {campaign.brief.objective} · {campaign.brief.budget}
          </p>
        </div>
        <Link href={`/campaigns/${campaign.id}/brief`}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-surface-800 border border-white/10 transition-colors">
          <FileText size={13} /> Edit Brief
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Stage sidebar */}
        <div className="w-52 shrink-0 border-r border-white/[0.06] bg-surface-850 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 px-3 mb-3 font-medium">Generation Stages</p>
          {STAGES.map((s) => {
            const Icon    = STAGE_ICONS[s];
            const meta    = STAGE_META[s];
            const active  = activeStage === s;
            const hasData = !!outputMap[s];

            return (
              <button key={s} onClick={() => setStage(s)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left group",
                  active ? "bg-surface-700 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                )}>
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  active ? "bg-surface-600" : "bg-surface-800 group-hover:bg-surface-700"
                )}>
                  {hasData && !active
                    ? <Check size={13} className="text-green-400" />
                    : <Icon size={14} className={active ? "text-white" : "text-slate-500 group-hover:text-slate-400"} />
                  }
                </div>
                <div className="min-w-0">
                  <div className={cn("text-xs font-medium leading-none", active ? "text-white" : "text-slate-300")}>{meta.label}</div>
                  <div className="text-[10px] text-slate-600 mt-1 truncate leading-none">{meta.description}</div>
                </div>
              </button>
            );
          })}

          {/* Brief summary */}
          <div className="!mt-6 mx-1 p-3 rounded-xl bg-surface-800 border border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2 font-medium">Brief</p>
            <div className="space-y-1">
              {[
                { label: "Product", value: campaign.brief.product },
                { label: "Audience", value: campaign.brief.audience.slice(0, 40) + (campaign.brief.audience.length > 40 ? "…" : "") },
                { label: "Budget", value: campaign.brief.budget },
                { label: "Target", value: campaign.brief.target_metric || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-[10px] text-slate-600">{label}: </span>
                  <span className="text-[10px] text-slate-400">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage content */}
        <div className="flex-1 overflow-hidden">
          <StagePanel
            key={activeStage}
            campaignId={campaign.id}
            stage={activeStage}
            brief={campaign.brief}
            savedOutput={outputMap[activeStage]}
          />
        </div>
      </div>
    </div>
  );
}
