'use client';

import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
formatAssetDate,
formatPaiseToRupees,
getDaysUntilExpiry,
isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import {
Building2,
Clock,
Cpu,
IndianRupee,
MapPin,
Phone,
Printer,
Share2,
ShieldCheck,
Tag,
Wrench,
X
} from 'lucide-react';

interface AdminAssetsRegisterDetailModalProps {
  asset: AdminAssetRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onManageAmc?: (asset: AdminAssetRecord) => void;
}

export function AdminAssetsRegisterDetailModal({
  asset,
  isOpen,
  onClose,
  onManageAmc,
}: AdminAssetsRegisterDetailModalProps) {
  if (!isOpen || !asset) return null;

  const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
  const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) {
      window.print();
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Specification Card - ${asset.assetCode}</title>
          <style>
            @page { size: A5 landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 12px; }
            .logo { font-size: 16px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
            .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
            th { background: #4338ca; color: #fff; padding: 6px; text-align: left; font-size: 11px; }
            td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">SMART LIBRARY NETWORK</div>
              <div style="font-size: 11px; color: #64748b;">Central Capital Infrastructure Division · Branch: ${asset.branchName}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge" style="background:#e0e7ff; color:#3730a3;">ASSET HEALTH CARD</span>
              <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">Tag: ${asset.assetCode}</div>
              <div style="font-size: 10px; color: #64748b;">Status: ${asset.status}</div>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 16px; font-weight: 800; color: #1e1b4b;">${asset.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              Category: <strong>${asset.category}</strong> | Location: <strong>${asset.locationWithinBranch}</strong> | Serial No: <strong>${asset.serialNumber ?? 'N/A'}</strong>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="box-title">Financial Valuation</div>
              <div>Original Purchase: <strong>${formatPaiseToRupees(asset.purchaseCost)}</strong></div>
              <div>Purchase Date: <strong>${formatAssetDate(asset.purchaseDate)}</strong></div>
              <div>Current Depreciated Book Value: <strong>${formatPaiseToRupees(asset.currentBookValue)}</strong></div>
            </div>
            <div class="box">
              <div class="box-title">Warranty & AMC Status</div>
              <div>Warranty Expiry: <strong>${formatAssetDate(asset.warrantyExpiryDate)}</strong> ${expiringSoon ? `(Expires in ${daysLeft}d)` : ''}</div>
              <div>Coverage: <strong>${asset.amcStatus}</strong></div>
              <div>AMC Vendor: <strong>${asset.amcVendorName ?? 'Not Contracted'}</strong> (${asset.amcVendorContact ?? '—'})</div>
            </div>
          </div>

          <div class="box" style="margin-bottom: 12px;">
            <div class="box-title">Vendor & Service Schedule</div>
            <div>Primary Supplier: <strong>${asset.vendorName}</strong> | Contact: <strong>${asset.vendorContact}</strong></div>
            <div>Last Serviced: <strong>${formatAssetDate(asset.lastServiceDate)}</strong> | Next Scheduled Visit: <strong>${formatAssetDate(asset.nextScheduledServiceDate)}</strong></div>
            ${asset.notes ? `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1; font-style: italic;">Notes: ${asset.notes}</div>` : ''}
          </div>

          <div class="footer">
            <span>Verified Capital Asset Record · Smart Library Asset ID: ${asset.id}</span>
            <span>Printed on: ${new Date().toLocaleString('en-IN')}</span>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Library Capital Asset Spec Sheet*\n` +
      `Asset: ${asset.name}\n` +
      `Tag: ${asset.assetCode}\n` +
      `Branch: ${asset.branchName} (${asset.locationWithinBranch})\n` +
      `Category: ${asset.category}\n` +
      `Purchase Cost: ${formatPaiseToRupees(asset.purchaseCost)}\n` +
      `Warranty Expiry: ${formatAssetDate(asset.warrantyExpiryDate)}\n` +
      `AMC Status: ${asset.amcStatus}\n` +
      `Vendor: ${asset.vendorName} (${asset.vendorContact})\n` +
      `Status: ${asset.status}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Asset Specification Card</h3>
                <span className="rounded bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                  {asset.assetCode}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Central Asset Registry & Warranty Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset details dialog"
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Asset Title & Main Status Header */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary mb-1.5">
                  <Tag className="h-3 w-3 text-indigo-400" />
                  {asset.category}
                </span>
                <h2 className="text-lg font-bold text-foreground">{asset.name}</h2>
                {asset.serialNumber && (
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Serial No: <span className="text-foreground font-semibold">{asset.serialNumber}</span>
                  </p>
                )}
              </div>
              <div className="self-start sm:self-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                    asset.status === 'OPERATIONAL'
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                      : asset.status === 'MAINTENANCE_REQUIRED' || asset.status === 'UNDER_REPAIR'
                      ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  {asset.status === 'OPERATIONAL'
                    ? 'Operational'
                    : asset.status === 'MAINTENANCE_REQUIRED'
                    ? 'Service Overdue'
                    : asset.status === 'UNDER_REPAIR'
                    ? 'Under Repair'
                    : 'Disposed'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics (3 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-emerald-400" />
                Original Purchase
              </span>
              <p className="text-lg font-mono font-bold text-foreground">
                {formatPaiseToRupees(asset.purchaseCost)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Date: {formatAssetDate(asset.purchaseDate)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-sky-400" />
                Current Book Value
              </span>
              <p className="text-lg font-mono font-bold text-foreground">
                {formatPaiseToRupees(asset.currentBookValue)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Post-depreciation value
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-3.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-amber-400" />
                Warranty Status
              </span>
              <p className="text-sm font-mono font-bold text-foreground">
                {formatAssetDate(asset.warrantyExpiryDate)}
              </p>
              {expiringSoon ? (
                <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                  <Clock className="h-3 w-3" />
                  Expires in {daysLeft} days!
                </span>
              ) : daysLeft !== null && daysLeft < 0 ? (
                <span className="text-[10px] text-rose-400 font-semibold">Warranty Expired</span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-semibold">Valid Warranty</span>
              )}
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branch & Placement */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Branch & Location Placement
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Branch:</span>
                  <p className="font-bold text-foreground text-sm">{asset.branchName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location Within Branch:</span>
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    {asset.locationWithinBranch}
                  </p>
                </div>
              </div>
            </div>

            {/* Vendor & Supplier */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-secondary" />
                Primary Supplier / Vendor
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Supplier Name:</span>
                  <p className="font-bold text-foreground text-sm">{asset.vendorName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Direct Support Contact:</span>
                  <p className="font-mono font-bold text-foreground text-sm mt-0.5">{asset.vendorContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AMC & Maintenance Details */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Wrench className="h-3.5 w-3.5 text-amber-400" />
                Annual Maintenance Contract (AMC) & Service
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border border-border bg-surface-muted">
                {asset.amcStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground">AMC Service Provider:</span>
                <p className="font-semibold text-foreground">{asset.amcVendorName ?? 'Not Contracted'}</p>
                {asset.amcVendorContact && (
                  <p className="font-mono text-muted-foreground text-[11px]">{asset.amcVendorContact}</p>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Contract Renewal Due:</span>
                <p className="font-semibold text-foreground">{formatAssetDate(asset.amcExpiryDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Next Scheduled Service:</span>
                <p className="font-semibold text-foreground">{formatAssetDate(asset.nextScheduledServiceDate)}</p>
              </div>
            </div>

            {asset.notes && (
              <div className="rounded-lg bg-surface-muted p-3 text-xs border border-border text-text-secondary mt-2">
                <strong className="text-foreground">Maintenance Notes: </strong>
                {asset.notes}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-muted px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Spec Card
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onManageAmc && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onManageAmc(asset);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
              >
                <Wrench className="h-4 w-4" />
                Manage AMC Contract
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAssetsRegisterDetailModal;
