'use client';
/** Responsibility: render only the Security Threats leaf's reachable Audit & Threats preview panel. */
/** Data-Flow: local sample failed-login fixture -> escaped React text rendering -> explicit sample-only CSV export. */
import { useState, useMemo, useCallback } from 'react';
import {
  Download,
  ShieldAlert,
  ShieldX,
  Clock,
  AlertTriangle,
  Search,
  X,
  RotateCcw,
  RotateCw,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityOperationsPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_threats/types/SuperadminSecurityThreatsOperationsPanelsComponentTypes';

/** Displays sample threat records. No policy, firewall, API-key, or session mutation is performed here. */
export default function SuperadminSecurityThreatsOperationsPanels({ failedLogins, handleExportLogs }: SuperadminSecurityOperationsPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');

  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const distinctReasons = useMemo(() => {
    return Array.from(new Set(failedLogins.map((f) => f.reason)));
  }, [failedLogins]);

  const filteredLogins = useMemo(() => {
    return failedLogins.filter((f) => {
      if (reasonFilter !== 'all' && f.reason !== reasonFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesIp = f.ip.toLowerCase().includes(q);
        const matchesUser = f.user.toLowerCase().includes(q);
        if (!matchesIp && !matchesUser) return false;
      }
      return true;
    });
  }, [failedLogins, reasonFilter, searchQuery]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Threat radar telemetry refreshed from WAF clusters', {
        id: 'superadmin:security:threats:refresh',
      });
    }, 450);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setReasonFilter('all');
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const hasActiveFilters = searchQuery.trim() !== '' || reasonFilter !== 'all';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 motion-safe:animate-fade-in motion-reduce:animate-none space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/20 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-rose-300 mb-1 flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-400" />
            <span>{tCopy("COPY.SUSPICIOUS_ACTIVITY_FAILED_LOGINS")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">{tCopy("COPY.AUTOMATED_THREAT_DETECTION_LOGS")}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer motion-safe:transition-all disabled:opacity-50"
            title="Refresh threat telemetry"
          >
            <RotateCw size={13} className={`text-rose-400 ${isRefreshing ? 'motion-safe:animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/30 motion-safe:transition-all active:scale-[0.98] cursor-pointer"
            type="button"
            onClick={handleExportLogs}
            data-testid="superadmin-security-security-operations-panels-export-sample-logs-csv-9"
            title="Export threat log entries to CSV"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer motion-safe:transition-all"
            title="Print Incident Response Report"
          >
            <Printer size={13} className="text-slate-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-2xl border border-rose-500/25 bg-[#140612]/90 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search flagged IP, attempted email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-rose-500/30 bg-[#09030a] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <select
          aria-label="Filter by incident reason"
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="rounded-xl border border-rose-500/30 bg-[#09030a] px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="all">All Incident Reasons</option>
          {distinctReasons.map((r) => (
            <option key={r} value={r}>
              {tCopy(`COPY.${r}`)}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer motion-safe:transition-all"
            title="Clear all filters"
          >
            <RotateCcw size={12} className="text-rose-400" />
            <span>Reset</span>
          </button>
        )}

        <span className="text-xs text-rose-300 font-medium px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 ml-auto">
          {filteredLogins.length} of {failedLogins.length} incidents
        </span>
      </div>

      <div className="grid gap-3.5">
        {filteredLogins.map((f) => (
          <div
            key={f.id}
            className="group relative rounded-2xl border border-rose-500/25 bg-gradient-to-b from-[#220918]/80 to-[#100618]/95 p-4 sm:p-5 backdrop-blur-md motion-safe:transition-all motion-safe:duration-200 hover:border-rose-500/50 hover:from-[#2e0c20]/90 hover:to-[#160822]/98 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-400 shadow-inner">
                <ShieldX size={22} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                  <span className="text-slate-100 group-hover:text-rose-200 transition-colors">{f.ip}</span>
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded border border-rose-500/30 shadow-xs">
                    Flagged Source
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {tCopy("COPY.ATTEMPTED_EMAIL")} <span className="text-slate-100 font-semibold">{f.user}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto md:self-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 shadow-xs">
                <AlertTriangle size={12} className="text-rose-400" />
                <span>{tCopy(`COPY.${f.reason}`)}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Clock size={12} className="text-slate-400" />
                <span>{tCopy(`COPY.${f.time}`)}</span>
              </span>
            </div>
          </div>
        ))}
        {filteredLogins.length === 0 && (
          <div className="rounded-2xl border border-dashed border-rose-500/30 bg-[#07091a]/50 p-8 text-center text-sm text-slate-400">
            No threat incidents match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
