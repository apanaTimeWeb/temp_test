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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-indigo-500/20 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/25 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Notices</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Showing {matchedCount} matching filters</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Notices</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1.5">{stats.active}</div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">Currently visible to libraries</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-700/50 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expired Notices</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-300 mt-1.5">{stats.expired}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Archived from board</div>
        </div>
      </div>
    </div>
  );
}
