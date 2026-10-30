// RESPONSIBILITY: AdminAccountingMaintenanceFilterSection component owned by admin_accounting; responsibility folder: admin_accounting_components_forms.
'use client';
import type { AdminAccountingMaintenanceStatusFilter } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/types/AdminAssetsMaintenanceTypes';


export default function AdminAccountingMaintenanceFilterSection({
  label, allLabel, options, value, onChange, getStatusLabel,
}: {
  label: string;
  allLabel: string;
  options: readonly AdminAccountingMaintenanceStatusFilter[];
  value: AdminAccountingMaintenanceStatusFilter;
  onChange: (value: AdminAccountingMaintenanceStatusFilter) => void;
  getStatusLabel: (value: Exclude<AdminAccountingMaintenanceStatusFilter, 'all'>) => string;
}) {
  return (
    <section className="flex flex-wrap items-center gap-3" aria-label={label}>
      <label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="maintenance-status">{label}</label>
      <select id="maintenance-status" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-48" value={value} onChange={(event) => onChange(event.target.value as AdminAccountingMaintenanceStatusFilter)}>
        <option value="all">{allLabel}</option>
        {options.filter((option) => option !== 'all').map((option) => <option key={option} value={option}>{getStatusLabel(option)}</option>)}
      </select>
    </section>
  );
}


export type { AdminAccountingMaintenanceStatusFilter };
