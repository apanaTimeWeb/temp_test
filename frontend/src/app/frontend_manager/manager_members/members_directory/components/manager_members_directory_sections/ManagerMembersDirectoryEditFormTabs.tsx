'use client';
// RESPONSIBILITY: Tab field views for editing member profile attributes with multi-shift support and seat/locker dropdowns.

import React from 'react';
import { Check } from 'lucide-react';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export type EditTab = 'personal' | 'seat_locker' | 'guardian_goal' | 'plan_status';

export interface ManagerMembersDirectoryEditFormTabsProps {
  activeTab: EditTab;
  formData: ManagerMembersDirectoryRecord;
  onChange: (field: keyof ManagerMembersDirectoryRecord, value: string) => void;
}

const SHIFT_OPTIONS = [
  { id: 'Morning', label: 'Morning Shift', hours: '06:00 AM – 02:00 PM', badge: '8 Hrs', fullName: 'Morning (06:00 AM – 02:00 PM)' },
  { id: 'Evening', label: 'Evening Shift', hours: '02:00 PM – 10:00 PM', badge: '8 Hrs', fullName: 'Evening (02:00 PM – 10:00 PM)' },
  { id: 'Night', label: 'Night Shift', hours: '10:00 PM – 06:00 AM', badge: '8 Hrs', fullName: 'Night (10:00 PM – 06:00 AM)' },
  { id: 'Full Day', label: 'Full Day Access', hours: '06:00 AM – 10:00 PM', badge: '16 Hrs', fullName: 'Full Day (06:00 AM – 10:00 PM)' },
];

const SEAT_PRESETS = Array.from({ length: 30 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`);
const LOCKER_PRESETS = Array.from({ length: 20 }, (_, i) => `L-${String(i + 1).padStart(2, '0')}`);
const FLOORS = ['Ground Floor (AC Hall)', '1st Floor (General Study)', '2nd Floor (Silent Zone)'];
const GOALS = ['UPSC Civil Services', 'State PSC', 'SSC CGL / CHSL', 'Banking / IBPS / SBI', 'NEET (Medical)', 'JEE (Engineering)', 'CA / CS / Commerce', 'General Studies & Research'];

export function ManagerMembersDirectoryEditFormTabs({ activeTab, formData, onChange }: ManagerMembersDirectoryEditFormTabsProps) {
  if (activeTab === 'personal') {
    return (
      <div className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-name" className="block text-xs font-semibold text-secondary mb-1">Student Full Name *</label>
            <input id="edit-member-name" type="text" required className="mgr-input w-full" value={formData.name} onChange={(e) => onChange('name', e.target.value)} />
          </div>
          <div>
            <label htmlFor="edit-member-phone" className="block text-xs font-semibold text-secondary mb-1">Phone Number *</label>
            <input id="edit-member-phone" type="tel" required className="mgr-input w-full font-mono" value={formData.phone} onChange={(e) => onChange('phone', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-email" className="block text-xs font-semibold text-secondary mb-1">Email Address</label>
            <input id="edit-member-email" type="email" className="mgr-input w-full" value={formData.email || ''} onChange={(e) => onChange('email', e.target.value)} />
          </div>
          <div>
            <label htmlFor="edit-member-gender" className="block text-xs font-semibold text-secondary mb-1">Gender</label>
            <select id="edit-member-gender" className="mgr-input w-full" value={formData.gender || 'Male'} onChange={(e) => onChange('gender', e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-dob" className="block text-xs font-semibold text-secondary mb-1">Date of Birth</label>
            <input id="edit-member-dob" type="date" className="mgr-input w-full" value={formData.dob || ''} onChange={(e) => onChange('dob', e.target.value)} />
          </div>
          <div>
            <label htmlFor="edit-member-address" className="block text-xs font-semibold text-secondary mb-1">Residential Address</label>
            <input id="edit-member-address" type="text" className="mgr-input w-full" value={formData.address || ''} onChange={(e) => onChange('address', e.target.value)} />
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'seat_locker') {
    const currentShiftStr = formData.shift || '';
    const isShiftActive = (shiftId: string) => currentShiftStr.toLowerCase().includes(shiftId.toLowerCase());

    const toggleShift = (shiftId: string) => {
      let nextShifts: string[];
      const activeIds = SHIFT_OPTIONS.filter((s) => isShiftActive(s.id)).map((s) => s.id);

      if (shiftId === 'Full Day') {
        nextShifts = activeIds.includes('Full Day') ? [] : ['Full Day'];
      } else {
        const withoutFull = activeIds.filter((s) => s !== 'Full Day');
        if (withoutFull.includes(shiftId)) {
          nextShifts = withoutFull.filter((s) => s !== shiftId);
        } else {
          nextShifts = [...withoutFull, shiftId];
        }
      }

      const consolidated = nextShifts.map((id) => SHIFT_OPTIONS.find((s) => s.id === id)?.fullName || id).join(' + ');
      onChange('shift', consolidated);
    };

    const allSeats = formData.seat && !SEAT_PRESETS.includes(formData.seat) ? [formData.seat, ...SEAT_PRESETS] : SEAT_PRESETS;
    const allLockers = formData.locker && formData.locker !== 'None' && !LOCKER_PRESETS.includes(formData.locker) ? [formData.locker, ...LOCKER_PRESETS] : LOCKER_PRESETS;

    return (
      <div className="space-y-4">
        {/* Multi-Shift Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-secondary">
              Shift Timing (Select Multiple Shifts) *
            </label>
            <span className="text-[11px] text-info font-medium">
              {formData.shift ? 'Multi-Shift Active' : 'Select at least 1 shift'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SHIFT_OPTIONS.map((shift) => {
              const isSelected = isShiftActive(shift.id);
              return (
                <button
                  type="button"
                  key={shift.id}
                  onClick={() => toggleShift(shift.id)}
                  aria-pressed={isSelected}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary text-primary'
                      : 'border-border bg-card hover:bg-surface-hover text-secondary'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                      {isSelected ? <Check size={13} className="text-primary" /> : null}
                      {shift.label}
                    </p>
                    <p className="text-[11px] text-secondary mt-0.5">{shift.hours}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-primary text-on-primary' : 'bg-surface border border-border'
                  }`}>
                    {shift.badge}
                  </span>
                </button>
              );
            })}
          </div>
          {formData.shift && (
            <p className="text-[11px] text-secondary mt-1.5 bg-surface-highlight p-2 rounded-lg border border-border font-mono">
              Selected: <span className="font-semibold text-primary">{formData.shift}</span>
            </p>
          )}
        </div>

        {/* Assigned Seat & Locker Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-seat" className="block text-xs font-semibold text-secondary mb-1">
              Assigned Seat Dropdown
            </label>
            <select
              id="edit-member-seat"
              className="mgr-input w-full font-bold uppercase"
              value={formData.seat || ''}
              onChange={(e) => onChange('seat', e.target.value)}
            >
              <option value="">-- Unassigned / Floating Seat --</option>
              {allSeats.map((seat) => (
                <option key={seat} value={seat}>{seat} (Desk #{seat.replace('S-', '')})</option>
              ))}
            </select>
            <p className="text-[11px] text-secondary mt-0.5">Select a library seat from the list.</p>
          </div>

          <div>
            <label htmlFor="edit-member-locker" className="block text-xs font-semibold text-secondary mb-1">
              Assigned Locker Dropdown
            </label>
            <select
              id="edit-member-locker"
              className="mgr-input w-full font-bold uppercase"
              value={formData.locker || ''}
              onChange={(e) => onChange('locker', e.target.value)}
            >
              <option value="">-- No Locker (Unallocated) --</option>
              {allLockers.map((locker) => (
                <option key={locker} value={locker}>{locker} (Locker #{locker.replace('L-', '')})</option>
              ))}
            </select>
            <p className="text-[11px] text-secondary mt-0.5">Select a locker box from the list.</p>
          </div>
        </div>

        {/* Floor Allocation Dropdown */}
        <div>
          <label htmlFor="edit-member-floor" className="block text-xs font-semibold text-secondary mb-1">
            Floor Allocation
          </label>
          <select
            id="edit-member-floor"
            className="mgr-input w-full"
            value={formData.floor || FLOORS[1]}
            onChange={(e) => onChange('floor', e.target.value)}
          >
            {FLOORS.map((floor) => (
              <option key={floor} value={floor}>{floor}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (activeTab === 'guardian_goal') {
    return (
      <div className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-guardian" className="block text-xs font-semibold text-secondary mb-1">Parent / Guardian Name</label>
            <input id="edit-member-guardian" type="text" placeholder="Ramesh Sharma (Father)" className="mgr-input w-full" value={formData.guardian || ''} onChange={(e) => onChange('guardian', e.target.value)} />
          </div>
          <div>
            <label htmlFor="edit-member-emergency" className="block text-xs font-semibold text-secondary mb-1">Guardian Emergency Contact</label>
            <input id="edit-member-emergency" type="tel" placeholder="9876543210" className="mgr-input w-full font-mono" value={formData.emergencyContact || ''} onChange={(e) => onChange('emergencyContact', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-preparation" className="block text-xs font-semibold text-secondary mb-1">Target Exam / Goal</label>
            <select id="edit-member-preparation" className="mgr-input w-full" value={formData.preparationFor || GOALS[0]} onChange={(e) => onChange('preparationFor', e.target.value)}>
              {GOALS.map((prep) => <option key={prep} value={prep}>{prep}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edit-member-department" className="block text-xs font-semibold text-secondary mb-1">Course / College / Department</label>
            <input id="edit-member-department" type="text" placeholder="B.Tech / General Studies" className="mgr-input w-full" value={formData.department || ''} onChange={(e) => onChange('department', e.target.value)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label htmlFor="edit-member-plan" className="block text-xs font-semibold text-secondary mb-1">Membership Plan</label>
          <select id="edit-member-plan" className="mgr-input w-full" value={formData.type} onChange={(e) => onChange('type', e.target.value)}>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label htmlFor="edit-member-status" className="block text-xs font-semibold text-secondary mb-1">Account Status</label>
          <select id="edit-member-status" className="mgr-input w-full" value={formData.status} onChange={(e) => onChange('status', e.target.value as 'Active' | 'Expired' | 'Suspended')}>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div>
          <label htmlFor="edit-member-expiry" className="block text-xs font-semibold text-secondary mb-1">Plan Expiry Date</label>
          <input id="edit-member-expiry" type="date" required className="mgr-input w-full" value={formData.expiryDate} onChange={(e) => onChange('expiryDate', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
