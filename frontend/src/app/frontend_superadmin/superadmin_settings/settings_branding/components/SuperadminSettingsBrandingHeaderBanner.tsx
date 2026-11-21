'use client';
import type { FC } from 'react';
import { Palette, Sparkles } from 'lucide-react';

interface SuperadminSettingsBrandingHeaderBannerProps {
  title: string;
  subtitle: string;
}

export const SuperadminSettingsBrandingHeaderBanner: FC<SuperadminSettingsBrandingHeaderBannerProps> = ({
  title,
  subtitle,
}) => (
  <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-transparent p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
    <div className="space-y-1.5">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
        <Sparkles size={12} className="animate-spin" />
        <span>Interactive White-Label Engine</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-primary flex items-center gap-3 tracking-tight">
        <Palette size={28} className="text-primary shrink-0" />
        <span>{title}</span>
      </h1>
      <p className="text-secondary text-xs sm:text-sm max-w-2xl leading-relaxed">{subtitle}</p>
    </div>
    <div className="flex items-center gap-2.5 text-xs text-secondary bg-surface-zebra/90 border border-border/80 rounded-xl px-4 py-2.5 self-start md:self-auto shrink-0 shadow-xs">
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="font-medium">Live Simulator Sandbox</span>
    </div>
  </div>
);
