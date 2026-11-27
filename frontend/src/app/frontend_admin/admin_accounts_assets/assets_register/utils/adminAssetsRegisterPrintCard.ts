import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatAssetDate,
  formatPaiseToRupees,
  getDaysUntilExpiry,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import { escapeAssetHtml } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/adminAssetsRegisterSpreadsheet';

const ASSET_CARD_CSS = `
  @page { size: A5 landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 12px; }
  .logo { font-size: 16px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
  .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
  .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
`;

export function buildAssetDetailPrintHtml(asset: AdminAssetRecord): string {
  const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
  const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);
  return `
    <!DOCTYPE html><html><head><title>Asset Specification Card - ${escapeAssetHtml(asset.assetCode)}</title><style>${ASSET_CARD_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="logo">SMART LIBRARY NETWORK</div><div style="font-size: 11px; color: #64748b;">Central Capital Infrastructure Division · Branch: ${escapeAssetHtml(asset.branchName)}</div></div>
          <div style="text-align: right;"><span class="badge" style="background:#e0e7ff; color:#3730a3;">ASSET HEALTH CARD</span><div style="font-size: 13px; font-weight: bold; margin-top: 4px;">Tag: ${escapeAssetHtml(asset.assetCode)}</div><div style="font-size: 10px; color: #64748b;">Status: ${escapeAssetHtml(asset.status)}</div></div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="font-size: 16px; font-weight: 800; color: #1e1b4b;">${escapeAssetHtml(asset.name)}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Category: <strong>${escapeAssetHtml(asset.category)}</strong> | Location: <strong>${escapeAssetHtml(asset.locationWithinBranch)}</strong> | Serial No: <strong>${escapeAssetHtml(asset.serialNumber ?? 'N/A')}</strong></div>
        </div>
        <div class="grid">
          <div class="box"><div class="box-title">Financial Valuation</div><div>Original Purchase: <strong>${escapeAssetHtml(formatPaiseToRupees(asset.purchaseCost))}</strong></div><div>Purchase Date: <strong>${escapeAssetHtml(formatAssetDate(asset.purchaseDate))}</strong></div><div>Current Depreciated Book Value: <strong>${escapeAssetHtml(formatPaiseToRupees(asset.currentBookValue))}</strong></div></div>
          <div class="box"><div class="box-title">Warranty & AMC Status</div><div>Warranty Expiry: <strong>${escapeAssetHtml(formatAssetDate(asset.warrantyExpiryDate))}</strong> ${expiringSoon ? `(Expires in ${daysLeft}d)` : ''}</div><div>Coverage: <strong>${escapeAssetHtml(asset.amcStatus)}</strong></div><div>AMC Vendor: <strong>${escapeAssetHtml(asset.amcVendorName ?? 'Not Contracted')}</strong> (${escapeAssetHtml(asset.amcVendorContact ?? '—')})</div></div>
        </div>
        <div class="box" style="margin-bottom: 12px;"><div class="box-title">Vendor & Service Schedule</div><div>Primary Supplier: <strong>${escapeAssetHtml(asset.vendorName)}</strong> | Contact: <strong>${escapeAssetHtml(asset.vendorContact)}</strong></div><div>Last Serviced: <strong>${escapeAssetHtml(formatAssetDate(asset.lastServiceDate))}</strong> | Next Scheduled Visit: <strong>${escapeAssetHtml(formatAssetDate(asset.nextScheduledServiceDate))}</strong></div>${asset.notes ? `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; font-style: italic;">Notes: ${escapeAssetHtml(asset.notes)}</div>` : ''}</div>
        <div class="footer"><span>Verified Capital Asset Record · Smart Library Asset ID: ${escapeAssetHtml(asset.id)}</span><span>Printed on: ${escapeAssetHtml(new Date().toLocaleString('en-IN'))}</span></div>
      </body></html>
  `;
}
