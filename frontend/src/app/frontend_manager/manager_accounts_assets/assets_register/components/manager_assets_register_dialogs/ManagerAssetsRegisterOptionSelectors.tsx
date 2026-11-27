'use client';

import '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_styles/ManagerAssetsRegisterStyles.css';
import type { ManagerAssetsRegisterAssetFormData } from '@/app/frontend_manager/manager_accounts_assets/assets_register/schemas/ManagerAssetsRegisterAssetFormSchema';
import { Archive, Armchair, Camera, CheckCircle2, Cpu, Package, Wrench } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';

export type CategoryType = 'Appliance' | 'Electronics' | 'Furniture' | 'Security';
export type StatusType = 'active' | 'maintenance' | 'disposed';

export const ASSET_CATEGORIES = [
  { id: 'Appliance' as const, label: 'Appliance', sub: 'AC, RO, Cooler', icon: Package, activeClass: 'mar-pill-appliance-active' },
  { id: 'Electronics' as const, label: 'Electronics', sub: 'Inverter, Wi-Fi', icon: Cpu, activeClass: 'mar-pill-electronics-active' },
  { id: 'Furniture' as const, label: 'Furniture', sub: 'Chairs, Desks', icon: Armchair, activeClass: 'mar-pill-furniture-active' },
  { id: 'Security' as const, label: 'Security', sub: 'CCTV, Biometric', icon: Camera, activeClass: 'mar-pill-security-active' },
];

export const ASSET_STATUSES = [
  { id: 'active' as const, label: 'Active', sub: 'Operational', icon: CheckCircle2, activeClass: 'mar-pill-active-state' },
  { id: 'maintenance' as const, label: 'Maintenance', sub: 'Under Repair', icon: Wrench, activeClass: 'mar-pill-maintenance-state' },
  { id: 'disposed' as const, label: 'Disposed', sub: 'Decommissioned', icon: Archive, activeClass: 'mar-pill-disposed-state' },
];

export function ManagerAssetsRegisterCategorySelector({
  selectedCategory,
  setSelectedCategory,
  setValue,
  errorMessage,
}: {
  selectedCategory: CategoryType;
  setSelectedCategory: (val: CategoryType) => void;
  setValue: UseFormSetValue<ManagerAssetsRegisterAssetFormData>;
  errorMessage?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-2">
        <Package size={14} className="text-primary" />
        Asset Category *
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ASSET_CATEGORIES.map((cat) => {
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
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center motion-safe:transition-all cursor-pointer ${
                isSelected ? `${cat.activeClass} font-bold` : 'border-border bg-surface-highlight hover:bg-surface-hover text-secondary hover:text-primary'
              }`}
            >
              <Icon size={16} className="mb-1 shrink-0" />
              <span className="text-xs font-bold leading-tight">{cat.label}</span>
              <span className={`text-[9px] mt-0.5 ${isSelected && cat.id === 'Furniture' ? 'text-black' : isSelected ? 'text-white opacity-80' : 'text-secondary'}`}>
                {cat.sub}
              </span>
            </button>
          );
        })}
      </div>
      {errorMessage && (
        <p id="asset-category-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export function ManagerAssetsRegisterStatusSelector({
  selectedStatus,
  setSelectedStatus,
  setValue,
}: {
  selectedStatus: StatusType;
  setSelectedStatus: (val: StatusType) => void;
  setValue: UseFormSetValue<ManagerAssetsRegisterAssetFormData>;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-secondary block mb-2">Initial Operational Condition *</label>
      <div className="grid grid-cols-3 gap-2">
        {ASSET_STATUSES.map((st) => {
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
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center motion-safe:transition-all cursor-pointer ${
                isSelected ? `${st.activeClass} font-bold` : 'border-border bg-surface-highlight hover:bg-surface-hover text-secondary hover:text-primary'
              }`}
            >
              <Icon size={15} className="mb-1 shrink-0" />
              <span className="text-xs font-bold leading-tight">{st.label}</span>
              <span className={`text-[9px] mt-0.5 ${isSelected && st.id === 'maintenance' ? 'text-black' : isSelected ? 'text-white opacity-80' : 'text-secondary'}`}>
                {st.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
