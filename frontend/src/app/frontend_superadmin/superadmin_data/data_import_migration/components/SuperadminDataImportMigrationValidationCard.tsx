// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/components/SuperadminDataImportMigrationValidationCard.tsx
'use client';

/**
 * @file SuperadminDataImportMigrationValidationCard.tsx
 * @description Pre-flight Dry-Run Validation Card & Duplicate Detection (Feature 10).
 */

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Database,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { PreflightValidationResult } from '@/app/frontend_superadmin/superadmin_data/data_import_migration/types/superadmin_data_import_migration.types';
import { formatNumberWithCommas } from '@/app/frontend_superadmin/superadmin_data/data_import_migration/utils/superadmin_data_import_migration_formatters';

interface ValidationCardProps {
  result: PreflightValidationResult;
  onCommit: (takeRollbackSnapshot: boolean) => void;
  onDismiss: () => void;
  isCommitting: boolean;
}

export function SuperadminDataImportMigrationValidationCard({
  result,
  onCommit,
  onDismiss,
  isCommitting,
}: ValidationCardProps) {
  const [takeSnapshot, setTakeSnapshot] = React.useState(true);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Pre-flight Validation & Dry Run Results
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analysis for <span className="font-semibold">{result.fileName}</span> ({result.entityType})
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Row Metrics Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Rows</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {formatNumberWithCommas(result.totalRows)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Valid Rows</span>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            {formatNumberWithCommas(result.validRows)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
          <span className="text-[11px] font-medium text-rose-700 dark:text-rose-300">Invalid Rows</span>
          <p className="text-lg font-bold text-rose-700 dark:text-rose-300 mt-1">
            {formatNumberWithCommas(result.invalidRows)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
          <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">Duplicates Detected</span>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300 mt-1">
            {formatNumberWithCommas(result.duplicateRows)}
          </p>
        </div>
      </div>

      {/* Issues Table Preview */}
      {result.issues.length > 0 && (
        <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            Detected Pre-flight Validation Issues ({result.issues.length})
          </div>
          <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {result.issues.map((issue, idx) => (
              <div key={idx} className="p-2.5 flex items-start gap-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                {issue.severity === 'ERROR' ? (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                ) : issue.severity === 'DUPLICATE' ? (
                  <Copy className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Row #{issue.rowNumber} [{issue.field}]
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                    {issue.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commit Options & Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={takeSnapshot}
            onChange={(e) => setTakeSnapshot(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Create automated rollback snapshot before committing data
          </span>
        </label>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => onCommit(takeSnapshot)}
            disabled={!result.canProceed || isCommitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            {isCommitting ? 'Committing Migration...' : 'Commit Ingestion'}
          </button>
        </div>
      </div>
    </div>
  );
}
