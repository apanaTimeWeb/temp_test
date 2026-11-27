import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';

const INR_FIXED_TWO = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

function escapeCsvCell(v: unknown): string {
  const s = String(v ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

export function exportAssetsRegisterCsv(rows: ManagerAssetsRegisterAsset[]): void {
  const headers = ['Asset ID', 'Asset Name', 'Category', 'Purchase Date', 'Purchase Cost (INR)', 'Current Value (INR)', 'Location', 'Status']
    .map(escapeCsvCell)
    .join(',');

  const csvRows = rows
    .map((a) =>
      [
        a.id,
        a.name,
        a.category,
        a.purchaseDate,
        INR_FIXED_TWO.format(a.purchaseValue / 100),
        INR_FIXED_TWO.format(a.currentValue / 100),
        a.location,
        a.status,
      ]
        .map(escapeCsvCell)
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([`\uFEFF${headers}\r\n${csvRows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `assets_register_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
