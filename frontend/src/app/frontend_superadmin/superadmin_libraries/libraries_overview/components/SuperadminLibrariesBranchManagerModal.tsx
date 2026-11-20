'use client';

import React, { useState } from 'react';
import {
  X, Building2, MapPin, Armchair, Clock, UserCheck, Plus, Check,
  KeyRound, ShieldCheck, AlertCircle, Phone, Mail, Store, Shield
} from 'lucide-react';
import type { SuperadminLibrariesLibrary, SuperadminBranchRecord } from '../types/SuperadminLibrariesOverviewTypes';

interface SuperadminLibrariesBranchManagerModalProps {
  lib: SuperadminLibrariesLibrary;
  onClose: () => void;
  onAddBranch: (tenantId: string, branch: SuperadminBranchRecord) => void;
  onToggleAdminPanel: (tenantId: string) => void;
}

export default function SuperadminLibrariesBranchManagerModal({
  lib,
  onClose,
  onAddBranch,
  onToggleAdminPanel,
}: SuperadminLibrariesBranchManagerModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [city, setCity] = useState(lib.location || '');
  const [address, setAddress] = useState('');
  const [seats, setSeats] = useState(100);
  const [shifts, setShifts] = useState(3);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [formError, setFormError] = useState('');

  const branches = lib.branchList || [
    {
      id: `br-${lib.id}-1`,
      name: `${lib.name} Main Branch`,
      code: 'MB-01',
      city: lib.location,
      address: 'Main Facility Address',
      seats: Math.max(80, Math.floor((lib.students || 100) / (lib.branches || 1))),
      shifts: 3,
      managerName: lib.owner,
      managerPhone: lib.phone,
      managerEmail: lib.email,
      status: 'Active' as const,
    },
  ];

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) {
      setFormError('Please enter a branch name.');
      return;
    }
    const newBranch: SuperadminBranchRecord = {
      id: `br-${lib.id}-${Date.now().toString(36)}`,
      name: branchName.trim(),
      code: branchCode.trim() || `BR-0${branches.length + 1}`,
      city: city.trim() || lib.location,
      address: address.trim() || `${city} Campus`,
      seats: Number(seats) || 100,
      shifts: Number(shifts) || 3,
      managerName: managerName.trim() || 'Assigned by Admin',
      managerPhone: managerPhone.trim() || lib.phone,
      managerEmail: managerEmail.trim() || lib.email,
      status: 'Active',
    };

    onAddBranch(lib.id, newBranch);
    setBranchName('');
    setBranchCode('');
    setAddress('');
    setManagerName('');
    setManagerPhone('');
    setManagerEmail('');
    setShowAddForm(false);
    setFormError('');
  };

  const isAdminPanelEnabled = lib.adminPanelEnabled ?? true;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-indigo-500/30 bg-[#0a0d22] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-[#0a0d22] to-[#0c0f28]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="branch-modal-title" className="text-base sm:text-lg font-bold text-white">
                  {lib.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {branches.length} {branches.length === 1 ? 'Branch' : 'Branches'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Owner / Single Admin: <strong className="text-slate-200">{lib.owner}</strong> ({lib.email})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Admin Panel Master Toggle Section */}
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl border shrink-0 ${isAdminPanelEnabled ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/15 border-amber-500/30 text-amber-400'}`}>
                {isAdminPanelEnabled ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Admin Panel Access</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isAdminPanelEnabled ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
                    {isAdminPanelEnabled ? 'ENABLED (Multi-Branch Command)' : 'DISABLED (Manager-Only Mode)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isAdminPanelEnabled
                    ? 'Owner has full Admin Panel to manage staff, multi-branch financial reports, and branch assignments.'
                    : 'Admin panel is turned OFF. The owner operates directly through the Manager Panel for their branch.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleAdminPanel(lib.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                isAdminPanelEnabled
                  ? 'border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25'
                  : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
              }`}
            >
              <KeyRound size={13} />
              <span>{isAdminPanelEnabled ? 'Turn Admin Panel OFF' : 'Turn Admin Panel ON'}</span>
            </button>
          </div>

          {/* Branches Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Store size={15} className="text-indigo-400" />
                <span>Physical Branches under this Admin</span>
              </h3>
              <p className="text-xs text-slate-400">All physical locations share this single tenant identity and billing account.</p>
            </div>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Plus size={13} />
                <span>+ Add Branch</span>
              </button>
            )}
          </div>

          {/* Add Branch Inline Form */}
          {showAddForm && (
            <form onSubmit={handleCreateBranch} className="rounded-xl border border-indigo-500/30 bg-[#0e1333] p-4 space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">New Branch Details</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              {formError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">{formError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Branch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gomti Nagar Branch"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Branch Code / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. GN-02"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lucknow"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 4, Main Market"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Daily Shifts</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={shifts}
                    onChange={(e) => setShifts(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Assigned Branch Manager</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Manager Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                >
                  Provision Branch
                </button>
              </div>
            </form>
          )}

          {/* Branches List */}
          <div className="space-y-3">
            {branches.map((br, idx) => (
              <div
                key={br.id || idx}
                className="rounded-xl border border-indigo-500/20 bg-[#0d102c]/90 p-4 hover:border-indigo-400/40 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {br.code}
                      </span>
                      <h4 className="text-sm font-bold text-white">{br.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        br.status === 'Active'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : br.status === 'Maintenance'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      }`}>
                        {br.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin size={12} className="text-indigo-400 shrink-0" />
                      <span>{br.address || br.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Armchair size={13} className="text-sky-400" />
                      <span className="font-semibold text-white">{br.seats}</span> Seats
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock size={13} className="text-indigo-400" />
                      <span className="font-semibold text-white">{br.shifts}</span> Shifts
                    </div>
                  </div>
                </div>

                {/* Manager Assignment */}
                <div className="mt-3 pt-3 border-t border-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <UserCheck size={13} className="text-emerald-400 shrink-0" />
                    <span>Assigned Manager: <strong className="text-slate-200">{br.managerName || 'Unassigned'}</strong></span>
                  </div>
                  {br.managerPhone && (
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Phone size={11} className="text-teal-400" /> {br.managerPhone}
                      </span>
                      {br.managerEmail && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Mail size={11} className="text-purple-400" /> {br.managerEmail}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/20 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Total Capacity across {branches.length} branches: <strong className="text-white">{branches.reduce((sum, b) => sum + (b.seats || 0), 0)} Seats</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
