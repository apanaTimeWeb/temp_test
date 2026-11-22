'use client';
// RESPONSIBILITY: Render form fields for branch location, manager, and operational schedule.
import { MapPin, Armchair, Clock, Calendar } from 'lucide-react';

interface SuperadminBranchesOverviewCreateModalFieldsProps {
  city: string;
  onCityChange: (val: string) => void;
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
}

export default function SuperadminBranchesOverviewCreateModalFields({
  city,
  onCityChange,
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
}: SuperadminBranchesOverviewCreateModalFieldsProps) {
  return (
    <>
      {/* Location & Address */}
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
              placeholder="e.g. New Delhi"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">State</label>
            <input
              maxLength={100}
              type="text"
              placeholder="e.g. Delhi NCR"
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
              placeholder="e.g. 110001"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground font-mono focus:border-primary outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-secondary mb-1">Premises / Street Address</label>
          <input
            maxLength={250}
            type="text"
            placeholder="Plot/Floor, Road or Landmark..."
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
              placeholder="+91 "
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
              placeholder="branch@library.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* Branch Manager Assignment */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-info">Branch Manager Assignment</p>
          <span className="text-[10px] text-muted">Scoped operational access strictly to this branch</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-secondary mb-1">Manager Name *</label>
            <input
              maxLength={100}
              type="text"
              required
              placeholder="e.g. Rohan Sharma"
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
              placeholder="rohan@library.org"
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
              placeholder="+91 "
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
    </>
  );
}
