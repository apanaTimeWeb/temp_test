'use client';
import type { ManagerAccountsSeatGapReportMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes.ts';
import { MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import { useLocale, useTranslations } from 'next-intl';

import { useManagerSeatGapReportCurrencyFormatter } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportFormattingHook';


// RESPONSIBILITY: Entry page for the manager_seat_gap_report module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { ManagerAccountsSeatGapReportEmptyState } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_empty_states/ManagerAccountsSeatGapReportEmptyState';

function formatKnownIsoCalendarDate(value: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return value;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}



const MOCK = MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS;

export default function ManagerAccountsSeatGapReportPage({ view, id }: ManagerAccountsSeatGapReportMainProps) {
  const tManagerUi = useTranslations('manager.manager_seat_gap_report.ui');
  const locale = useLocale();
  const formatManagerSeatGapReportCurrency = useManagerSeatGapReportCurrencyFormatter();
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const visible = MOCK.filter(r =>
    (shiftFilter === 'all' || r.shift === shiftFilter) &&
    (statusFilter === 'all' || r.status === statusFilter)
  );

  const totalLoss = visible.reduce((s, r) => s + r.revenueLoss, 0);


  return (
    <div className="space-y-6" data-route-view={view} data-route-id={id}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('seat_gap_report')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('preview_vacant_seat_gaps_and_illustrative_revenue_loss_e_8c1a45')}</p>
        <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-accounting-seat-gap-sample-warning">{tManagerUi('sample_data_only_rows_and_revenue_estimates_are_not_live_8f348a')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-card fin-kpi-card--danger"><p className="fin-kpi-label fin-kpi-label--danger">{tManagerUi('total_gap_seats')}</p><p className="fin-kpi-value fin-kpi-value--danger">{visible.length}</p></div>
        <div className="fin-kpi-card fin-kpi-card--warning"><p className="fin-kpi-label fin-kpi-label--warning">{tManagerUi('revenue_loss')}</p><p className="fin-kpi-value fin-kpi-value--warning">{formatManagerSeatGapReportCurrency(totalLoss)}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tManagerUi('avg_gap_days')}</p><p className="fin-kpi-value">{visible.length ? Math.round(visible.reduce((s,r)=>s+r.gapDays,0)/visible.length) : 0}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tManagerUi('under_maintenance')}</p><p className="fin-kpi-value">{visible.filter(r=>r.status==='maintenance').length}</p></div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} aria-label={tManagerUi('all_shifts')}>
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Afternoon">{tManagerUi('afternoon')}</option>
          <option value="Night">{tManagerUi('night')}</option>
        </select>
        <select className="fin-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="vacant">{tManagerUi('vacant')}</option>
          <option value="maintenance">{tManagerUi('maintenance')}</option>
        </select>
        <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed ml-auto" disabled title={tManagerUi('official_report_export_unavailable_the_rows_are_sample_d_e79411')} data-testid="manager-accounting-seat-gap-export-disabled">{tManagerUi('export_unavailable')}</button>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tManagerUi('seat_no')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('shift')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('floor')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('last_occupied')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('gap_days')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('revenue_loss_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7}><ManagerAccountsSeatGapReportEmptyState className="fin-empty-state"><div className="fin-empty-state__icon">🪑</div><p className="fin-empty-state__title">{tManagerUi('no_gap_seats_found')}</p></ManagerAccountsSeatGapReportEmptyState></td></tr>
            ) : visible.map(r => (
              <tr key={r.seatNo} className="fin-table-hover-row fin-table-row">
                <td className="py-3 px-4 fin-cell-name">{r.seatNo}</td>
                <td className="py-3 px-4 fin-cell-subtext">{({ Morning: tManagerUi('morning'), Afternoon: tManagerUi('afternoon'), Night: tManagerUi('night') } as Record<string, string>)[r.shift] ?? r.shift}</td>
                <td className="py-3 px-4 fin-cell-subtext">{r.floor}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatKnownIsoCalendarDate(r.lastOccupied, locale)}</td>
                <td className={`py-3 px-4 text-right font-semibold ${r.gapDays > 20 ? 'fin-text-danger' : 'fin-text-warning'}`}>{r.gapDays}{tManagerUi('d')}</td>
                <td className="py-3 px-4 text-right fin-text-danger font-semibold">{formatManagerSeatGapReportCurrency(r.revenueLoss)}</td>
                <td className="py-3 px-4">
                  <span className={`fin-badge ${r.status === 'vacant' ? 'fin-badge--warning' : 'fin-badge--danger'}`}>{r.status === 'vacant' ? tManagerUi('vacant') : r.status === 'maintenance' ? tManagerUi('maintenance') : r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
