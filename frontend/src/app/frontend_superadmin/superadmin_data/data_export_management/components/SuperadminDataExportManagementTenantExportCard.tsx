// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementTenantExportCard.tsx
'use client';

/**
 * @file SuperadminDataExportManagementTenantExportCard.tsx
 * @description Quick card for configuring and initiating Tenant-Specific Library Data Exports (Feature 4).
 */

import React from 'react';
import { Building, Download, ShieldCheck, Database } from 'lucide-react';
import type { TenantOption } from '@/app/frontend_superadmin/superadmin_data/data_export_management/types/superadmin_data_export_management.types';
import { formatNumberWithCommas } from '@/app/frontend_superadmin/superadmin_data/data_export_management/utils/superadmin_data_export_management_formatters';

interface TenantExportCardProps {
  tenants: TenantOption[];
  onInitiateExport: (tenantId: string) => void;
}

export function SuperadminDataExportManagementTenantExportCard({
  tenants,
  onInitiateExport,
}: TenantExportCardProps) {
  const [selectedTenantId, setSelectedTenantId] = React.useState<string>(
    tenants[0]?.id ?? ''
  );

  React.useEffect(() => {
    if (!selectedTenantId && tenants.length > 0) {
      setSelectedTenantId(tenants[0].id);
    }
  }, [tenants, selectedTenantId]);

  const currentTenant = tenants.find((t) => t.id === selectedTenantId) ?? tenants[0];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tenant Library Data Export
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extract isolated, full-library datasets with zero cross-tenant contamination.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Library Tenant
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code}) — {t.totalBranches} Branches
                </option>
              ))}
            </select>
          </div>

          {currentTenant && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Database className="w-4 h-4 text-blue-500" />
                <span>Total Active Records:</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {formatNumberWithCommas(currentTenant.recordCount)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Strictly isolated schema partition export guaranteed.</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onInitiateExport(selectedTenantId)}
          disabled={!selectedTenantId}
          className="group w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-sky-600 via-blue-500 to-sky-600 hover:from-sky-500 hover:to-blue-400 disabled:opacity-50 rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-sky-500/50 hover:scale-[1.01] active:scale-[0.97] motion-safe:transition-all motion-safe:duration-300 cursor-pointer"
        >
          <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
            <Download className="w-3.5 h-3.5" />
          </span>
          <span>Export Library Tenant Data</span>
        </button>
      </div>
    </div>
  );
}
