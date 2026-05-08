"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles, Loader2, RefreshCw, Copy, Check,
  Send, Globe, ChevronDown, ChevronUp, Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_META } from "@/lib/prompts";
import type { CampaignBrief, CampaignStage, ChatMessage } from "@/types";

interface Props {
  campaignId: string;
  stage:      CampaignStage;
  brief:      CampaignBrief;
  savedOutput?: string;
}

export function StagePanel({ campaignId, stage, brief, savedOutput = "" }: Props) {
  const meta = STAGE_META[stage];
  const [output,   setOutput]   = useState(savedOutput);
  const [loading,  setLoading]  = useState(false);
  const [saved,    setSaved]    = useState(!!savedOutput);
  const [copied,   setCopied]   = useState(false);
  const [useSearch,setSearch]   = useState(true);
  const [followUp, setFollowUp] = useState("");
  const [history,  setHistory]  = useState<ChatMessage[]>([]);
  const [showHist, setShowHist] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const abortRef  = useRef<AbortController | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const generate = useCallback(async (followUpMsg?: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    if (!followUpMsg) setOutput("");
    setSaved(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          campaign_id: campaignId,
          stage, brief, useSearch,
          followUp: followUpMsg,
          history: followUpMsg ? [...history, { role: "assistant", content: output }] : [],
        }),
      });

      if (!res.body) throw new Error("No response body");
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let newContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const { text } = JSON.parse(data);
            newContent += text;
            setOutput(prev => prev + text);
          } catch {}
        }
      }

      if (followUpMsg) {
        setHistory(h => [
          ...h,
          { role: "user",      content: followUpMsg },
          { role: "assistant", content: newContent  },
        ]);
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") {
        setOutput("Error generating content. Check your API key and try again.");
      }
    }

    setLoading(false);
  }, [campaignId, stage, brief, useSearch, history, output]);

  async function saveOutput() {
    await fetch(`/api/campaigns/${campaignId}/outputs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, content: output }),
    });
    setSaved(true);
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendFollowUp() {
    if (!followUp.trim() || loading) return;
    const q = followUp;
    setFollowUp("");
    await generate(q);
  }

  const colorMap: Record<string, string> = {
    amber:  "text-amber-400",
    blue:   "text-blue-400",
    green:  "text-green-400",
    purple: "text-purple-400",
    teal:   "text-teal-400",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
        <div>
          <h2 className="text-base font-semibold">{meta.label}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <button onClick={() => setSearch(!useSearch)}
            title="Toggle real-time web search"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors",
              useSearch
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-white/10 bg-surface-700 text-slate-500"
            )}>
            <Globe size={12} />
            {useSearch ? "Live Search ON" : "Live Search OFF"}
          </button>

          {output && !loading && (
            <>
              <button onClick={copyOutput} className="btn-secondary py-1.5 text-xs">
                {copied ? <><Check size={13} className="text-green-400" /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
              <button onClick={saveOutput} className={cn("btn-secondary py-1.5 text-xs", saved && "text-green-400")}>
                {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save</>}
              </button>
              <button onClick={() => generate()} className="btn-secondary py-1.5 text-xs">
                <RefreshCw size={13} /> Regenerate
              </button>
            </>
          )}

          {!output && (
            <button onClick={() => generate()} disabled={loading} className="btn-primary">
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Generating...</>
                : <><Sparkles size={15} /> Generate with Claude</>}
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto px-6 py-5">
        {!output && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className={cn("w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4", colorMap[meta.color])}>
              <Sparkles size={28} className={colorMap[meta.color]} />
            </div>
            <h3 className="font-medium mb-2">Ready to generate {meta.label}</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Claude will analyze your brief{useSearch ? " + fetch real-time Meta intelligence" : ""} to generate{" "}
              {meta.description.toLowerCase()}.
            </p>
            <button onClick={() => generate()} disabled={loading} className="btn-primary mt-6">
              <Sparkles size={15} /> Generate {meta.label}
            </button>
          </div>
        )}

        {loading && !output && (
          <div className="flex items-center gap-3 text-slate-400 mt-8">
            <Loader2 size={18} className="animate-spin text-brand-400" />
            <div>
              <div className="text-sm font-medium text-slate-200">Claude is generating...</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {useSearch ? "Fetching live Meta intelligence + generating content" : "Generating content with brief context"}
              </div>
            </div>
          </div>
        )}

        {output && (
          <div className="prose-dark max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            {loading && <span className="inline-block w-2 h-4 bg-brand-400 animate-pulse ml-0.5 rounded-sm" />}
          </div>
        )}
      </div>

      {/* Follow-up & history */}
      {output && !loading && (
        <div className="shrink-0 border-t border-white/[0.06] px-6 py-4 space-y-3">
          {/* Conversation history toggle */}
          {history.length > 0 && (
            <button onClick={() => setShowHist(!showHist)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              {showHist ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {history.length} follow-up{history.length > 1 ? "s" : ""} in this session
            </button>
          )}

          {showHist && history.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map((m, i) => (
                <div key={i} className={cn("text-xs px-3 py-2 rounded-lg",
                  m.role === "user" ? "bg-brand-600/10 text-brand-300" : "bg-surface-800 text-slate-400")}>
                  <span className="font-medium mr-2">{m.role === "user" ? "You:" : "Claude:"}</span>
                  {m.content.slice(0, 120)}{m.content.length > 120 ? "..." : ""}
                </div>
              ))}
            </div>
          )}

          {/* Follow-up input */}
          <div className="flex gap-2">
            <input
              value={followUp}
              onChange={e => setFollowUp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendFollowUp()}
              placeholder="Ask a follow-up... e.g. 'Make the hooks more aggressive' or 'Add UGC video script'"
              className="input-dark flex-1 text-sm"
            />
            <button onClick={sendFollowUp} disabled={!followUp.trim()} className="btn-primary px-3">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
