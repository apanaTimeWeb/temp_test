'use client';
// RESPONSIBILITY: Render the canonical add-enquiry view and preserve incoming route query context.
// DATA FLOW: Enquiries Main -> AddPage -> enquiry form UI.
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useManagerEnquiriesDialogFocus } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/ManagerMembersEnquiriesDialogFocus';

import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';

import { useRouter } from 'next/navigation';
import { useManagerMembersEnquiriesConfirm } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesConfirm.tsx';
import { useManagerMembersEnquiriesUnsavedChangesGuard } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesUnsavedChangesGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneCall, Save, X } from 'lucide-react';
import { managerCrmAddEnquirySchema, type ManagerMembersEnquiriesAddEnquiryFormData } from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import { MANAGER_CRM_SAMPLE_SOURCE_OPTIONS, MANAGER_CRM_SAMPLE_SHIFT_OPTIONS, MANAGER_CRM_SAMPLE_STAFF_OPTIONS } from '@/app/frontend_manager/manager_members/members_enquiries/mocks/manager_members_enquiries_fixtures/ManagerMembersEnquiriesFixtures';
import type { ManagerMembersEnquiriesAddPageRouteProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';



export default function ManagerMembersEnquiriesAddPage(_routeQuery: ManagerMembersEnquiriesAddPageRouteProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const shiftLabel = (name: string) => ({ Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day') } as Record<string, string>)[name] ?? name;
  const shiftTimeLabel = (time: string) => ({
    '6 AM – 12 PM': tManagerUi('shift_time_morning'),
    '12 PM – 5 PM': tManagerUi('shift_time_afternoon'),
    '5 PM – 10 PM': tManagerUi('shift_time_evening'),
    '10 PM – 6 AM': tManagerUi('shift_time_night'),
    '6 AM – 10 PM': tManagerUi('shift_time_full_day'),
  } as Record<string, string>)[time] ?? time;
  const sourceLabel = (source: string) => ({ 'Walk-in': tManagerUi('source_walk_in'), WhatsApp: tManagerUi('source_whatsapp'), Referral: tManagerUi('source_referral'), 'Social Media': tManagerUi('source_social_media'), 'Phone Call': tManagerUi('source_phone_call'), 'Google Ads': tManagerUi('source_google_ads'), Instagram: tManagerUi('source_instagram'), Facebook: tManagerUi('source_facebook'), Other: tManagerUi('source_other') } as Record<string, string>)[source] ?? source;
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);
  const router = useRouter();
  const dialogRef = useRef<HTMLElement>(null);
  const { confirm, dialog: unsavedConfirmDialog } = useManagerMembersEnquiriesConfirm();
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ManagerMembersEnquiriesAddEnquiryFormData>({
    resolver: zodResolver(managerCrmAddEnquirySchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { name: '', phone: '', preferredShift: '', source: '', handledBy: '', notes: '' },
  });


  useManagerMembersEnquiriesUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi });
  const onValidateDraft = handleSubmit(() => {
    setDraftFeedback(tManagerUi('crm_mutations_unavailable_host_contract'));
  });
  const handleClose = () => {
    if (!isDirty) { router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST); return; }
    void confirm(tManagerUi('confirm_leave_with_unsaved_changes'), tManagerUi('cancel'), tManagerUi('continue')).then((confirmed) => {
      if (confirmed) router.push(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST);
    });
  };
  useManagerEnquiriesDialogFocus(dialogRef, handleClose);

  return <>
    {unsavedConfirmDialog}
<div className="crm-drawer-overlay" onClick={handleClose} aria-hidden="true" />
    <aside ref={dialogRef} tabIndex={-1} className="crm-drawer" role="dialog" aria-labelledby="crm-new-enquiry-title" aria-modal="true"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div className="crm-drawer-header"><div className="crm-drawer-header-left"><div className="crm-drawer-icon"><PhoneCall size={18} aria-hidden="true" /></div><div><h2 id="crm-new-enquiry-title" className="crm-drawer-title">{tManagerUi('new_enquiry')}</h2><p className="crm-drawer-subtitle">{tManagerUi('capture_a_new_prospective_student')}</p></div></div><button type="button" className="crm-btn-icon" onClick={handleClose} title={tManagerUi('close')} aria-label={tManagerUi('close_drawer')}><X size={18} /></button></div>
      <p className="crm-contract-warning" role="status" data-testid="manager-crm-create-contract-warning">{tManagerUi('crm_mutations_unavailable_host_contract')}</p>
      {draftFeedback && <p className="crm-contract-warning" role="status" aria-live="polite" data-testid="manager-crm-create-draft-feedback">{draftFeedback}</p>}
      <form onSubmit={onValidateDraft} noValidate>
        <div className="crm-drawer-body"><div className="crm-form-stack">
          <div className="crm-field"><label htmlFor="enq-name" className="crm-label crm-label--required">{tManagerUi('full_name')}</label><input id="enq-name" type="text" autoComplete="name" className={`crm-input${errors.name ? ' crm-input--error' : ''}`} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'enq-name-error' : undefined} {...register('name')} />{errors.name && <p id="enq-name-error" className="crm-error" role="alert">{errors.name.message}</p>}</div>
          <div className="crm-field"><label htmlFor="enq-phone" className="crm-label crm-label--required">{tManagerUi('mobile_number')}</label><div className="crm-phone-wrap"><span className="crm-phone-prefix">+91</span><input id="enq-phone" type="tel" maxLength={10} autoComplete="tel-national" className={`crm-input crm-input-phone${errors.phone ? ' crm-input--error' : ''}`} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'enq-phone-error' : undefined} {...register('phone')} /></div>{errors.phone && <p id="enq-phone-error" className="crm-error" role="alert">{errors.phone.message}</p>}</div>
          <div className="crm-field"><label htmlFor="enq-shift" className="crm-label">{tManagerUi('preferred_shift')} <span className="crm-label-optional">{tManagerUi('optional')}</span></label><select id="enq-shift" className="crm-select" {...register('preferredShift')}><option value="">{tManagerUi('select_a_shift')}</option>{MANAGER_CRM_SAMPLE_SHIFT_OPTIONS.map((shift) => <option key={shift.id} value={shift.name}>{shiftLabel(shift.name)} ({shiftTimeLabel(shift.time)})</option>)}</select></div>
          <div className="crm-field"><label htmlFor="enq-source" className="crm-label">{tManagerUi('source')} <span className="crm-label-optional">{tManagerUi('optional')}</span></label><select id="enq-source" className="crm-select" {...register('source')}><option value="">{tManagerUi('how_did_they_find_us')}</option>{MANAGER_CRM_SAMPLE_SOURCE_OPTIONS.map((source) => <option key={source} value={source}>{sourceLabel(source)}</option>)}</select></div>
          <div className="crm-field"><label htmlFor="enq-handled-by" className="crm-label">{tManagerUi('handled_by')} <span className="crm-label-optional">{tManagerUi('optional')}</span></label><select id="enq-handled-by" className="crm-select" {...register('handledBy')}><option value="">{tManagerUi('assign_a_staff_member')}</option>{MANAGER_CRM_SAMPLE_STAFF_OPTIONS.map((staff) => <option key={staff.id} value={staff.name}>{staff.name}</option>)}</select></div>
          <div className="crm-field"><label htmlFor="enq-notes" className="crm-label">{tManagerUi('notes')} <span className="crm-label-optional">{tManagerUi('optional')}</span></label><textarea id="enq-notes" rows={3} className="crm-textarea" {...register('notes')} /></div>
        </div></div>
        <div className="crm-drawer-footer"><button type="button" className="crm-btn-ghost crm-btn-flex-1" onClick={handleClose}>{tManagerUi('cancel')}</button><button type="submit" className="crm-btn-primary crm-btn-flex-2 cursor-not-allowed" disabled title={tManagerUi('crm_mutations_unavailable_host_contract')}><Save size={15} />{tManagerUi('crm_creation_unavailable')}</button></div>
      </form>
    </aside>
  </>;
}
