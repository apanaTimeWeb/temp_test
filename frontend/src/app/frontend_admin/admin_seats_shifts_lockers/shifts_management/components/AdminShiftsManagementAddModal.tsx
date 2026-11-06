'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';

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
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('12:00');
  const [capacity, setCapacity] = useState(40);
  const [branchName, setBranchName] = useState('Downtown Central');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

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
      branchName: branchName || selectedBranchName || 'Downtown Central',
    };
    onAddShift(newShift);
    toast.success(`Shift "${newShift.name}" added successfully.`);
    onClose();
    setName('');
    setStartTime('06:00');
    setEndTime('12:00');
    setCapacity(40);
    setFormError(null);
  };

  const handleClose = () => {
    onClose();
    setFormError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay-backdrop p-4" role="dialog" aria-modal="true" aria-labelledby="add-shift-dialog-title">
      <div className="admin-card w-full max-w-lg bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 id="add-shift-dialog-title" className="text-lg font-semibold text-text-primary">Add New Shift</h2>
          <button
            type="button"
            className="rounded-md p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {formError && (
            <p role="alert" className="text-sm text-danger-text">{formError}</p>
          )}
          <div className="space-y-1">
            <label htmlFor="shift-name-input" className="text-sm font-medium text-text-primary">Shift Name</label>
            <input
              id="shift-name-input"
              type="text"
              required
              placeholder="e.g. Night Shift / Early Morning"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="admin-input w-full"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="shift-start-time" className="text-sm font-medium text-text-primary">Start Time</label>
              <input
                id="shift-start-time"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="admin-input w-full"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="shift-end-time" className="text-sm font-medium text-text-primary">End Time</label>
              <input
                id="shift-end-time"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="admin-input w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="shift-capacity" className="text-sm font-medium text-text-primary">Total Capacity (Seats)</label>
            <input
              id="shift-capacity"
              type="number"
              min="1"
              max="1000"
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="admin-input w-full"
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              className="admin-btn-ghost min-h-11"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn-primary min-h-11"
            >
              Save Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminShiftsManagementAddModal;

