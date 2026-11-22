// components/SuperadminDataBackupOperationsSchedulesTable.tsx
// RESPONSIBILITY: Renders the table of active automated backup schedules with search, status toggles, and frequency indicators. No direct API calls.
'use client';

import React, { useState, useMemo } from 'react';
import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
import { CalendarClock, CheckCircle2, PauseCircle, Search } from 'lucide-react';
import type { SuperadminBackupSchedule } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/types/superadmin_data_backup_operations.types';
import {
  formatFrequencyLabel,
  formatScopeLabel,
  formatStorageTargetLabel,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/utils/superadmin_data_backup_operations_formatters';
import { displayValue } from '@/lib/display_value';

interface SuperadminDataBackupOperationsSchedulesTableProps {
  schedules: SuperadminBackupSchedule[];
  searchFilter: string;
  onSearchChange: (search: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export function SuperadminDataBackupOperationsSchedulesTable({
  schedules,
  searchFilter,
  onSearchChange,
  onToggleStatus,
}: SuperadminDataBackupOperationsSchedulesTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const paginatedSchedules = useMemo(() => {
    return schedules.slice(page * pageSize, (page + 1) * pageSize);
  }, [schedules, page, pageSize]);
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden" data-testid="data_backup-schedules-table-container">
      {/* ── Table Toolbar ── */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-900/30">
        <div className="flex items-center gap-2">
          <CalendarClock size={18} className="text-pink-400" />
          <h3 className="text-sm font-bold text-foreground">Active Automated Backup Schedules</h3>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input maxLength={100}
            type="text"
            value={searchFilter}
            onChange={(e) => { onSearchChange(e.target.value); setPage(0); }}
            placeholder="Search schedules..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* ── Table Content ── */}
      {schedules.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No schedules match your search query.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-neutral-900/50 text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Policy Name & Frequency</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Target Storage</th>
                <th className="py-3 px-4">Retention</th>
                <th className="py-3 px-4">Next Run</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Switch Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{schedule.name}</div>
                    <div className="text-[11px] text-pink-400 font-mono mt-0.5">
                      {formatFrequencyLabel(schedule.frequency)} ({schedule.cronExpression})
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px]">
                      {formatScopeLabel(schedule.scope)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {formatStorageTargetLabel(schedule.storageTarget)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-foreground">
                    {schedule.retentionDays} days
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {displayValue(schedule.nextRunTimestamp)}
                  </td>
                  <td className="py-3.5 px-4">
                    {schedule.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        PAUSED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      {/* Tactile Elongated (Lamba) Switch matching Icon Size */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={schedule.isActive}
                        aria-label={schedule.isActive ? `Pause backup policy for ${schedule.name}` : `Resume backup policy for ${schedule.name}`}
                        onClick={() => onToggleStatus(schedule.id, !schedule.isActive)}
                        className={`relative flex items-center w-[68px] h-[30px] p-[3px] rounded-full border-0 cursor-pointer box-border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                          schedule.isActive
                            ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45),inset_0_1px_2px_rgba(0,0,0,0.25)]'
                            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-slate-700/80 hover:border-slate-600'
                        }`}
                      >
                        {/* Internal circuit groove */}
                        <div
                          className={`pointer-events-none absolute inset-x-2.5 top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-all duration-300 ${
                            schedule.isActive
                              ? 'bg-gradient-to-r from-emerald-300 to-teal-200 opacity-70 shadow-[0_0_4px_rgba(16,185,129,0.8)]'
                              : 'bg-slate-950/80 opacity-40'
                          }`}
                        />

                        {/* Tactile White Chrome Knob with Power Icon ⏻ */}
                        <span
                          aria-hidden="true"
                          className={`relative z-10 flex items-center justify-center w-[24px] h-[24px] min-w-[24px] min-h-[24px] rounded-full bg-white transition-transform duration-300 ease-out select-none shadow-[0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.8)_inset] ${
                            schedule.isActive
                              ? 'translate-x-[38px] text-emerald-600'
                              : 'translate-x-0 text-slate-800'
                          }`}
                        >
                          <span className="text-[11px] leading-none select-none font-bold">⏻</span>
                        </span>
                      </button>

                      <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider text-slate-400 select-none">
                        {schedule.isActive ? 'CLICK TO PAUSE' : 'CLICK TO ARM'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SuperadminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={schedules.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="schedules"
        />
        </div>
      )}
    </div>
  );
}
