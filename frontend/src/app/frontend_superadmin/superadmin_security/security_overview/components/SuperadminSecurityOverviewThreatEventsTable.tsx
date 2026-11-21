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
    <section className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-border/80">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-400" />
            Live Security Threat Telemetry & Intrusion Log
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time heuristic anomaly detection, rate-limiting violations, and perimeter firewall blocks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="Search event, IP, user..."
              value={threatSearch}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onPageChange(0);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-muted/30 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-400 w-48 sm:w-56"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => {
              onSeverityChange(e.target.value);
              onPageChange(0);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
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
            <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground font-semibold">
              <th className="px-4 py-3">Event ID & Time</th>
              <th className="px-4 py-3">Triggered Security Event</th>
              <th className="px-4 py-3">Origin IP & Geo</th>
              <th className="px-4 py-3">Target Scope</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3 text-right">Enforced Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedThreats.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No security incidents match the active filter criteria.
                </td>
              </tr>
            ) : (
              paginatedThreats.map((e) => (
                <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-foreground block">{e.id}</span>
                    <span className="text-[11px] text-muted-foreground">{e.timestamp}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground flex items-center gap-2">
                    {e.status === 'Blocked' ? (
                      <Ban size={14} className="text-rose-400 shrink-0" />
                    ) : e.status === 'Mitigated' ? (
                      <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                    ) : (
                      <Activity size={14} className="text-sky-400 shrink-0" />
                    )}
                    <span>{e.event}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-foreground block">{e.originIp}</span>
                    <span className="text-[11px] text-muted-foreground">{e.location}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">{e.targetUser}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        e.severity === 'Critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : e.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : e.severity === 'Medium'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {e.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-emerald-400">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
        <span>
          Showing {filteredThreats.length === 0 ? 0 : page * pageSize + 1} to{' '}
          {Math.min((page + 1) * pageSize, filteredThreats.length)} of {filteredThreats.length} events
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
            disabled={page === 0}
            onClick={() => onPageChange(Math.max(0, page - 1))}
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          <span className="font-mono text-xs text-foreground px-2">
            Page {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer"
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
