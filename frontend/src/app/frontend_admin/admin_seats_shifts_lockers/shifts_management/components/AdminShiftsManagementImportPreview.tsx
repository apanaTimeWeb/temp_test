'use client';

import { formatAdminShiftsManagementCurrency } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/utils/formatAdminShiftsManagementCurrency';
import { AlertTriangle, Check, CheckCircle2, FileText } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export interface ParsedImportShift {
  name: string;
  startTime: string;
  endTime: string;
  monthlyPrice: number;
  capacity: number;
  branchName: string;
  isValid: boolean;
  validationError?: string;
}

interface AdminShiftsManagementImportPreviewProps {
  fileName: string | null;
  parsedRows: readonly ParsedImportShift[];
  validCount: number;
  onReset: () => void;
}

export function AdminShiftsManagementImportPreview({
  fileName,
  parsedRows,
  validCount,
  onReset,
}: AdminShiftsManagementImportPreviewProps) {
  const t = useTranslations('ADMIN_SHIFTS');
  const locale = useLocale();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface-highlight p-3">
        <div className="flex items-center gap-2.5">
          <FileText size={18} className="text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-text-primary">{fileName}</span>
          <span className="text-xs text-text-secondary">({parsedRows.length} rows)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-text">
            <CheckCircle2 size={13} aria-hidden="true" /> {validCount} Valid
          </span>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-text-secondary hover:text-text-primary underline ml-2"
          >
            Change File
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-highlight max-h-64 overflow-y-auto">
        <table className="w-full text-left text-xs text-text-primary">
          <thead className="sticky top-0 bg-card border-b border-border font-semibold text-text-secondary">
            <tr>
              <th className="px-3.5 py-2">Status</th>
              <th className="px-3.5 py-2">Shift Name</th>
              <th className="px-3.5 py-2">Timing</th>
              <th className="px-3.5 py-2">Price</th>
              <th className="px-3.5 py-2">Capacity</th>
              <th className="px-3.5 py-2">Branch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {parsedRows.map((r) => (
              <tr key={`${r.name}-${r.startTime}-${r.branchName}`} className={r.isValid ? '' : 'bg-danger-bg'}>
                <td className="px-3.5 py-2">
                  {r.isValid ? (
                    <span className="text-success-text font-semibold flex items-center gap-1">
                      <Check size={12} aria-hidden="true" /> Valid
                    </span>
                  ) : (
                    <span className="text-danger-text font-semibold flex items-center gap-1" title={r.validationError}>
                      <AlertTriangle size={12} aria-hidden="true" /> {r.validationError}
                    </span>
                  )}
                </td>
                <td className="px-3.5 py-2 font-medium text-text-primary">{r.name}</td>
                <td className="px-3.5 py-2 font-mono text-text-secondary">{r.startTime} → {r.endTime}</td>
                <td className="px-3.5 py-2 text-success-text">{t('monthlyRatePerMo', { amount: formatAdminShiftsManagementCurrency(r.monthlyPrice, locale) })}</td>
                <td className="px-3.5 py-2 text-text-secondary">{r.capacity} seats</td>
                <td className="px-3.5 py-2 text-primary">{r.branchName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
