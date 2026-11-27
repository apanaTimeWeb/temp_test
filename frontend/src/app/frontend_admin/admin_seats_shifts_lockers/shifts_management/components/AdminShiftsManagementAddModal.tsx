'use client';

import { AdminShiftsManagementAddPreview, SHIFT_ADD_PRESETS, SHIFT_BRANCH_METADATA } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementAddPreview';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { getAdminShiftsManagementCurrencySymbol } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/utils/formatAdminShiftsManagementCurrency';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { getLibraryPricingConfig, saveLibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import { AlertTriangle, Building2, CheckCircle2, Clock, IndianRupee, Info, Moon, ShieldCheck, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AdminShiftsManagementAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShift: (shift: AdminShiftsShift) => void;
  selectedBranchName?: string;
}

export function AdminShiftsManagementAddModal({
  isOpen,
  onClose,
  onAddShift,
  selectedBranchName,
}: AdminShiftsManagementAddModalProps) {
  const t = useTranslations('ADMIN_SHIFTS');
  const currencySymbol = getAdminShiftsManagementCurrencySymbol(useLocale());
  const { branches } = useAdminBranch();
  const [targetBranch, setTargetBranch] = useState(selectedBranchName || 'All Branches');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('12:00');
  const [capacity, setCapacity] = useState(() => {
    const meta = SHIFT_BRANCH_METADATA[selectedBranchName || 'All Branches'];
    return meta ? meta.deskCount : 24;
  });
  const [monthlyPrice, setMonthlyPrice] = useState(700);
  const [formError, setFormError] = useState<string | null>(null);

  const durationHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    let diff = (eH * 60 + eM) - (sH * 60 + sM);
    if (diff <= 0) diff += 24 * 60;
    return Math.round((diff / 60) * 10) / 10;
  }, [startTime, endTime]);

  const isOvernight = useMemo(() => {
    if (!startTime || !endTime) return false;
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    return (eH * 60 + eM) <= (sH * 60 + sM);
  }, [startTime, endTime]);

  const branchMeta = SHIFT_BRANCH_METADATA[targetBranch] || SHIFT_BRANCH_METADATA['All Branches'];
  const exceedsCapacity = targetBranch !== 'All Branches' && capacity > branchMeta.deskCount;

  const operatingHoursWarning = useMemo(() => {
    const [sH] = startTime.split(':').map(Number);
    const [eH] = endTime.split(':').map(Number);
    if (targetBranch === 'Westside Branch' && (isOvernight || sH >= 21 || eH > 21 || sH < 7)) {
      return 'Notice: Westside Branch commercial complex closes at 21:00. Night slots require facility gate clearance.';
    }
    if (targetBranch === 'North Hub' && (isOvernight || sH >= 23 || eH > 23 || sH < 6)) {
      return 'Notice: North Hub campus operates 06:00 – 23:00. Overnight access requires campus pass approval.';
    }
    return null;
  }, [targetBranch, startTime, endTime, isOvernight]);

  const timelineSegments = useMemo(() => {
    if (!startTime || !endTime) return [];
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const sMin = sH * 60 + sM;
    const eMin = eH * 60 + eM;
    const totalMin = 1440;
    if (eMin > sMin) return [{ left: (sMin / totalMin) * 100, width: ((eMin - sMin) / totalMin) * 100 }];
    return [
      { left: (sMin / totalMin) * 100, width: ((totalMin - sMin) / totalMin) * 100 },
      { left: 0, width: (eMin / totalMin) * 100 },
    ];
  }, [startTime, endTime]);

  const branchOptionsList = [
    { value: 'All Branches', title: 'All Branches', subtitle: 'Universal Shift Template' },
    ...branches.map((b) => ({ value: b.name, title: b.name, subtitle: `${b.code} · ${SHIFT_BRANCH_METADATA[b.name]?.deskCount ?? 12} Desks` })),
  ];

  const handleBranchSelect = (branchValue: string) => {
    setTargetBranch(branchValue);
    const meta = SHIFT_BRANCH_METADATA[branchValue];
    if (meta && capacity > meta.deskCount) setCapacity(meta.deskCount);
  };

  const handleApplyPreset = (preset: (typeof SHIFT_ADD_PRESETS)[0]) => {
    setName(preset.name);
    setStartTime(preset.start);
    setEndTime(preset.end);
    setMonthlyPrice(preset.price);
    const meta = SHIFT_BRANCH_METADATA[targetBranch];
    setCapacity(meta ? Math.min(preset.capacity, meta.deskCount) : preset.capacity);
  };

  const handleClose = () => {
    onClose();
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a shift title.');
      return;
    }
    const newShift: AdminShiftsShift = {
      id: String(Date.now()),
      name: name.trim(),
      startTime,
      endTime,
      occupancy: 0,
      capacity: Number(capacity) || 24,
      active: true,
      branchName: targetBranch,
      monthlyPrice: Number(monthlyPrice) || 700,
    };
    const currentConfig = getLibraryPricingConfig();
    const updatedShifts = [
      ...currentConfig.shifts.filter((s) => s.id !== newShift.name),
      { id: newShift.name, name: newShift.name, startTime: newShift.startTime, endTime: newShift.endTime, monthlyPrice: Number(monthlyPrice) || 700, hours: `${newShift.startTime} – ${newShift.endTime}`, badge: 'Custom' },
    ];
    saveLibraryPricingConfig({ ...currentConfig, shifts: updatedShifts });
    onAddShift(newShift);
    toast.success(`Shift "${newShift.name}" successfully configured for ${targetBranch}.`, { id: 'admin-shifts-add' });
    onClose();
    setName('');
    setStartTime('06:00');
    setEndTime('12:00');
    setCapacity(24);
    setMonthlyPrice(700);
    setFormError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) handleClose(); }}>
      <DialogContent className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-overlay p-6 sm:p-7 text-text-primary shadow-dialog">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                <ShieldCheck size={12} aria-hidden="true" />
                Admin Authority Only
              </span>
              <span className="text-[11px] text-text-secondary">Multi-Branch Architecture</span>
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-text-primary mt-1">Create Library Shift</DialogTitle>
            <p className="text-xs text-text-secondary mt-0.5">Configure operating hours, physical desk capacity, and pricing for your branches</p>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {formError && <p role="alert" className="rounded-xl border border-danger bg-danger-bg p-3 text-xs text-danger-text font-semibold">{formError}</p>}

          <div className="rounded-xl border border-border bg-surface-highlight p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <Building2 size={14} className="text-primary" aria-hidden="true" />
                Step 1: Branch Scope &amp; Physical Desk Allocation
              </span>
              <span className="text-[10px] text-primary font-mono">{branchMeta.maxDesksText}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {branchOptionsList.map((branchOpt) => (
                <button key={branchOpt.value} type="button" onClick={() => handleBranchSelect(branchOpt.value)} className={`flex flex-col text-left rounded-lg border p-2.5 motion-safe:transition-colors ${targetBranch === branchOpt.value ? 'border-border-focus bg-primary-subtle text-primary shadow-card' : 'border-border bg-card text-text-primary hover:bg-surface-hover'}`}>
                  <span className="text-xs font-bold leading-tight">{branchOpt.title}</span>
                  <span className="text-[10px] text-text-secondary mt-0.5">{branchOpt.subtitle}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-text-secondary">
              <Info size={13} className="text-info-text shrink-0" aria-hidden="true" />
              <span><strong>{targetBranch}:</strong> {branchMeta.timingText}.{targetBranch !== 'All Branches' && ` Maximum physical seating: ${branchMeta.deskCount} desks.`}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Step 2: Quick Shift Presets (1-Click Autofill)</span>
              <span className="text-[10px] text-text-secondary">Auto-calibrated timings</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SHIFT_ADD_PRESETS.map((p) => (
                <button key={p.name} type="button" onClick={() => handleApplyPreset(p)} className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-border-focus hover:text-text-primary motion-safe:transition-colors inline-flex items-center gap-1.5">
                  <span>{p.icon}</span>
                  <span>{p.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-text-secondary">({p.start}–{p.end})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="shift-name-input" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Shift Title <span className="text-danger-text">*</span>
            </label>
            <input maxLength={30} id="shift-name-input" type="text" required placeholder="e.g. Morning Dedicated Slot / Evening Batch" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="shift-start-time" className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 flex items-center gap-1">
                <Clock size={12} className="text-info-text" aria-hidden="true" /> Start Time
              </label>
              <input id="shift-start-time" type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono" />
            </div>
            <div>
              <label htmlFor="shift-end-time" className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1"><Clock size={12} className="text-info-text" aria-hidden="true" /> End Time</span>
                <span className="text-[10px] text-primary font-mono font-bold">{durationHours}h slot</span>
              </label>
              <input id="shift-end-time" type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono" />
            </div>
          </div>

          {isOvernight && (
            <div className="flex items-center gap-2 rounded-lg border border-purple-text bg-purple-bg px-3 py-1.5 text-xs text-purple-text">
              <Moon size={14} className="shrink-0" aria-hidden="true" />
              <span><strong>Overnight Shift Detected:</strong> This slot spans past midnight into the next calendar day ({startTime} ➜ {endTime}).</span>
            </div>
          )}

          {operatingHoursWarning && (
            <div className="flex items-center gap-2 rounded-lg border border-warning bg-warning-bg px-3 py-1.5 text-xs text-warning-text">
              <AlertTriangle size={14} className="shrink-0" aria-hidden="true" />
              <span>{operatingHoursWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="shift-capacity" className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 flex items-center justify-between">
                <span>Desk Capacity</span>
                <span className="text-[10px] font-mono">Max: {branchMeta.deskCount}</span>
              </label>
              <input id="shift-capacity" type="number" min="1" max="500" required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono" />
            </div>
            <div>
              <label htmlFor="shift-monthly-price" className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1 flex items-center gap-1">
                <IndianRupee size={12} className="text-success-text" aria-hidden="true" /> {t('baseMonthlyFeeLabel', { currency: currencySymbol })}
              </label>
              <input id="shift-monthly-price" type="number" min="0" step="50" required value={monthlyPrice} onChange={(e) => setMonthlyPrice(Number(e.target.value))} placeholder="700" className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono" />
            </div>
          </div>

          {exceedsCapacity && (
            <div className="flex items-center gap-2 rounded-lg border border-warning bg-warning-bg px-3 py-2 text-xs text-warning-text">
              <AlertTriangle size={14} className="shrink-0" aria-hidden="true" />
              <span><strong>Physical Desk Advisory:</strong> {targetBranch} only has {branchMeta.deskCount} physical desks. Setting capacity to {capacity} requires floating desks or dual-seat sharing.</span>
            </div>
          )}

          <AdminShiftsManagementAddPreview
            name={name}
            startTime={startTime}
            endTime={endTime}
            durationHours={durationHours}
            monthlyPrice={monthlyPrice}
            capacity={capacity}
            targetBranch={targetBranch}
            branchBadgeColor={branchMeta.badgeColor}
            timelineSegments={timelineSegments}
          />

          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <button type="button" className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors" onClick={handleClose}>Cancel</button>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <CheckCircle2 size={15} aria-hidden="true" /> Create Shift
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminShiftsManagementAddModal;
