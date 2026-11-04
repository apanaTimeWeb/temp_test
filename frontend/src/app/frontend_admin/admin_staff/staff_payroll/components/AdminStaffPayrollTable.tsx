'use client';

import { useTranslations } from 'next-intl';
import {
  FileText,
  Send,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { PAYROLL_STATUS_VARIANTS } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.url_config';

interface Props {
  records: StaffSalaryRecord[];
  onOpenSlip: (record: StaffSalaryRecord) => void;
  onOpenDisburse: (record: StaffSalaryRecord) => void;
}

export function AdminStaffPayrollTable({ records, onOpenSlip, onOpenDisburse }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <CreditCard className="h-10 w-10 text-text-disabled" />
        <h3 className="mt-3 text-base font-semibold text-text-primary">{t('TABLE_EMPTY_TITLE')}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t('TABLE_EMPTY_DESC')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <tr>
              <th className="px-4 py-3">{t('COL_STAFF')}</th>
              <th className="px-4 py-3">{t('COL_BRANCH')}</th>
              <th className="px-4 py-3 text-right">{t('COL_BASE_SALARY')}</th>
              <th className="px-4 py-3 text-right">{t('COL_ALLOWANCES')}</th>
              <th className="px-4 py-3 text-right">{t('COL_DEDUCTIONS')}</th>
              <th className="px-4 py-3 text-right">{t('COL_NET_PAYABLE')}</th>
              <th className="px-4 py-3">{t('COL_STATUS')}</th>
              <th className="px-4 py-3">{t('COL_PAYMENT_INFO')}</th>
              <th className="px-4 py-3 text-right">{t('COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((r) => {
              const statusBadgeClass = PAYROLL_STATUS_VARIANTS[r.status] || 'bg-surface text-text-secondary';
              const isDisbursed = r.status === 'DISBURSED';

              return (
                <tr key={r.id} className="transition-colors hover:bg-surface-hover">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <div>
                      <span className="font-semibold">{r.staffName}</span>
                      <span className="block text-xs text-text-secondary">{r.staffId} · {r.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Building2 size={13} className="text-primary" />
                      {r.branchName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-text-primary">
                    ₹{r.baseSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-success-text">
                    +₹{r.allowances.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-danger-text">
                    <div>{r.deductions > 0 ? `-₹${r.deductions.toLocaleString('en-IN')}` : '₹0'}</div>
                    {r.advanceSalaryDeduction > 0 && (
                      <div className="text-[10px] text-text-secondary font-sans font-normal">
                        (Adv: -₹{r.advanceSalaryDeduction.toLocaleString('en-IN')})
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-bold text-text-primary">
                    ₹{r.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass}`}>
                      {t(`STATUS_${r.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {isDisbursed ? (
                      <div className="text-xs">
                        <span className="font-medium text-text-primary">{r.paymentMethod?.replace('_', ' ')}</span>
                        {r.transactionRef && (
                          <span className="block font-mono text-[11px] text-text-disabled">
                            {r.transactionRef}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-text-disabled">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenSlip(r)}
                        title={t('ACTION_SLIP')}
                        aria-label={t('ACTION_SLIP')}
                        className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <FileText size={14} />
                        <span className="hidden sm:inline">Slip</span>
                      </button>

                      <button
                        type="button"
                        disabled={isDisbursed}
                        onClick={() => onOpenDisburse(r)}
                        title={t('ACTION_DISBURSE')}
                        aria-label={t('ACTION_DISBURSE')}
                        className="inline-flex min-h-9 items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send size={13} />
                        <span>{isDisbursed ? 'Paid' : 'Disburse'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStaffPayrollTable;

