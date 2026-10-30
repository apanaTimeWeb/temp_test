'use client';
// RESPONSIBILITY: AdminAccountsSeatGapReportPage component owned by admin_accounting; responsibility folder: admin_accounting_components_views.

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminAccountingSeatGapSummarySection from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/components/AdminAccountsSeatGapReportSeatGapSummarySection';
import AdminAccountingSeatGapFilterSection from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/components/AdminAccountsSeatGapReportSeatGapFilterSection';
import AdminAccountingSeatGapTableSection from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/components/AdminAccountsSeatGapReportSeatGapTableSection';
import { ADMIN_ACCOUNTING_SEAT_GAP_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/mocks/AdminAccountsSeatGapReportSeatGapFixtures';
import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/utils/AdminAccountsSeatGapReportFormatCurrency';
import { buildAdminAccountsSeatGapReportCsv, downloadAdminAccountingCsv } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/utils/AdminAccountsSeatGapReportExportUtils';
import { ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS, ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/config/admin_accounts_seat_gap_report.url_config';

/**
 * Renders the accounting seat-gap report by shift and availability status. Dependencies: module-owned shift/status options and report data. Edge cases: empty categories and unknown statuses must not be inferred as available seats.
 */
export function AdminAccountsSeatGapReportPage() {
  const locale = useLocale();
  const t = useTranslations('ADMIN_ACCOUNTING.SEAT_GAP');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialShift = searchParams.get('shift');
  const initialStatus = searchParams.get('status');
  const [shiftFilter, setShiftFilter] = useState<(typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]>(ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS.includes(initialShift as (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]) ? initialShift as (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number] : 'all');
  const [statusFilter, setStatusFilter] = useState<(typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number]>(ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS.includes(initialStatus as (typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number]) ? initialStatus as (typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number] : 'all');

  useEffect(() => {
    const nextShift = searchParams.get('shift');
    const normalizedShift = ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS.includes(nextShift as (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]) ? nextShift as (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number] : 'all';
    const nextStatus = searchParams.get('status');
    const normalizedStatus = ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS.includes(nextStatus as (typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number]) ? nextStatus as (typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number] : 'all';
    if (normalizedShift !== shiftFilter) setShiftFilter(normalizedShift);
    if (normalizedStatus !== statusFilter) setStatusFilter(normalizedStatus);
  }, [searchParams, shiftFilter, statusFilter]);

  const updateFilter = (key: 'shift' | 'status', value: string) => {
    if (key === 'shift') setShiftFilter(value as (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]);
    else setStatusFilter(value as (typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number]);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete(key); else params.set(key, value);
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const sourceRows = useMemo(() => isDemoMode ? ADMIN_ACCOUNTING_SEAT_GAP_FIXTURES : [], [isDemoMode]);
  const visible = useMemo(() => sourceRows.filter((row) => (shiftFilter === 'all' || row.shift === shiftFilter) && (statusFilter === 'all' || row.status === statusFilter)), [sourceRows, shiftFilter, statusFilter]);
  const totalLoss = visible.reduce((sum, row) => sum + row.revenueLoss, 0);

  const exportCsv = () => {
    if (!isDemoMode) { toast.info(t('EXPORT_BLOCKED'), { id: 'admin_accounts_assets-accounts_seat_gap_report-components-AdminAccountsSeatGapReportPage-toast-56-1' }); return; }
    const csv = buildAdminAccountsSeatGapReportCsv(visible);
    downloadAdminAccountingCsv('admin-accounting-seat-gap-report.csv', csv);
    toast.info(t('DEMO_EXPORTED'), { id: 'admin_accounts_assets-accounts_seat_gap_report-components-AdminAccountsSeatGapReportPage-toast-59-2' });
  };

  const columns: DataGridColumn<AdminAccountingSeatGapRow>[] = [
    { field: 'seatNo', headerName: t('SEAT_NO'), sortable: true },
    { field: 'shift', headerName: t('SHIFT'), sortable: true, cellRenderer: ({ value }) => { const shift = String(value ?? ''); const key = ({ Morning: 'MORNING', Afternoon: 'AFTERNOON', Night: 'NIGHT' } as const)[shift as 'Morning' | 'Afternoon' | 'Night']; return key ? t(key) : (shift || '—'); } },
    { field: 'floor', headerName: t('FLOOR'), sortable: true },
    { field: 'lastOccupied', headerName: t('LAST_OCCUPIED'), sortable: true },
    { field: 'gapDays', headerName: t('GAP_DAYS'), sortable: true, valueFormatter: ({ value }) => `${String(value ?? 0)}d` },
    { field: 'revenueLoss', headerName: t('REVENUE_LOSS'), sortable: true, valueFormatter: ({ value }) => formatAdminAccountingCurrency(Number(value ?? 0), locale) },
    { field: 'status', headerName: t('STATUS'), sortable: true, cellRenderer: ({ value }) => { const status = String(value ?? ''); const known = status === 'vacant' || status === 'maintenance'; return <span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${status === 'vacant' ? 'bg-warning-bg text-warning-text border-warning-bg' : status === 'maintenance' ? 'bg-danger-bg text-danger-text border-danger-bg' : 'bg-card text-text-secondary border-border'}`}>{status === 'vacant' ? t('VACANT') : status === 'maintenance' ? t('MAINTENANCE') : (known ? status : status || '—')}</span>; } },
  ];

  return <div className="space-y-6">
    {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
    <div><h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1><p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p></div>
    <AdminAccountingSeatGapSummarySection rows={visible} totalLossLabel={formatAdminAccountingCurrency(totalLoss, locale)} labels={{ totalGapSeats: t('TOTAL_GAP_SEATS'), revenueLoss: t('REVENUE_LOSS'), averageGapDays: t('AVG_GAP_DAYS'), underMaintenance: t('UNDER_MAINTENANCE') }} />
    <AdminAccountingSeatGapFilterSection shift={shiftFilter} status={statusFilter} onFilterChange={updateFilter} onExport={exportCsv} canExport={isDemoMode} exportBlockedLabel={t('EXPORT_BLOCKED')} labels={{ shift: t('SHIFT'), status: t('STATUS'), allShifts: t('ALL_SHIFTS'), morning: t('MORNING'), afternoon: t('AFTERNOON'), night: t('NIGHT'), allStatus: t('ALL_STATUS'), vacant: t('VACANT'), maintenance: t('MAINTENANCE'), export: t('EXPORT') }} />
    <AdminAccountingSeatGapTableSection rows={visible} columns={columns} emptyMessage={t('NO_GAP_SEATS')} title={t('TITLE')} />
  </div>;
}
