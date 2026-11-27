'use client';
// RESPONSIBILITY: Render the members new admission admission personal section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerMembersNewAdmissionPersonalExtendedFields } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionPersonalExtendedFields';
import type { ManagerMembersNewAdmissionAdmissionPersonalSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
import { Camera, Mail, Phone, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export type { ManagerMembersNewAdmissionAdmissionPersonalSectionProps };

export function ManagerMembersNewAdmissionAdmissionPersonalSection({
  register,
  errors,
  setValue,
  watch,
}: ManagerMembersNewAdmissionAdmissionPersonalSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const watchedReferredBy = watch ? watch('referredBy') : '';
  const watchedGender = watch ? watch('gender') : '';
  const watchedPrep = watch ? watch('preparationFor') : '';
  const watchedBloodGroup = watch ? watch('bloodGroup') : '';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setPhotoPreview(res);
      setValue?.('photoUrl', res, { shouldDirty: true, shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-personal">
      <div className="mgr-card-header">
        <div className="mgr-section-number">01</div>
        <h2 id="manager-students-admission-personal" className="mgr-section-title">{tManagerUi('personal_information')}</h2>
      </div>
      <div className="mgr-card-body">
        {/* Photo Upload Row */}
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-border bg-floating">
          <div className="relative w-20 h-20 rounded-full bg-surface-zebra border-2 border-dashed border-border flex items-center justify-center overflow-hidden shrink-0">
            {photoPreview ? (
              <Image src={photoPreview} alt="Member preview" fill unoptimized className="object-cover" />
            ) : (
              <Camera size={26} className="text-secondary" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-primary">Member Photo / Avatar</p>
            <p className="text-xs text-secondary mb-2">Upload a passport-size photo during registration (JPG, PNG, max 2MB)</p>
            <label className="mgr-btn-ghost mgr-btn-sm inline-flex items-center gap-2 cursor-pointer">
              <Camera size={14} />
              <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        <div className="mgr-form-grid">
          {/* Full Name */}
          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label mgr-label-required" htmlFor="admission-full-name">
              {tManagerUi('full_name')}
            </label>
            <div className="mgr-input-icon-wrap">
              <User size={18} strokeWidth={2} className="mgr-input-icon" />
              <input maxLength={30}
                id="admission-full-name"
                {...register('fullName')}
                className={`mgr-input mgr-input-with-icon${errors.fullName ? ' mgr-input-error' : ''}`}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'admission-full-name-error' : undefined}
                placeholder={tManagerUi('enter_student_full_name')}
              />
            </div>
            {errors.fullName && <p id="admission-full-name-error" className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.fullName.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-phone">
              {tManagerUi('phone_number')}
            </label>
            <div className="mgr-input-icon-wrap">
              <Phone size={18} strokeWidth={2} className="mgr-input-icon" />
              <input
                id="admission-phone" {...register('phone', {
                  onChange: (e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    e.target.value = clean;
                    if (setValue) {
                      setValue('phone', clean, { shouldValidate: true, shouldDirty: true });
                    }
                  },
                })}
                onKeyDown={(e) => {
                  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End'].includes(e.key)) return;
                  if (e.ctrlKey || e.metaKey) return;
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                type="tel"
                maxLength={10}
                className={`mgr-input mgr-input-with-icon${errors.phone ? ' mgr-input-error' : ''}`}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'admission-phone-error' : undefined}
                placeholder="10-digit mobile number"
              />
            </div>
            {errors.phone && <p id="admission-phone-error" className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.phone.message}</p>}
          </div>

          {/* Email Address */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-email">
              Email Address <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <Mail size={18} strokeWidth={2} className="mgr-input-icon" />
              <input maxLength={30}
                id="admission-email"
                {...register('email')}
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'admission-email-error' : undefined}
                className={`mgr-input mgr-input-with-icon${errors.email ? ' mgr-input-error' : ''}`}
                placeholder="student@example.com"
              />
            </div>
            {errors.email && <p id="admission-email-error" className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.email.message}</p>}
          </div>

          <ManagerMembersNewAdmissionPersonalExtendedFields
            register={register}
            errors={errors}
            setValue={setValue}
            watchedGender={watchedGender || ''}
            watchedPrep={watchedPrep || ''}
            watchedBloodGroup={watchedBloodGroup || ''}
            watchedReferredBy={watchedReferredBy || ''}
          />
        </div>
      </div>
    </section>
  );
}
