'use client';
// RESPONSIBILITY: Render the members new admission admission enrollment section section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members new admission admission enrollment section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { Armchair, FileText, Layers, Lock } from 'lucide-react';
import type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
export type { ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps };





export function ManagerMembersNewAdmissionAdmissionEnrollmentSection({ register, errors }: ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-enrollment">
      <div className="mgr-card-header"><div className="mgr-section-number">02</div><h2 id="manager-students-admission-enrollment" className="mgr-section-title">{tManagerUi('seat_membership')}</h2></div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-floor">Floor Allotment</label>
            <div className="mgr-input-icon-wrap"><Layers size={18} strokeWidth={2} className="mgr-input-icon" /><select id="admission-floor" className="mgr-select mgr-input-with-icon"><option value="1">1st Floor (General Study)</option><option value="2">2nd Floor (Silent Zone)</option><option value="3">3rd Floor (Reserved/Cabin)</option></select></div>
          </div>
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-shift">{tManagerUi('shift')}</label>
            <div className="mgr-input-icon-wrap"><FileText size={18} strokeWidth={2} className="mgr-input-icon" /><select id="admission-shift" {...register('shift')} disabled className={`mgr-select mgr-input-with-icon${errors.shift ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.shift)}><option value="">{tManagerUi('admission_unavailable')}</option></select></div>
            {errors.shift && <p className="mgr-error" role="alert">{errors.shift.message}</p>}
          </div>
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-seat">{tManagerUi('seat_number')}</label>
            <div className="mgr-input-icon-wrap"><Armchair size={18} strokeWidth={2} className="mgr-input-icon" /><select id="admission-seat" {...register('seat')} disabled className={`mgr-select mgr-input-with-icon${errors.seat ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.seat)}><option value="">{tManagerUi('admission_unavailable')}</option></select></div>
            {errors.seat && <p className="mgr-error" role="alert">{errors.seat.message}</p>}
          </div>
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-locker">{tManagerUi('locker_optional')}</label>
            <div className="mgr-input-icon-wrap"><Lock size={18} strokeWidth={2} className="mgr-input-icon" /><select id="admission-locker" {...register('locker')} disabled className="mgr-select mgr-input-with-icon"><option value="">{tManagerUi('admission_unavailable')}</option></select></div>
          </div>
        </div>
      </div>
    </section>
  );
}
