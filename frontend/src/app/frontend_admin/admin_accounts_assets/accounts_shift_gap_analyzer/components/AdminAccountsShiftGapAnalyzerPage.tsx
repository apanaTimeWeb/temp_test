// RESPONSIBILITY: AdminAccountsShiftGapAnalyzerPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.
'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ADMIN_ACCOUNTING_SHIFT_GAP_FIXTURES, ADMIN_ACCOUNTING_DAY_GAP_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/mocks/AdminAccountsShiftGapAnalyzerShiftGapFixtures';
import type { AdminAccountingShiftGap } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/utils/AdminAccountsShiftGapAnalyzerFormatCurrency';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminAccountingShiftGapSummarySection from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/components/AdminAccountsShiftGapAnalyzerShiftGapSummarySection';
import AdminAccountingShiftGapCardsSection from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/components/AdminAccountsShiftGapAnalyzerShiftGapCardsSection';
import AdminAccountingShiftGapFilterSection from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/components/AdminAccountsShiftGapAnalyzerShiftGapFilterSection';
import AdminAccountingShiftGapTableSection from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/components/AdminAccountsShiftGapAnalyzerShiftGapTableSection';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/config/admin_accounts_shift_gap_analyzer.url_config';
import { filterAdminAccountingDayGaps, filterAdminAccountingShiftGaps, normalizeAdminAccountingShiftFilter, summarizeAdminAccountingShiftGaps } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/utils/AdminAccountsShiftGapAnalyzerShiftGapUtils';

export function AdminAccountsShiftGapAnalyzerPage() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.SHIFT_GAP');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialShift = normalizeAdminAccountingShiftFilter(searchParams.get('shift'));
  const [shiftFilter, setShiftFilter] = useState<(typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]>(initialShift);

  useEffect(() => {
    const next = normalizeAdminAccountingShiftFilter(searchParams.get('shift'));
    if (next !== shiftFilter) setShiftFilter(next);
  }, [searchParams, shiftFilter]);

  const updateFilter = (value: (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]) => {
    setShiftFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('shift'); else params.set('shift', value);
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6" aria-labelledby="shift-gap-title">
<h1 id="shift-gap-title" className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
<p className="text-warning-text" role="status">{t('LIVE_UNAVAILABLE')}</p>
</section>;

  const visibleDays = filterAdminAccountingDayGaps(ADMIN_ACCOUNTING_DAY_GAP_FIXTURES, shiftFilter);
  const visibleShifts = filterAdminAccountingShiftGaps(ADMIN_ACCOUNTING_SHIFT_GAP_FIXTURES, shiftFilter);
  const { totalRevenueLoss: totalLoss, totalVacantSeats: totalVacant, averageOccupancy, shiftCount } = summarizeAdminAccountingShiftGaps(visibleShifts);
  const getShiftLabel = (shift: string) => {
    const name = shift.split(' (')[0];
    const labelKey = name === 'Morning' ? 'MORNING' : name === 'Afternoon' ? 'AFTERNOON' : name === 'Night' ? 'NIGHT' : name === '24-Hour' ? 'FULL' : null;
    if (!labelKey) return shift;
    const hours = shift.includes(' (') ? ` (${shift.split(' (').slice(1).join(' (')}` : '';
    return `${t(labelKey)}${hours}`;
  };

  const columns: DataGridColumn<(typeof visibleDays)[number]>[] = [
    { field: 'date', headerName: t('DATE'), sortable: true },
    { field: 'shift', headerName: t('SHIFT'), sortable: true, cellRenderer: ({ value }) => getShiftLabel(String(value ?? '—')) },
    { field: 'seatNo', headerName: t('SEAT_NO'), sortable: true },
    { field: 'gapDays', headerName: t('GAP_DAYS'), sortable: true, valueFormatter: ({ value }) => `${String(value ?? 0)}d` },
    { field: 'loss', headerName: t('REVENUE_LOSS'), sortable: true, valueFormatter: ({ value }) => formatAdminAccountingCurrency(Number(value ?? 0), locale) },
  ];

  return <div className="space-y-6">
    <div>
<h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
<p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
</div>
    <AdminAccountingShiftGapSummarySection totalLossLabel={formatAdminAccountingCurrency(totalLoss, locale)} totalVacant={totalVacant} averageOccupancy={averageOccupancy} shiftCount={shiftCount} labels={{ totalRevenueLoss: t('TOTAL_REVENUE_LOSS'), totalVacantSeats: t('TOTAL_VACANT_SEATS'), averageOccupancy: t('AVG_OCCUPANCY'), shiftsAnalyzed: t('SHIFTS_ANALYZED') }} />
    <AdminAccountingShiftGapCardsSection shifts={visibleShifts} getShiftLabel={getShiftLabel} formatCurrency={(amount) => formatAdminAccountingCurrency(amount, locale)} labels={{ full: t('FULL'), occupied: t('OCCUPIED'), vacant: t('VACANT'), loss: t('LOSS') }} />
    <AdminAccountingShiftGapFilterSection value={shiftFilter} onChange={updateFilter} labels={{ title: t('DAY_WISE_GAP_LOG'), filterLabel: t('SHIFT'), all: t('ALL_SHIFTS'), morning: t('MORNING'), afternoon: t('AFTERNOON'), night: t('NIGHT'), twentyFourHour: t('TWENTY_FOUR_HOUR') }} />
    <AdminAccountingShiftGapTableSection rows={visibleDays} columns={columns} emptyMessage={t('NO_GAP_LOG')} title={t('DAY_WISE_GAP_LOG')} />
  </div>;
}
