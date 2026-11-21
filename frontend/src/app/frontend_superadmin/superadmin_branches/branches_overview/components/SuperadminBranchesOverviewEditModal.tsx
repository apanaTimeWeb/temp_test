'use client';
// RESPONSIBILITY: Render complete branch edit modal allowing SuperAdmin to update branch operational, contact, and module settings.
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit2, Building2, MapPin, Phone, Mail, Clock, Calendar, Armchair, ShieldCheck, Check } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
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
            <Edit2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Edit Branch Profile & Software Access</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {branch.code}
              </span>
            </div>
            <p className="text-xs text-slate-400">Parent Organization: {branch.libraryName} ({branch.libraryId})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Branch Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2.5 text-xs text-white focus:border-indigo-400 outline-none"
              />
            </div>
            <div className="p-3 rounded-xl border border-indigo-500/20 bg-card/40">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Code (Fixed System Identifier)</label>
              <input
                type="text"
                disabled
                value={branch.code}
                className="w-full rounded-xl border border-indigo-500/15 bg-slate-950/60 p-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          {/* Location & Contact */}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white font-mono focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Premises Address</label>
              <input
                type="text"
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Branch Help Desk Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Assigned Manager */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-sky-300">Branch Manager Assignment</p>
              <span className="text-[10px] text-slate-400">Scoped operational desk credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manager Name *</label>
                <input
                  type="text"
                  required
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manager Email</label>
                <input
                  type="email"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/80 p-2 text-xs text-white focus:border-indigo-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manager Mobile</label>
                <input
                  type="tel"
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

          {/* Module Entitlements Control */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-card/40 space-y-2">
            <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Branch Operational Modules (SuperAdmin Entitlements)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {Object.entries(modules).map(([key, enabled]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleToggleModule(key)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    enabled
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <span className="capitalize font-medium">{key.replace('_', ' ')}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    enabled ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {enabled ? 'Active' : 'Disabled'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer"
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
