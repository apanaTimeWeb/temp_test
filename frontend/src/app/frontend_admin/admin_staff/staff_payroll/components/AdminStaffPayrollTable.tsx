'use client';

import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { sharePayrollSlipWhatsApp } from '@/app/frontend_admin/admin_staff/staff_payroll/utils/adminStaffPayrollExports';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Building2, CheckCircle2, Clock, CreditCard, FileText, MessageSquare, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface Props {
  records: StaffSalaryRecord[];
  onOpenSlip: (record: StaffSalaryRecord) => void;
  onOpenDisburse: (record: StaffSalaryRecord) => void;
}

type PayrollSortField = 'staffName' | 'branchName' | 'baseSalary' | 'allowances' | 'deductions' | 'netPayable' | 'status';

function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRoleBadge(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes('manager')) return 'bg-info-bg text-info-text border-info';
  if (lower.includes('supervisor')) return 'bg-purple-bg text-purple-text border-purple-text';
  if (lower.includes('assistant') || lower.includes('attendant')) return 'bg-success-bg text-success-text border-success';
  return 'bg-surface text-text-secondary border-border';
}

const STATUS_CONFIG: Record<'DISBURSED' | 'PENDING' | 'ON_HOLD', { bg: string; text: string; border: string; dot: string }> = {
  DISBURSED: { bg: 'bg-success-bg', text: 'text-success-text', border: 'border-success', dot: 'bg-success shadow-sm' },
  PENDING: { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-warning', dot: 'bg-warning motion-safe:animate-pulse' },
  ON_HOLD: { bg: 'bg-info-bg', text: 'text-info-text', border: 'border-info', dot: 'bg-info' },
};

export function AdminStaffPayrollTable({ records, onOpenSlip, onOpenDisburse }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const [sortField, setSortField] = useState<PayrollSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: PayrollSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
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
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
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
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-3.5 py-2.5 whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 cursor-pointer motion-safe:transition-colors ${align === 'right' ? 'ml-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? <ArrowUp className="text-success-text font-bold shrink-0" size={13} aria-hidden="true" /> : <ArrowDown className="text-success-text font-bold shrink-0" size={13} aria-hidden="true" />
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={13} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <CreditCard className="h-10 w-10 text-text-secondary" />
        <h3 className="mt-3 text-base font-semibold text-text-primary">{t('TABLE_EMPTY_TITLE')}</h3>
        <p className="mt-1 text-sm text-text-secondary">{t('TABLE_EMPTY_DESC')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-border bg-surface text-[11px] font-bold uppercase tracking-wider text-text-secondary">
            <tr>
              {renderSortableHeader('staffName', t('COL_STAFF'))}
              {renderSortableHeader('branchName', t('COL_BRANCH'))}
              {renderSortableHeader('baseSalary', t('COL_BASE_SALARY'), 'right')}
              {renderSortableHeader('allowances', t('COL_ALLOWANCES'), 'right')}
              {renderSortableHeader('deductions', t('COL_DEDUCTIONS'), 'right')}
              {renderSortableHeader('netPayable', t('COL_NET_PAYABLE'), 'right')}
              {renderSortableHeader('status', t('COL_STATUS'))}
              <th className="px-3.5 py-2.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-text-secondary">{t('COL_PAYMENT_INFO')}</th>
              <th className="px-3.5 py-2.5 text-right whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-text-secondary">{t('COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRecords.map((r) => {
              const isDisbursed = r.status === 'DISBURSED';
              const statusConf = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;

              return (
                <tr key={r.id} className="motion-safe:transition-colors hover:bg-surface-hover">
                  <td className="px-3.5 py-2.5 font-medium">
                    <div className="flex items-center gap-2.5 min-w-[190px]">
                      <div className="h-8 w-8 rounded-full bg-info-bg border border-info flex items-center justify-center text-info-text font-bold text-xs shrink-0 shadow-inner">
                        {getInitials(r.staffName)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-text-primary block truncate">{r.staffName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-text-secondary font-medium">{r.staffId}</span>
                          <span className={`text-[10px] font-medium border px-1.5 py-0.5 rounded-md truncate max-w-[120px] ${getRoleBadge(r.role)}`}>{r.role}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-text-secondary whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs rounded-lg bg-surface border border-border px-2 py-0.5 font-medium text-text-primary">
                      <Building2 size={12} className="text-info-text shrink-0" /><span>{r.branchName}</span>
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-mono text-xs text-text-primary font-semibold whitespace-nowrap">₹{r.baseSalary.toLocaleString('en-IN')}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono text-xs text-success-text font-bold whitespace-nowrap">+₹{r.allowances.toLocaleString('en-IN')}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono text-xs whitespace-nowrap">
                    {r.deductions > 0 ? <span className="font-bold text-danger-text">-₹{r.deductions.toLocaleString('en-IN')}</span> : <span className="text-text-secondary font-normal">₹0</span>}
                    {r.advanceSalaryDeduction > 0 && <div className="text-[10px] text-text-secondary font-sans font-normal mt-0.5">(Adv: -₹{r.advanceSalaryDeduction.toLocaleString('en-IN')})</div>}
                  </td>
                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                    <span className="inline-flex items-center justify-end px-2.5 py-1 rounded-lg bg-success-bg border border-success font-mono text-xs font-bold text-success-text shadow-xs">₹{r.netPayable.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-xs ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
                      <span>{t(`STATUS_${r.status}`)}</span>
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-text-secondary whitespace-nowrap">
                    {isDisbursed ? (
                      <div className="text-xs space-y-0.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-text-primary"><CreditCard size={12} className="text-success-text" /><span>{r.paymentMethod?.replace('_', ' ')}</span></span>
                        {r.transactionRef && <span className="block font-mono text-[10px] text-text-secondary truncate max-w-[130px]">{r.transactionRef}</span>}
                      </div>
                    ) : r.status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-warning-text font-medium bg-warning-bg border border-warning px-2 py-0.5 rounded-md"><Clock size={11} /><span>Awaiting Auth</span></span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-info-text font-medium bg-info-bg border border-info px-2 py-0.5 rounded-md"><AlertCircle size={11} /><span>Hold Review</span></span>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => sharePayrollSlipWhatsApp(r)} title="Share Salary Slip on WhatsApp" aria-label="Share Salary Slip on WhatsApp" className="inline-flex h-8 items-center gap-1 rounded-xl border border-success bg-success-bg px-2 py-1 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-all cursor-pointer shadow-xs">
                        <MessageSquare size={13} /><span className="hidden xl:inline">WA</span>
                      </button>
                      <button type="button" onClick={() => onOpenSlip(r)} title={t('ACTION_SLIP')} aria-label={t('ACTION_SLIP')} className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-all cursor-pointer shadow-xs">
                        <FileText size={13} /><span className="hidden sm:inline">Slip</span>
                      </button>
                      <button
                        type="button"
                        disabled={isDisbursed}
                        onClick={() => onOpenDisburse(r)}
                        title={t('ACTION_DISBURSE')}
                        aria-label={t('ACTION_DISBURSE')}
                        className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold motion-safe:transition-all shadow-xs ${
                          isDisbursed ? 'bg-surface border border-border text-text-disabled cursor-not-allowed' : 'bg-success hover:opacity-90 text-on-primary cursor-pointer'
                        }`}
                      >
                        {isDisbursed ? <CheckCircle2 size={13} /> : <Send size={13} />}
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
      <AdminTablePagination page={page} pageSize={pageSize} totalRows={records.length} onPageChange={setPage} onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(0); }} />
    </div>
  );
}
export default AdminStaffPayrollTable;
