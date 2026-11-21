// components/SuperadminSecurityOverviewThreatEventsTable.tsx
// RESPONSIBILITY: Display live security threat telemetry, severity badges, action taken, and interactive pagination.
'use client';

import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  ShieldAlert,
} from 'lucide-react';
import React, { useMemo } from 'react';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  event: string;
  originIp: string;
  location: string;
  targetUser: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  actionTaken: string;
  status: 'Blocked' | 'Mitigated' | 'Monitoring';
}

interface SuperadminSecurityOverviewThreatEventsTableProps {
  events: ThreatEvent[];
  threatSearch: string;
  onSearchChange: (q: string) => void;
  severityFilter: string;
  onSeverityChange: (sev: string) => void;
  page: number;
  onPageChange: (p: number) => void;
  pageSize: number;
  onPageSizeChange: (sz: number) => void;
  onExportCsv: () => void;
}

export const SuperadminSecurityOverviewThreatEventsTable: React.FC<
  SuperadminSecurityOverviewThreatEventsTableProps
> = ({
  events,
  threatSearch,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onExportCsv,
}) => {
  const filteredThreats = useMemo(() => {
    return events.filter((e) => {
      const matchSeverity = severityFilter === 'All' || e.severity === severityFilter;
      const q = threatSearch.toLowerCase();
      const matchSearch =
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.event.toLowerCase().includes(q) ||
        e.originIp.toLowerCase().includes(q) ||
        e.targetUser.toLowerCase().includes(q);
      return matchSeverity && matchSearch;
    });
  }, [events, threatSearch, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredThreats.length / pageSize));
  const paginatedThreats = useMemo(() => {
    const start = page * pageSize;
    return filteredThreats.slice(start, start + pageSize);
  }, [filteredThreats, page, pageSize]);

  return (
    <section id="threat-events-section" className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-2xl overflow-hidden scroll-mt-6 backdrop-blur-xl">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-indigo-500/20 bg-indigo-950/25">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert size={16} />
            </div>
            <span>Live Security Threat Telemetry & Intrusion Log</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time heuristic anomaly detection, rate-limiting violations, and perimeter firewall blocks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search event, IP, user..."
              value={threatSearch}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(0);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 w-48 sm:w-56"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => {
              onSeverityChange(e.target.value);
              onPageChange(0);
            }}
            className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-indigo-500/20 bg-[#07091a]/95 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <th className="px-5 py-3.5">Event ID & Time</th>
              <th className="px-5 py-3.5">Triggered Security Event</th>
              <th className="px-5 py-3.5">Origin IP & Geo</th>
              <th className="px-5 py-3.5">Target Scope</th>
              <th className="px-5 py-3.5">Severity</th>
              <th className="px-5 py-3.5 text-right">Enforced Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {paginatedThreats.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                  No security incidents match the active filter criteria.
                </td>
              </tr>
            ) : (
              paginatedThreats.map((e) => (
                <tr key={e.id} className="hover:bg-indigo-950/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-slate-100 text-xs block">{e.id}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{e.timestamp}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      {e.status === 'Blocked' ? (
                        <Ban size={14} className="text-rose-400 shrink-0" />
                      ) : e.status === 'Mitigated' ? (
                        <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                      ) : (
                        <Activity size={14} className="text-sky-400 shrink-0" />
                      )}
                      <span>{e.event}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-semibold text-indigo-300 text-xs block">{e.originIp}</span>
                    <span className="text-[11px] text-slate-400">{e.location}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]">{e.targetUser}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        e.severity === 'Critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : e.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : e.severity === 'Medium'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700'
                      }`}
                    >
                      {e.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
                      <CheckCircle size={12} />
                      <span>{e.actionTaken}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-indigo-500/20 bg-[#07091a]/80 text-xs text-slate-400">
        <span>
          Showing {filteredThreats.length === 0 ? 0 : page * pageSize + 1} to{' '}
          {Math.min((page + 1) * pageSize, filteredThreats.length)} of {filteredThreats.length} events
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-slate-300 hover:bg-indigo-900/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-[0.98]"
            disabled={page === 0}
            onClick={() => onPageChange(Math.max(0, page - 1))}
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          <span className="font-mono text-xs text-slate-200 px-2">
            Page {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-slate-300 hover:bg-indigo-900/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-[0.98]"
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
