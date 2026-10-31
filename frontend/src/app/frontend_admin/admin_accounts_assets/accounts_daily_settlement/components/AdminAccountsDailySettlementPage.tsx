'use client';
// Responsibility: AdminAccountsDailySettlementPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.

// RESPONSIBILITY: Entry page for the admin_accounting module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { AdminAccountsDailySettlementEntry } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import useAdminAccountsDailySettlementState from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementState';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatCurrency';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminAccountsDailySettlementSummarySection from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementSummarySection';
import AdminAccountsDailySettlementTableSection from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTableSection';
import type { Entry } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';


const SETTLEMENT_STATUS_TRANSLATION_KEY: Record<string, string> = { settled: 'STATUS_SETTLED', pending: 'STATUS_PENDING' };

/**
 * Presents the daily settlement summary for the accounting module. Dependencies: the module-owned settlement fixture and settlement presentation constants. Edge cases: when no settlement fixture exists, the date fallback must remain explicit and must not imply persisted live data.
 */
export function AdminAccountsDailySettlementPage() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.SETTLEMENT');
  const { date, setDate, resetDate, entries, setEntries } = useAdminAccountsDailySettlementState();
  const visibleEntries = entries.filter((entry) => entry.date === date);

  const handleSettle = (id: number) => {
    if (!isFrontendDemoModeEnabled()) {
      toast.error(t('SETTLEMENT_BLOCKED'), { id: 'admin_accounts_assets-accounts_daily_settlement-components-AdminAccountsDailySettlementPage-toast-34-1' });
      return;
    }
    setEntries((current) => current.map((entry) => entry.id === id ? { ...entry, status: 'settled', settledBy: 'Demo preview' } : entry));
    toast.info(t('DEMO_SETTLED'), { id: 'admin_accounts_assets-accounts_daily_settlement-components-AdminAccountsDailySettlementPage-toast-38-2' });
  };

  const totalCash = visibleEntries.reduce((s, e) => s + e.cashCollected, 0);
  const totalUpi  = visibleEntries.reduce((s, e) => s + e.upiCollected, 0);
  const totalExp  = visibleEntries.reduce((s, e) => s + e.expenses, 0);

  const colDefs: DataGridColumn<Entry>[] = [
    { field: 'shift', headerName: t('SHIFT'), flex: 1, minWidth: 180, cellRenderer: (p: DataGridCellParams<Entry>) => <span className="text-body font-semibold text-text-primary font-medium">{p.value}</span> },
    {
      field: 'openingBalance',
      headerName: t('OPENING_BALANCE'),
      width: 130,
      cellClass: 'text-right',
      cellRenderer: (p: DataGridCellParams<Entry>) => <span className="block w-full text-right font-mono text-caption text-text-secondary text-sm">{formatAdminAccountingCurrency(Number(p.value ?? 0), locale)}</span>
    },
    {
      field: 'cashCollected',
      headerName: t('CASH'),
      width: 120,
      cellClass: 'text-right',
      cellRenderer: (p: DataGridCellParams<Entry>) => <span className="block w-full text-right font-mono text-success-text font-medium">{formatAdminAccountingCurrency(Number(p.value ?? 0), locale)}</span>
    },
    {
      field: 'upiCollected',
      headerName: t('UPI'),
      width: 120,
      cellClass: 'text-right',
      cellRenderer: (p: DataGridCellParams<Entry>) => <span className="block w-full text-right font-mono text-info-text font-medium">{formatAdminAccountingCurrency(Number(p.value ?? 0), locale)}</span>
    },
    {
      field: 'expenses',
      headerName: t('EXPENSES'),
      width: 130,
      cellClass: 'text-right',
      cellRenderer: (p: DataGridCellParams<Entry>) => <span className="block w-full text-right font-mono text-danger-text font-medium">{formatAdminAccountingCurrency(Number(p.value ?? 0), locale)}</span>
    },
    {
      field: 'closingBalance',
      headerName: t('CLOSING_BALANCE'),
      width: 130,
      cellClass: 'text-right',
      cellRenderer: (p: DataGridCellParams<Entry>) => <span className="block w-full text-right font-mono text-body text-text-primary font-medium">{formatAdminAccountingCurrency(Number(p.value ?? 0), locale)}</span>
    },
    { field: 'settledBy', headerName: t('SETTLED_BY'), width: 140, cellRenderer: (p: DataGridCellParams<Entry>) => <span className="text-caption text-text-secondary">{p.value}</span> },
    {
      field: 'status',
      headerName: t('STATUS'),
      width: 120,
      cellRenderer: (p: DataGridCellParams<Entry>) => (
        <span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${p.value === 'settled' ? 'bg-success-bg text-success-text border-success-bg' : 'bg-warning-bg text-warning-text border-warning-bg'} inline-block mt-2`}>
          {t(SETTLEMENT_STATUS_TRANSLATION_KEY[String(p.value)] ?? 'STATUS_PENDING')}
        </span>
      )
    },
    {
      headerName: t('ACTION'),
      width: 120,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<Entry>) => {
        if (params.data.status === 'pending') {
          return (
            <div className="h-full flex justify-end items-center">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-success px-4 py-2 text-body font-semibold text-on-success hover:bg-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isFrontendDemoModeEnabled()} title={!isFrontendDemoModeEnabled() ? t('SETTLEMENT_BLOCKED') : undefined}
                onClick={() => handleSettle(params.data.id)}
              >
                <CheckCircle size={18} strokeWidth={2} className="mr-1" /> {t('SETTLE')}
              </button>
            </div>
          );
        }
        return null;
      }
    }
  ];

  return (
    <div className="space-y-6">
      {!isFrontendDemoModeEnabled() && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
          <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
<input type="date" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-44" aria-label={t('DATE_LABEL')} value={date} onChange={e => setDate(e.target.value)} />
<button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" onClick={resetDate}>{t('RESET_DATE')}</button>
</div>
      </div>

      <AdminAccountsDailySettlementSummarySection
        values={{ cash: formatAdminAccountingCurrency(totalCash, locale), upi: formatAdminAccountingCurrency(totalUpi, locale), expenses: formatAdminAccountingCurrency(totalExp, locale), net: formatAdminAccountingCurrency(totalCash + totalUpi - totalExp, locale) }}
        labels={{ cashCollected: t('CASH_COLLECTED'), upiCollected: t('UPI_COLLECTED'), expenses: t('EXPENSES'), net: t('NET') }}
      />

      <AdminAccountsDailySettlementTableSection entries={visibleEntries} columns={colDefs} emptyMessage={t('NO_ENTRIES', { date })} tableLabel={t('TITLE')} />
    </div>
  );
}
