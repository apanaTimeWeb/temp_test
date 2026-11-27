'use client';
// RESPONSIBILITY: Render complete branch edit modal allowing SuperAdmin to update branch operational, contact, and module settings (< 300 lines).
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit2, Check } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import SuperadminBranchesOverviewEditModalFields from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewEditModalFields';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface SuperadminBranchesOverviewEditModalProps {
  branch: SuperadminBranchRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<SuperadminBranchRecord>) => void;
}

export default function SuperadminBranchesOverviewEditModal({
  branch,
  isOpen,
  onClose,
  onSave,
}: SuperadminBranchesOverviewEditModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(isOpen && branch && mounted));

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [capacity, setCapacity] = useState(120);
  const [workingHours, setWorkingHours] = useState('');
  const [weeklyHolidays, setWeeklyHolidays] = useState('');
  const [modules, setModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (branch) {
      setName(branch.name || '');
      setCity(branch.city || '');
      setState(branch.state || '');
      setAddress(branch.address || '');
      setPinCode(branch.pinCode || '');
      setPhone(branch.phone || '');
      setEmail(branch.email || '');
      setManagerName(branch.managerName || '');
      setManagerEmail(branch.managerEmail || '');
      setManagerPhone(branch.managerPhone || '');
      setCapacity(branch.capacity || 120);
      setWorkingHours(branch.workingHours || '08:00 AM - 10:00 PM');
      setWeeklyHolidays(branch.weeklyHolidays || 'Sunday');
      setModules(branch.allowedModules || {
        attendance: true,
        seats_matrix: true,
        lockers: true,
        daily_settlement: true,
        expenses: true,
      });
    }
  }, [branch]);

  if (!isOpen || !branch || !mounted) return null;

  const handleToggleModule = (modKey: string) => {
    setModules((prev) => ({
      ...prev,
      [modKey]: !prev[modKey],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !managerName.trim()) return;

    onSave(branch.id, {
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      pinCode: pinCode.trim(),
      phone: phone.trim(),
      email: email.trim(),
      managerName: managerName.trim(),
      managerEmail: managerEmail.trim(),
      managerPhone: managerPhone.trim(),
      capacity,
      workingHours,
      weeklyHolidays,
      allowedModules: modules,
    });
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in motion-safe:duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-foreground max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 motion-safe:duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground p-1 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-primary-subtle text-primary border border-border">
            <Edit2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Edit Branch Profile & Software Access</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary-subtle text-primary border border-border">
                {branch.code}
              </span>
            </div>
            <p className="text-xs text-secondary">Parent Organization: {branch.libraryName} ({branch.libraryId})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Branch Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-card">
              <label className="block text-xs font-semibold text-secondary mb-1">Branch Name *</label>
              <input
                maxLength={100}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-foreground focus:border-primary outline-none"
              />
            </div>
            <div className="p-3 rounded-xl border border-border bg-card">
              <label className="block text-xs font-semibold text-secondary mb-1">Branch Code (Fixed System Identifier)</label>
              <input
                maxLength={30}
                type="text"
                disabled
                value={branch.code}
                className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-muted font-mono cursor-not-allowed"
              />
            </div>
          </div>

          {/* Form fields for Location, Manager, Operations & Modules */}
          <SuperadminBranchesOverviewEditModalFields
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            pinCode={pinCode}
            setPinCode={setPinCode}
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            managerName={managerName}
            setManagerName={setManagerName}
            managerEmail={managerEmail}
            setManagerEmail={setManagerEmail}
            managerPhone={managerPhone}
            setManagerPhone={setManagerPhone}
            capacity={capacity}
            setCapacity={setCapacity}
            workingHours={workingHours}
            setWorkingHours={setWorkingHours}
            weeklyHolidays={weeklyHolidays}
            setWeeklyHolidays={setWeeklyHolidays}
            modules={modules}
            onToggleModule={handleToggleModule}
          />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-on-primary shadow-sm active:scale-95 motion-safe:transition-all cursor-pointer motion-safe:active:scale-95"
            >
              <Check size={14} />
              <span>Save Branch Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
