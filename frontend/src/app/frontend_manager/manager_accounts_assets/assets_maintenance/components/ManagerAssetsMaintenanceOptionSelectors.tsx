'use client';

import '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceStyles.css';
import type { ManagerAssetsMaintenanceOrderFormData } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/schemas/ManagerAssetsMaintenanceSchema';
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, ShieldAlert } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';

export type PriorityOption = 'routine' | 'urgent' | 'emergency';
export type TypeOption = 'preventive' | 'breakdown' | 'inspection';

const PRIORITY_OPTIONS = [
  { id: 'routine' as const, label: 'Routine', sub: 'Standard Check', activeClass: 'mm-pill-routine-active', icon: CheckCircle2 },
  { id: 'urgent' as const, label: 'Urgent', sub: 'Impacting Ops', activeClass: 'mm-pill-urgent-active', icon: Clock },
  { id: 'emergency' as const, label: 'Emergency', sub: 'Critical Failure', activeClass: 'mm-pill-emergency-active', icon: AlertTriangle },
];

const TYPE_OPTIONS = [
  { id: 'preventive' as const, label: 'Preventive', sub: 'Scheduled Service', activeClass: 'mm-pill-preventive-active' },
  { id: 'breakdown' as const, label: 'Breakdown', sub: 'Repair Required', activeClass: 'mm-pill-breakdown-active' },
  { id: 'inspection' as const, label: 'Inspection', sub: 'Safety Audit', activeClass: 'mm-pill-inspection-active' },
];

interface ManagerAssetsMaintenanceOptionSelectorsProps {
  selectedPriority: PriorityOption;
  setSelectedPriority: (val: PriorityOption) => void;
  selectedType: TypeOption;
  setSelectedType: (val: TypeOption) => void;
  setValue: UseFormSetValue<ManagerAssetsMaintenanceOrderFormData>;
}

export function ManagerAssetsMaintenanceOptionSelectors({
  selectedPriority,
  setSelectedPriority,
  selectedType,
  setSelectedType,
  setValue,
}: ManagerAssetsMaintenanceOptionSelectorsProps) {
  return (
    <>
      <div>
        <label className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-2">
          <ShieldAlert size={14} className="text-amber-500" />
          Ticket Priority *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITY_OPTIONS.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPriority === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPriority(p.id);
                  setValue('priority', p.id);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center motion-safe:transition-all cursor-pointer ${
                  isSelected
                    ? `${p.activeClass} font-bold`
                    : 'border-border bg-surface-highlight hover:bg-surface-hover text-secondary hover:text-primary'
                }`}
              >
                <Icon size={16} className="mb-1 shrink-0" />
                <span className="text-xs font-bold leading-tight">{p.label}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected && p.id === 'urgent' ? 'text-black' : isSelected ? 'text-white opacity-80' : 'text-secondary'}`}>
                  {p.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-2">
          <ClipboardList size={14} className="text-sky-500" />
          Maintenance Type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TYPE_OPTIONS.map((t) => {
            const isSelected = selectedType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSelectedType(t.id);
                  setValue('maintenanceType', t.id);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center motion-safe:transition-all cursor-pointer ${
                  isSelected
                    ? `${t.activeClass} font-bold`
                    : 'border-border bg-surface-highlight hover:bg-surface-hover text-secondary hover:text-primary'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{t.label}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-white opacity-80' : 'text-secondary'}`}>{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
