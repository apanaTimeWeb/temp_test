'use client';
// RESPONSIBILITY: Display complete security event audit trails, actor credentials, origin network telemetry, and forensic payload in a Cyber-Luxury modal.

import React from 'react';
import { X, ShieldAlert, ShieldCheck, Lock, Key, FileOutput, AlertTriangle, Globe, User, Building2, Terminal } from 'lucide-react';
import type { SecurityReportTableRecord, SecurityEventType, SecuritySeverity } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/types/SuperadminAnalyticsSecurityReportsTypes';
import { formatSecurityEventLabel } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/utils/SuperadminAnalyticsSecurityReportsFormatters';

interface Props {
  record: SecurityReportTableRecord | null;
  onClose: () => void;
}

function getEventIcon(type: SecurityEventType) {
  switch (type) {
    case 'LOGIN_SUCCESS':
      return <ShieldCheck size={22} className="text-emerald-400" />;
    case 'LOGIN_FAILED':
      return <ShieldAlert size={22} className="text-amber-400" />;
    case 'ACCOUNT_LOCKED':
      return <Lock size={22} className="text-rose-400" />;
    case 'PERMISSION_CHANGED':
      return <Key size={22} className="text-purple-400" />;
    case 'DATA_EXPORTED':
      return <FileOutput size={22} className="text-sky-400" />;
    case 'SUSPICIOUS_ACTIVITY':
      return <AlertTriangle size={22} className="text-rose-500 motion-safe:animate-pulse" />;
    default:
      return <ShieldAlert size={22} className="text-slate-400" />;
  }
}

function getSeverityBadge(severity: SecuritySeverity) {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs shadow-rose-500/20';
    case 'HIGH':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-xs shadow-orange-500/20';
    case 'MEDIUM':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs shadow-amber-500/20';
    case 'LOW':
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }
}

export function SuperadminAnalyticsSecurityReportsDetailModal({ record, onClose }: Props) {
  if (!record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-detail-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-[#0a0d24]/95 text-white shadow-2xl shadow-indigo-950/60 backdrop-blur-xl space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-950/40 shrink-0">
              {getEventIcon(record.eventType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="security-detail-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight">
                  {formatSecurityEventLabel(record.eventType)}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getSeverityBadge(record.severity)}`}>
                  {record.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Timestamp: {record.timestamp}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer transition-colors"
            aria-label="Close security event details"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── 2-Column Info Grid: Target Entity & Network Origin ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Target Organization */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
              <Building2 size={13} />
              <span>Target Organization</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Library Unit</span>
                <span className="font-bold text-white text-xs">{record.libraryName}</span>
                <span className="font-mono text-rose-400 text-[10px] ml-1.5">({record.libraryCode})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Branch Campus</span>
                <span className="text-slate-200 font-medium">{record.branchName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tier Plan & Status</span>
                <span className="text-sky-400 font-medium">{record.plan}</span>
                <span className="text-slate-500 mx-1">•</span>
                <span className="text-emerald-400 font-semibold">{record.status}</span>
              </div>
            </div>
          </div>

          {/* Actor & Network Origin */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-bold uppercase tracking-wider">
              <User size={13} />
              <span>User & Network Telemetry</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Account Actor</span>
                <span className="font-bold text-white text-xs">{record.adminName}</span>
                <p className="text-[10px] font-mono text-slate-400">{record.adminEmail}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Origin IP Address</span>
                <span className="font-mono text-xs font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 inline-block mt-0.5">
                  {record.ipAddress}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Globe size={11} className="text-slate-400" />
                <span className="text-slate-300 text-[11px] font-medium">{record.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Diagnostic Audit Payload Box ── */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal size={13} className="text-amber-400" />
              <span>Forensic Audit Payload & Details</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500 uppercase">{record.eventType}</span>
          </div>
          <p className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/15 font-mono text-xs text-slate-200 leading-relaxed break-words">
            {record.details}
          </p>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-end pt-2 border-t border-indigo-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-white motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Close Event Details
          </button>
        </div>
      </div>
    </div>
  );
}
