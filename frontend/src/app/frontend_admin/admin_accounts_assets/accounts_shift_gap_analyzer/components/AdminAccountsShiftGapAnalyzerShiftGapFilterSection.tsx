'use client';
// RESPONSIBILITY: AdminAccountingShiftGapFilterSection component owned by admin_accounting; responsibility folder: admin_accounting_components_forms.
import { ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/config/admin_accounts_shift_gap_analyzer.url_config';

export default function AdminAccountingShiftGapFilterSection({ value, onChange, labels }: {
  value: (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number];
  onChange: (value: (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number]) => void;
  labels: { title: string; filterLabel: string; all: string; morning: string; afternoon: string; night: string; twentyFourHour: string };
}) {
  return (
    <section className="flex flex-wrap items-center gap-4" aria-label={labels.title}>
      <p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{labels.title}</p>
      <label className="sr-only" htmlFor="shift-gap-filter">{labels.filterLabel}</label>
      <select id="shift-gap-filter" className="ml-auto min-h-11 w-44 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={value} onChange={(event) => onChange(event.target.value as (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number])}>
        <option value="all">{labels.all}</option><option value="Morning">{labels.morning}</option><option value="Afternoon">{labels.afternoon}</option><option value="Night">{labels.night}</option><option value="24-Hour">{labels.twentyFourHour}</option>
      </select>
    </section>
  );
}
