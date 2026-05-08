"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Zap, LayoutDashboard, FolderOpen, Settings,
  LogOut, ChevronRight, Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const NAV = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Dashboard" },
  { href: "/campaigns",   icon: FolderOpen,       label: "Campaigns" },
  { href: "/settings",    icon: Settings,          label: "Settings" },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  const path   = usePathname();
  const router = useRouter();

  async function signOut() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-surface-900 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">AdCommander</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Powered by Claude AI</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors group",
                active
                  ? "bg-brand-600/15 text-brand-300"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}>
              <Icon size={16} className={active ? "text-brand-400" : "text-slate-500 group-hover:text-slate-400"} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto text-brand-500" />}
            </Link>
          );
        })}

        {/* Search badge */}
        <div className="mt-6 mx-1 px-3 py-2.5 rounded-xl bg-surface-800 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <Wifi size={13} className="text-green-400" />
            <span className="text-xs font-medium text-green-400">Live Web Intel</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Real-time Meta & Andromeda insights fetched on every generation.
          </p>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-xs font-semibold text-brand-300 shrink-0">
            {profile?.full_name?.slice(0, 2).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{profile?.full_name ?? "User"}</div>
            <div className="text-xs text-slate-500 truncate">{profile?.email}</div>
          </div>
          <button onClick={signOut} title="Sign out"
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
