'use client';

import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { MANAGER_ACCOUNTING_SAMPLE_ASSETS } from '@/app/frontend_manager/manager_accounts_assets/assets_register/mocks/manager_assets_register_fixtures/ManagerAssetsRegisterAssetSampleFixtures';
import { SearchableCombobox,type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { zodResolver } from '@hookform/resolvers/zod';
import {AlertTriangle, Building2, Calendar, CheckCircle2, ClipboardList, Clock, IndianRupee, ShieldAlert, Wrench, X} from 'lucide-react';
import { useEffect,useMemo,useState } from 'react';
import { useForm } from 'react-hook-form';
import {
managerAssetsMaintenanceOrderSchema,
type ManagerAssetsMaintenanceOrderFormData,
} from '../schemas/ManagerAssetsMaintenanceSchema';
import type { MaintenanceLogItem } from './ManagerAssetsMaintenanceTable';

interface ManagerAssetsMaintenanceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (newLog: MaintenanceLogItem) => void;
}

type PriorityOption = 'routine' | 'urgent' | 'emergency';
type TypeOption = 'preventive' | 'breakdown' | 'inspection';

export function ManagerAssetsMaintenanceAddModal({
  isOpen,
  onClose,
  onAddOrder,
}: ManagerAssetsMaintenanceAddModalProps) {
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

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, reset, onClose]);

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
    const costRupees = Number(data.cost) || 0;
    const costMinorUnits = Math.round(costRupees * 100);

    const newLog: MaintenanceLogItem = {
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
    };
    onAddOrder(newLog);
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-maintenance-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Wrench size={20} />
            </div>
            <div>
              <h2 id="add-maintenance-title" className="text-base font-bold text-primary">
                Log Maintenance Request
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Register a new asset repair or routine service ticket
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
          {/* Priority Level Selectable Boxes */}
          <div>
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-2">
              <ShieldAlert size={14} className="text-amber-500" />
              Ticket Priority *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: 'routine',
                    label: 'Routine',
                    sub: 'Standard Check',
                    activeStyle: {
                      boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
                      backgroundColor: '#10b981',
                      borderColor: '#34d399',
                      color: '#ffffff',
                    },
                    icon: CheckCircle2,
                  },
                  {
                    id: 'urgent',
                    label: 'Urgent',
                    sub: 'Impacting Ops',
                    activeStyle: {
                      boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
                      backgroundColor: '#f59e0b',
                      borderColor: '#fbbf24',
                      color: '#000000',
                    },
                    icon: Clock,
                  },
                  {
                    id: 'emergency',
                    label: 'Emergency',
                    sub: 'Critical Failure',
                    activeStyle: {
                      boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)',
                      backgroundColor: '#ef4444',
                      borderColor: '#f87171',
                      color: '#ffffff',
                    },
                    icon: AlertTriangle,
                  },
                ] as const
              ).map((p) => {
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
                    style={isSelected ? p.activeStyle : undefined}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'font-bold border'
                        : 'border-border bg-surface-highlight/50 hover:bg-surface-hover text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon size={16} className="mb-1 shrink-0" />
                    <span className="text-xs font-bold leading-tight">{p.label}</span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isSelected && p.id === 'urgent' ? 'text-black/80' : isSelected ? 'text-white/80' : 'text-secondary'
                      }`}
                    >
                      {p.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Maintenance Type Selectable Boxes */}
          <div>
            <label className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-2">
              <ClipboardList size={14} className="text-sky-500" />
              Maintenance Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: 'preventive',
                    label: 'Preventive',
                    sub: 'Scheduled Service',
                    activeStyle: {
                      boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
                      backgroundColor: '#0ea5e9',
                      borderColor: '#38bdf8',
                      color: '#ffffff',
                    },
                  },
                  {
                    id: 'breakdown',
                    label: 'Breakdown',
                    sub: 'Repair Required',
                    activeStyle: {
                      boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
                      backgroundColor: '#a855f7',
                      borderColor: '#c084fc',
                      color: '#ffffff',
                    },
                  },
                  {
                    id: 'inspection',
                    label: 'Inspection',
                    sub: 'Safety Audit',
                    activeStyle: {
                      boxShadow: '0 0 16px rgba(20, 184, 166, 0.45)',
                      backgroundColor: '#14b8a6',
                      borderColor: '#2dd4bf',
                      color: '#ffffff',
                    },
                  },
                ] as const
              ).map((t) => {
                const isSelected = selectedType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.id);
                      setValue('maintenanceType', t.id);
                    }}
                    style={isSelected ? t.activeStyle : undefined}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'font-bold border'
                        : 'border-border bg-surface-highlight/50 hover:bg-surface-hover text-secondary hover:text-primary'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{t.label}</span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-secondary'
                      }`}
                    >
                      {t.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asset Selection */}
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

          {/* Issue Description */}
          <div>
            <label htmlFor="maintenance-issue" className="text-xs font-semibold text-secondary block mb-1">
              Issue Description / Service Scope *
            </label>
            <textarea maxLength={1000}
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

          {/* Vendor and Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="maintenance-vendor" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
                <Building2 size={13} className="text-primary" />
                Assigned Vendor (Optional)
              </label>
              <input maxLength={30}
                id="maintenance-vendor"
                type="text"
                placeholder="e.g. Daikin Care Services"
                className="mgr-input w-full text-xs"
                {...register('vendor')}
              />
            </div>
            <div>
              <label htmlFor="maintenance-cost" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
                <IndianRupee size={13} className="text-emerald-500" />
                Estimated Cost (₹) (Optional)
              </label>
              <input maxLength={30}
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

          {/* Auto-Post to Operating Expenses Ledger */}
          {Number(watch('cost')) > 0 && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-300 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPostToExpenses}
                    onChange={(e) => setAutoPostToExpenses(e.target.checked)}
                    className="rounded border-border text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Auto-Post to Operating Expenses</span>
                </label>
                <span className="text-xs text-emerald-300 font-mono font-bold">
                  ₹{Number(watch('cost')).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed pl-6">
                Automatically logs a "Maintenance" expense voucher into Operating Expenses so repair costs are never omitted from accounts ledger.
              </p>

              {autoPostToExpenses && (
                <div className="pl-6 pt-1 flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-[11px] text-secondary font-medium">Expense Fund Source:</span>
                  <button
                    type="button"
                    onClick={() => setExpensePaymentSource('petty_cash')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      expensePaymentSource === 'petty_cash'
                        ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-xs'
                        : 'bg-card text-secondary border-border'
                    }`}
                  >
                    Petty Cash Float
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpensePaymentSource('bank_direct')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      expensePaymentSource === 'bank_direct'
                        ? 'bg-sky-500/25 text-sky-300 border-sky-500/40 shadow-xs'
                        : 'bg-card text-secondary border-border'
                    }`}
                  >
                    Bank / Owner Direct
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Scheduled Date */}
          <div>
            <label htmlFor="maintenance-scheduledDate" className="text-xs font-semibold text-secondary flex items-center gap-1.5 mb-1">
              <Calendar size={13} className="text-primary" />
              Scheduled Date *
            </label>
            <input maxLength={30}
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
