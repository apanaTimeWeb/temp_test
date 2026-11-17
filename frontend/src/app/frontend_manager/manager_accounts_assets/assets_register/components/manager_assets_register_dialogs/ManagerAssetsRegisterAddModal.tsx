'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  X,
  IndianRupee,
  CheckCircle,
  Package,
  Cpu,
  Armchair,
  Camera,
  CheckCircle2,
  Wrench,
  Archive,
  Sparkles,
} from 'lucide-react';
import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
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

type CategoryType = 'Appliance' | 'Electronics' | 'Furniture' | 'Security';
type StatusType = 'active' | 'maintenance' | 'disposed';

export function ManagerAssetsRegisterAddModal({
  isOpen,
  onClose,
  onAddAsset,
}: ManagerAssetsRegisterAddModalProps) {
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

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, reset, onClose]);

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

  const categories = [
    {
      id: 'Appliance' as const,
      label: 'Appliance',
      sub: 'AC, RO, Cooler',
      icon: Package,
      activeStyle: {
        boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
        backgroundColor: '#0ea5e9',
        borderColor: '#38bdf8',
        color: '#ffffff',
      },
    },
    {
      id: 'Electronics' as const,
      label: 'Electronics',
      sub: 'Inverter, Wi-Fi',
      icon: Cpu,
      activeStyle: {
        boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
        backgroundColor: '#a855f7',
        borderColor: '#c084fc',
        color: '#ffffff',
      },
    },
    {
      id: 'Furniture' as const,
      label: 'Furniture',
      sub: 'Chairs, Desks',
      icon: Armchair,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
    {
      id: 'Security' as const,
      label: 'Security',
      sub: 'CCTV, Biometric',
      icon: Camera,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
  ];

  const statuses = [
    {
      id: 'active' as const,
      label: 'Active',
      sub: 'Operational',
      icon: CheckCircle2,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
    {
      id: 'maintenance' as const,
      label: 'Maintenance',
      sub: 'Under Repair',
      icon: Wrench,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
    {
      id: 'disposed' as const,
      label: 'Disposed',
      sub: 'Decommissioned',
      icon: Archive,
      activeStyle: {
        boxShadow: '0 0 16px rgba(100, 116, 139, 0.45)',
        backgroundColor: '#64748b',
        borderColor: '#94a3b8',
        color: '#ffffff',
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-asset-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 id="add-asset-title" className="text-base font-bold text-primary">
                Add Library Physical Asset
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Register asset into branch inventory with tracking parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4" noValidate>
          {/* Category Selectable Boxes with Glowing Halos */}
          <div>
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-2">
              <Package size={14} className="text-primary" />
              Asset Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setValue('category', cat.id, { shouldValidate: true });
                    }}
                    style={isSelected ? cat.activeStyle : undefined}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'font-bold border'
                        : 'border-border bg-surface-highlight/50 hover:bg-surface-hover text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon size={16} className="mb-1 shrink-0" />
                    <span className="text-xs font-bold leading-tight">{cat.label}</span>
                    <span
                      className={`text-[9px] mt-0.5 ${
                        isSelected && cat.id === 'Furniture'
                          ? 'text-black/80'
                          : isSelected
                          ? 'text-white/80'
                          : 'text-secondary'
                      }`}
                    >
                      {cat.sub}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p id="asset-category-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Asset Name */}
          <div>
            <label htmlFor="asset-name" className="text-xs font-semibold text-secondary block mb-1">
              Asset Name / Model Description *
            </label>
            <input
              id="asset-name"
              type="text"
              className={`mgr-input w-full text-xs ${errors.name ? 'border-danger' : ''}`}
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

          {/* Value and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="asset-value" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
                <IndianRupee size={13} className="text-emerald-500" />
                Purchase Cost (INR) *
              </label>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                <input
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
                <p id="asset-value-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                  {errors.purchaseValue.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="asset-date" className="text-xs font-semibold text-secondary block mb-1">
                Purchase Date *
              </label>
              <input
                id="asset-date"
                type="date"
                className={`mgr-input w-full text-xs ${errors.purchaseDate ? 'border-danger' : ''}`}
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

          {/* Location */}
          <div>
            <label htmlFor="asset-location" className="text-xs font-semibold text-secondary block mb-1">
              Installation Location *
            </label>
            <input
              id="asset-location"
              type="text"
              className={`mgr-input w-full text-xs ${errors.location ? 'border-danger' : ''}`}
              placeholder="e.g. North Reading Hall / 2nd Floor Cabin 4"
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

          {/* Initial Condition Status Selectable Boxes */}
          <div>
            <label className="text-xs font-semibold text-secondary block mb-2">
              Initial Operational Condition *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map((st) => {
                const Icon = st.icon;
                const isSelected = selectedStatus === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(st.id);
                      setValue('status', st.id, { shouldValidate: true });
                    }}
                    style={isSelected ? st.activeStyle : undefined}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'font-bold border'
                        : 'border-border bg-surface-highlight/50 hover:bg-surface-hover text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon size={15} className="mb-1 shrink-0" />
                    <span className="text-xs font-bold leading-tight">{st.label}</span>
                    <span
                      className={`text-[9px] mt-0.5 ${
                        isSelected && st.id === 'maintenance'
                          ? 'text-black/80'
                          : isSelected
                          ? 'text-white/80'
                          : 'text-secondary'
                      }`}
                    >
                      {st.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
                backgroundColor: '#6366f1',
                borderColor: '#818cf8',
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold border hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <ButtonLoader icon="library" /> : <Sparkles size={14} />}
              <span>{isSubmitting ? 'Registering...' : 'Register Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAssetsRegisterAddModal;
