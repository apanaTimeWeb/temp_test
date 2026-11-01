// components/AdminAssetsRegisterAmcModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, CalendarClock } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import { ADMIN_ASSET_AMC_STATUSES } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import type {
  AdminAssetRecord,
  AdminAssetAmcStatus,
  UpdateAmcPayload,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatAssetDate,
  getDaysUntilExpiry,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';

interface Props {
  asset: AdminAssetRecord | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateAmcPayload) => Promise<boolean>;
}

export function AdminAssetsRegisterAmcModal({
  asset,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  const tModal = useTranslations('ADMIN_ASSETS_REGISTER.MODAL_AMC');

  const [amcStatus, setAmcStatus] = useState<AdminAssetAmcStatus>('ACTIVE_AMC');
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (asset) {
      setAmcStatus(asset.amcStatus);
      setVendorName(asset.amcVendorName ?? asset.vendorName);
      setVendorContact(asset.amcVendorContact ?? asset.vendorContact);
      setExpiryDate(asset.amcExpiryDate ?? asset.warrantyExpiryDate);
      setNextServiceDate(asset.nextScheduledServiceDate ?? '');
      setNotes(asset.notes ?? '');
    }
  }, [asset]);

  if (!asset) return null;

  const daysUntilWarranty = getDaysUntilExpiry(asset.warrantyExpiryDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateAmcPayload = {
      assetId: asset.id,
      amcStatus,
      amcVendorName: vendorName.trim(),
      amcVendorContact: vendorContact.trim(),
      amcExpiryDate: expiryDate,
      nextScheduledServiceDate: nextServiceDate.trim() ? nextServiceDate : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <DialogTitle>{tModal('TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{tModal('DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          {/* Asset Context Snapshot */}
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{asset.name}</span>
              <span className="font-mono text-muted-foreground">{asset.assetCode}</span>
            </div>
            <div className="text-muted-foreground flex justify-between">
              <span>Branch: {asset.branchName} ({asset.locationWithinBranch})</span>
              <span>OEM Warranty: {formatAssetDate(asset.warrantyExpiryDate)}</span>
            </div>
            {daysUntilWarranty !== null && daysUntilWarranty <= 30 && (
              <div className="rounded bg-amber-500/10 p-1.5 text-amber-700 dark:text-amber-300 font-medium">
                ⚠️ OEM Warranty expires in {daysUntilWarranty} days. Free service check is available!
              </div>
            )}
          </div>

          <div className="space-y-3 text-xs">
            {/* AMC Status */}
            <div className="space-y-1">
              <label htmlFor="amc-status" className="font-semibold text-foreground">
                {tModal('AMC_STATUS_LABEL')} *
              </label>
              <select
                id="amc-status"
                value={amcStatus}
                onChange={(e) => setAmcStatus(e.target.value as AdminAssetAmcStatus)}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              >
                {ADMIN_ASSET_AMC_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`AMC_STATUS.${s}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider */}
            <div className="space-y-1">
              <label htmlFor="amc-vname" className="font-semibold text-foreground">
                {tModal('AMC_VENDOR_NAME_LABEL')} *
              </label>
              <input
                id="amc-vname"
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder={tModal('AMC_VENDOR_NAME_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Contact */}
            <div className="space-y-1">
              <label htmlFor="amc-vcontact" className="font-semibold text-foreground">
                {tModal('AMC_VENDOR_CONTACT_LABEL')} *
              </label>
              <input
                id="amc-vcontact"
                type="text"
                required
                value={vendorContact}
                onChange={(e) => setVendorContact(e.target.value)}
                placeholder={tModal('AMC_VENDOR_CONTACT_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Expiry Date */}
              <div className="space-y-1">
                <label htmlFor="amc-expiry" className="font-semibold text-foreground">
                  {tModal('AMC_EXPIRY_LABEL')} *
                </label>
                <input
                  id="amc-expiry"
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
              </div>

              {/* Next Service Date */}
              <div className="space-y-1">
                <label htmlFor="amc-next-service" className="font-semibold text-foreground">
                  {tModal('NEXT_SERVICE_LABEL')}
                </label>
                <input
                  id="amc-next-service"
                  type="date"
                  value={nextServiceDate}
                  onChange={(e) => setNextServiceDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label htmlFor="amc-notes" className="font-semibold text-foreground">
                {tModal('NOTES_LABEL')}
              </label>
              <textarea
                id="amc-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={tModal('NOTES_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {tModal('CANCEL')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 motion-safe:transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isSubmitting ? 'Updating...' : tModal('SUBMIT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAssetsRegisterAmcModal;

