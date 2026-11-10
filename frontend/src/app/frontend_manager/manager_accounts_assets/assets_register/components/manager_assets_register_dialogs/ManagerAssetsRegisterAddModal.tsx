'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, X, IndianRupee, CheckCircle } from 'lucide-react';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import {
  managerAssetsRegisterAssetFormSchema,
  type ManagerAssetsRegisterAssetFormData,
} from '../../schemas/ManagerAssetsRegisterAssetFormSchema';

interface ManagerAssetsRegisterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: ManagerAssetsRegisterAsset) => void;
}

export function ManagerAssetsRegisterAddModal({
  isOpen,
  onClose,
  onAddAsset,
}: ManagerAssetsRegisterAddModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManagerAssetsRegisterAssetFormData>({
    resolver: zodResolver(managerAssetsRegisterAssetFormSchema),
    defaultValues: {
      name: '',
      category: 'Appliance',
      purchaseValue: 0,
      location: 'North Reading Hall (AC)',
      purchaseDate: new Date().toISOString().slice(0, 10),
      status: 'active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        category: 'Appliance',
        purchaseValue: 0,
        location: 'North Reading Hall (AC)',
        purchaseDate: new Date().toISOString().slice(0, 10),
        status: 'active',
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onValidSubmit = (data: ManagerAssetsRegisterAssetFormData) => {
    const valInPaise = Math.round(Number(data.purchaseValue) * 100);
    const newAsset: ManagerAssetsRegisterAsset = {
      id: Date.now(),
      name: data.name.trim(),
      category: data.category,
      purchaseDate: data.purchaseDate,
      purchaseValue: valInPaise,
      currentValue: valInPaise,
      location: data.location.trim() || 'Main Branch Hall',
      status: data.status,
    };

    onAddAsset(newAsset);
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-asset-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <h2 id="add-asset-title" className="text-base font-bold text-primary">
              Add Library Physical Asset
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-lg hover:bg-surface-hover"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-3.5" noValidate>
          <div>
            <label htmlFor="asset-name" className="text-xs font-semibold text-primary block mb-1">
              Asset Name / Model *
            </label>
            <input
              id="asset-name"
              type="text"
              className={`mgr-input text-xs ${errors.name ? 'border-danger' : ''}`}
              placeholder="e.g. Daikin Inverter Split AC 1.5 Ton"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'asset-name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p id="asset-name-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="asset-category" className="text-xs font-semibold text-primary block mb-1">
                Category *
              </label>
              <select
                id="asset-category"
                className="mgr-select text-xs"
                {...register('category')}
              >
                <option value="Appliance">Appliance (AC, RO, Water Cooler)</option>
                <option value="Electronics">Electronics (Inverter, Wi-Fi)</option>
                <option value="Furniture">Furniture (Chairs, Desks)</option>
                <option value="Security">Security (CCTV, Biometric)</option>
              </select>
            </div>
            <div>
              <label htmlFor="asset-value" className="text-xs font-semibold text-primary block mb-1">
                Purchase Cost (INR) *
              </label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                <input
                  id="asset-value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`mgr-input pl-8 text-xs font-mono font-bold ${errors.purchaseValue ? 'border-danger' : ''}`}
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.purchaseValue)}
                  aria-describedby={errors.purchaseValue ? 'asset-value-error' : undefined}
                  {...register('purchaseValue')}
                />
              </div>
              {errors.purchaseValue && (
                <p id="asset-value-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                  {errors.purchaseValue.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="asset-location" className="text-xs font-semibold text-primary block mb-1">
                Installation Location *
              </label>
              <input
                id="asset-location"
                type="text"
                className={`mgr-input text-xs ${errors.location ? 'border-danger' : ''}`}
                placeholder="e.g. North Hall / 2nd Floor"
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? 'asset-location-error' : undefined}
                {...register('location')}
              />
              {errors.location && (
                <p id="asset-location-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="asset-date" className="text-xs font-semibold text-primary block mb-1">
                Purchase Date *
              </label>
              <input
                id="asset-date"
                type="date"
                className={`mgr-input text-xs ${errors.purchaseDate ? 'border-danger' : ''}`}
                aria-invalid={Boolean(errors.purchaseDate)}
                aria-describedby={errors.purchaseDate ? 'asset-date-error' : undefined}
                {...register('purchaseDate')}
              />
              {errors.purchaseDate && (
                <p id="asset-date-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="asset-status" className="text-xs font-semibold text-primary block mb-1">
              Initial Condition Status
            </label>
            <select
              id="asset-status"
              className="mgr-select text-xs"
              {...register('status')}
            >
              <option value="active">Active & Operational</option>
              <option value="maintenance">Under Maintenance / AMC</option>
              <option value="disposed">Disposed / Decommissioned</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="mgr-btn-ghost text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mgr-btn-primary text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle size={14} /> Register Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAssetsRegisterAddModal;
