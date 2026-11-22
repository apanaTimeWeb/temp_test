'use client';

import React, { useState } from 'react';
import type { SuperadminBranchRecord } from '../types/SuperadminLibrariesOverviewTypes';

interface SuperadminLibrariesBranchAddFormProps {
  libraryLocation: string;
  defaultPhone: string;
  defaultEmail: string;
  totalExistingBranches: number;
  onCancel: () => void;
  onSubmit: (branch: Omit<SuperadminBranchRecord, 'id'>) => void;
}

export default function SuperadminLibrariesBranchAddForm({
  libraryLocation,
  defaultPhone,
  defaultEmail,
  totalExistingBranches,
  onCancel,
  onSubmit,
}: SuperadminLibrariesBranchAddFormProps) {
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [city, setCity] = useState(libraryLocation || '');
  const [address, setAddress] = useState('');
  const [seats, setSeats] = useState(100);
  const [shifts, setShifts] = useState(3);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) {
      setFormError('Please enter a branch name.');
      return;
    }
    onSubmit({
      name: branchName.trim(),
      code: branchCode.trim() || `BR-0${totalExistingBranches + 1}`,
      city: city.trim() || libraryLocation,
      address: address.trim() || `${city} Campus`,
      seats: Number(seats) || 100,
      shifts: Number(shifts) || 3,
      managerName: managerName.trim() || 'Assigned by Admin',
      managerPhone: managerPhone.trim() || defaultPhone,
      managerEmail: managerEmail.trim() || defaultEmail,
      status: 'Active',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-indigo-500/30 bg-[#0e1333] p-4 space-y-3.5 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">New Branch Details</h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-white text-xs cursor-pointer"
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
          <input maxLength={100}
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
          <input maxLength={30}
            type="text"
            placeholder="e.g. GN-02"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
          <input maxLength={100}
            type="text"
            placeholder="e.g. Lucknow"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Street Address</label>
          <input maxLength={250}
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
          <input maxLength={100}
            type="text"
            placeholder="e.g. Priya Sharma"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-indigo-500/30 bg-input text-white focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Manager Phone</label>
          <input maxLength={100}
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
          onClick={onCancel}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
        >
          Provision Branch
        </button>
      </div>
    </form>
  );
}
