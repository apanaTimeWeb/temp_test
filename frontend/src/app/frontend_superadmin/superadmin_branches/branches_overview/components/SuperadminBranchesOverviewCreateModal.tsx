'use client';
// RESPONSIBILITY: Render complete branch creation dialog with unique code validation and tenant scoping (< 300 lines).
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GitBranch, AlertCircle, Building2 } from 'lucide-react';
import type { SuperadminBranchRecord, SuperadminLibraryOption } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import SuperadminBranchesOverviewQuotaBlockBanner from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewQuotaBlockBanner';
import SuperadminBranchesOverviewCreateModalFields from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewCreateModalFields';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface SuperadminBranchesOverviewCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableLibraries: SuperadminLibraryOption[];
  existingCodes: string[];
  onSubmit: (data: Omit<SuperadminBranchRecord, 'id' | 'createdAt' | 'status'>) => { success: boolean; error?: string };
}

export default function SuperadminBranchesOverviewCreateModal({
  isOpen,
  onClose,
  availableLibraries,
  existingCodes,
  onSubmit,
}: SuperadminBranchesOverviewCreateModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(isOpen && mounted));

  const [libraryId, setLibraryId] = useState(availableLibraries[0]?.id || 'lib-1');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('+91 ');
  const [capacity, setCapacity] = useState(120);
  const [workingHours, setWorkingHours] = useState('06:00 AM - 10:00 PM');
  const [weeklyHolidays, setWeeklyHolidays] = useState('Sunday');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync initial library if availableLibraries changes
  useEffect(() => {
    if (availableLibraries.length > 0 && !availableLibraries.some((l) => l.id === libraryId)) {
      setLibraryId(availableLibraries[0].id);
    }
  }, [availableLibraries, libraryId]);

  if (!isOpen || !mounted) return null;

  const parentLib = availableLibraries.find((l) => l.id === libraryId) || availableLibraries[0];
  const isLimitReached = parentLib ? parentLib.currentBranchCount >= parentLib.maxBranchesAllowed : false;

  const handleLibraryChange = (selectedId: string) => {
    setLibraryId(selectedId);
    const lib = availableLibraries.find((l) => l.id === selectedId);
    if (lib && city) {
      setCode(`BR-${city.slice(0, 3).toUpperCase()}-0${lib.currentBranchCount + 1}`);
    }
  };

  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    if (cityName.length >= 3 && !code) {
      setCode(`BR-${cityName.slice(0, 3).toUpperCase()}-01`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim() || !code.trim() || !city.trim() || !managerName.trim()) {
      setErrorMsg('Please fill in Branch Name, Code, City and Manager Name.');
      return;
    }

    if (existingCodes.includes(code.toUpperCase().trim())) {
      setErrorMsg(`Branch code "${code.toUpperCase()}" already exists! Codes must be globally unique across all libraries.`);
      return;
    }

    if (isLimitReached) {
      setErrorMsg(`Cannot create branch: Library ${parentLib?.name} has reached its plan quota (${parentLib?.maxBranchesAllowed} branches). Upgrade plan first.`);
      return;
    }

    const res = onSubmit({
      libraryId,
      libraryName: parentLib?.name || 'Central Library',
      code: code.toUpperCase().trim(),
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address.trim() || `${city.trim()} Central Premises`,
      pinCode: pinCode.trim() || '201301',
      phone: phone.trim() || '+91 98765 00000',
      email: email.trim() || `branch.${code.toLowerCase()}@libraryos.io`,
      managerName: managerName.trim(),
      managerEmail: managerEmail.trim() || `manager.${code.toLowerCase()}@libraryos.io`,
      managerPhone: managerPhone.trim() || phone.trim(),
      adminName: 'Organization Admin',
      adminEmail: 'admin@libraryos.io',
      openingDate: new Date().toISOString().split('T')[0],
      workingHours,
      weeklyHolidays,
      capacity,
      activeMembers: 0,
      physicalBooks: 0,
      outstandingBooks: 0,
      memberDues: 0,
      cashBalance: 5000,
      plan: 'Pro',
      allowedModules: {
        attendance: true,
        seats_matrix: true,
        lockers: true,
        daily_settlement: true,
        expenses: true,
      },
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create branch');
    } else {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in motion-safe:duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
            <GitBranch size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Create New Branch (SuperAdmin Only)</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-success-bg text-success border border-success-border">
                PROVISIONING
              </span>
            </div>
            <p className="text-xs text-secondary">Scoped branch provisioning with duplicate code protection</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl border border-danger-border bg-danger-bg flex items-center gap-2 text-xs text-danger" role="alert">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Library Account Selection */}
          <div className="p-3.5 rounded-xl border border-border bg-surface">
            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
              <Building2 size={13} className="text-primary" />
              <span>Parent Library Account (Strict Tenant Scope) *</span>
            </label>
            <select
              value={libraryId}
              onChange={(e) => handleLibraryChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-foreground focus:border-primary outline-none cursor-pointer"
            >
              {availableLibraries.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.name} (Quota: {lib.currentBranchCount} of {lib.maxBranchesAllowed} Branches used)
                </option>
              ))}
            </select>
          </div>

          {/* Quota Limit Blocking Banner */}
          {isLimitReached && parentLib && (
            <SuperadminBranchesOverviewQuotaBlockBanner library={parentLib} />
          )}

          {/* Branch Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-card">
              <label className="block text-xs font-semibold text-secondary mb-1">Branch Name *</label>
              <input
                maxLength={100}
                type="text"
                required
                placeholder="e.g. Connaught Place Premier Hub"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-foreground placeholder:text-muted focus:border-primary outline-none"
              />
            </div>
            <div className="p-3 rounded-xl border border-border bg-card">
              <label className="block text-xs font-semibold text-secondary mb-1">Unique Branch Code *</label>
              <input
                maxLength={30}
                type="text"
                required
                placeholder="e.g. BR-DEL-01"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-foreground uppercase font-mono placeholder:text-muted focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Extracted form fields for Location, Manager, Operations */}
          <SuperadminBranchesOverviewCreateModalFields
            city={city}
            onCityChange={handleCityChange}
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
          />

          {/* Action Footer */}
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
              disabled={isLimitReached}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-on-primary shadow-sm motion-safe:transition-all cursor-pointer motion-safe:active:scale-95 ${
                isLimitReached
                  ? 'bg-surface opacity-60 cursor-not-allowed text-muted'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              {isLimitReached ? 'Creation Blocked (Quota Reached)' : 'Create & Provision Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
