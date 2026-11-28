'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import {
  ManagerAssetsRegisterCategorySelector,
  ManagerAssetsRegisterStatusSelector,
  type CategoryType,
  type StatusType,
} from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_dialogs/ManagerAssetsRegisterOptionSelectors';
import '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_styles/ManagerAssetsRegisterStyles.css';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import {
  managerAssetsRegisterAssetFormSchema,
  type ManagerAssetsRegisterAssetFormData,
} from '@/app/frontend_manager/manager_accounts_assets/assets_register/schemas/ManagerAssetsRegisterAssetFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { IndianRupee, Plus, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ManagerAssetsRegisterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: ManagerAssetsRegisterAsset) => void;
}

export function ManagerAssetsRegisterAddModal({ isOpen, onClose, onAddAsset }: ManagerAssetsRegisterAddModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Appliance');
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('active');

  const {
    register,
    handleSubmit,
    setValue,
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
      setSelectedCategory('Appliance');
      setSelectedStatus('active');
      reset({
        name: '',
        category: 'Appliance',
        purchaseValue: 0,
        location: 'North Reading Hall (AC)',
        purchaseDate: new Date().toISOString().slice(0, 10),
        status: 'active',
      });
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, reset, onClose]);

  if (!isOpen) return null;

  const onValidSubmit = (data: ManagerAssetsRegisterAssetFormData) => {
    const valInPaise = Math.round(Number(data.purchaseValue) * 100);
    onAddAsset({
      id: Date.now(),
      name: data.name.trim(),
      category: data.category,
      purchaseDate: data.purchaseDate,
      purchaseValue: valInPaise,
      currentValue: valInPaise,
      location: data.location.trim() || 'Main Branch Hall',
      status: data.status,
    });
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 motion-safe:animate-in fade-in motion-safe:duration-fast"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-asset-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 id="add-asset-title" className="text-base font-bold text-primary">Add Library Physical Asset</h2>
              <p className="text-xs text-secondary mt-0.5">Register asset into branch inventory with tracking parameters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover motion-safe:transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4" noValidate>
          <ManagerAssetsRegisterCategorySelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setValue={setValue}
            errorMessage={errors.category?.message}
          />

          <div>
            <label htmlFor="asset-name" className="text-xs font-semibold text-secondary block mb-1">Asset Name / Model Description *</label>
            <input
              maxLength={30}
              id="asset-name"
              type="text"
              className={`mgr-input w-full text-xs ${errors.name ? 'border-danger' : ''}`}
              placeholder="e.g. Daikin Inverter Split AC 1.5 Ton"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'asset-name-error' : undefined}
              {...register('name')}
            />
            {errors.name && (
              <p id="asset-name-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="asset-value" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
                <IndianRupee size={13} className="text-emerald-500" />
                Purchase Cost (INR) *
              </label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                <input
                  maxLength={30}
                  id="asset-value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`mgr-input pl-8 w-full text-xs font-mono font-bold ${errors.purchaseValue ? 'border-danger' : ''}`}
                  placeholder="0.00"
                  aria-invalid={Boolean(errors.purchaseValue)}
                  aria-describedby={errors.purchaseValue ? 'asset-value-error' : undefined}
                  {...register('purchaseValue')}
                />
              </div>
              {errors.purchaseValue && (
                <p id="asset-value-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">{errors.purchaseValue.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="asset-date" className="text-xs font-semibold text-secondary block mb-1">Purchase Date *</label>
              <input
                maxLength={30}
                id="asset-date"
                type="date"
                className={`mgr-input w-full text-xs ${errors.purchaseDate ? 'border-danger' : ''}`}
                aria-invalid={Boolean(errors.purchaseDate)}
                aria-describedby={errors.purchaseDate ? 'asset-date-error' : undefined}
                {...register('purchaseDate')}
              />
              {errors.purchaseDate && (
                <p id="asset-date-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">{errors.purchaseDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="asset-location" className="text-xs font-semibold text-secondary block mb-1">Installation Location *</label>
            <input
              maxLength={30}
              id="asset-location"
              type="text"
              className={`mgr-input w-full text-xs ${errors.location ? 'border-danger' : ''}`}
              placeholder="e.g. North Reading Hall / 2nd Floor Cabin 4"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? 'asset-location-error' : undefined}
              {...register('location')}
            />
            {errors.location && (
              <p id="asset-location-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">{errors.location.message}</p>
            )}
          </div>

          <ManagerAssetsRegisterStatusSelector selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} setValue={setValue} />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mar-btn-glow-indigo inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold border hover:opacity-95 motion-safe:transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <ButtonLoader icon="clipboard-list" /> : <Plus size={14} />}
              <span>{isSubmitting ? 'Registering...' : 'Register Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAssetsRegisterAddModal;
