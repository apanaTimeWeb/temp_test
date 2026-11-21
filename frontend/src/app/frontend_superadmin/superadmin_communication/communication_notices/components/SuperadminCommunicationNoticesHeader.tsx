'use client';
// RESPONSIBILITY: Render hero header and live KPI cards for Platform Notices with Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNoticesPageClient -> SuperadminCommunicationNoticesHeader.

import React from 'react';
import { Bell, CheckCircle2, Clock, Download, Plus, Printer, Radio } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NoticesHeaderProps {
  stats: { total: number; active: number; expired: number };
  matchedCount: number;
  onOpenAdd: () => void;
  onExportCsv: () => void;
}

export function SuperadminCommunicationNoticesHeader({
  stats,
  matchedCount,
  onOpenAdd,
  onExportCsv,
}: NoticesHeaderProps) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1338]/90 to-slate-900/90 border border-sky-500/25 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Ambient glowing spotlight */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast Network Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 shadow-inner">
              <Bell className="w-6 h-6" />
            </div>
            <span>Platform Notices & Announcements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Publish and govern multi-tenant announcements, scheduled system maintenance, and operational alerts.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/25 hover:border-sky-500/50 hover:bg-sky-500/10 text-slate-200 text-xs font-medium transition-all shadow-sm cursor-pointer"
            title="Export notices to CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/25 hover:border-slate-500/50 hover:bg-white/[0.05] text-slate-300 text-xs font-medium transition-all shadow-sm cursor-pointer"
            title="Print notices"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={onOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all active:scale-95 cursor-pointer"
            data-testid="superadmin-communication-communication-notices-post-notice-15"
          >
            <Plus size={15} />
            <span>{tCopy('COPY.POST_NOTICE')}</span>
          </button>
        </div>
      </div>

      {/* Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-indigo-500/20 relative z-10">
        {/* 1. Total Notices - Indigo / Sky */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0c0f2a]/95 via-[#090d24]/90 to-[#141a45]/85 p-5 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-950/50">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/15 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/25" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Total Notices
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-indigo-500/20 bg-indigo-500/20 border-indigo-500/40 text-indigo-300">
              <Bell size={18} strokeWidth={2.3} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight text-indigo-200">{stats.total}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-indigo-300 bg-indigo-500/15 border-indigo-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {matchedCount} matching filters
            </span>
          </div>
        </div>

        {/* 2. Active Broadcasts - Emerald / Green */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#061e14]/95 via-[#061810]/90 to-[#0a2e1d]/85 p-5 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-950/50">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/25" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/90">
              Active Broadcasts
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-emerald-500/20 bg-emerald-500/20 border-emerald-500/40 text-emerald-400">
              <CheckCircle2 size={18} strokeWidth={2.3} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight text-emerald-300">{stats.active}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-emerald-300 bg-emerald-500/15 border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Currently Live to Libraries
            </span>
          </div>
        </div>

        {/* 3. Expired Notices - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/85 p-5 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-950/50">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/15 blur-2xl transition-all duration-500 group-hover:bg-amber-500/25" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
              Expired Notices
            </span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-md shadow-amber-500/20 bg-amber-500/20 border-amber-500/40 text-amber-400">
              <Clock size={18} strokeWidth={2.3} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black tracking-tight text-amber-300">{stats.expired}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-amber-300 bg-amber-500/15 border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Archived from Board
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
