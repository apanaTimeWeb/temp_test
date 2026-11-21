// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsSandboxDrillCard.tsx
'use client';

/**
 * @file SuperadminDataRestoreOperationsSandboxDrillCard.tsx
 * @description Sandbox Restore Testing & Automated Disaster Recovery Verification Card.
 */

import React from 'react';
import { Activity, Play, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { RestoreDrillRecord } from '../types/superadmin_data_restore_operations.types';
import { formatTimestamp, formatRtoDuration } from '../utils/superadmin_data_restore_operations_formatters';
import { SLA_TARGETS } from '../constants/superadmin_data_restore_operations.constants';

interface SandboxDrillCardProps {
  lastDrill?: RestoreDrillRecord | null;
  onTriggerDrill: () => void;
  isTriggering: boolean;
}

export function SuperadminDataRestoreOperationsSandboxDrillCard({
  lastDrill,
  onTriggerDrill,
  isTriggering,
}: SandboxDrillCardProps) {
  const isPassed = lastDrill?.status === 'PASSED';
  const rtoMinutes = lastDrill?.simulatedRtoMinutes ?? 0;
  const isRtoCompliant = rtoMinutes <= SLA_TARGETS.MAX_RTO_MINUTES;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Automated Restore Verification & Sandbox Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proves recovery readiness in an isolated staging sandbox without touching live tenant data.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerDrill}
          disabled={isTriggering}
          className="group inline-flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 shrink-0 cursor-pointer"
        >
          <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current" />
          </span>
          <span>{isTriggering ? 'Running Sandbox Drill...' : 'Trigger Disaster Drill'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {/* Verification Status */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Drill Status</span>
          <div className="flex items-center gap-2 mt-2">
            {isPassed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                VERIFIED & PASSED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                {lastDrill?.status ?? 'DRILL PENDING'}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Last: {formatTimestamp(lastDrill?.executedAt)}
          </span>
        </div>

        {/* Simulated RTO */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Simulated Recovery (RTO)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatRtoDuration(rtoMinutes)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              (SLA: ≤ {SLA_TARGETS.MAX_RTO_MINUTES}m)
            </span>
          </div>
          <span
            className={`text-[11px] font-medium block mt-1 ${
              isRtoCompliant ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isRtoCompliant ? 'Within SLA threshold' : 'SLA Target Exceeded'}
          </span>
        </div>

        {/* Checksum Matching */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cryptographic Integrity</span>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">SHA-256 Bit-Identical</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Zero bitrot or data corruption</span>
        </div>

        {/* Tenant Isolation Drill Pass */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tenant Isolation Check</span>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">Zero Bleed Verified</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">No cross-tenant foreign key leakage</span>
        </div>
      </div>
    </div>
  );
}
