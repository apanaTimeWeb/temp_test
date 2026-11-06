'use client';

import { useTranslations } from 'next-intl';
import {
  ADMIN_ASSET_CATEGORIES,
  ADMIN_ASSET_AMC_STATUSES,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import type {
  AdminAssetCategory,
  AdminAssetAmcStatus,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

interface AdminAssetsRegisterAddFormFieldsProps {
  assetCode: string;
  setAssetCode: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  category: AdminAssetCategory;
  setCategory: (val: AdminAssetCategory) => void;
  branchId: string;
  setBranchId: (val: string) => void;
  branches: Array<{ id: string; name: string }>;
  locationWithinBranch: string;
  setLocationWithinBranch: (val: string) => void;
  purchaseCostRupees: string;
  setPurchaseCostRupees: (val: string) => void;
  purchaseDate: string;
  setPurchaseDate: (val: string) => void;
  warrantyExpiryDate: string;
  setWarrantyExpiryDate: (val: string) => void;
  vendorName: string;
  setVendorName: (val: string) => void;
  vendorContact: string;
  setVendorContact: (val: string) => void;
  amcStatus: AdminAssetAmcStatus;
  setAmcStatus: (val: AdminAssetAmcStatus) => void;
  serialNumber: string;
  setSerialNumber: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export function AdminAssetsRegisterAddFormFields({
  assetCode,
  setAssetCode,
  name,
  setName,
  category,
  setCategory,
  branchId,
  setBranchId,
  branches,
  locationWithinBranch,
  setLocationWithinBranch,
  purchaseCostRupees,
  setPurchaseCostRupees,
  purchaseDate,
  setPurchaseDate,
  warrantyExpiryDate,
  setWarrantyExpiryDate,
  vendorName,
  setVendorName,
  vendorContact,
  setVendorContact,
  amcStatus,
  setAmcStatus,
  serialNumber,
  setSerialNumber,
  notes,
  setNotes,
}: AdminAssetsRegisterAddFormFieldsProps) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  const tModal = useTranslations('ADMIN_ASSETS_REGISTER.MODAL_ADD');

  return (
    <>
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
    </>
  );
}

export default AdminAssetsRegisterAddFormFields;

