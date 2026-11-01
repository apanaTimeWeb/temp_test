'use client';
// RESPONSIBILITY: Tab field views for editing member profile attributes.

import React from 'react';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export type EditTab = 'personal' | 'seat_locker' | 'guardian_goal' | 'plan_status';

export interface ManagerMembersDirectoryEditFormTabsProps {
  activeTab: EditTab;
  formData: ManagerMembersDirectoryRecord;
  onChange: (field: keyof ManagerMembersDirectoryRecord, value: string) => void;
}

const SHIFTS = [
  'Morning (06:00 AM – 02:00 PM)',
  'Evening (02:00 PM – 10:00 PM)',
  'Full Day (06:00 AM – 10:00 PM)',
  'Night (10:00 PM – 06:00 AM)',
];
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
    return (
      <div className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-seat" className="block text-xs font-semibold text-secondary mb-1">Assigned Seat (e.g. S-01, S-12)</label>
            <input id="edit-member-seat" type="text" placeholder="S-01" className="mgr-input w-full font-bold uppercase" value={formData.seat || ''} onChange={(e) => onChange('seat', e.target.value)} />
            <p className="text-[11px] text-secondary mt-0.5">Leave blank if unassigned.</p>
          </div>
          <div>
            <label htmlFor="edit-member-locker" className="block text-xs font-semibold text-secondary mb-1">Assigned Locker (e.g. L-04, None)</label>
            <input id="edit-member-locker" type="text" placeholder="L-04" className="mgr-input w-full font-bold uppercase" value={formData.locker || ''} onChange={(e) => onChange('locker', e.target.value)} />
            <p className="text-[11px] text-secondary mt-0.5">Specify locker ID or type None.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="edit-member-shift" className="block text-xs font-semibold text-secondary mb-1">Shift Timing</label>
            <select id="edit-member-shift" className="mgr-input w-full" value={formData.shift || SHIFTS[0]} onChange={(e) => onChange('shift', e.target.value)}>
              {SHIFTS.map((shift) => <option key={shift} value={shift}>{shift}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="edit-member-floor" className="block text-xs font-semibold text-secondary mb-1">Floor Allocation</label>
            <select id="edit-member-floor" className="mgr-input w-full" value={formData.floor || FLOORS[1]} onChange={(e) => onChange('floor', e.target.value)}>
              {FLOORS.map((floor) => <option key={floor} value={floor}>{floor}</option>)}
            </select>
          </div>
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
