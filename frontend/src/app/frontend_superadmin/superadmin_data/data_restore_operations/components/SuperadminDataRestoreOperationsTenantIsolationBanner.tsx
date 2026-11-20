// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsTenantIsolationBanner.tsx
'use client';

/**
 * @file SuperadminDataRestoreOperationsTenantIsolationBanner.tsx
 * @description Informs and certifies strict Multi-Tenant Isolation during Restore operations.
 */

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface TenantIsolationBannerProps {
  guaranteed: boolean;
}

export function SuperadminDataRestoreOperationsTenantIsolationBanner({
  guaranteed,
}: TenantIsolationBannerProps) {
  return (
    <div
      role="region"
      aria-label="Multi-Tenant Isolation Assurance"
      className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Multi-Tenant Isolation Assurance (Zero-Bleed Law)
              </h2>
              {guaranteed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  Schema Quarantined
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Restoring data for any single library tenant operates strictly within its isolated schema
              partition. Foreign keys and database row filters prohibit cross-tenant modification. Other
              tenants remain 100% untouched and active during recovery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Point-in-Time Schema Sandboxing</span>
        </div>
      </div>
    </div>
  );
}
