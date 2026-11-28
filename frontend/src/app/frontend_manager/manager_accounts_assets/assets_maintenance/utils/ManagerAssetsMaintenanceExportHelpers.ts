import type { MaintenanceLogItem } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTable';

const INR_RUPEES_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const INR_FIXED_TWO = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function formatMaintenanceInrRupees(rupees: number): string {
  return INR_RUPEES_FORMATTER.format(rupees);
}

/** Formats minor-unit maintenance cost into major-unit INR display text. */
export function formatMaintenanceMinorInr(minorAmount: number): string {
  return formatMaintenanceInrRupees(Math.round(minorAmount / 100));
}

export const MAINTENANCE_CURRENCY_SYMBOL = INR_RUPEES_FORMATTER.format(0).replace(/[0-9.,\s]/g, '');

function escapeCsvCell(v: unknown): string {
  const s = String(v ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

export function exportMaintenanceLogsCsv(rows: MaintenanceLogItem[]): void {
  const headers = [
    'Ticket ID',
    'Asset Name',
    'Priority',
    'Type',
    'Issue',
    'Reported Date',
    'Scheduled Date',
    'Vendor',
    'Cost (INR)',
    'Status',
  ]
    .map(escapeCsvCell)
    .join(',');

  const csvRows = rows
    .map((l) =>
      [
        l.id,
        l.assetName,
        l.priority || 'routine',
        l.type || 'preventive',
        l.issue,
        l.reportedDate,
        l.scheduledDate,
        l.vendor,
        INR_FIXED_TWO.format(l.cost / 100),
        l.status,
      ]
        .map(escapeCsvCell)
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([`\uFEFF${headers}\r\n${csvRows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `asset_maintenance_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
