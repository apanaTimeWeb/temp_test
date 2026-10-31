'use client';
// RESPONSIBILITY: Render the members new admission admission enrollment section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { Armchair, FileText, Layers, Lock } from 'lucide-react';
import type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';

export type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps };

export function ManagerMembersNewAdmissionAdmissionEnrollmentSection({ register, errors }: ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-enrollment">
      <div className="mgr-card-header">
        <div className="mgr-section-number">02</div>
        <h2 id="manager-students-admission-enrollment" className="mgr-section-title">{tManagerUi('seat_membership')}</h2>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          {/* Floor Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-floor">Floor Allotment</label>
            <div className="mgr-input-icon-wrap">
              <Layers size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-floor" {...register('floor')} className="mgr-select mgr-input-with-icon">
                <option value="1">1st Floor (General Study Hall)</option>
                <option value="2">2nd Floor (Silent Zone / AC)</option>
                <option value="3">3rd Floor (Reserved / Dedicated Cabin)</option>
              </select>
            </div>
          </div>

          {/* Shift Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-shift">{tManagerUi('shift')}</label>
            <div className="mgr-input-icon-wrap">
              <FileText size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-shift" {...register('shift')} className={`mgr-select mgr-input-with-icon${errors.shift ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.shift)}>
                <option value="">-- Select Shift --</option>
                <option value="Morning">Morning Shift (06:00 AM – 02:00 PM)</option>
                <option value="Evening">Evening Shift (02:00 PM – 10:00 PM)</option>
                <option value="Full Day">Full Day Shift (06:00 AM – 10:00 PM)</option>
                <option value="Night">Night Shift (10:00 PM – 06:00 AM)</option>
              </select>
            </div>
            {errors.shift && <p className="mgr-error" role="alert">{errors.shift.message}</p>}
          </div>

          {/* Seat Number Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-seat">{tManagerUi('seat_number')}</label>
            <div className="mgr-input-icon-wrap">
              <Armchair size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-seat" {...register('seat')} className={`mgr-select mgr-input-with-icon${errors.seat ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.seat)}>
                <option value="">-- Select Available Seat --</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const seatCode = `S-${String(i + 1).padStart(2, '0')}`;
                  return <option key={seatCode} value={seatCode}>{seatCode} (Available)</option>;
                })}
              </select>
            </div>
            {errors.seat && <p className="mgr-error" role="alert">{errors.seat.message}</p>}
          </div>

          {/* Locker Selection */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-locker">{tManagerUi('locker_optional')}</label>
            <div className="mgr-input-icon-wrap">
              <Lock size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-locker" {...register('locker')} className="mgr-select mgr-input-with-icon">
                <option value="">No Locker Required</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const lockerCode = `L-${String(i + 1).padStart(2, '0')}`;
                  return <option key={lockerCode} value={lockerCode}>{lockerCode} (Available - ₹200/mo)</option>;
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
