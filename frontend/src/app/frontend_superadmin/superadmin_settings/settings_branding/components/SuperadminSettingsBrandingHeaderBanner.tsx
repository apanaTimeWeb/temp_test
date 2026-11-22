'use client';
import type { FC } from 'react';
import { Palette } from 'lucide-react';

interface SuperadminSettingsBrandingHeaderBannerProps {
  title: string;
  subtitle: string;
}

export const SuperadminSettingsBrandingHeaderBanner: FC<SuperadminSettingsBrandingHeaderBannerProps> = ({
  title,
  subtitle,
}) => (
  <div className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#1d0b30]/80 via-[#0a0d24] to-[#060810] p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
    {/* Ambient Glow spot */}
    <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-purple-500/15 blur-3xl" />
    <div className="space-y-1.5 relative">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-semibold text-purple-300">
        <Palette size={12} className="text-purple-400" />
        <span>Interactive White-Label Engine</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3 tracking-tight">
        <Palette size={26} className="text-purple-400 shrink-0" />
        <span>{title}</span>
      </h1>
      <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">{subtitle}</p>
    </div>
    <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/90 border border-indigo-500/30 rounded-xl px-4 py-2 self-start md:self-auto shrink-0 shadow-lg relative">
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="font-semibold text-indigo-200">Live Simulator Sandbox</span>
    </div>
  </div>
);
