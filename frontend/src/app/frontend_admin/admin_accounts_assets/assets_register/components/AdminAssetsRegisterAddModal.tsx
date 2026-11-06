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
import type {
  AdminAssetCategory,
  AdminAssetAmcStatus,
  CreateAssetPayload,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import { AdminAssetsRegisterAddFormFields } from './AdminAssetsRegisterAddFormFields';

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
            <div className="rounded-md bg-destructive-bg p-2.5 text-xs font-medium text-destructive">
              {validationError}
            </div>
          )}

          <AdminAssetsRegisterAddFormFields
            assetCode={assetCode}
            setAssetCode={setAssetCode}
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
            branchId={branchId}
            setBranchId={setBranchId}
            branches={branches}
            locationWithinBranch={locationWithinBranch}
            setLocationWithinBranch={setLocationWithinBranch}
            purchaseCostRupees={purchaseCostRupees}
            setPurchaseCostRupees={setPurchaseCostRupees}
            purchaseDate={purchaseDate}
            setPurchaseDate={setPurchaseDate}
            warrantyExpiryDate={warrantyExpiryDate}
            setWarrantyExpiryDate={setWarrantyExpiryDate}
            vendorName={vendorName}
            setVendorName={setVendorName}
            vendorContact={vendorContact}
            setVendorContact={setVendorContact}
            amcStatus={amcStatus}
            setAmcStatus={setAmcStatus}
            serialNumber={serialNumber}
            setSerialNumber={setSerialNumber}
            notes={notes}
            setNotes={setNotes}
          />

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
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 motion-safe:transition-colors"
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
