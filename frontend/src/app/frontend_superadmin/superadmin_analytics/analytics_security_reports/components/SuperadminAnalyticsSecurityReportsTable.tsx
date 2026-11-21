'use client';
// RESPONSIBILITY: Tabular display of security events, audit trails, and authentication anomalies with pagination.

import React from 'react';
import { Eye, ChevronLeft, ChevronRight, ShieldAlert, ShieldCheck, Lock, Key, FileOutput, AlertTriangle } from 'lucide-react';
import type { SecurityReportTableRecord, SecurityEventType, SecuritySeverity } from '../types/SuperadminAnalyticsSecurityReportsTypes';
import { formatSecurityEventLabel } from '../utils/SuperadminAnalyticsSecurityReportsFormatters';
import { SuperadminAnalyticsSecurityReportsEmptyState } from './SuperadminAnalyticsSecurityReportsEmptyState';

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
      return <AlertTriangle size={14} className="text-rose-500 animate-pulse" />;
    default:
      return <ShieldAlert size={14} className="text-muted-foreground" />;
  }
}

function getSeverityBadge(severity: SecuritySeverity) {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    case 'HIGH':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    case 'MEDIUM':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
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
      className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs overflow-hidden shadow-xs"
      data-testid="security-reports-table-container"
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs" data-testid="security-reports-table">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Library / Branch</th>
              <th className="py-3 px-4">Admin / Account</th>
              <th className="py-3 px-4">IP Address / Location</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {records.map((r) => {
              const isSelected = selectedRecord?.id === r.id;

              return (
                <tr
                  key={r.id}
                  className={`hover:bg-muted/40 transition-colors ${
                    isSelected ? 'bg-rose-500/10' : ''
                  }`}
                >
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-muted-foreground text-[11px]">{r.timestamp}</span>
                  </td>

                  {/* Event Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getEventIcon(r.eventType)}
                      <span className="font-semibold text-foreground">
                        {formatSecurityEventLabel(r.eventType)}
                      </span>
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(
                        r.severity
                      )}`}
                    >
                      {r.severity}
                    </span>
                  </td>

                  {/* Library & Branch */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-foreground">{r.libraryName}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-rose-400">{r.libraryCode}</span>
                        <span>•</span>
                        <span>{r.branchName}</span>
                      </p>
                    </div>
                  </td>

                  {/* Admin / Account */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-medium text-foreground">{r.adminName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{r.adminEmail}</p>
                    </div>
                  </td>

                  {/* IP Address & Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <span className="font-mono text-foreground font-semibold">{r.ipAddress}</span>
                      <p className="text-[10px] text-muted-foreground">{r.location}</p>
                    </div>
                  </td>

                  {/* Details */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-muted-foreground text-[11px]">
                    {r.details}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      title="Inspect security audit event"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div className="p-3.5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          Showing {records.length} of {totalCount} logged security events
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
