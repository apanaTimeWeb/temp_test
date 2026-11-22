'use client';

import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementJobQueueTable.tsx
/**
 * @file SuperadminDataExportManagementJobQueueTable.tsx
 * @description Asynchronous Export Job Queue and Download Center with integrity verification.
 */

import React from 'react';
import {
  FileArchive,
  Download,
  Copy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  GitBranch,
} from 'lucide-react';
import type { ExportJobRecord } from '../types/superadmin_data_export_management.types';
import {
  displayValue,
  formatBytes,
  formatTimestamp,
  formatShortHash,
} from '../utils/superadmin_data_export_management_formatters';

interface JobQueueTableProps {
  jobs: ExportJobRecord[];
  filterScope: string;
  onFilterScopeChange: (scope: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  onCancelJob: (id: string) => void;
}

export function SuperadminDataExportManagementJobQueueTable({
  jobs,
  filterScope,
  onFilterScopeChange,
  filterStatus,
  onFilterStatusChange,
  onCancelJob,
}: JobQueueTableProps) {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const paginatedJobs = React.useMemo(() => {
    return jobs.slice(page * pageSize, (page + 1) * pageSize);
  }, [jobs, page, pageSize]);

  const handleCopyHash = (hash: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Export Jobs & Download Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor asynchronous data bundling jobs and download cryptographically signed archives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Scope Filter */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            {(['ALL', 'TENANT', 'BRANCH'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onFilterScopeChange(s); setPage(0); }}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterScope === s
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s === 'ALL' ? 'All Scopes' : s === 'TENANT' ? 'Tenant Only' : 'Branch Only'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => { onFilterStatusChange(e.target.value); setPage(0); }}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="READY">Ready for Download</option>
            <option value="PROCESSING">Processing</option>
            <option value="QUEUED">Queued</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Job Reference</th>
              <th className="py-3 px-4">Target Scope</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">Status & Progress</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">SHA-256 Checksum</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedJobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileArchive className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {job.exportNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatTimestamp(job.createdAt)}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {job.scope === 'TENANT' ? (
                        <>
                          <Building className="w-3 h-3 text-blue-500" />
                          {job.tenantName}
                        </>
                      ) : (
                        <>
                          <GitBranch className="w-3 h-3 text-violet-500" />
                          {job.branchName ?? 'Branch'}
                        </>
                      )}
                    </span>
                    {job.scope === 'BRANCH' && (
                      <span className="text-[10px] text-slate-400 block pl-1">
                        Parent: {job.tenantName}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {job.format}
                </td>

                <td className="py-3 px-4">
                  {job.status === 'READY' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Ready
                    </span>
                  )}
                  {job.status === 'PROCESSING' && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Packaging ({job.progressPercent}%)</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${job.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {job.status === 'QUEUED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Clock className="w-3 h-3" />
                      Queued
                    </span>
                  )}
                  {job.status === 'FAILED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                      <XCircle className="w-3 h-3" />
                      Failed
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                  {formatBytes(job.sizeBytes)}
                </td>

                <td className="py-3 px-4">
                  {job.sha256Checksum ? (
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{formatShortHash(job.sha256Checksum)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyHash(job.sha256Checksum!)}
                        title="Copy SHA-256"
                        className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedHash === job.sha256Checksum && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Copied</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                <td className="py-3 px-4 text-right">
                  {job.status === 'READY' && job.downloadUrl ? (
                    <a
                      href={job.downloadUrl}
                      download
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </a>
                  ) : job.status === 'PROCESSING' || job.status === 'QUEUED' ? (
                    <button
                      type="button"
                      onClick={() => onCancelJob(job.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                      Cancel
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SuperadminTablePagination
        page={page}
        pageSize={pageSize}
        totalItems={jobs.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemLabel="export jobs"
      />
    </div>
  );
}
