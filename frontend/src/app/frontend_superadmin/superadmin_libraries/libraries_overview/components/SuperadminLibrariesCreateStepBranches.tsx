'use client';
/** Responsibility: Step C of Library Creation Wizard; manages multi-branch provisioning respecting dynamic plan branch limits (default max_branches = 3). */
import { useState } from 'react';
import { GitBranch, Plus, Trash2, Building, Clock, Users, ShieldCheck } from 'lucide-react';
import type {
  LibraryBranchCreationItem,
  LibraryProvisioningPlan,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';

interface StepBranchesProps {
  branches: LibraryBranchCreationItem[];
  onChange: (updated: LibraryBranchCreationItem[]) => void;
  plan: LibraryProvisioningPlan;
  libraryCodePrefix: string;
}

export default function SuperadminLibrariesCreateStepBranches({
  branches,
  onChange,
  plan,
  libraryCodePrefix,
}: StepBranchesProps) {
  const [activeTab, setActiveTab] = useState(0);

  const canAddMore = branches.length < plan.maxBranches;

  const handleAddBranch = () => {
    if (!canAddMore) return;
    const nextIndex = branches.length + 1;
    const newBranch: LibraryBranchCreationItem = {
      id: `br-${Date.now()}-${nextIndex}`,
      branchName: `Branch ${nextIndex}`,
      branchCode: `${libraryCodePrefix || 'LIB'}-BR${nextIndex.toString().padStart(2, '0')}`,
      branchAddress: '',
      contactNumber: '',
      branchEmail: '',
      branchManager: '',
      openingDate: new Date().toISOString().split('T')[0],
      workingHours: '06:00 AM - 11:00 PM',
      weeklyHolidays: 'None (Open 7 Days)',
      status: 'Active',
      allowedModules: { lockers: true, members: true, seats: true, finance: true, accounts: true, communication: true },
      capacitySeats: 150,
      hasAirConditioning: true,
      hasLockers: true,
    };
    onChange([...branches, newBranch]);
    setActiveTab(branches.length);
  };

  const handleRemoveBranch = (index: number) => {
    if (branches.length <= 1) return;
    const updated = branches.filter((_, i) => i !== index);
    onChange(updated);
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const currentBranch = branches[activeTab] || branches[0];

  const updateCurrent = (fields: Partial<LibraryBranchCreationItem>) => {
    const updated = [...branches];
    updated[activeTab] = { ...currentBranch, ...fields };
    onChange(updated);
  };

  const toggleModule = (moduleKey: keyof LibraryBranchCreationItem['allowedModules']) => {
    const cur = currentBranch.allowedModules;
    updateCurrent({ allowedModules: { ...cur, [moduleKey]: !cur[moduleKey] } });
  };

  return (
    <div className="space-y-4">
      {/* Header and Branch Quota Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <GitBranch size={18} className="text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Section C: Branch Provisioning</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Plan Quota: {branches.length} of {plan.maxBranches} Branches
          </span>
          {canAddMore && (
            <button
              type="button"
              onClick={handleAddBranch}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              <span>Add Branch</span>
            </button>
          )}
        </div>
      </div>

      {/* Branch Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {branches.map((b, idx) => (
          <button
            key={b.id || idx}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === idx
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{b.branchName || `Branch ${idx + 1}`}</span>
            {branches.length > 1 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBranch(idx);
                }}
                className="hover:text-rose-400 p-0.5"
                title="Remove branch"
              >
                <Trash2 size={11} />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Branch Form */}
      {currentBranch && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Branch Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. South Extension Main Branch"
                value={currentBranch.branchName}
                onChange={(e) => updateCurrent({ branchName: e.target.value })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unique Branch Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. APX-BR01"
                value={currentBranch.branchCode}
                onChange={(e) => updateCurrent({ branchCode: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs font-mono font-bold text-cyan-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Branch Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2nd Floor, Apex Plaza, Main Market, South Ext Part 1"
              value={currentBranch.branchAddress}
              onChange={(e) => updateCurrent({ branchAddress: e.target.value })}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Number</label>
              <input
                type="tel"
                placeholder="+91 98765 11111"
                value={currentBranch.contactNumber}
                onChange={(e) => updateCurrent({ contactNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Email</label>
              <input
                type="email"
                placeholder="branch1@apexlibrary.in"
                value={currentBranch.branchEmail}
                onChange={(e) => updateCurrent({ branchEmail: e.target.value })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Manager</label>
              <input
                type="text"
                placeholder="e.g. Vikram Mehta"
                value={currentBranch.branchManager}
                onChange={(e) => updateCurrent({ branchManager: e.target.value })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Working Hours</label>
              <input
                type="text"
                value={currentBranch.workingHours}
                onChange={(e) => updateCurrent({ workingHours: e.target.value })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Holidays</label>
              <input
                type="text"
                value={currentBranch.weeklyHolidays}
                onChange={(e) => updateCurrent({ weeklyHolidays: e.target.value })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Status</label>
              <select
                value={currentBranch.status}
                onChange={(e) => updateCurrent({ status: e.target.value as 'Active' | 'Setup' | 'Maintenance' })}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Setup">Setup / In Progress</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Allowed Modules & Branch Specific Settings */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-slate-900/60 space-y-2.5">
            <span className="text-xs font-bold text-cyan-300 block">Allowed Modules for this Branch</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
              {Object.entries(currentBranch.allowedModules).map(([modKey, isAllowed]) => (
                <label key={modKey} className="flex items-center gap-2 cursor-pointer capitalize">
                  <input
                    type="checkbox"
                    checked={isAllowed}
                    onChange={() => toggleModule(modKey as keyof LibraryBranchCreationItem['allowedModules'])}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>{modKey}</span>
                </label>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span>Capacity:</span>
                <input
                  type="number"
                  min={10}
                  max={5000}
                  value={currentBranch.capacitySeats}
                  onChange={(e) => updateCurrent({ capacitySeats: Number(e.target.value) })}
                  className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white font-bold"
                />
                <span>Seats</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentBranch.hasAirConditioning}
                    onChange={(e) => updateCurrent({ hasAirConditioning: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500"
                  />
                  <span>AC Cooling</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentBranch.hasLockers}
                    onChange={(e) => updateCurrent({ hasLockers: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500"
                  />
                  <span>Lockers</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
