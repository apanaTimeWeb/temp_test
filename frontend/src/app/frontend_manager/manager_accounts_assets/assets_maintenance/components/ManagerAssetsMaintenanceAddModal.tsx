'use client';

import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, X } from 'lucide-react';
import type { MaintenanceLogItem } from './ManagerAssetsMaintenanceTable';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS } from '@/app/frontend_manager/manager_accounts_assets/assets_register/mocks/manager_assets_register_fixtures/ManagerAssetsRegisterAssetSampleFixtures';
import {
  managerAssetsMaintenanceOrderSchema,
  type ManagerAssetsMaintenanceOrderFormData,
} from '../schemas/ManagerAssetsMaintenanceSchema';

interface ManagerAssetsMaintenanceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newLog: MaintenanceLogItem) => void;
}

export function ManagerAssetsMaintenanceAddModal({
  isOpen,
  onClose,
  onAddOrder,
}: ManagerAssetsMaintenanceAddModalProps) {
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
    },
  });

  const selectedAssetName = watch('assetName');

  useEffect(() => {
    if (isOpen) {
      reset({
        assetName: '',
        issue: '',
        vendor: '',
        cost: 0,
        scheduledDate: new Date().toISOString().slice(0, 10),
      });
    }
  }, [isOpen, reset]);

  const assetOptions: ComboboxOption[] = useMemo(() => {
    return MANAGER_ACCOUNTING_SAMPLE_ASSETS.map((a) => ({
      value: a.name,
      label: a.name,
      subLabel: `${a.category} · Location: ${a.location}`,
      badge: a.status,
    }));
  }, []);

  if (!isOpen) return null;

  const onValidSubmit = (data: ManagerAssetsMaintenanceOrderFormData) => {
    const newLog: MaintenanceLogItem = {
      id: Date.now(),
      assetName: data.assetName.trim(),
      issue: data.issue.trim(),
      reportedDate: new Date().toISOString().slice(0, 10),
      scheduledDate: data.scheduledDate,
      vendor: data.vendor?.trim() || 'Internal Technician',
      cost: Number(data.cost) || 0,
      status: 'pending',
    };
    onAddOrder(newLog);
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-maintenance-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning-bg text-warning border border-border flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <h2 id="add-maintenance-title" className="text-base font-bold text-primary">
              Log Maintenance Request
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

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-3" noValidate>
          <div>
            <label htmlFor="assetName-combobox" className="text-xs font-semibold text-secondary block mb-1">
              Select Registered Asset *
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
              Issue Description *
            </label>
            <textarea
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="maintenance-vendor" className="text-xs font-semibold text-secondary block mb-1">
                Assigned Vendor (Optional)
              </label>
              <input
                id="maintenance-vendor"
                type="text"
                placeholder="e.g. Daikin Care Services"
                className="mgr-input w-full text-xs"
                {...register('vendor')}
              />
            </div>
            <div>
              <label htmlFor="maintenance-cost" className="text-xs font-semibold text-secondary block mb-1">
                Estimated Cost (₹) (Optional)
              </label>
              <input
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

          <div>
            <label htmlFor="maintenance-scheduledDate" className="text-xs font-semibold text-secondary block mb-1">
              Scheduled Date *
            </label>
            <input
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
              className="mgr-btn-ghost text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mgr-btn-primary text-xs cursor-pointer disabled:opacity-50"
            >
              Log Maintenance Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerAssetsMaintenanceAddModal;
