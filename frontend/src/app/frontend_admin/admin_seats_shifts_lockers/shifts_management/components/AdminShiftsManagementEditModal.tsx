'use client';
// RESPONSIBILITY: Edit shift details, timings, monthly fee, and active state for shifts management.

import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { Building2,Clock,IndianRupee,Moon,Power,Save,Sun,X } from 'lucide-react';
import { useEffect,useMemo,useState } from 'react';
import { toast } from 'sonner';

export interface AdminShiftsManagementEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: AdminShiftsShift | null;
  onSaveShift: (updatedShift: AdminShiftsShift) => void;
}

const BRANCHES = ['All Branches', 'Downtown Central', 'Westside Branch', 'North Hub'];

export function AdminShiftsManagementEditModal({
  isOpen,
  onClose,
  shift,
  onSaveShift,
}: AdminShiftsManagementEditModalProps) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('14:00');
  const [monthlyPrice, setMonthlyPrice] = useState(700);
  const [capacity, setCapacity] = useState(24);
  const [branchName, setBranchName] = useState('All Branches');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (shift) {
      setName(shift.name);
      setStartTime(shift.startTime || '06:00');
      setEndTime(shift.endTime || '14:00');
      setMonthlyPrice(shift.monthlyPrice ?? 700);
      setCapacity(shift.capacity || 24);
      setBranchName(shift.branchName || 'All Branches');
      setActive(shift.active);
    }
  }, [shift]);

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

  if (!isOpen || !shift) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Shift name is required.');
      return;
    }

    const updated: AdminShiftsShift = {
      ...shift,
      name: name.trim(),
      startTime,
      endTime,
      monthlyPrice: Number(monthlyPrice),
      capacity: Number(capacity),
      branchName,
      active,
    };

    onSaveShift(updated);
    toast.success(`Shift "${updated.name}" updated successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/70 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Edit Study Shift & Pricing</h2>
              <p className="text-xs text-slate-400">Configure timetable hours, desk fee, and operational status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Shift Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Shift Title / Slot Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Shift (6 AM - 2 PM)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Timings Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sun size={13} className="text-amber-400" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Moon size={13} className="text-indigo-400" />
                <span>End Time</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                required
              />
            </div>
          </div>

          {/* Timing Info Pill */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-indigo-400" />
              <span className="text-slate-300 font-medium">Slot Duration: <strong>{durationHours} Hours</strong></span>
            </div>
            {isOvernight && (
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                <Moon size={10} /> Crosses Midnight
              </span>
            )}
          </div>

          {/* Pricing & Capacity Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <IndianRupee size={13} className="text-emerald-400" />
                <span>Monthly Fee (₹)</span>
              </label>
              <input
                type="number"
                min={100}
                max={50000}
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Desk Capacity (Seats)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                required
              />
            </div>
          </div>

          {/* Branch & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 size={13} className="text-indigo-400" />
                <span>Applicable Branch</span>
              </label>
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Power size={13} className="text-slate-400" />
                <span>Active Status</span>
              </label>
              <select
                value={active ? 'true' : 'false'}
                onChange={(e) => setActive(e.target.value === 'true')}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="true">Active (Accepting Bookings)</option>
                <option value="false">Inactive (Suspended)</option>
              </select>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminShiftsManagementEditModal;
