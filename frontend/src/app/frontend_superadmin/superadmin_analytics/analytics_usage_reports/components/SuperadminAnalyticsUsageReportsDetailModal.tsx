'use client';
// RESPONSIBILITY: Display complete telemetry, storage quotas, API volume, and administrator details in a Cyber-Luxury modal.

import React from 'react';
import { X, Gauge, HardDrive, Users, Activity, MessageSquare, ShieldCheck, Mail, Calendar } from 'lucide-react';
import type { UsageReportTableRecord } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber, formatStorageSize } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/utils/SuperadminAnalyticsUsageReportsFormatters';

interface Props {
  record: UsageReportTableRecord | null;
  onClose: () => void;
}

export function SuperadminAnalyticsUsageReportsDetailModal({ record, onClose }: Props) {
  if (!record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-detail-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-[#0a0d24]/95 text-white shadow-2xl shadow-indigo-950/60 backdrop-blur-xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Gauge size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="usage-detail-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight">
                  {record.libraryName}
                </h2>
                <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                  {record.libraryCode}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {record.branchName} • <span className="text-slate-300">{record.plan}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition-colors"
            aria-label="Close usage details"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── 4 Telemetry Stat Cards Grid ── */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Card 1: Members & Staff */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-bold uppercase tracking-wider">
              <Users size={14} />
              <span>Members & Staff</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white pt-1">
              {formatUsageNumber(record.membersCount)}
            </div>
            <p className="text-[11px] text-slate-400">
              Active staff: <span className="text-slate-200 font-semibold">{record.staffCount}</span>
            </p>
          </div>

          {/* Card 2: Cloud Storage */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-bold uppercase tracking-wider">
              <HardDrive size={14} />
              <span>Storage Ingress</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-purple-300 pt-1">
              {formatStorageSize(record.storageMb)}
            </div>
            <p className="text-[11px] text-slate-400">Database & Blob Storage</p>
          </div>

          {/* Card 3: API Requests */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Activity size={14} />
              <span>API Gateway</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 pt-1">
              {formatUsageNumber(record.apiCalls)}
            </div>
            <p className="text-[11px] text-slate-400">Monthly HTTP API calls</p>
          </div>

          {/* Card 4: Multi-Channel Messaging */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <MessageSquare size={14} />
              <span>Messaging Volume</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300 pt-1">
              {formatUsageNumber(record.whatsappCount)} WA
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {formatUsageNumber(record.smsCount)} SMS Dispatches
            </p>
          </div>
        </div>

        {/* ── Detailed Account & Administrator Meta ── */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2.5 text-xs">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <ShieldCheck size={13} />
            <span>Account Ownership & System Parameters</span>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-indigo-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mail size={12} />
                <span>Admin Account:</span>
              </span>
              <span className="font-medium text-white">{record.adminName} ({record.adminEmail})</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-indigo-500/15">
              <span className="text-slate-400">Subscription Tier:</span>
              <span className="font-semibold text-sky-400">{record.plan}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-indigo-500/15">
              <span className="text-slate-400">Operating Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                record.status === 'ACTIVE'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {record.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-indigo-500/15">
              <span className="text-slate-400">Payment Standing:</span>
              <span className={`font-semibold ${
                record.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {record.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar size={12} />
                <span>Last Telemetry Sync:</span>
              </span>
              <span className="font-mono text-slate-300">{record.lastActiveDate}</span>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-end pt-2 border-t border-indigo-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-white motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
