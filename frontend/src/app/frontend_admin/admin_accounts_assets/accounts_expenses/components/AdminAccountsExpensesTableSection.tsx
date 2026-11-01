'use client';
// RESPONSIBILITY: AdminAccountsExpensesTableSection component owned by admin_accounting; responsibility folder: admin_accounts_expenses_sections.

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Trash2, Check, X, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';
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
  canMutate,
}: AdminAccountsExpensesTableSectionProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>(
    'admin-accounting-admin-accounting-expenses-table-section-1-page',
    0
  );

  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.EXPENSES');

  const columnDefs = useMemo<DataGridColumn<AdminAccountingExpense>[]>(() => [
    { field: 'date', headerName: t('DATE'), width: 110, sortable: true },
    {
      field: 'branchName',
      headerName: t('BRANCH'),
      width: 140,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => (
        <span className="font-medium text-foreground">{params.data.branchName ?? 'Main Branch'}</span>
      ),
    },
    {
      field: 'category',
      headerName: t('CATEGORY'),
      width: 140,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const value = String(params.value ?? '—');
        const key = CATEGORY_TRANSLATION_KEY[value as keyof typeof CATEGORY_TRANSLATION_KEY];
        return (
          <span className="inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs font-medium bg-card text-text-secondary">
            {key ? t(key) : value}
          </span>
        );
      },
    },
    {
      field: 'description',
      headerName: t('DESCRIPTION'),
      minWidth: 200,
      flex: 1,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => (
        <div className="flex flex-col py-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">{params.data.description}</span>
            {params.data.isPettyCashRequest && (
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                Petty Cash
              </span>
            )}
          </div>
          {params.data.notes && (
            <span className="text-xs text-muted-foreground truncate" title={params.data.notes}>
              {params.data.notes}
            </span>
          )}
          {params.data.rejectionReason && (
            <span className="text-xs text-destructive font-medium">
              Reason: {params.data.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
    {
      field: 'amount',
      headerName: t('AMOUNT'),
      width: 130,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => (
        <span className="font-mono font-semibold text-foreground">
          {formatAdminAccountingCurrency(Number(params.value ?? 0), locale)}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: t('STATUS'),
      width: 150,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        const status = params.data.status ?? 'APPROVED';
        if (status === 'PENDING_APPROVAL') {
          return (
            <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning-bg px-2 py-0.5 text-xs font-medium text-warning-text">
              <Clock className="h-3 w-3" />
              <span>{t('STATUS_PENDING')}</span>
            </span>
          );
        }
        if (status === 'APPROVED') {
          return (
            <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-bg px-2 py-0.5 text-xs font-medium text-success-text">
              <CheckCircle2 className="h-3 w-3" />
              <span>{t('STATUS_APPROVED')}</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
            <XCircle className="h-3 w-3" />
            <span>{t('STATUS_REJECTED')}</span>
          </span>
        );
      },
    },
    {
      field: 'paidBy',
      headerName: t('PAID_BY'),
      width: 140,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => (
        <span className="text-xs text-muted-foreground">
          {params.data.requestedBy ?? params.data.paidBy}
        </span>
      ),
    },
    {
      field: 'receiptUrl',
      headerName: 'Slip',
      width: 80,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminAccountingExpense>) => {
        if (!params.data.receiptUrl) return <span className="text-muted-foreground">—</span>;
        return (
          <a
            href={params.data.receiptUrl}
            target="_blank"
            rel="noreferrer"
            title={t('VIEW_QUOTATION')}
            className="inline-flex items-center justify-center p-1.5 rounded text-primary hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        );
      },
    },
    {
      headerName: t('ACTIONS'),
      width: 150,
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
                className="inline-flex items-center justify-center rounded-md bg-success p-1.5 text-white hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success min-h-[32px] min-w-[32px]"
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
                className="inline-flex items-center justify-center rounded-md border border-destructive/30 bg-card p-1.5 text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive min-h-[32px] min-w-[32px]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              data-testid={`admin_accounting-expenses-delete-${params.data.id}`}
              aria-label={t('DELETE_EXPENSE', { description: params.data.description })}
              className="inline-flex items-center justify-center rounded-md border border-border p-1.5 text-danger-text bg-danger-bg hover:bg-danger-bg/80 min-h-[32px] min-w-[32px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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
  ], [locale, onRequestDelete, onRequestApprove, onRequestReject, canMutate, t]);

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
