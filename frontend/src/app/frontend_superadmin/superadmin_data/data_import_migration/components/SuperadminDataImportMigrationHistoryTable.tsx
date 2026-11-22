import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/components/SuperadminDataImportMigrationHistoryTable.tsx
'use client';

/**
 * @file SuperadminDataImportMigrationHistoryTable.tsx
 * @description Migration Batches History, Error CSV Download, and Instant Rollback Trigger (Feature 11).
 */

import React from 'react';
import {
  History,
  RotateCcw,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Building,
  Layers,
  Download,
} from 'lucide-react';
import type { ImportBatchRecord } from '../types/superadmin_data_import_migration.types';
import {
  displayValue,
  formatTimestamp,
  formatNumberWithCommas,
  calculateSuccessRate,
} from '../utils/superadmin_data_import_migration_formatters';

interface HistoryTableProps {
  batches: ImportBatchRecord[];
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  onRollbackBatch: (batchId: string) => void;
  isRollingBack: boolean;
}

export function SuperadminDataImportMigrationHistoryTable({
  batches,
  filterStatus,
  onFilterStatusChange,
  onRollbackBatch,
  isRollingBack,
}: HistoryTableProps) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const paginatedBatches = React.useMemo(() => {
    return batches.slice(page * pageSize, (page + 1) * pageSize);
  }, [batches, page, pageSize]);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Migration Batches & Rollback History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit logs of previous library migrations, error logs, and instantaneous snapshot rollbacks.
          </p>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => { onFilterStatusChange(e.target.value); setPage(0); }}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">All Batch Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="ROLLED_BACK">Rolled Back</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Batch Number</th>
              <th className="py-3 px-4">Target Library</th>
              <th className="py-3 px-4">Entity Type</th>
              <th className="py-3 px-4">Original File</th>
              <th className="py-3 px-4">Records Progress</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Rollback Snapshot</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedBatches.map((batch) => (
              <tr
                key={batch.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {batch.batchNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatTimestamp(batch.createdAt)}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    <Building className="w-3 h-3 text-amber-500" />
                    {batch.tenantName}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <Layers className="w-3 h-3 text-slate-400" />
                    {batch.entityType}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-[140px]">
                  {batch.originalFileName}
                </td>

                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <span className="font-medium text-slate-900 dark:text-white font-mono">
                      {formatNumberWithCommas(batch.importedRecords)} / {formatNumberWithCommas(batch.totalRecords)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Success: {calculateSuccessRate(batch.importedRecords, batch.totalRecords)}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  {batch.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {batch.status === 'ROLLED_BACK' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                      <RotateCcw className="w-3 h-3" />
                      Rolled Back
                    </span>
                  )}
                  {batch.status === 'FAILED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      <XCircle className="w-3 h-3" />
                      Failed
                    </span>
                  )}
                </td>

                <td className="py-3 px-4">
                  {batch.rollbackSnapshotId ? (
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {batch.rollbackSnapshotId}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {batch.errorCsvUrl && (
                      <a
                        href={batch.errorCsvUrl}
                        download
                        title="Download Invalidation Error CSV"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Errors
                      </a>
                    )}
                    {batch.status === 'COMPLETED' && batch.rollbackSnapshotId && (
                      <button
                        type="button"
                        onClick={() => onRollbackBatch(batch.id)}
                        disabled={isRollingBack}
                        title="Revert imported records using rollback snapshot"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-700 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Rollback
                      </button>
                    )}
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
        totalItems={batches.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="migration batches"
      />
    </div>
  );
}
