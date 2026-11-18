'use client';

import { useState, useMemo } from 'react';
import { IndianRupee, X, Building2, Clock, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { getLibraryPricingConfig, saveLibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';

interface AdminShiftsManagementAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShift: (shift: AdminShiftsShift) => void;
  selectedBranchName?: string;
}

const SHIFT_PRESETS = [
  { name: 'Morning Shift', start: '06:00', end: '12:00', price: 800, capacity: 40 },
  { name: 'Afternoon Shift', start: '12:00', end: '17:00', price: 700, capacity: 40 },
  { name: 'Evening Shift', start: '17:00', end: '22:00', price: 900, capacity: 40 },
  { name: 'Night Owl Slot', start: '22:00', end: '06:00', price: 1000, capacity: 30 },
  { name: 'Full Day Dedicated 24/7', start: '00:00', end: '23:59', price: 2000, capacity: 25 },
];

export function AdminShiftsManagementAddModal({
  isOpen,
  onClose,
  onAddShift,
  selectedBranchName,
}: AdminShiftsManagementAddModalProps) {
  const { branches } = useAdminBranch();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('12:00');
  const [capacity, setCapacity] = useState(40);
  const [monthlyPrice, setMonthlyPrice] = useState(700);
  const [targetBranch, setTargetBranch] = useState(selectedBranchName || 'All Branches');
  const [formError, setFormError] = useState<string | null>(null);

  const durationHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    let diff = (eH * 60 + eM) - (sH * 60 + sM);
    if (diff <= 0) diff += 24 * 60; // overnight
    return Math.round((diff / 60) * 10) / 10;
  }, [startTime, endTime]);

  if (!isOpen) return null;

  const branchOptionsList = [
    { value: 'All Branches', title: 'All Branches', subtitle: 'Universal Shift Template' },
    ...branches.map((b) => ({
      value: b.name,
      title: b.name,
      subtitle: `${b.code} · ${b.city}`,
    })),
  ];

  const handleApplyPreset = (preset: typeof SHIFT_PRESETS[0]) => {
    setName(preset.name);
    setStartTime(preset.start);
    setEndTime(preset.end);
    setMonthlyPrice(preset.price);
    setCapacity(preset.capacity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a shift name.');
      return;
    }
    const newShift: AdminShiftsShift = {
      id: String(Date.now()),
      name: name.trim(),
      startTime,
      endTime,
      occupancy: 0,
      capacity: Number(capacity) || 40,
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
    setCapacity(40);
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
        className="relative my-8 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                <ShieldCheck size={12} />
                Admin Authority Only
              </span>
            </div>
            <h2 id="add-shift-dialog-title" className="text-xl font-bold tracking-tight text-white mt-1">
              Add Library Shift
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Define operational timings, branch assignment, and desk capacity
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

          {/* Target Branch Selector */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building2 size={14} className="text-indigo-400" />
              Target Branch Assignment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {branchOptionsList.map((branchOpt) => {
                const isSelected = targetBranch === branchOpt.value;
                return (
                  <button
                    key={branchOpt.value}
                    type="button"
                    onClick={() => setTargetBranch(branchOpt.value)}
                    className={`flex flex-col text-left rounded-lg border p-2.5 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{branchOpt.title}</span>
                    <span className="text-[10px] text-slate-400">{branchOpt.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                Quick Shift Presets
              </span>
              <span className="text-[10px] text-slate-500">Click to autofill</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SHIFT_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-indigo-500 hover:text-white transition-all"
                >
                  {p.name.split(' ')[0]} ({p.start}–{p.end})
                </button>
              ))}
            </div>
          </div>

          {/* Shift Name */}
          <div>
            <label htmlFor="shift-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Shift Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="shift-name-input"
              type="text"
              required
              placeholder="e.g. Morning Shift / Evening Slot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Timings with duration indicator */}
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
                <span className="text-[10px] text-indigo-300 font-mono">({durationHours}h duration)</span>
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

          {/* Capacity and Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="shift-capacity" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Capacity (Desks)
              </label>
              <input
                id="shift-capacity"
                type="number"
                min="1"
                max="1000"
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
              Save Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminShiftsManagementAddModal;
