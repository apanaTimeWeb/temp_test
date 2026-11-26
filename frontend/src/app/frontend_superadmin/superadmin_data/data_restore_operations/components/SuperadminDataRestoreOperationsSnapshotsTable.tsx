'use client';

import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsSnapshotsTable.tsx
/**
 * @file SuperadminDataRestoreOperationsSnapshotsTable.tsx
 * @description Catalog table of previous backup snapshots with verification badges,
 * SHA-256 integrity hashes, and isolated point-in-time restore triggers.
 */

import React from 'react';
import {
  Search,
  Database,
  RotateCcw,
  ShieldAlert,
  CheckCircle,
  Copy,
  Layers,
  Building,
} from 'lucide-react';
import type { BackupSnapshotRecord } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/types/superadmin_data_restore_operations.types';
import {
  displayValue,
  formatBytes,
  formatTimestamp,
  formatShortHash,
} from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/utils/superadmin_data_restore_operations_formatters';

interface SnapshotsTableProps {
  snapshots: BackupSnapshotRecord[];
  scopeFilter: string;
  onScopeFilterChange: (scope: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectRestore: (snapshot: BackupSnapshotRecord) => void;
}

export function SuperadminDataRestoreOperationsSnapshotsTable({
  snapshots,
  scopeFilter,
  onScopeFilterChange,
  searchQuery,
  onSearchQueryChange,
  onSelectRestore,
}: SnapshotsTableProps) {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const paginatedSnapshots = React.useMemo(() => {
    return snapshots.slice(page * pageSize, (page + 1) * pageSize);
  }, [snapshots, page, pageSize]);

  const handleCopyHash = (hash: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header and Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Backup Snapshot History Catalog
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically signed snapshot archives available for point-in-time recovery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Scope Filters */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            {(['ALL', 'FULL', 'INCREMENTAL', 'TENANT_ISOLATED'] as const).map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => { onScopeFilterChange(scope); setPage(0); }}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  scopeFilter === scope
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {scope === 'ALL'
                  ? 'All'
                  : scope === 'FULL'
                  ? 'Full Snapshots'
                  : scope === 'INCREMENTAL'
                  ? 'Incremental'
                  : 'Tenant Isolated'}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input maxLength={100}
              type="text"
              value={searchQuery}
              onChange={(e) => { onSearchQueryChange(e.target.value); setPage(0); }}
              placeholder="Search snapshots or tenants..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Snapshot ID</th>
              <th className="py-3 px-4">Scope & Partition</th>
              <th className="py-3 px-4">Created Time</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">SHA-256 Hash</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedSnapshots.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {s.snapshotNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {s.metadata.databaseVersion}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  {s.scope === 'TENANT_ISOLATED' ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <Building className="w-3 h-3" />
                        {displayValue(s.tenantName)}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Layers className="w-3 h-3" />
                      {s.scope === 'FULL' ? 'Platform Full' : 'Incremental'}
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {formatTimestamp(s.createdAt)}
                </td>

                <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                  {formatBytes(s.sizeBytes)}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{formatShortHash(s.sha256Checksum)}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(s.sha256Checksum)}
                      title="Copy full SHA-256"
                      className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {copiedHash === s.sha256Checksum && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Copied</span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4">
                  {s.verificationStatus === 'VERIFIED' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                      <ShieldAlert className="w-3 h-3" />
                      Untested
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectRestore(s)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore
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
        totalItems={snapshots.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="snapshots"
      />
    </div>
  );
}
