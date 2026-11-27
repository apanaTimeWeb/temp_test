'use client';
// RESPONSIBILITY: Render tabular security event audit records focusing on essential metrics with Cyber-Luxury styling.

import React from 'react';
import { Eye, ChevronLeft, ChevronRight, ShieldAlert, ShieldCheck, Lock, Key, FileOutput, AlertTriangle } from 'lucide-react';
import type { SecurityReportTableRecord, SecurityEventType, SecuritySeverity } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/types/SuperadminAnalyticsSecurityReportsTypes';
import { formatSecurityEventLabel } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/utils/SuperadminAnalyticsSecurityReportsFormatters';
import { SuperadminAnalyticsSecurityReportsEmptyState } from '@/app/frontend_superadmin/superadmin_analytics/analytics_security_reports/components/SuperadminAnalyticsSecurityReportsEmptyState';

interface Props {
  records: SecurityReportTableRecord[];
  isLoading: boolean;
  selectedRecord: SecurityReportTableRecord | null;
  onSelectRecord: (record: SecurityReportTableRecord) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function getEventIcon(type: SecurityEventType) {
  switch (type) {
    case 'LOGIN_SUCCESS':
      return <ShieldCheck size={14} className="text-emerald-400" />;
    case 'LOGIN_FAILED':
      return <ShieldAlert size={14} className="text-amber-400" />;
    case 'ACCOUNT_LOCKED':
      return <Lock size={14} className="text-rose-400" />;
    case 'PERMISSION_CHANGED':
      return <Key size={14} className="text-purple-400" />;
    case 'DATA_EXPORTED':
      return <FileOutput size={14} className="text-sky-400" />;
    case 'SUSPICIOUS_ACTIVITY':
      return <AlertTriangle size={14} className="text-rose-500 motion-safe:animate-pulse" />;
    default:
      return <ShieldAlert size={14} className="text-slate-400" />;
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

export function SuperadminAnalyticsSecurityReportsTable({
  records,
  isLoading,
  selectedRecord,
  onSelectRecord,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}: Props) {
  if (records.length === 0 && !isLoading) {
    return <SuperadminAnalyticsSecurityReportsEmptyState />;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div
      className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-indigo-950/40"
      data-testid="security-reports-table-container"
    >
      {/* ── Table Header Banner ── */}
      <div className="p-4 sm:p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Security Audit Trail & Threat Telemetry</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-semibold">
              {records.length} events
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">High-priority authentication events, risk severity, and access monitoring</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
        </span>
      </div>

      {/* ── Focused Essential Columns Table ── */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs" data-testid="security-reports-table">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-500/20 font-bold">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Security Event</th>
              <th className="py-3.5 px-4 text-center">Severity</th>
              <th className="py-3.5 px-4">Library & Branch</th>
              <th className="py-3.5 px-4">User / Actor</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {records.map((r) => {
              const isSelected = selectedRecord?.id === r.id;

              return (
                <tr
                  key={r.id}
                  className={`hover:bg-indigo-500/10 transition-colors ${
                    isSelected ? 'bg-rose-500/10' : ''
                  }`}
                >
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-slate-400 text-[11px]">{r.timestamp}</span>
                  </td>

                  {/* Event Type with Icon */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getEventIcon(r.eventType)}
                      <span className="font-semibold text-white">
                        {formatSecurityEventLabel(r.eventType)}
                      </span>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(
                        r.severity
                      )}`}
                    >
                      {r.severity}
                    </span>
                  </td>

                  {/* Library & Branch */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-white leading-tight">{r.libraryName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.branchName}</p>
                    </div>
                  </td>

                  {/* Actor / User */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-200">{r.adminName}</span>
                  </td>

                  {/* Action: View full audit payload in popup */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-white motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Inspect security audit event"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div className="p-3.5 border-t border-indigo-500/20 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing <span className="text-white font-medium">{records.length}</span> of <span className="text-white font-medium">{totalCount}</span> logged security events
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer motion-safe:transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/25 font-bold font-mono text-white text-xs">
            {currentPage}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer motion-safe:transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
