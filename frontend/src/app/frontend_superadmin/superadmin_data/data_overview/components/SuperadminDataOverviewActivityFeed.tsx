// components/SuperadminDataOverviewActivityFeed.tsx
// RESPONSIBILITY: Renders the filterable table of recent Disaster Recovery and data operations. No direct API calls.
'use client';

import React from 'react';
import { History, CheckCircle2, Clock, RotateCcw, ArrowDownToLine, ArrowUpFromLine, Archive } from 'lucide-react';
import type { SuperadminDataOverviewActivityItem } from '@/app/frontend_superadmin/superadmin_data/data_overview/types/superadmin_data_overview.types';
import { formatDurationSeconds, getStatusBadgeVariant } from '@/app/frontend_superadmin/superadmin_data/data_overview/utils/superadmin_data_overview_formatters';
import { displayValue } from '@/lib/display_value';

interface SuperadminDataOverviewActivityFeedProps {
  activities: SuperadminDataOverviewActivityItem[];
  currentFilter: 'ALL' | 'BACKUP' | 'RESTORE' | 'EXPORT' | 'IMPORT';
  onFilterChange: (filter: 'ALL' | 'BACKUP' | 'RESTORE' | 'EXPORT' | 'IMPORT') => void;
}

export function SuperadminDataOverviewActivityFeed({
  activities,
  currentFilter,
  onFilterChange,
}: SuperadminDataOverviewActivityFeedProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'BACKUP':
        return <Clock size={14} className="text-pink-400" />;
      case 'RESTORE':
        return <RotateCcw size={14} className="text-emerald-400" />;
      case 'EXPORT':
        return <ArrowUpFromLine size={14} className="text-sky-400" />;
      case 'IMPORT':
        return <ArrowDownToLine size={14} className="text-violet-400" />;
      case 'ARCHIVE':
        return <Archive size={14} className="text-amber-400" />;
      default:
        return <History size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden" data-testid="data_overview-activity-feed">
      {/* ── Feed Header & Filter Bar ── */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <History size={18} className="text-pink-400" />
          <h3 className="text-sm font-bold text-foreground">Recent Disaster Recovery Operations</h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Activity filter">
          {(['ALL', 'BACKUP', 'RESTORE', 'EXPORT', 'IMPORT'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentFilter === filter
                  ? 'bg-pink-600 text-white'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              data-testid={`data_overview-filter-${filter.toLowerCase()}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── Events Table ── */}
      {activities.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No operations found matching current filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-neutral-900/40 text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Event & Scope</th>
                <th className="py-3 px-4">Target Tenant</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activities.map((act) => {
                const badge = getStatusBadgeVariant(act.status);

                return (
                  <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <span className="p-1 rounded-md bg-muted/60 mt-0.5">{getIconForType(act.type)}</span>
                        <div>
                          <div className="font-semibold text-foreground">{act.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{act.details}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-foreground font-mono text-[11px]">
                        {displayValue(act.tenantName)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{act.timestamp}</td>
                    <td className="py-3 px-4 text-foreground font-mono">
                      {formatDurationSeconds(act.durationSeconds)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text}`}>
                        <CheckCircle2 size={11} />
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
