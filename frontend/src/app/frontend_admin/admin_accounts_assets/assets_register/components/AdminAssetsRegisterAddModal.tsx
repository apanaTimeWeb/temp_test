// components/AdminAssetsRegisterAddModal.tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlusCircle, ShieldCheck } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import {
  ADMIN_ASSET_CATEGORIES,
  ADMIN_ASSET_AMC_STATUSES,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import type {
  AdminAssetCategory,
  AdminAssetAmcStatus,
  CreateAssetPayload,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

interface Props {
  isOpen: boolean;
  isSubmitting: boolean;
  branches: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (payload: CreateAssetPayload) => Promise<boolean>;
}

export function AdminAssetsRegisterAddModal({
  isOpen,
  isSubmitting,
  branches,
  onClose,
  onSubmit,
}: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  const tModal = useTranslations('ADMIN_ASSETS_REGISTER.MODAL_ADD');

  const [assetCode, setAssetCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AdminAssetCategory>('AC_HVAC');
  const [branchId, setBranchId] = useState(branches[0]?.id ?? 'br-karol-bagh');
  const [locationWithinBranch, setLocationWithinBranch] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchaseCostRupees, setPurchaseCostRupees] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState('');
  const [amcStatus, setAmcStatus] = useState<AdminAssetAmcStatus>('UNDER_WARRANTY');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const costRupees = parseFloat(purchaseCostRupees);
    if (isNaN(costRupees) || costRupees <= 0) {
      setValidationError('Please enter a valid positive purchase cost.');
      return;
    }

    const branch = branches.find((b) => b.id === branchId);
    const branchName = branch ? branch.name : 'Karol Bagh Central';

    const payload: CreateAssetPayload = {
      assetCode: assetCode.trim().toUpperCase(),
      name: name.trim(),
      category,
      branchId,
      branchName,
      locationWithinBranch: locationWithinBranch.trim(),
      purchaseDate,
      purchaseCost: Math.round(costRupees * 100),
      vendorName: vendorName.trim(),
      vendorContact: vendorContact.trim(),
      warrantyExpiryDate,
      amcStatus,
      serialNumber: serialNumber.trim() ? serialNumber.trim() : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              <DialogTitle>{tModal('TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{tModal('DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          {validationError && (
            <div className="rounded-md bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
              {validationError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            {/* Tag / Code */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-code" className="font-semibold text-foreground">
                {tModal('ASSET_CODE_LABEL')} *
              </label>
              <input
                id="modal-asset-code"
                type="text"
                required
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                placeholder={tModal('ASSET_CODE_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm uppercase font-mono"
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-name" className="font-semibold text-foreground">
                {tModal('NAME_LABEL')} *
              </label>
              <input
                id="modal-asset-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tModal('NAME_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-cat" className="font-semibold text-foreground">
                {tModal('CATEGORY_LABEL')} *
              </label>
              <select
                id="modal-asset-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as AdminAssetCategory)}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              >
                {ADMIN_ASSET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`CATEGORIES.${c}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-branch" className="font-semibold text-foreground">
                {tModal('BRANCH_LABEL')} *
              </label>
              <select
                id="modal-asset-branch"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location in Branch */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-loc" className="font-semibold text-foreground">
                {tModal('LOCATION_LABEL')} *
              </label>
              <input
                id="modal-asset-loc"
                type="text"
                required
                value={locationWithinBranch}
                onChange={(e) => setLocationWithinBranch(e.target.value)}
                placeholder={tModal('LOCATION_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Purchase Cost */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-cost" className="font-semibold text-foreground">
                {tModal('PURCHASE_COST_LABEL')} *
              </label>
              <input
                id="modal-asset-cost"
                type="number"
                step="any"
                min="1"
                required
                value={purchaseCostRupees}
                onChange={(e) => setPurchaseCostRupees(e.target.value)}
                placeholder="48000"
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm font-mono"
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-pdate" className="font-semibold text-foreground">
                {tModal('PURCHASE_DATE_LABEL')} *
              </label>
              <input
                id="modal-asset-pdate"
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Warranty Expiry Date */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-wdate" className="font-semibold text-foreground">
                {tModal('WARRANTY_EXPIRY_LABEL')} *
              </label>
              <input
                id="modal-asset-wdate"
                type="date"
                required
                value={warrantyExpiryDate}
                onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Vendor Name */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-vname" className="font-semibold text-foreground">
                {tModal('VENDOR_NAME_LABEL')} *
              </label>
              <input
                id="modal-asset-vname"
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder={tModal('VENDOR_NAME_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Vendor Contact */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-vcontact" className="font-semibold text-foreground">
                {tModal('VENDOR_CONTACT_LABEL')} *
              </label>
              <input
                id="modal-asset-vcontact"
                type="text"
                required
                value={vendorContact}
                onChange={(e) => setVendorContact(e.target.value)}
                placeholder={tModal('VENDOR_CONTACT_PLACEHOLDER')}
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              />
            </div>

            {/* Initial AMC status */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-amcstatus" className="font-semibold text-foreground">
                {tModal('AMC_STATUS_LABEL')} *
              </label>
              <select
                id="modal-asset-amcstatus"
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

            {/* Serial Number */}
            <div className="space-y-1">
              <label htmlFor="modal-asset-serial" className="font-semibold text-foreground">
                {tModal('SERIAL_LABEL')}
              </label>
              <input
                id="modal-asset-serial"
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="FTKF50TV16U-001"
                className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 text-xs">
            <label htmlFor="modal-asset-notes" className="font-semibold text-foreground">
              {tModal('NOTES_LABEL')}
            </label>
            <textarea
              id="modal-asset-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Free 4th quarter servicing included by vendor"
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm"
            />
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
              <span>{isSubmitting ? 'Registering...' : tModal('SUBMIT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAssetsRegisterAddModal;

