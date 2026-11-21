'use client';
// RESPONSIBILITY: Render complete branch creation dialog with unique code validation and tenant scoping.
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GitBranch, AlertCircle, Building2, MapPin, Phone, Mail, Clock, Calendar, Armchair } from 'lucide-react';
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
      physicalBooks: 1500,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-indigo-500/40 bg-[#0d102b] p-6 shadow-2xl text-white max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-indigo-500/20">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <GitBranch size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Create New Branch (SuperAdmin Only)</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROVISIONING
              </span>
            </div>
            <p className="text-xs text-slate-400">Scoped branch provisioning with duplicate code protection</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Library Account Selection (Guaranteed Tenant Scoping) */}
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40">
            <label className="block text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
              <Building2 size={13} />
              <span>Parent Library Account (Strict Tenant Scope) *</span>
            </label>
            <select
              value={libraryId}
              onChange={(e) => handleLibraryChange(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-[#0c0f28] p-2.5 text-xs text-white focus:border-indigo-400 outline-none cursor-pointer"
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

          {/* Branch Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Connaught Place Premier Hub"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 outline-none"
              />
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unique Branch Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. BR-DEL-01"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2.5 text-xs text-white uppercase font-mono placeholder:text-slate-500 focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Location & Address */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40 space-y-3">
            <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <MapPin size={13} /> Location & Address Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">PIN Code</label>
                <input
                  type="text"
                  placeholder="e.g. 110001"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white font-mono focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Premises / Street Address</label>
              <input
                type="text"
                placeholder="Plot/Floor, Road or Landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Branch Help Desk Phone</label>
                <input
                  type="tel"
                  placeholder="+91 "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Branch Help Desk Email</label>
                <input
                  type="email"
                  placeholder="branch@library.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Branch Manager Assignment */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-sky-300">Branch Manager Assignment</p>
              <span className="text-[10px] text-slate-400">Scoped operational access strictly to this branch</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manager Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manager Email</label>
                <input
                  type="email"
                  placeholder="rohan@library.org"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manager Mobile</label>
                <input
                  type="tel"
                  placeholder="+91 "
                  value={managerPhone}
                  onChange={(e) => setManagerPhone(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Operations & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Armchair size={13} className="text-amber-300" />
                <span>Seat Capacity</span>
              </label>
              <input
                type="number"
                min={10}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white font-mono focus:border-indigo-400 outline-none"
              />
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Clock size={13} className="text-indigo-400" />
                <span>Working Hours</span>
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
              />
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar size={13} className="text-amber-400" />
                <span>Weekly Holidays</span>
              </label>
              <input
                type="text"
                value={weeklyHolidays}
                onChange={(e) => setWeeklyHolidays(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLimitReached}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                isLimitReached
                  ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500'
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
