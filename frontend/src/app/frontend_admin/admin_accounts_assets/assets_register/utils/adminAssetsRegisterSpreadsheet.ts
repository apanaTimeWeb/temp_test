import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import { toast } from 'sonner';

export function escapeAssetHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerAssetDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const ASSET_HEADERS = [
  'Asset Code', 'Asset Name', 'Category', 'Branch', 'Location', 'Purchase Date',
  'Purchase Cost (INR)', 'Book Value (INR)', 'Status', 'Warranty Expiry',
  'AMC Status', 'AMC Vendor', 'AMC Expiry', 'Serial Number',
];

export function exportAdminAssetsCsv(filteredRecords: AdminAssetRecord[]): void {
  const rows = filteredRecords.map((r) => [
    `"${r.assetCode}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    r.category,
    `"${r.branchName}"`,
    `"${r.locationWithinBranch.replace(/"/g, '""')}"`,
    r.purchaseDate,
    (r.purchaseCost / 100).toFixed(2),
    (r.currentBookValue / 100).toFixed(2),
    r.status,
    r.warrantyExpiryDate,
    r.amcStatus,
    `"${r.amcVendorName ?? ''}"`,
    r.amcExpiryDate ?? '',
    `"${r.serialNumber ?? ''}"`,
  ]);
  const csv = [ASSET_HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerAssetDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-asset-register-audit-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  toast.success(`Exported ${filteredRecords.length} asset records to CSV`, { id: 'admin-assets-csv-export' });
}

export function exportAdminAssetsExcel(filteredRecords: AdminAssetRecord[]): void {
  const rows = filteredRecords.map((r) => [
    r.assetCode, r.name, r.category, r.branchName, r.locationWithinBranch, r.purchaseDate,
    `₹${(r.purchaseCost / 100).toLocaleString('en-IN')}`,
    `₹${(r.currentBookValue / 100).toLocaleString('en-IN')}`,
    r.status.replace(/_/g, ' '), r.warrantyExpiryDate, r.amcStatus.replace(/_/g, ' '),
    r.amcVendorName ?? 'None', r.amcExpiryDate ?? '-', r.serialNumber ?? '-',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #0369a1; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f0f9ff; }
      </style>
    </head>
    <body><table>
      <thead><tr>${ASSET_HEADERS.map((h) => `<th>${escapeAssetHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeAssetHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  triggerAssetDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-asset-register-audit-${new Date().toISOString().slice(0, 10)}.xls`,
  );
  toast.success(`Exported ${filteredRecords.length} asset records to Excel (.xls)`, { id: 'admin-assets-excel-export' });
}
