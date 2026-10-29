'use client';
// RESPONSIBILITY: Render the members group admission admission personal section section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members group admission admission personal section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { Phone, User } from 'lucide-react';
import type { ManagerMembersGroupAdmissionAdmissionPersonalSectionProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';
export type { ManagerMembersGroupAdmissionAdmissionPersonalSectionProps };





export function ManagerMembersGroupAdmissionAdmissionPersonalSection({ register, errors }: ManagerMembersGroupAdmissionAdmissionPersonalSectionProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');
  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-personal">
      <div className="mgr-card-header"><div className="mgr-section-number">01</div><h2 id="manager-students-admission-personal" className="mgr-section-title">{tManagerUi('personal_information')}</h2></div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label mgr-label-required" htmlFor="admission-full-name">{tManagerUi('full_name')}</label>
            <div className="mgr-input-icon-wrap"><User size={18} strokeWidth={2} className="mgr-input-icon" /><input id="admission-full-name" {...register('fullName')} className={`mgr-input mgr-input-with-icon${errors.fullName ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'admission-full-name-error' : undefined} placeholder={tManagerUi('enter_student_full_name')} /></div>
            {errors.fullName && <p id="admission-full-name-error" className="mgr-error" role="alert">{errors.fullName.message}</p>}
          </div>
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-phone">{tManagerUi('phone_number')}</label>
            <div className="mgr-input-icon-wrap"><Phone size={18} strokeWidth={2} className="mgr-input-icon" /><input id="admission-phone" {...register('phone')} type="tel" className={`mgr-input mgr-input-with-icon${errors.phone ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admission-phone-error' : undefined} placeholder="9876543210" /></div>
            {errors.phone && <p id="admission-phone-error" className="mgr-error" role="alert">{errors.phone.message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
