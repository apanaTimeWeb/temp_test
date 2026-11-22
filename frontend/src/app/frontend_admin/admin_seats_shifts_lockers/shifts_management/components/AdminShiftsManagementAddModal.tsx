'use client';

import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { getLibraryPricingConfig,saveLibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import { AlertTriangle,Building2,CheckCircle2,Clock,IndianRupee,Info,Moon,ShieldCheck,Sun,X } from 'lucide-react';
import { useMemo,useState } from 'react';
import { toast } from 'sonner';

interface AdminShiftsManagementAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShift: (shift: AdminShiftsShift) => void;
  selectedBranchName?: string;
}

const BRANCH_METADATA: Record<string, { deskCount: number; maxDesksText: string; timingText: string; is24x7: boolean; badgeColor: string }> = {
  'Downtown Central': {
    deskCount: 24,
    maxDesksText: '24 Physical Desks',
    timingText: '24/7 Round-the-clock operations',
    is24x7: true,
    badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  },
  'Westside Branch': {
    deskCount: 12,
    maxDesksText: '12 Physical Desks',
    timingText: '07:00 – 21:00 (Mall / Complex Hours)',
    is24x7: false,
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  'North Hub': {
    deskCount: 12,
    maxDesksText: '12 Physical Desks',
    timingText: '06:00 – 23:00 (University Area)',
    is24x7: false,
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  },
  'All Branches': {
    deskCount: 24,
    maxDesksText: 'Universal Network Template (All 3 Branches)',
    timingText: 'Applied across network with branch desk caps',
    is24x7: true,
    badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  },
};

const SHIFT_PRESETS = [
  { name: 'Morning Shift', start: '06:00', end: '12:00', price: 800, capacity: 24, icon: '🌅' },
  { name: 'Afternoon Shift', start: '12:00', end: '17:00', price: 700, capacity: 24, icon: '☀️' },
  { name: 'Evening Shift', start: '17:00', end: '22:00', price: 900, capacity: 24, icon: '🌆' },
  { name: 'Night Owl Slot', start: '22:00', end: '06:00', price: 1000, capacity: 24, icon: '🌙' },
  { name: 'Full Day Dedicated 24/7', start: '00:00', end: '23:59', price: 2000, capacity: 24, icon: '⭐' },
];

export function AdminShiftsManagementAddModal({
  isOpen,
  onClose,
  onAddShift,
  selectedBranchName,
}: AdminShiftsManagementAddModalProps) {
  const { branches } = useAdminBranch();
  const [targetBranch, setTargetBranch] = useState(selectedBranchName || 'All Branches');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('12:00');
  const [capacity, setCapacity] = useState(() => {
    const meta = BRANCH_METADATA[selectedBranchName || 'All Branches'];
    return meta ? meta.deskCount : 24;
  });
  const [monthlyPrice, setMonthlyPrice] = useState(700);
  const [formError, setFormError] = useState<string | null>(null);

  const durationHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    let diff = (eH * 60 + eM) - (sH * 60 + sM);
    if (diff <= 0) diff += 24 * 60; // overnight
    return Math.round((diff / 60) * 10) / 10;
  }, [startTime, endTime]);

  const isOvernight = useMemo(() => {
    if (!startTime || !endTime) return false;
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    return (eH * 60 + eM) <= (sH * 60 + sM);
  }, [startTime, endTime]);

  const branchMeta = BRANCH_METADATA[targetBranch] || BRANCH_METADATA['All Branches'];
  const exceedsCapacity = targetBranch !== 'All Branches' && capacity > branchMeta.deskCount;

  const operatingHoursWarning = useMemo(() => {
    if (targetBranch === 'Westside Branch') {
      const [sH] = startTime.split(':').map(Number);
      const [eH] = endTime.split(':').map(Number);
      if (isOvernight || sH >= 21 || eH > 21 || sH < 7) {
        return 'Notice: Westside Branch commercial complex closes at 21:00. Night slots require facility gate clearance.';
      }
    }
    if (targetBranch === 'North Hub') {
      const [sH] = startTime.split(':').map(Number);
      const [eH] = endTime.split(':').map(Number);
      if (isOvernight || sH >= 23 || eH > 23 || sH < 6) {
        return 'Notice: North Hub campus operates 06:00 – 23:00. Overnight access requires campus pass approval.';
      }
    }
    return null;
  }, [targetBranch, startTime, endTime, isOvernight]);

  // Visual 24-hour timeline bar calculations
  const timelineSegments = useMemo(() => {
    if (!startTime || !endTime) return [];
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const sMin = sH * 60 + sM;
    const eMin = eH * 60 + eM;
    const totalMin = 1440;

    if (eMin > sMin) {
      const left = (sMin / totalMin) * 100;
      const width = ((eMin - sMin) / totalMin) * 100;
      return [{ left, width }];
    } else {
      const part1Left = (sMin / totalMin) * 100;
      const part1Width = ((totalMin - sMin) / totalMin) * 100;
      const part2Left = 0;
      const part2Width = (eMin / totalMin) * 100;
      return [
        { left: part1Left, width: part1Width },
        { left: part2Left, width: part2Width },
      ];
    }
  }, [startTime, endTime]);

  if (!isOpen) return null;

  const branchOptionsList = [
    { value: 'All Branches', title: 'All Branches', subtitle: 'Universal Shift Template' },
    ...branches.map((b) => ({
      value: b.name,
      title: b.name,
      subtitle: `${b.code} · ${BRANCH_METADATA[b.name]?.deskCount ?? 12} Desks`,
    })),
  ];

  const handleBranchSelect = (branchValue: string) => {
    setTargetBranch(branchValue);
    const meta = BRANCH_METADATA[branchValue];
    if (meta && capacity > meta.deskCount) {
      setCapacity(meta.deskCount);
    }
  };

  const handleApplyPreset = (preset: typeof SHIFT_PRESETS[0]) => {
    setName(preset.name);
    setStartTime(preset.start);
    setEndTime(preset.end);
    setMonthlyPrice(preset.price);
    const meta = BRANCH_METADATA[targetBranch];
    setCapacity(meta ? Math.min(preset.capacity, meta.deskCount) : preset.capacity);
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

    // Sync to centralized pricing engine
    const currentConfig = getLibraryPricingConfig();
    const updatedShifts = [
      ...currentConfig.shifts.filter((s) => s.id !== newShift.name),
      {
        id: newShift.name,
        name: newShift.name,
        startTime: newShift.startTime,
        endTime: newShift.endTime,
        monthlyPrice: Number(monthlyPrice) || 700,
        hours: `${newShift.startTime} – ${newShift.endTime}`,
        badge: 'Custom',
      },
    ];
    saveLibraryPricingConfig({ ...currentConfig, shifts: updatedShifts });

    onAddShift(newShift);
    toast.success(`Shift "${newShift.name}" successfully configured for ${targetBranch}.`);
    onClose();
    setName('');
    setStartTime('06:00');
    setEndTime('12:00');
    setCapacity(24);
    setMonthlyPrice(700);
    setFormError(null);
  };

  const handleClose = () => {
    onClose();
    setFormError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-shift-dialog-title"
      onClick={handleClose}
    >
      <div
        className="relative my-8 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                <ShieldCheck size={12} />
                Admin Authority Only
              </span>
              <span className="text-[11px] text-slate-400">
                Multi-Branch Architecture
              </span>
            </div>
            <h2 id="add-shift-dialog-title" className="text-xl font-bold tracking-tight text-white mt-1">
              Create Library Shift
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure operating hours, physical desk capacity, and pricing for your 3 branches
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {formError && (
            <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 font-semibold">
              {formError}
            </p>
          )}

          {/* STEP 1: Target Branch Scope */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Building2 size={14} className="text-indigo-400" />
                Step 1: Branch Scope & Physical Desk Allocation
              </label>
              <span className="text-[10px] text-indigo-300 font-mono">
                {branchMeta.maxDesksText}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {branchOptionsList.map((branchOpt) => {
                const isSelected = targetBranch === branchOpt.value;
                return (
                  <button
                    key={branchOpt.value}
                    type="button"
                    onClick={() => handleBranchSelect(branchOpt.value)}
                    className={`flex flex-col text-left rounded-lg border p-2.5 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 shadow-xs'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{branchOpt.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{branchOpt.subtitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Branch Context Info Banner */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-300">
              <Info size={13} className="text-cyan-400 shrink-0" />
              <span>
                <strong>{targetBranch}:</strong> {branchMeta.timingText}.
                {targetBranch !== 'All Branches' && ` Maximum physical seating: ${branchMeta.deskCount} desks.`}
              </span>
            </div>
          </div>

          {/* STEP 2: Quick Shift Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Step 2: Quick Shift Presets (1-Click Autofill)
              </span>
              <span className="text-[10px] text-slate-500">Auto-calibrated timings</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SHIFT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-indigo-500 hover:text-white transition-all inline-flex items-center gap-1.5"
                >
                  <span>{p.icon}</span>
                  <span>{p.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-slate-400">({p.start}–{p.end})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shift Title */}
          <div>
            <label htmlFor="shift-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Shift Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="shift-name-input"
              type="text"
              required
              placeholder="e.g. Morning Dedicated Slot / Evening Batch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* STEP 3: Timings + Duration + Overnight Detection */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="shift-start-time" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                  <Clock size={12} className="text-cyan-400" />
                  Start Time
                </label>
                <input
                  id="shift-start-time"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label htmlFor="shift-end-time" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-cyan-400" />
                    End Time
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono font-bold">
                    {durationHours}h slot
                  </span>
                </label>
                <input
                  id="shift-end-time"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Overnight Badge if cross-midnight */}
            {isOvernight && (
              <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300">
                <Moon size={14} className="text-purple-400 shrink-0" />
                <span><strong>Overnight Shift Detected:</strong> This slot spans past midnight into the next calendar day ({startTime} ➜ {endTime}).</span>
              </div>
            )}

            {/* Operating Hours Warning */}
            {operatingHoursWarning && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
                <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                <span>{operatingHoursWarning}</span>
              </div>
            )}

            {/* 24-Hour Visual Schedule Timeline */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sun size={11} className="text-amber-400" /> 24-Hour Day Schedule Placement
                </span>
                <span className="font-mono text-indigo-300">{startTime} → {endTime} ({durationHours} Hours)</span>
              </div>
              <div className="relative h-6 w-full rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                {/* 6h interval guides */}
                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20 text-[9px] text-slate-400">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
                {/* Active shift segments */}
                {timelineSegments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-90 rounded-xs shadow-xs"
                    style={{ left: `${seg.left}%`, width: `${Math.max(1, seg.width)}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-mono px-0.5">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>12 AM</span>
              </div>
            </div>
          </div>

          {/* STEP 4: Capacity & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="shift-capacity" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center justify-between">
                <span>Desk Capacity</span>
                <span className="text-[10px] text-slate-400 font-mono">Max: {branchMeta.deskCount}</span>
              </label>
              <input
                id="shift-capacity"
                type="number"
                min="1"
                max="500"
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label htmlFor="shift-monthly-price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                <IndianRupee size={12} className="text-emerald-400" />
                Base Monthly Fee (₹)
              </label>
              <input
                id="shift-monthly-price"
                type="number"
                min="0"
                step="50"
                required
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                placeholder="700"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Exceeds Capacity Alert */}
          {exceedsCapacity && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
              <span>
                <strong>Physical Desk Advisory:</strong> {targetBranch} only has {branchMeta.deskCount} physical desks. Setting capacity to {capacity} requires floating desks or dual-seat sharing.
              </span>
            </div>
          )}

          {/* LIVE SHIFT PREVIEW CARD */}
          <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                Live Shift Directory Preview
              </span>
              <span className="text-[10px] text-slate-400">Card rendered in student catalog</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{name || 'Shift Title Preview'}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock size={11} className="text-cyan-400" />
                    <span>{startTime} → {endTime}</span>
                    <span className="text-indigo-400 font-mono">({durationHours} hrs)</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-300">
                    <IndianRupee size={11} />
                    <span>{monthlyPrice} / mo</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${branchMeta.badgeColor}`}>
                  <Building2 size={11} />
                  <span>{targetBranch}</span>
                </span>
                <span className="text-slate-400 font-mono">
                  Capacity: <strong className="text-white">{capacity} Desks</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
            <button
              type="button"
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <CheckCircle2 size={15} />
              Create Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminShiftsManagementAddModal;
