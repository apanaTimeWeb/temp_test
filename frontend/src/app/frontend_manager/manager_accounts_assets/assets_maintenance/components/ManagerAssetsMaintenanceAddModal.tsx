'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerAssetsMaintenanceAutoExpenseCard } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceAutoExpenseCard';
import {
  ManagerAssetsMaintenanceOptionSelectors,
  type PriorityOption,
  type TypeOption,
} from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceOptionSelectors';
import '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceStyles.css';
import type { MaintenanceLogItem } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTable';
import { MANAGER_ASSETS_MAINTENANCE_DEMO_ASSETS } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/config/manager_assets_maintenance.demo_data';
import {
  managerAssetsMaintenanceOrderSchema,
  type ManagerAssetsMaintenanceOrderFormData,
} from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/schemas/ManagerAssetsMaintenanceSchema';
import { MAINTENANCE_CURRENCY_SYMBOL } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/utils/ManagerAssetsMaintenanceExportHelpers';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Calendar, IndianRupee, Wrench, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ManagerAssetsMaintenanceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newLog: MaintenanceLogItem) => void;
}

export function ManagerAssetsMaintenanceAddModal({ isOpen, onClose, onAddOrder }: ManagerAssetsMaintenanceAddModalProps) {
  const [selectedPriority, setSelectedPriority] = useState<PriorityOption>('routine');
  const [selectedType, setSelectedType] = useState<TypeOption>('preventive');
  const [autoPostToExpenses, setAutoPostToExpenses] = useState<boolean>(true);
  const [expensePaymentSource, setExpensePaymentSource] = useState<'petty_cash' | 'bank_direct'>('petty_cash');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManagerAssetsMaintenanceOrderFormData>({
    resolver: zodResolver(managerAssetsMaintenanceOrderSchema),
    defaultValues: {
      assetName: '',
      issue: '',
      vendor: '',
      cost: 0,
      scheduledDate: new Date().toISOString().slice(0, 10),
      priority: 'routine',
      maintenanceType: 'preventive',
    },
  });

  const selectedAssetName = watch('assetName');

  useEffect(() => {
    if (isOpen) {
      setSelectedPriority('routine');
      setSelectedType('preventive');
      reset({
        assetName: '',
        issue: '',
        vendor: '',
        cost: 0,
        scheduledDate: new Date().toISOString().slice(0, 10),
        priority: 'routine',
        maintenanceType: 'preventive',
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

  const assetOptions: ComboboxOption[] = useMemo(
    () =>
      MANAGER_ASSETS_MAINTENANCE_DEMO_ASSETS.map((a) => ({
        value: a.name,
        label: a.name,
        subLabel: `${a.category} · Location: ${a.location}`,
        badge: a.status,
      })),
    []
  );

  if (!isOpen) return null;

  const onValidSubmit = (data: ManagerAssetsMaintenanceOrderFormData) => {
    const costRupees = Number(data.cost) || 0;
    const costMinorUnits = Math.round(costRupees * 100);
    onAddOrder({
      id: Date.now(),
      assetName: data.assetName.trim(),
      issue: data.issue.trim(),
      reportedDate: new Date().toISOString().slice(0, 10),
      scheduledDate: data.scheduledDate,
      vendor: data.vendor?.trim() || 'Internal Maintenance Staff',
      cost: costMinorUnits,
      status: 'pending',
      priority: selectedPriority,
      type: selectedType,
      autoPostToExpenses: costMinorUnits > 0 ? autoPostToExpenses : false,
      expensePaymentSource: costMinorUnits > 0 ? expensePaymentSource : undefined,
    });
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 motion-safe:animate-in fade-in motion-safe:duration-fast"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-maintenance-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Wrench size={20} />
            </div>
            <div>
              <h2 id="add-maintenance-title" className="text-base font-bold text-primary">Log Maintenance Request</h2>
              <p className="text-xs text-secondary mt-0.5">Register a new asset repair or routine service ticket</p>
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
          <ManagerAssetsMaintenanceOptionSelectors
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            setValue={setValue}
          />

          <div>
            <label htmlFor="assetName-combobox" className="text-xs font-semibold text-secondary flex items-center justify-between mb-1">
              <span>Select Registered Asset *</span>
              <span className="text-[11px] text-secondary font-normal">Choose from Asset Register</span>
            </label>
            <SearchableCombobox
              id="assetName-combobox"
              options={assetOptions}
              value={selectedAssetName}
              onChange={(val) => setValue('assetName', val, { shouldValidate: true })}
              placeholder="Search library assets (e.g. AC Unit, CCTV, Water Purifier)..."
              searchPlaceholder="Type asset name or category..."
              aria-label="Select registered library asset for maintenance"
            />
            {errors.assetName && (
              <p id="assetName-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                {errors.assetName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="maintenance-issue" className="text-xs font-semibold text-secondary block mb-1">
              Issue Description / Service Scope *
            </label>
            <textarea
              maxLength={1000}
              id="maintenance-issue"
              rows={2}
              placeholder="Describe breakdown or routine servicing requirement..."
              className={`mgr-input w-full mt-1 text-xs ${errors.issue ? 'border-danger' : ''}`}
              aria-invalid={Boolean(errors.issue)}
              aria-describedby={errors.issue ? 'issue-error' : undefined}
              {...register('issue')}
            />
            {errors.issue && (
              <p id="issue-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                {errors.issue.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="maintenance-vendor" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
                <Building2 size={13} className="text-primary" />
                Assigned Vendor (Optional)
              </label>
              <input maxLength={30} id="maintenance-vendor" type="text" placeholder="e.g. Daikin Care Services" className="mgr-input w-full text-xs" {...register('vendor')} />
            </div>
            <div>
              <label htmlFor="maintenance-cost" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
                <IndianRupee size={13} className="text-emerald-500" />
                {`Estimated Cost (${MAINTENANCE_CURRENCY_SYMBOL}) (Optional)`}
              </label>
              <input
                maxLength={30}
                id="maintenance-cost"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 1500"
                className={`mgr-input w-full text-xs ${errors.cost ? 'border-danger' : ''}`}
                aria-invalid={Boolean(errors.cost)}
                aria-describedby={errors.cost ? 'cost-error' : undefined}
                {...register('cost')}
              />
              {errors.cost && (
                <p id="cost-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                  {errors.cost.message}
                </p>
              )}
            </div>
          </div>

          <ManagerAssetsMaintenanceAutoExpenseCard
            costValue={Number(watch('cost')) || 0}
            autoPostToExpenses={autoPostToExpenses}
            setAutoPostToExpenses={setAutoPostToExpenses}
            expensePaymentSource={expensePaymentSource}
            setExpensePaymentSource={setExpensePaymentSource}
          />

          <div>
            <label htmlFor="maintenance-scheduledDate" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
              <Calendar size={13} className="text-primary" />
              Scheduled Date *
            </label>
            <input
              maxLength={30}
              id="maintenance-scheduledDate"
              type="date"
              className={`mgr-input w-full text-xs ${errors.scheduledDate ? 'border-danger' : ''}`}
              aria-invalid={Boolean(errors.scheduledDate)}
              aria-describedby={errors.scheduledDate ? 'scheduledDate-error' : undefined}
              {...register('scheduledDate')}
            />
            {errors.scheduledDate && (
              <p id="scheduledDate-error" role="alert" className="text-danger text-[11px] mt-1 font-medium">
                {errors.scheduledDate.message}
              </p>
            )}
          </div>

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
              className="mm-btn-glow-indigo inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold border hover:opacity-95 motion-safe:transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <ButtonLoader icon="wrench" /> : <Wrench size={14} />}
              <span>{isSubmitting ? 'Logging...' : 'Log Maintenance Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAssetsMaintenanceAddModal;
