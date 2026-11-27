'use client';

import type { GroupStudentEntry } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal';
import { Building2, Calendar, Droplet, MapPin, ShieldCheck, UserCheck, Wallet } from 'lucide-react';

interface CardExtraFieldsProps {
  row: GroupStudentEntry;
  index: number;
  updateStudent: (index: number, field: keyof GroupStudentEntry, value: string) => void;
}

export function ManagerMembersGroupAdmissionCardExtraFields({ row, index, updateStudent }: CardExtraFieldsProps) {
  return (
    <>
      <div>
        <label className="text-xs font-medium text-secondary block mb-1">Date of Birth (Optional)</label>
        <div className="mgr-input-icon-wrap">
          <Calendar size={15} className="mgr-input-icon text-secondary" />
          <input
            maxLength={100}
            type="date"
            max={new Date().toISOString().split('T')[0]}
            min="1950-01-01"
            className="mgr-input mgr-input-with-icon text-xs"
            value={row.dob || ''}
            onChange={(e) => updateStudent(index, 'dob', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-secondary block mb-1">Blood Group</label>
        <div className="mgr-input-icon-wrap">
          <Droplet size={15} className="mgr-input-icon text-danger opacity-70" />
          <select
            className="mgr-select mgr-input-with-icon text-xs"
            value={row.bloodGroup || ''}
            onChange={(e) => updateStudent(index, 'bloodGroup', e.target.value)}
          >
            <option value="">-- Select Blood Group (Optional) --</option>
            {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-secondary block mb-1">College / Institute (Optional)</label>
        <div className="mgr-input-icon-wrap">
          <Building2 size={15} className="mgr-input-icon text-secondary" />
          <input
            type="text"
            maxLength={80}
            className="mgr-input mgr-input-with-icon text-xs"
            placeholder="e.g. Delhi University"
            value={row.college || ''}
            onChange={(e) => updateStudent(index, 'college', e.target.value.slice(0, 80))}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-secondary block mb-1">Guardian Full Name (Optional)</label>
        <div className="mgr-input-icon-wrap">
          <UserCheck size={15} className="mgr-input-icon text-secondary" />
          <input
            type="text"
            maxLength={50}
            className="mgr-input mgr-input-with-icon text-xs"
            placeholder="Father / Mother Name"
            value={row.guardianName || ''}
            onChange={(e) =>
              updateStudent(index, 'guardianName', e.target.value.replace(/[^a-zA-Z\s.-]/g, '').slice(0, 50))
            }
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-secondary block mb-1">Guardian Phone *</label>
        <div className="mgr-input-icon-wrap">
          <ShieldCheck size={15} className="mgr-input-icon text-primary" />
          <input
            type="tel"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            className={`mgr-input mgr-input-with-icon text-xs font-mono ${
              row.guardianPhone.length > 0 &&
              (!/^[6-9]/.test(row.guardianPhone) ||
                row.guardianPhone.length < 10 ||
                (row.guardianPhone === row.phone && row.phone.length === 10))
                ? 'border-danger focus:border-danger'
                : ''
            }`}
            placeholder="10-digit mobile (6-9)"
            value={row.guardianPhone}
            onChange={(e) => updateStudent(index, 'guardianPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </div>
        {row.guardianPhone.length > 0 && !/^[6-9]/.test(row.guardianPhone) && (
          <p className="text-[11px] text-danger mt-1">Must start with 6, 7, 8, or 9</p>
        )}
        {row.guardianPhone.length > 0 && /^[6-9]/.test(row.guardianPhone) && row.guardianPhone.length < 10 && (
          <p className="text-[11px] text-danger mt-1">{10 - row.guardianPhone.length} more digit(s) needed</p>
        )}
        {row.guardianPhone.length === 10 && row.phone.length === 10 && row.guardianPhone === row.phone && (
          <p className="text-[11px] text-danger mt-1">Guardian number cannot be same as student mobile</p>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-secondary block mb-1">Payment Mode</label>
        <div className="mgr-input-icon-wrap">
          <Wallet size={15} className="mgr-input-icon text-secondary" />
          <select
            className="mgr-select mgr-input-with-icon text-xs"
            value={row.paymentMode || 'Cash'}
            onChange={(e) => updateStudent(index, 'paymentMode', e.target.value)}
          >
            <option value="Cash">Cash Counter</option>
            <option value="UPI">UPI / QR Code</option>
          </select>
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className="text-xs font-medium text-secondary block mb-1">Residential Address (Optional)</label>
        <div className="mgr-input-icon-wrap">
          <MapPin size={15} className="mgr-input-icon text-secondary" />
          <input
            type="text"
            maxLength={150}
            className="mgr-input mgr-input-with-icon text-xs"
            placeholder="Flat / Room, Street, Landmark, City"
            value={row.address || ''}
            onChange={(e) => updateStudent(index, 'address', e.target.value.slice(0, 150))}
          />
        </div>
      </div>
    </>
  );
}
