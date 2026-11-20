// components/SuperadminDataBackupOperationsSchedulesTable.tsx
// RESPONSIBILITY: Renders the table of active automated backup schedules with search, status toggles, and frequency indicators. No direct API calls.
'use client';

import React from 'react';
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
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedules.map((schedule) => (
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 size={11} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-800 text-muted-foreground">
                        <PauseCircle size={11} /> Paused
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(schedule.id, !schedule.isActive)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        schedule.isActive
                          ? 'text-amber-400 hover:bg-amber-500/10'
                          : 'text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {schedule.isActive ? 'Pause' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
