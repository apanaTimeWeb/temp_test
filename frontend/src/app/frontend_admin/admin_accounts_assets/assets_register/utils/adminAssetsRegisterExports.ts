import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatAssetDate,
  formatPaiseToRupees,
  getDaysUntilExpiry,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import { toast } from 'sonner';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerDownload(blob: Blob, filename: string): void {
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
  'Asset Code',
  'Asset Name',
  'Category',
  'Branch',
  'Location',
  'Purchase Date',
  'Purchase Cost (INR)',
  'Book Value (INR)',
  'Status',
  'Warranty Expiry',
  'AMC Status',
  'AMC Vendor',
  'AMC Expiry',
  'Serial Number',
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
  triggerDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-asset-register-audit-${new Date().toISOString().slice(0, 10)}.csv`
  );
  toast.success(`Exported ${filteredRecords.length} asset records to CSV`, { id: 'admin-assets-csv-export' });
}

export function exportAdminAssetsExcel(filteredRecords: AdminAssetRecord[]): void {
  const rows = filteredRecords.map((r) => [
    r.assetCode,
    r.name,
    r.category,
    r.branchName,
    r.locationWithinBranch,
    r.purchaseDate,
    `₹${(r.purchaseCost / 100).toLocaleString('en-IN')}`,
    `₹${(r.currentBookValue / 100).toLocaleString('en-IN')}`,
    r.status.replace(/_/g, ' '),
    r.warrantyExpiryDate,
    r.amcStatus.replace(/_/g, ' '),
    r.amcVendorName ?? 'None',
    r.amcExpiryDate ?? '-',
    r.serialNumber ?? '-',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Assets Audit</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #0369a1; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f0f9ff; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${ASSET_HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </body>
    </html>
  `.trim();
  triggerDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-asset-register-audit-${new Date().toISOString().slice(0, 10)}.xls`
  );
  toast.success(`Exported ${filteredRecords.length} asset records to Excel (.xls)`, { id: 'admin-assets-excel-export' });
}

export function buildAssetDetailPrintHtml(asset: AdminAssetRecord): string {
  const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
  const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Asset Specification Card - ${escapeHtml(asset.assetCode)}</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 12px; }
          .logo { font-size: 16px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
          .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Central Capital Infrastructure Division · Branch: ${escapeHtml(asset.branchName)}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#e0e7ff; color:#3730a3;">ASSET HEALTH CARD</span>
            <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">Tag: ${escapeHtml(asset.assetCode)}</div>
            <div style="font-size: 10px; color: #64748b;">Status: ${escapeHtml(asset.status)}</div>
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="font-size: 16px; font-weight: 800; color: #1e1b4b;">${escapeHtml(asset.name)}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Category: <strong>${escapeHtml(asset.category)}</strong> | Location: <strong>${escapeHtml(asset.locationWithinBranch)}</strong> | Serial No: <strong>${escapeHtml(asset.serialNumber ?? 'N/A')}</strong>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Financial Valuation</div>
            <div>Original Purchase: <strong>${escapeHtml(formatPaiseToRupees(asset.purchaseCost))}</strong></div>
            <div>Purchase Date: <strong>${escapeHtml(formatAssetDate(asset.purchaseDate))}</strong></div>
            <div>Current Depreciated Book Value: <strong>${escapeHtml(formatPaiseToRupees(asset.currentBookValue))}</strong></div>
          </div>
          <div class="box">
            <div class="box-title">Warranty & AMC Status</div>
            <div>Warranty Expiry: <strong>${escapeHtml(formatAssetDate(asset.warrantyExpiryDate))}</strong> ${expiringSoon ? `(Expires in ${daysLeft}d)` : ''}</div>
            <div>Coverage: <strong>${escapeHtml(asset.amcStatus)}</strong></div>
            <div>AMC Vendor: <strong>${escapeHtml(asset.amcVendorName ?? 'Not Contracted')}</strong> (${escapeHtml(asset.amcVendorContact ?? '—')})</div>
          </div>
        </div>
        <div class="box" style="margin-bottom: 12px;">
          <div class="box-title">Vendor & Service Schedule</div>
          <div>Primary Supplier: <strong>${escapeHtml(asset.vendorName)}</strong> | Contact: <strong>${escapeHtml(asset.vendorContact)}</strong></div>
          <div>Last Serviced: <strong>${escapeHtml(formatAssetDate(asset.lastServiceDate))}</strong> | Next Scheduled Visit: <strong>${escapeHtml(formatAssetDate(asset.nextScheduledServiceDate))}</strong></div>
          ${asset.notes ? `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; font-style: italic;">Notes: ${escapeHtml(asset.notes)}</div>` : ''}
        </div>
        <div class="footer">
          <span>Verified Capital Asset Record · Smart Library Asset ID: ${escapeHtml(asset.id)}</span>
          <span>Printed on: ${escapeHtml(new Date().toLocaleString('en-IN'))}</span>
        </div>
      </body>
    </html>
  `;
}
