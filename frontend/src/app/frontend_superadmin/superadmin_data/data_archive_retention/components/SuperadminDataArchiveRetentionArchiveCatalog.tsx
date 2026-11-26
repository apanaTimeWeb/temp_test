// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/components/SuperadminDataArchiveRetentionArchiveCatalog.tsx
'use client';

/**
 * @file SuperadminDataArchiveRetentionArchiveCatalog.tsx
 * @description Cold Storage Data Archive Catalog & Legal Hold Overrides (Feature 7).
 */

import React, { useState, useMemo } from 'react';
import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
import {
  Archive,
  RotateCcw,
  Shield,
  ShieldCheck,
  Building,
  Layers,
  HardDrive,
  Lock,
} from 'lucide-react';
import type { ArchivedRecordItem } from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/types/superadmin_data_archive_retention.types';
import {
  displayValue,
  formatBytes,
  formatTimestamp,
} from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/utils/superadmin_data_archive_retention_formatters';

interface ArchiveCatalogProps {
  records: ArchivedRecordItem[];
  filterEntityType: string;
  onFilterEntityTypeChange: (type: string) => void;
  filterTier: string;
  onFilterTierChange: (tier: string) => void;
  onUnarchive: (id: string) => void;
  isUnarchiving: boolean;
  onToggleLegalHold: (id: string) => void;
  isTogglingHold: boolean;
}

export function SuperadminDataArchiveRetentionArchiveCatalog({
  records,
  filterEntityType,
  onFilterEntityTypeChange,
  filterTier,
  onFilterTierChange,
  onUnarchive,
  isUnarchiving,
  onToggleLegalHold,
  isTogglingHold,
}: ArchiveCatalogProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const paginatedRecords = useMemo(() => {
    return records.slice(page * pageSize, (page + 1) * pageSize);
  }, [records, page, pageSize]);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Cold Storage Data Archive Catalog (Feature 7)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, unarchive, or apply statutory legal holds on cold-archived library records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Entity Filter */}
          <select
            value={filterEntityType}
            onChange={(e) => { onFilterEntityTypeChange(e.target.value); setPage(0); }}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Archived Types</option>
            <option value="CLOSED_PATRONS">Closed Patrons</option>
            <option value="EXPIRED_CIRCULATION_LOGS">Expired Circulations</option>
            <option value="ARCHIVED_SEAT_LOGS">Archived Seat & Shift Logs</option>
          </select>

          {/* Storage Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => { onFilterTierChange(e.target.value); setPage(0); }}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Storage Tiers</option>
            <option value="COLD_GLACIER_VAULT">Cold Glacier Vault</option>
            <option value="WARM_S3_STANDARD">Warm S3 Standard</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Archive Record ID</th>
              <th className="py-3 px-4">Tenant Scope</th>
              <th className="py-3 px-4">Entity & Summary</th>
              <th className="py-3 px-4">Storage Tier</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Archived At</th>
              <th className="py-3 px-4">Legal Hold Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedRecords.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-teal-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono text-[11px]">
                        {item.recordIdentifier}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Orig: {formatTimestamp(item.originalCreatedAt)}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    <Building className="w-3 h-3 text-teal-500" />
                    {item.tenantName}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="space-y-0.5 max-w-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                      {item.entityType}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                      {item.summary}
                    </p>
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-400" />
                    {item.storageTier}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                  {formatBytes(item.sizeBytes)}
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {formatTimestamp(item.archivedAt)}
                </td>

                <td className="py-3 px-4">
                  {item.isLegalHold ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                      <Lock className="w-3 h-3" />
                      Legal Hold Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Standard
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleLegalHold(item.id)}
                      disabled={isTogglingHold}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Shield className="w-3 h-3" />
                      {item.isLegalHold ? 'Release Hold' : 'Apply Hold'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onUnarchive(item.id)}
                      disabled={isUnarchiving || item.isLegalHold}
                      title={item.isLegalHold ? 'Cannot unarchive while under legal hold' : 'Restore record to hot database'}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 rounded-lg disabled:opacity-40 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Unarchive
                    </button>
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
        totalItems={records.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="archive records"
      />
    </div>
  );
}
