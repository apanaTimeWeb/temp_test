'use client';
// RESPONSIBILITY: Render form fields for editing branch location, contact, manager, and software module entitlements.
import { MapPin, Armchair, Clock, Calendar, ShieldCheck } from 'lucide-react';

interface SuperadminBranchesOverviewEditModalFieldsProps {
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  pinCode: string;
  setPinCode: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  managerName: string;
  setManagerName: (val: string) => void;
  managerEmail: string;
  setManagerEmail: (val: string) => void;
  managerPhone: string;
  setManagerPhone: (val: string) => void;
  capacity: number;
  setCapacity: (val: number) => void;
  workingHours: string;
  setWorkingHours: (val: string) => void;
  weeklyHolidays: string;
  setWeeklyHolidays: (val: string) => void;
  modules: Record<string, boolean>;
  onToggleModule: (key: string) => void;
}

export default function SuperadminBranchesOverviewEditModalFields({
  city,
  setCity,
  state,
  setState,
  pinCode,
  setPinCode,
  address,
  setAddress,
  phone,
  setPhone,
  email,
  setEmail,
  managerName,
  setManagerName,
  managerEmail,
  setManagerEmail,
  managerPhone,
  setManagerPhone,
  capacity,
  setCapacity,
  workingHours,
  setWorkingHours,
  weeklyHolidays,
  setWeeklyHolidays,
  modules,
  onToggleModule,
}: SuperadminBranchesOverviewEditModalFieldsProps) {
  return (
    <>
      {/* Location & Contact */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-3">
        <p className="text-xs font-bold text-primary flex items-center gap-1.5">
          <MapPin size={13} /> Location & Address Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">City *</label>
            <input
              maxLength={100}
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">State</label>
            <input
              maxLength={100}
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">PIN Code</label>
            <input
              maxLength={30}
              type="text"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground font-mono focus:border-primary outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-secondary mb-1">Premises Address</label>
          <input
            maxLength={250}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">Branch Help Desk Phone</label>
            <input
              maxLength={15}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">Branch Help Desk Email</label>
            <input
              maxLength={254}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* Assigned Manager */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-info">Branch Manager Assignment</p>
          <span className="text-[10px] text-muted">Scoped operational desk credentials</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">Manager Name *</label>
            <input
              maxLength={100}
              type="text"
              required
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">Manager Email</label>
            <input
              maxLength={254}
              type="email"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">Manager Mobile</label>
            <input
              maxLength={15}
              type="tel"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* Operations & Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card">
          <label className="block text-xs font-semibold text-secondary mb-1 flex items-center gap-1">
            <Armchair size={13} className="text-warning" />
            <span>Seat Capacity</span>
          </label>
          <input
            type="number"
            min={10}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground font-mono focus:border-primary outline-none"
          />
        </div>
        <div className="p-3 rounded-xl border border-border bg-card">
          <label className="block text-xs font-semibold text-secondary mb-1 flex items-center gap-1">
            <Clock size={13} className="text-primary" />
            <span>Working Hours</span>
          </label>
          <input
            maxLength={100}
            type="text"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
          />
        </div>
        <div className="p-3 rounded-xl border border-border bg-card">
          <label className="block text-xs font-semibold text-secondary mb-1 flex items-center gap-1">
            <Calendar size={13} className="text-warning" />
            <span>Weekly Holidays</span>
          </label>
          <input
            maxLength={30}
            type="text"
            value={weeklyHolidays}
            onChange={(e) => setWeeklyHolidays(e.target.value)}
            className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Module Entitlements Control */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" />
          <span>Branch Operational Modules (SuperAdmin Entitlements)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {Object.entries(modules).map(([key, enabled]) => (
            <button
              type="button"
              key={key}
              onClick={() => onToggleModule(key)}
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                enabled
                  ? 'border-success-border bg-success-bg text-success'
                  : 'border-border bg-surface text-muted hover:border-border-hover'
              }`}
            >
              <span className="capitalize font-medium">{key.replace('_', ' ')}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  enabled ? 'bg-success-bg text-success' : 'bg-surface-elevated text-muted'
                }`}
              >
                {enabled ? 'Active' : 'Disabled'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
