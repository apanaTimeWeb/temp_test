'use client';

import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/components/SuperadminDataArchiveRetentionRulesTable.tsx
/**
 * @file SuperadminDataArchiveRetentionRulesTable.tsx
 * @description Data Retention Rules & Automated Auto-Purge Scheduler Configuration (Feature 8).
 */

import React from 'react';
import { Clock, ShieldAlert, Settings, HardDrive, AlertOctagon } from 'lucide-react';
import type { RetentionRuleRecord } from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/types/superadmin_data_archive_retention.types';
import {
  displayValue,
  formatDaysToYearsOrDays,
  formatTimestamp,
} from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/utils/superadmin_data_archive_retention_formatters';

interface RulesTableProps {
  rules: RetentionRuleRecord[];
  onEditRule: (rule: RetentionRuleRecord) => void;
}

export function SuperadminDataArchiveRetentionRulesTable({
  rules,
  onEditRule,
}: RulesTableProps) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const paginatedRules = React.useMemo(() => {
    return rules.slice(page * pageSize, (page + 1) * pageSize);
  }, [rules, page, pageSize]);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Data Retention & Auto-Purge Policies (Feature 8)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure how long closed records, circulation logs, and audits are preserved before archival or purge.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Entity Category</th>
              <th className="py-3 px-4">Retention Duration</th>
              <th className="py-3 px-4">Post-Retention Action</th>
              <th className="py-3 px-4">Storage Tier</th>
              <th className="py-3 px-4">Auto-Purge Schedule</th>
              <th className="py-3 px-4">Status & Holds</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedRules.map((rule) => (
              <tr
                key={rule.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                        {rule.entityType}
                      </span>
                      <span className="text-[10px] text-slate-400 block max-w-xs truncate">
                        {rule.description}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    {formatDaysToYearsOrDays(rule.retentionPeriodDays)}
                  </span>
                </td>

                <td className="py-3 px-4">
                  {rule.postRetentionAction === 'ARCHIVE_TO_COLD_STORAGE' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 dark:text-teal-300">
                      <HardDrive className="w-3.5 h-3.5 text-teal-500" />
                      Cold Storage Vault
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-300">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                      Hard Purge (Delete)
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {rule.targetStorageTier}
                </td>

                <td className="py-3 px-4">
                  <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {rule.autoPurgeSchedule}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Last Run: {formatTimestamp(rule.lastRunAt)}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        rule.isEnabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {rule.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                    {rule.legalHoldCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                        <ShieldAlert className="w-3 h-3" />
                        {rule.legalHoldCount} Holds
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEditRule(rule)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 hover:border-rose-400/50 rounded-xl motion-safe:transition-all motion-safe:duration-300 shadow-xs active:scale-[0.97] cursor-pointer"
                  >
                    <span className="p-0.5 rounded-md bg-rose-500/20 text-rose-300 group-hover:rotate-45 transition-transform motion-safe:duration-300">
                      <Settings className="w-3 h-3" />
                    </span>
                    <span>Configure</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SuperadminTablePagination
        page={page}
        pageSize={pageSize}
        totalItems={rules.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="retention rules"
      />
    </div>
  );
}
