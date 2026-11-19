'use client';
// RESPONSIBILITY: AdminAccountsExpensesTableSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Trash2, Check, X, ExternalLink, Clock, CheckCircle2, XCircle, Eye, Building2, User, FileText } from 'lucide-react';
import { DataGrid, type DataGridCellParams, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { ADMIN_ACCOUNTING_EXPENSE_MODE_BADGE } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import type { AdminAccountsExpensesTableSectionProps } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';

const CATEGORY_TRANSLATION_KEY = {
  Electricity: 'CATEGORY_ELECTRICITY',
  Maintenance: 'CATEGORY_MAINTENANCE',
  Stationery: 'CATEGORY_STATIONERY',
  Internet: 'CATEGORY_INTERNET',
  Cleaning: 'CATEGORY_CLEANING',
  Salary: 'CATEGORY_SALARY',
  Rent: 'CATEGORY_RENT',
  Miscellaneous: 'CATEGORY_MISCELLANEOUS',
} as const;

/** Owns expense table columns, localized value labels, empty state, and row-level delete/approval initiation. */
export function AdminAccountsExpensesTableSection({
  expenses,
  onRequestDelete,
  onRequestApprove,
  onRequestReject,
  onViewVoucher,
  canMutate,
}: AdminAccountsExpensesTableSectionProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>(
    'admin-accounting-admin-accounting-expenses-table-section-1-page',
    0
  );

  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  const columnDefs = useMemo<DataGridColumn<AdminAccountingExpense>[]>(() => [
    { field: 'date', headerName: t('DATE'), width: 105, sortable: true },
    {
      field: 'branchName',
      headerName: t('BRANCH'),
      width: 150,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-semibold text-foreground text-xs">{params.data.branchName ?? 'Downtown Central'}</span>
        </div>
      ),
    },
    {
      field: 'category',
      headerName: t('CATEGORY'),
      width: 130,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const value = String(params.value ?? '—');
        const key = CATEGORY_TRANSLATION_KEY[value as keyof typeof CATEGORY_TRANSLATION_KEY];
        return (
          <span className="inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs font-medium bg-surface text-foreground">
            {key ? t(key) : value}
          </span>
        );
      },
    },
    {
      field: 'description',
      headerName: t('DESCRIPTION'),
      minWidth: 230,
      flex: 1,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => (
        <div className="flex flex-col py-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-foreground text-xs sm:text-sm">{params.data.description}</span>
            {params.data.isPettyCashRequest && (
              <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                Petty Cash
              </span>
            )}
            {params.data.vendorName && (
              <span className="rounded bg-primary-subtle border border-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                {params.data.vendorName}
              </span>
            )}
          </div>
          {params.data.notes && (
            <span className="text-xs text-muted-foreground truncate max-w-sm mt-0.5" title={params.data.notes}>
              {params.data.notes}
            </span>
          )}
          {params.data.rejectionReason && (
            <span className="text-xs text-rose-400 font-medium mt-0.5">
              Reason: {params.data.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: t('AMOUNT'),
      width: 140,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const minorAmount = Number(params.value ?? 0);
        const isHighValue = minorAmount > 200000;
        return (
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-foreground">
              {formatAdminAccountingCurrency(minorAmount, locale)}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                {params.data.mode}
              </span>
              {isHighValue && (
                <span className="inline-flex items-center rounded bg-amber-500/15 border border-amber-500/30 px-1 py-0.2 text-[9px] font-bold text-amber-400" title="High value (> ₹2,000) - requires Admin approval">
                  &gt; ₹2k Admin
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: t('STATUS'),
      width: 145,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const status = params.data.status ?? 'APPROVED';
        if (status === 'PENDING_APPROVAL') {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
              <Clock className="h-3 w-3" />
              <span>{t('STATUS_PENDING')}</span>
            </span>
          );
        }
        if (status === 'APPROVED') {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>{t('STATUS_APPROVED')}</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
            <XCircle className="h-3 w-3" />
            <span>{t('STATUS_REJECTED')}</span>
          </span>
        );
      },
    },
    {
      field: 'paidBy',
      headerName: t('REQUESTED_BY') ?? t('PAID_BY'),
      width: 160,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const name = params.data.requestedBy ?? params.data.paidBy ?? 'Branch Staff';
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-muted-foreground border border-border shrink-0">
              <User className="h-3 w-3" />
            </div>
            <span className="text-xs font-medium text-foreground truncate" title={name}>
              {name}
            </span>
          </div>
        );
      },
    },
    {
      field: 'receiptUrl',
      headerName: t('VOUCHER') ?? 'Bill / Slip',
      width: 95,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewVoucher) onViewVoucher(params.data);
            }}
            title={t('VIEW_VOUCHER') ?? 'View Expense Voucher'}
            className="inline-flex items-center gap-1 justify-center rounded-lg border border-border bg-surface px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-hover hover:border-primary/40 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </button>
        );
      },
    },
    {
      headerName: t('ACTIONS'),
      width: 140,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const isPending = params.data.status === 'PENDING_APPROVAL';

        return (
          <div className="inline-flex items-center gap-1.5">
            {isPending && onRequestApprove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestApprove(params.data);
                }}
                title={t('APPROVE')}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 p-1.5 text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[32px] min-w-[32px] motion-safe:transition-all hover:scale-105"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
            {isPending && onRequestReject && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestReject(params.data);
                }}
                title={t('REJECT')}
                className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[32px] min-w-[32px] motion-safe:transition-all hover:scale-105"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              data-testid={`admin_accounting-expenses-delete-${params.data.id}`}
              aria-label={t('DELETE_EXPENSE', { description: params.data.description })}
              className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/30 min-h-[32px] min-w-[32px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-all"
              disabled={!canMutate}
              title={!canMutate ? t('DELETE_BLOCKED') : undefined}
              onClick={(event) => {
                event.stopPropagation();
                onRequestDelete(params.data);
              }}
            >
              <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ], [locale, onRequestDelete, onRequestApprove, onRequestReject, onViewVoucher, canMutate, t]);

  return (
    <section aria-label={t('TABLE_ARIA')} className="rounded-xl border border-border bg-card shadow-card p-4">
      {expenses.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center"
        >
          <p className="font-medium text-text-primary">{t('NO_EXPENSES')}</p>
          <p className="mt-1 text-sm text-text-secondary">{t('EMPTY_DESCRIPTION')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataGrid
            rowData={[...expenses]}
            columnDefs={columnDefs}
            rowHeight={56}
            pagination
            pageSize={10}
            page={urlTablePage0}
            onPageChange={setUrlTablePage0}
          />
        </div>
      )}
    </section>
  );
}

export default AdminAccountsExpensesTableSection;
export type { AdminAccountsExpensesTableSectionProps };
