'use client';
// RESPONSIBILITY: Render the members new admission admission personal section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { Award, BookOpen, Calendar, Camera, GraduationCap, Mail, MapPin, Phone, ShieldAlert, User, Building, HeartPulse, Activity, Accessibility } from 'lucide-react';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';
import type { ManagerMembersNewAdmissionAdmissionPersonalSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';

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

  const referralOptions: ComboboxOption[] = useMemo(() => {
    return [
      { value: 'Direct Walk-in', label: 'Direct Walk-in / Self (No Referral)', badge: 'Default' },
      ...MANAGER_MEMBERS_DEMO_RECORDS.map((r) => ({
        value: `${r.id} (${r.name})`,
        label: `${r.name} (${r.id})`,
        subLabel: `Phone: ${r.phone} · Seat: ${r.seat || 'General'}`,
        badge: r.status,
      })),
    ];
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setPhotoPreview(res);
        if (setValue) {
          setValue('photoUrl', res, { shouldDirty: true, shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
    }
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
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Member preview" className="w-full h-full object-cover" />
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
            <label className="mgr-label mgr-label-required" htmlFor="admission-full-name">{tManagerUi('full_name')}</label>
            <div className="mgr-input-icon-wrap">
              <User size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-full-name" {...register('fullName')} className={`mgr-input mgr-input-with-icon${errors.fullName ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'admission-full-name-error' : undefined} placeholder={tManagerUi('enter_student_full_name')} />
            </div>
            {errors.fullName && <p id="admission-full-name-error" className="mgr-error" role="alert">{errors.fullName.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-phone">{tManagerUi('phone_number')}</label>
            <div className="mgr-input-icon-wrap">
              <Phone size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-phone" {...register('phone')} type="tel" className={`mgr-input mgr-input-with-icon${errors.phone ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'admission-phone-error' : undefined} placeholder="9876543210" />
            </div>
            {errors.phone && <p id="admission-phone-error" className="mgr-error" role="alert">{errors.phone.message}</p>}
          </div>

          {/* Email Address */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-email">Email Address</label>
            <div className="mgr-input-icon-wrap">
              <Mail size={18} strokeWidth={2} className="mgr-input-icon" />
              <input
                id="admission-email"
                {...register('email')}
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'admission-email-error' : undefined}
                className={`mgr-input mgr-input-with-icon${errors.email ? ' mgr-input-error' : ''}`}
                placeholder="student@example.com"
              />
            </div>
            {errors.email && <p id="admission-email-error" className="mgr-error" role="alert">{errors.email.message}</p>}
          </div>

          {/* Gender */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-gender">Gender</label>
            <select
              id="admission-gender"
              {...register('gender')}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.gender)}
              aria-describedby={errors.gender ? 'admission-gender-error' : undefined}
              className={`mgr-select${errors.gender ? ' mgr-input-error' : ''}`}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p id="admission-gender-error" className="mgr-error" role="alert">{errors.gender.message}</p>}
          </div>

          {/* Date of Birth */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-dob">Date of Birth</label>
            <div className="mgr-input-icon-wrap">
              <Calendar size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-dob" {...register('dob')} type="date" className="mgr-input mgr-input-with-icon" />
            </div>
          </div>

          {/* Full Address */}
          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label" htmlFor="admission-address">Permanent / Local Address</label>
            <div className="mgr-input-icon-wrap">
              <MapPin size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-address" {...register('address')} type="text" className="mgr-input mgr-input-with-icon" placeholder="House/Flat No, Street, Landmark, City, Pincode" />
            </div>
          </div>

          {/* Guardian / Parent Name */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-parent-name">Parent / Guardian Name</label>
            <div className="mgr-input-icon-wrap">
              <User size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-parent-name" {...register('parentName')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Guardian Full Name (Father/Mother)" />
            </div>
          </div>

          {/* Guardian Phone */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-parent-phone">Parent / Guardian Phone</label>
            <div className="mgr-input-icon-wrap">
              <ShieldAlert size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-parent-phone" {...register('parentPhone')} type="tel" className="mgr-input mgr-input-with-icon" placeholder="Emergency contact number" />
            </div>
          </div>

          {/* College / University (Optional) */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-college">
              College / Institute Name <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <GraduationCap size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-college" {...register('college')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Delhi University / Self-Study" />
            </div>
          </div>

          {/* Preparation For */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-preparation">Preparation For (Target Exam)</label>
            <div className="mgr-input-icon-wrap">
              <BookOpen size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-preparation" {...register('preparationFor')} className="mgr-select mgr-input-with-icon">
                <option value="UPSC Civil Services">UPSC Civil Services</option>
                <option value="State PSC">State PSC (BPSC/UPPSC/MPPSC)</option>
                <option value="SSC & Banking">SSC / Banking Exams</option>
                <option value="Medical Entrance (NEET/AIIMS)">Medical Entrance (NEET)</option>
                <option value="Engineering Entrance (JEE/GATE)">Engineering Entrance (JEE/GATE)</option>
                <option value="Chartered Accountancy (CA/CS)">Chartered Accountancy (CA/CS)</option>
                <option value="Judiciary / Law Entrance (CLAT)">Judiciary / Law Entrance (CLAT)</option>
                <option value="College Semester Studies">College Semester Studies</option>
                <option value="Other Competitive Exams">Other Competitive Exams</option>
              </select>
            </div>
          </div>

          {/* Library Branch (Locked to Manager's Assigned Branch) */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-branch">
              Library Branch <span className="text-xs font-semibold text-success">(Current Branch)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <Building size={18} strokeWidth={2} className="mgr-input-icon text-primary" />
              <input
                id="admission-branch"
                type="text"
                readOnly
                value="Main Central Branch (Sector 14)"
                className="mgr-input mgr-input-with-icon bg-surface font-semibold text-primary cursor-not-allowed"
                title="Branch is fixed to manager's authorized branch"
              />
              <input type="hidden" {...register('branch')} value="Main Central Branch" />
            </div>
          </div>

          {/* Blood Group */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-blood-group">Blood Group</label>
            <div className="mgr-input-icon-wrap">
              <HeartPulse size={18} strokeWidth={2} className="mgr-input-icon text-danger" />
              <select id="admission-blood-group" {...register('bloodGroup')} className="mgr-select mgr-input-with-icon">
                <option value="">-- Select Blood Group (Optional) --</option>
                <option value="B+">B+ (Positive)</option>
                <option value="A+">A+ (Positive)</option>
                <option value="O+">O+ (Positive)</option>
                <option value="AB+">AB+ (Positive)</option>
                <option value="B-">B- (Negative)</option>
                <option value="A-">A- (Negative)</option>
                <option value="O-">O- (Negative)</option>
                <option value="AB-">AB- (Negative)</option>
              </select>
            </div>
          </div>

          {/* Medical Issues (Optional) */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-medical-issues">Medical Issues / Allergies (Optional)</label>
            <div className="mgr-input-icon-wrap">
              <Activity size={18} strokeWidth={2} className="mgr-input-icon text-warning" />
              <input id="admission-medical-issues" {...register('medicalIssues')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Asthma, Dust Allergy, None" />
            </div>
          </div>

          {/* Disability / Special Needs (Optional) */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-disability">Disability / Special Needs (Optional)</label>
            <div className="mgr-input-icon-wrap">
              <Accessibility size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-disability" {...register('disability')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Wheelchair access, None" />
            </div>
          </div>

          {/* Referred By (Optional + Searchable Combobox) */}
          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label" htmlFor="admission-referred-by">
              Referred By (Student ID / Name) <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <SearchableCombobox
              id="admission-referred-by"
              options={referralOptions}
              value={watchedReferredBy || 'Direct Walk-in'}
              onChange={(val) => {
                if (setValue) {
                  setValue('referredBy', val, { shouldDirty: true, shouldValidate: true });
                }
              }}
              placeholder="Search student referrer by name or smart ID..."
              searchPlaceholder="Type name or LIB-ID..."
              aria-label="Referred by student selector"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
