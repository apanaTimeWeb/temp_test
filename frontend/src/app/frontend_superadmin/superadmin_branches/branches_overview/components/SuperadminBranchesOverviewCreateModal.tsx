'use client';
// RESPONSIBILITY: Render complete branch creation dialog with unique code validation and tenant scoping.
import { useState } from 'react';
import { X, GitBranch, AlertCircle, Building2 } from 'lucide-react';
import type { SuperadminBranchRecord, SuperadminLibraryOption } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import SuperadminBranchesOverviewQuotaBlockBanner from './SuperadminBranchesOverviewQuotaBlockBanner';
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
  useModalScrollLock(isOpen);
  const [libraryId, setLibraryId] = useState(availableLibraries[0]?.id || 'lib-1');
  const [code, setCode] = useState(''); const [name, setName] = useState('');
  const [city, setCity] = useState(''); const [state, setState] = useState('Uttar Pradesh');
  const [address, setAddress] = useState(''); const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('+91 '); const [email, setEmail] = useState('');
  const [managerName, setManagerName] = useState(''); const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('+91 ');
  const [capacity, setCapacity] = useState(120);
  const [workingHours, setWorkingHours] = useState('06:00 AM - 10:00 PM');
  const [weeklyHolidays, setWeeklyHolidays] = useState('Sunday');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
      setErrorMsg('Please complete all required fields (Name, Code, City, Manager).');
      return;
    }
    const cleanCode = code.trim().toUpperCase();
    if (existingCodes.some((c) => c.toUpperCase() === cleanCode)) {
      setErrorMsg(`Branch code "${cleanCode}" already exists. Duplicate branch codes are forbidden.`);
      return;
    }

    const parentLib = availableLibraries.find((l) => l.id === libraryId) || availableLibraries[0];
    const res = onSubmit({
      code: cleanCode,
      name: name.trim(),
      libraryId: parentLib.id,
      libraryName: parentLib.name,
      city: city.trim(),
      state,
      address: address.trim() || `${city} Campus`,
      pinCode: pinCode.trim() || '200001',
      phone: phone.trim(),
      email: email.trim() || `${cleanCode.toLowerCase()}@libraryos.invalid`,
      managerName: managerName.trim(),
      managerEmail: managerEmail.trim() || `mgr.${cleanCode.toLowerCase()}@libraryos.invalid`,
      managerPhone: managerPhone.trim(),
      adminName: 'Library Admin',
      adminEmail: `admin@${parentLib.name.toLowerCase().replace(/\s+/g, '')}.invalid`,
      openingDate: new Date().toISOString().slice(0, 10),
      workingHours,
      weeklyHolidays,
      capacity: Number(capacity) || 100,
      activeMembers: 0,
      physicalBooks: 0,
      outstandingBooks: 0,
      memberDues: 0,
      cashBalance: 0,
      plan: 'Multi-Branch Pro',
      allowedModules: { books: true, members: true, seats: true, finance: true, accounts: true, communication: true },
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create branch');
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-emerald-500/40 bg-[#0c0f28] p-6 shadow-2xl text-white max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ease-out">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/20">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <GitBranch size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create New Branch (SuperAdmin Only)</h2>
            <p className="text-xs text-slate-400">Scoped branch provisioning with duplicate code protection</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Library Account Selection (Guaranteed Tenant Scoping) */}
          <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/40">
            <label className="block text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
              <Building2 size={13} />
              <span>Parent Library Account (Strict Tenant Scope) *</span>
            </label>
            <select
              value={libraryId}
              onChange={(e) => handleLibraryChange(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-card p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
            >
              {availableLibraries.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.name} (Quota: {lib.currentBranchCount} of {lib.maxBranchesAllowed} Branches used)
                </option>
              ))}
            </select>
          </div>

          {/* Quota Limit Blocking Banner when 3/3 branches used */}
          {isLimitReached && parentLib && (
            <SuperadminBranchesOverviewQuotaBlockBanner library={parentLib} />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name *</label>
              <input
                type="text"
                placeholder="e.g. Connaught Place Premier Hub"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unique Branch Code *</label>
              <input
                type="text"
                placeholder="e.g. BR-DEL-01"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white uppercase placeholder:text-slate-500 focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code</label>
              <input
                type="text"
                placeholder="PIN"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
            <input
              type="text"
              placeholder="Road, building, floor or landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
            />
          </div>

          <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/60 space-y-3">
            <p className="text-xs font-bold text-slate-200">Branch Manager (Only sees this assigned branch)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Manager Name *"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
              <input
                type="email"
                placeholder="Manager Email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
              <input
                type="tel"
                placeholder="Manager Phone"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Seat Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Working Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Holidays</label>
              <input
                type="text"
                value={weeklyHolidays}
                onChange={(e) => setWeeklyHolidays(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-input p-2 text-xs text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLimitReached}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                isLimitReached
                  ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
              }`}
            >
              {isLimitReached ? 'Creation Blocked (Quota Reached)' : 'Create & Provision Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
