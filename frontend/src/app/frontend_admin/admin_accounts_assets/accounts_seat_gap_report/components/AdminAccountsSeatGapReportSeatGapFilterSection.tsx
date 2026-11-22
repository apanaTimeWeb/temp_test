'use client';
// RESPONSIBILITY: AdminAccountingSeatGapFilterSection component owned by admin_accounting; responsibility folder: admin_accounting_components_forms.
import { ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS,ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/config/admin_accounts_seat_gap_report.url_config';
import { Download,Search } from 'lucide-react';

export default function AdminAccountingSeatGapFilterSection({
  shift, status, search = '', onSearchChange, onFilterChange, onExport, canExport, exportBlockedLabel, labels,
}: {
  shift: (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number];
  status: (typeof ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS)[number];
  search?: string;
  onSearchChange?: (val: string) => void;
  onFilterChange: (key: 'shift' | 'status', value: string) => void;
  onExport: () => void;
  canExport: boolean;
  exportBlockedLabel: string;
  labels: { shift: string; status: string; allShifts: string; morning: string; afternoon: string; night: string; allStatus: string; vacant: string; maintenance: string; export: string };
}) {
  return (
    <section className="flex flex-wrap items-end gap-4" aria-label={labels.status}>
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="seat-gap-search">
            Search
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input maxLength={30}
              id="seat-gap-search"
              type="text"
              placeholder="Search seat no, floor, shift..."
              className="min-h-11 w-full rounded-md border border-border bg-input pl-9 pr-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}
      <div><label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="seat-gap-shift">{labels.shift}</label><select id="seat-gap-shift" className="min-h-11 w-40 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={shift} onChange={(event) => onFilterChange('shift', event.target.value)}><option value="all">{labels.allShifts}</option><option value="Morning">{labels.morning}</option><option value="Afternoon">{labels.afternoon}</option><option value="Night">{labels.night}</option></select></div>
      <div><label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="seat-gap-status">{labels.status}</label><select id="seat-gap-status" className="min-h-11 w-40 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={status} onChange={(event) => onFilterChange('status', event.target.value)}><option value="all">{labels.allStatus}</option><option value="vacant">{labels.vacant}</option><option value="maintenance">{labels.maintenance}</option></select></div>
      <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-200 hover:border-indigo-400 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer ml-auto" disabled={!canExport} title={!canExport ? exportBlockedLabel : undefined} onClick={onExport}>
        <Download size={14} className="text-indigo-400" />
        <span>{labels.export}</span>
      </button>
    </section>
  );
}
