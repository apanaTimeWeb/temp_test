'use client';
// RESPONSIBILITY: Edit shift details, timings, monthly fee, and active state for shifts management.

import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Building2, Clock, IndianRupee, Moon, Power, Save, Sun, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
      toast.error('Shift name is required.', { id: 'admin-shifts-edit-invalid' });
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
    toast.success(`Shift "${updated.name}" updated successfully!`, { id: 'admin-shifts-edit-saved' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
              <Clock size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Edit Study Shift &amp; Pricing
              </DialogTitle>
              <p className="text-xs text-text-secondary">Configure timetable hours, desk fee, and operational status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            title="Close modal"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="edit-shift-name" className="text-xs font-semibold text-text-secondary">
              Shift Title / Slot Name
            </label>
            <input
              id="edit-shift-name"
              maxLength={100}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Shift (6 AM - 2 PM)"
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="edit-shift-start" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Sun size={13} className="text-warning-text" aria-hidden="true" />
                <span>Start Time</span>
              </label>
              <input
                id="edit-shift-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-shift-end" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Moon size={13} className="text-primary" aria-hidden="true" />
                <span>End Time</span>
              </label>
              <input
                id="edit-shift-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-highlight p-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-primary" aria-hidden="true" />
              <span className="text-text-secondary font-medium">
                Slot Duration: <strong className="text-text-primary">{durationHours} Hours</strong>
              </span>
            </div>
            {isOvernight && (
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-text bg-purple-bg px-2 py-0.5 text-[10px] font-semibold text-purple-text">
                <Moon size={10} aria-hidden="true" /> Crosses Midnight
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="edit-shift-fee" className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                <IndianRupee size={13} className="text-success-text" aria-hidden="true" />
                <span>Monthly Fee (₹)</span>
              </label>
              <input
                id="edit-shift-fee"
                type="number"
                min={100}
                max={50000}
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-shift-capacity" className="text-xs font-semibold text-text-secondary">
                Desk Capacity (Seats)
              </label>
              <input
                id="edit-shift-capacity"
                type="number"
                min={1}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="edit-shift-branch" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Building2 size={13} className="text-primary" aria-hidden="true" />
                <span>Applicable Branch</span>
              </label>
              <select
                id="edit-shift-branch"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-shift-status" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Power size={13} className="text-text-secondary" aria-hidden="true" />
                <span>Active Status</span>
              </label>
              <select
                id="edit-shift-status"
                value={active ? 'true' : 'false'}
                onChange={(e) => setActive(e.target.value === 'true')}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="true">Active (Accepting Bookings)</option>
                <option value="false">Inactive (Suspended)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors cursor-pointer"
            >
              <Save size={15} aria-hidden="true" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminShiftsManagementEditModal;
