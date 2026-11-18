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
  MessageSquare,
} from 'lucide-react';
import type { StaffSalaryRecord } from '@/app/frontend_admin/admin_staff/staff_payroll/schemas/AdminStaffPayrollSchema';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

interface Props {
  records: StaffSalaryRecord[];
  onOpenSlip: (record: StaffSalaryRecord) => void;
  onOpenDisburse: (record: StaffSalaryRecord) => void;
}

function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRoleBadge(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes('manager')) {
    return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  }
  if (lower.includes('supervisor')) {
    return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  }
  if (lower.includes('assistant') || lower.includes('attendant')) {
    return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
  }
  return 'bg-slate-800 text-slate-300 border-slate-700';
}

const STATUS_CONFIG: Record<
  'DISBURSED' | 'PENDING' | 'ON_HOLD',
  { bg: string; text: string; border: string; dot: string }
> = {
  DISBURSED: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/25',
    dot: 'bg-emerald-400 shadow-sm shadow-emerald-400/50',
  },
  PENDING: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/25',
    dot: 'bg-amber-400 animate-pulse',
  },
  ON_HOLD: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-300',
    border: 'border-sky-500/25',
    dot: 'bg-sky-400',
  },
};

export function AdminStaffPayrollTable({ records, onOpenSlip, onOpenDisburse }: Props) {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  type PayrollSortField =
    | 'staffName'
    | 'branchName'
    | 'baseSalary'
    | 'allowances'
    | 'deductions'
    | 'netPayable'
    | 'status';
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
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`px-3.5 py-2.5 whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 cursor-pointer transition-colors ${
            align === 'right' ? 'ml-auto' : ''
          }`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-emerald-400 font-bold shrink-0" size={13} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-emerald-400 font-bold shrink-0" size={13} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity shrink-0"
              size={13}
              aria-hidden="true"
            />
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
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              {renderSortableHeader('staffName', t('COL_STAFF'))}
              {renderSortableHeader('branchName', t('COL_BRANCH'))}
              {renderSortableHeader('baseSalary', t('COL_BASE_SALARY'), 'right')}
              {renderSortableHeader('allowances', t('COL_ALLOWANCES'), 'right')}
              {renderSortableHeader('deductions', t('COL_DEDUCTIONS'), 'right')}
              {renderSortableHeader('netPayable', t('COL_NET_PAYABLE'), 'right')}
              {renderSortableHeader('status', t('COL_STATUS'))}
              <th className="px-3.5 py-2.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t('COL_PAYMENT_INFO')}
              </th>
              <th className="px-3.5 py-2.5 text-right whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t('COL_ACTIONS')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedRecords.map((r) => {
              const isDisbursed = r.status === 'DISBURSED';
              const statusConf = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
              const initials = getInitials(r.staffName);
              const roleBadgeClass = getRoleBadge(r.role);

              return (
                <tr key={r.id} className="transition-colors hover:bg-slate-800/40">
                  {/* Staff Member: Avatar + Name + ID + Role Badge */}
                  <td className="px-3.5 py-2.5 font-medium">
                    <div className="flex items-center gap-2.5 min-w-[190px]">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/25 to-purple-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0 shadow-inner">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-white block truncate">{r.staffName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400 font-medium">{r.staffId}</span>
                          <span
                            className={`text-[10px] font-medium border px-1.5 py-0.2 rounded-md truncate max-w-[120px] ${roleBadgeClass}`}
                          >
                            {r.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Branch Pill */}
                  <td className="px-3.5 py-2.5 text-slate-300 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs rounded-lg bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 font-medium text-slate-300">
                      <Building2 size={12} className="text-indigo-400 shrink-0" />
                      <span>{r.branchName}</span>
                    </span>
                  </td>

                  {/* Base Salary */}
                  <td className="px-3.5 py-2.5 text-right font-mono text-xs text-slate-300 font-semibold whitespace-nowrap">
                    ₹{r.baseSalary.toLocaleString('en-IN')}
                  </td>

                  {/* Allowances */}
                  <td className="px-3.5 py-2.5 text-right font-mono text-xs text-emerald-400 font-bold whitespace-nowrap">
                    +₹{r.allowances.toLocaleString('en-IN')}
                  </td>

                  {/* Deductions */}
                  <td className="px-3.5 py-2.5 text-right font-mono text-xs whitespace-nowrap">
                    {r.deductions > 0 ? (
                      <span className="font-bold text-rose-400">-₹{r.deductions.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-slate-500 font-normal">₹0</span>
                    )}
                    {r.advanceSalaryDeduction > 0 && (
                      <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                        (Adv: -₹{r.advanceSalaryDeduction.toLocaleString('en-IN')})
                      </div>
                    )}
                  </td>

                  {/* Net Payable: Highlighted Payout Pill */}
                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                    <span className="inline-flex items-center justify-end px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 font-mono text-xs font-bold text-emerald-300 shadow-xs">
                      ₹{r.netPayable.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Status: Glowing Live Beacon Pill */}
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-xs ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusConf.dot}`} />
                      <span>{t(`STATUS_${r.status}`)}</span>
                    </span>
                  </td>

                  {/* Payment Info */}
                  <td className="px-3.5 py-2.5 text-slate-300 whitespace-nowrap">
                    {isDisbursed ? (
                      <div className="text-xs space-y-0.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
                          <CreditCard size={12} className="text-emerald-400" />
                          <span>{r.paymentMethod?.replace('_', ' ')}</span>
                        </span>
                        {r.transactionRef && (
                          <span className="block font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                            {r.transactionRef}
                          </span>
                        )}
                      </div>
                    ) : r.status === 'PENDING' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        <Clock size={11} />
                        <span>Awaiting Auth</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-sky-400/90 font-medium bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">
                        <AlertCircle size={11} />
                        <span>Hold Review</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const slipText = `*Smart Library - Monthly Salary Slip*\n` +
                            `Employee: ${r.staffName} (${r.staffId})\n` +
                            `Designation: ${r.role}\n` +
                            `Branch: ${r.branchName}\n` +
                            `Month: ${r.month}\n` +
                            `---------------------------\n` +
                            `• Basic Salary: ₹${r.baseSalary.toLocaleString('en-IN')}\n` +
                            `• Allowances / Bonus: +₹${r.allowances.toLocaleString('en-IN')}\n` +
                            `• Deductions: -₹${r.deductions.toLocaleString('en-IN')}\n` +
                            (r.advanceSalaryDeduction > 0 ? `• Advance Settled: -₹${r.advanceSalaryDeduction.toLocaleString('en-IN')}\n` : '') +
                            `---------------------------\n` +
                            `*Net Take-Home: ₹${r.netPayable.toLocaleString('en-IN')}*\n` +
                            `Status: ${r.status}\n` +
                            `Bank: ${r.bankDetails.bankName} (${r.bankDetails.accountNoMasked})\n` +
                            (r.transactionRef ? `Ref / UTR: ${r.transactionRef}\n` : '') +
                            `---------------------------\n` +
                            `Official system generated salary slip from Smart Library Network Administration.`;
                          const waUrl = `https://wa.me/?text=${encodeURIComponent(slipText)}`;
                          if (typeof window !== 'undefined') {
                            window.open(waUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        title="Share Salary Slip on WhatsApp"
                        aria-label="Share Salary Slip on WhatsApp"
                        className="inline-flex h-8 items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:text-white transition-all cursor-pointer shadow-xs"
                      >
                        <MessageSquare size={13} />
                        <span className="hidden xl:inline">WA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenSlip(r)}
                        title={t('ACTION_SLIP')}
                        aria-label={t('ACTION_SLIP')}
                        className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer shadow-xs"
                      >
                        <FileText size={13} />
                        <span className="hidden sm:inline">Slip</span>
                      </button>

                      <button
                        type="button"
                        disabled={isDisbursed}
                        onClick={() => onOpenDisburse(r)}
                        title={t('ACTION_DISBURSE')}
                        aria-label={t('ACTION_DISBURSE')}
                        className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all shadow-xs ${
                          isDisbursed
                            ? 'bg-slate-800/60 border border-slate-700/60 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-950/30'
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
