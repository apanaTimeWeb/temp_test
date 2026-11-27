'use client';

import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatAssetDate,
  formatPaiseToRupees,
  getDaysUntilExpiry,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import { buildAssetDetailPrintHtml } from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/adminAssetsRegisterExports';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import {
  Building2, Clock, Cpu, IndianRupee, MapPin, Phone, Printer,
  Share2, ShieldCheck, Tag, Wrench, X,
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
    printWindow.document.write(buildAssetDetailPrintHtml(asset));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Library Capital Asset Spec Sheet*\nAsset: ${asset.name}\nTag: ${asset.assetCode}\nBranch: ${asset.branchName} (${asset.locationWithinBranch})\nCategory: ${asset.category}\nPurchase Cost: ${formatPaiseToRupees(asset.purchaseCost)}\nWarranty Expiry: ${formatAssetDate(asset.warrantyExpiryDate)}\nAMC Status: ${asset.amcStatus}\nVendor: ${asset.vendorName} (${asset.vendorContact})\nStatus: ${asset.status}`
    );
    const popup = window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const statusCls =
    asset.status === 'OPERATIONAL'
      ? 'border-success bg-success-bg text-success-text'
      : asset.status === 'MAINTENANCE_REQUIRED' || asset.status === 'UNDER_REPAIR'
        ? 'border-warning bg-warning-bg text-warning-text'
        : 'border-border bg-surface-highlight text-text-secondary';

  const statusLabel =
    asset.status === 'OPERATIONAL'
      ? 'Operational'
      : asset.status === 'MAINTENANCE_REQUIRED'
        ? 'Service Overdue'
        : asset.status === 'UNDER_REPAIR'
          ? 'Under Repair'
          : 'Disposed';

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-2xl rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-surface-highlight px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
              <Cpu className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-text-primary">Asset Specification Card</DialogTitle>
                <span className="rounded bg-primary-subtle border border-border-focus px-2 py-0.5 text-xs font-mono font-bold text-primary">
                  {asset.assetCode}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">Central Asset Registry &amp; Warranty Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset details dialog"
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-highlight px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary mb-1.5">
                  <Tag className="h-3 w-3 text-primary" aria-hidden="true" />
                  {asset.category}
                </span>
                <h2 className="text-lg font-bold text-text-primary">{asset.name}</h2>
                {asset.serialNumber && (
                  <p className="text-xs font-mono text-text-secondary mt-0.5">
                    Serial No: <span className="text-text-primary font-semibold">{asset.serialNumber}</span>
                  </p>
                )}
              </div>
              <div className="self-start sm:self-center">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${statusCls}`}>
                  <span className="h-2 w-2 rounded-full bg-current motion-safe:animate-pulse" />
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-success-text" aria-hidden="true" />
                Original Purchase
              </span>
              <p className="text-lg font-mono font-bold text-text-primary">{formatPaiseToRupees(asset.purchaseCost)}</p>
              <p className="text-[10px] text-text-secondary">Date: {formatAssetDate(asset.purchaseDate)}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-info-text" aria-hidden="true" />
                Current Book Value
              </span>
              <p className="text-lg font-mono font-bold text-text-primary">{formatPaiseToRupees(asset.currentBookValue)}</p>
              <p className="text-[10px] text-text-secondary">Post-depreciation value</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-warning-text" aria-hidden="true" />
                Warranty Status
              </span>
              <p className="text-sm font-mono font-bold text-text-primary">{formatAssetDate(asset.warrantyExpiryDate)}</p>
              {expiringSoon ? (
                <span className="inline-flex items-center gap-1 rounded bg-warning-bg border border-warning px-1.5 py-0.5 text-[10px] font-bold text-warning-text">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  Expires in {daysLeft} days!
                </span>
              ) : daysLeft !== null && daysLeft < 0 ? (
                <span className="text-[10px] text-danger-text font-semibold">Warranty Expired</span>
              ) : (
                <span className="text-[10px] text-success-text font-semibold">Valid Warranty</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Branch &amp; Location Placement
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-text-secondary">Branch:</span>
                  <p className="font-bold text-text-primary text-sm">{asset.branchName}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Location Within Branch:</span>
                  <p className="font-semibold text-text-primary flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-success-text" aria-hidden="true" />
                    {asset.locationWithinBranch}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <Phone className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                Primary Supplier / Vendor
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-text-secondary">Supplier Name:</span>
                  <p className="font-bold text-text-primary text-sm">{asset.vendorName}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Direct Support Contact:</span>
                  <p className="font-mono font-bold text-text-primary text-sm mt-0.5">{asset.vendorContact}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <Wrench className="h-3.5 w-3.5 text-warning-text" aria-hidden="true" />
                Annual Maintenance Contract (AMC) &amp; Service
              </div>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold border border-border bg-surface-highlight text-text-primary">
                {asset.amcStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-text-secondary">AMC Service Provider:</span>
                <p className="font-semibold text-text-primary">{asset.amcVendorName ?? 'Not Contracted'}</p>
                {asset.amcVendorContact && (
                  <p className="font-mono text-text-secondary text-[11px]">{asset.amcVendorContact}</p>
                )}
              </div>
              <div>
                <span className="text-text-secondary">Contract Renewal Due:</span>
                <p className="font-semibold text-text-primary">{formatAssetDate(asset.amcExpiryDate)}</p>
              </div>
              <div>
                <span className="text-text-secondary">Next Scheduled Service:</span>
                <p className="font-semibold text-text-primary">{formatAssetDate(asset.nextScheduledServiceDate)}</p>
              </div>
            </div>

            {asset.notes && (
              <div className="rounded-lg bg-surface-highlight p-3 text-xs border border-border text-text-secondary mt-2">
                <strong className="text-text-primary">Maintenance Notes: </strong>
                {asset.notes}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-highlight px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print Spec Card
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onManageAmc && (
              <button
                type="button"
                onClick={() => { onClose(); onManageAmc(asset); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover motion-safe:transition-colors shadow-card"
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                Manage AMC Contract
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAssetsRegisterDetailModal;
