'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  FileText,
  Send,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { PAYROLL_STATUS_VARIANTS } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.url_config';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

interface Props {
  records: StaffSalaryRecord[];
  onOpenSlip: (record: StaffSalaryRecord) => void;
  onOpenDisburse: (record: StaffSalaryRecord) => void;
}

export function AdminStaffPayrollTable({ records, onOpenSlip, onOpenDisburse }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  type PayrollSortField = 'staffName' | 'branchName' | 'baseSalary' | 'allowances' | 'deductions' | 'netPayable' | 'status';
  const [sortField, setSortField] = useState<PayrollSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: PayrollSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    if (!sortField) return records;
    return [...records].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = aVal - bVal;
        return sortDirection === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [records, sortField, sortDirection]);

  const paginatedRecords = useMemo(
    () => sortedRecords.slice(page * pageSize, (page + 1) * pageSize),
    [sortedRecords, page, pageSize]
  );

  const renderSortableHeader = (field: PayrollSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-4 py-3.5 whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 p-12 text-center">
        <CreditCard className="h-10 w-10 text-slate-600" />
        <h3 className="mt-3 text-base font-semibold text-slate-200">{t('TABLE_EMPTY_TITLE')}</h3>
        <p className="mt-1 text-sm text-slate-400">{t('TABLE_EMPTY_DESC')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              {renderSortableHeader('staffName', t('COL_STAFF'))}
              {renderSortableHeader('branchName', t('COL_BRANCH'))}
              {renderSortableHeader('baseSalary', t('COL_BASE_SALARY'), 'right')}
              {renderSortableHeader('allowances', t('COL_ALLOWANCES'), 'right')}
              {renderSortableHeader('deductions', t('COL_DEDUCTIONS'), 'right')}
              {renderSortableHeader('netPayable', t('COL_NET_PAYABLE'), 'right')}
              {renderSortableHeader('status', t('COL_STATUS'))}
              <th className="px-4 py-3.5">{t('COL_PAYMENT_INFO')}</th>
              <th className="px-4 py-3.5 text-right">{t('COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedRecords.map((r) => {
              const statusBadgeClass = PAYROLL_STATUS_VARIANTS[r.status] || 'bg-surface text-text-secondary';
              const isDisbursed = r.status === 'DISBURSED';

              return (
                <tr key={r.id} className="transition-colors hover:bg-slate-800/40">
                  <td className="px-4 py-3.5 font-medium">
                    <div>
                      <span className="font-semibold text-slate-100">{r.staffName}</span>
                      <span className="block text-xs text-slate-400">{r.staffId} · {r.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    <span className="inline-flex items-center gap-1.5 text-xs rounded-md bg-slate-800/60 border border-slate-700/50 px-2 py-0.5">
                      <Building2 size={13} className="text-primary" />
                      {r.branchName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-slate-300 font-medium">
                    ₹{r.baseSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-emerald-400 font-semibold">
                    +₹{r.allowances.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs text-rose-400 font-semibold">
                    <div>{r.deductions > 0 ? `-₹${r.deductions.toLocaleString('en-IN')}` : '₹0'}</div>
                    {r.advanceSalaryDeduction > 0 && (
                      <div className="text-[10px] text-slate-400 font-sans font-normal">
                        (Adv: -₹{r.advanceSalaryDeduction.toLocaleString('en-IN')})
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-sm font-bold text-white bg-slate-950/25">
                    ₹{r.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass}`}>
                      {t(`STATUS_${r.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    {isDisbursed ? (
                      <div className="text-xs">
                        <span className="font-medium text-slate-200">{r.paymentMethod?.replace('_', ' ')}</span>
                        {r.transactionRef && (
                          <span className="block font-mono text-[11px] text-slate-500">
                            {r.transactionRef}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenSlip(r)}
                        title={t('ACTION_SLIP')}
                        aria-label={t('ACTION_SLIP')}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-all"
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
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-on-primary hover:bg-primary-hover hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-all shadow-xs"
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
      <AdminTablePagination
        page={page}
        pageSize={pageSize}
        totalRows={records.length}
        onPageChange={setPage}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setPage(0);
        }}
      />
    </div>
  );
}

export default AdminStaffPayrollTable;

