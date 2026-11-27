// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementBranchExportCard.tsx
'use client';

/**
 * @file SuperadminDataExportManagementBranchExportCard.tsx
 * @description Quick card for configuring and initiating Branch-Specific Data Exports (Feature 5).
 */

import React from 'react';
import { GitBranch, Download, Layers, ShieldCheck } from 'lucide-react';
import type { TenantOption, BranchOption } from '@/app/frontend_superadmin/superadmin_data/data_export_management/types/superadmin_data_export_management.types';
import { formatNumberWithCommas } from '@/app/frontend_superadmin/superadmin_data/data_export_management/utils/superadmin_data_export_management_formatters';

interface BranchExportCardProps {
  tenants: TenantOption[];
  branches: BranchOption[];
  onInitiateExport: (tenantId: string, branchId: string) => void;
}

export function SuperadminDataExportManagementBranchExportCard({
  tenants,
  branches,
  onInitiateExport,
}: BranchExportCardProps) {
  const [selectedTenantId, setSelectedTenantId] = React.useState<string>(
    tenants[0]?.id ?? ''
  );

  const availableBranches = React.useMemo(() => {
    return branches.filter((b) => b.tenantId === selectedTenantId);
  }, [branches, selectedTenantId]);

  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('');

  React.useEffect(() => {
    if (!selectedTenantId && tenants.length > 0) {
      setSelectedTenantId(tenants[0].id);
    }
  }, [tenants, selectedTenantId]);

  React.useEffect(() => {
    if (availableBranches.length > 0) {
      setSelectedBranchId(availableBranches[0].id);
    } else {
      setSelectedBranchId('');
    }
  }, [availableBranches]);

  const currentBranch = availableBranches.find((b) => b.id === selectedBranchId);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Branch-Specific Data Extraction
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extract catalogs and circulation records scoped to a single branch location.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Parent Library
              </label>
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Branch
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                disabled={availableBranches.length === 0}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
              >
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentBranch && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Layers className="w-4 h-4 text-violet-500" />
                <span>Branch Inventory Count:</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {formatNumberWithCommas(currentBranch.recordCount)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Scoped branch-level isolation filter applied.</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onInitiateExport(selectedTenantId, selectedBranchId)}
          disabled={!selectedBranchId}
          className="group w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-violet-600/30 hover:shadow-violet-500/50 hover:scale-[1.01] active:scale-[0.97] motion-safe:transition-all motion-safe:duration-300 cursor-pointer"
        >
          <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
            <Download className="w-3.5 h-3.5" />
          </span>
          <span>Export Branch Data</span>
        </button>
      </div>
    </div>
  );
}
