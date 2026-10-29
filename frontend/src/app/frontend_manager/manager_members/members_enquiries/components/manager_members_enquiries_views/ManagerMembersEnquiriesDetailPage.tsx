'use client';
import { useLocale, useTranslations } from 'next-intl';

import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useManagerMembersEnquiriesConfirm } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesConfirm.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, XCircle } from 'lucide-react';
import { fetchManagerEnquiriesEnquiryById } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.api';
import { MANAGER_CRM_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.query_keys';
import { MANAGER_CRM_STATUS_OPTIONS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import { managerCrmFollowUpDraftSchema, type ManagerMembersEnquiriesFollowUpFormData } from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import { getManagerEnquiriesLocalDateInputMinimum } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { ManagerMembersEnquiriesFollowUpFormPanel } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_forms/ManagerMembersEnquiriesFollowUpFormPanel.tsx';
import { ManagerMembersEnquiriesActivityTimeline } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesActivityTimeline.tsx';
import { ManagerMembersEnquiriesEnquiryProfileCard } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesEnquiryProfileCard.tsx';
import { ManagerMembersEnquiriesEnquiryActionsPanel } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesEnquiryActionsPanel.tsx';
import type { ManagerMembersEnquiriesDetailPageProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
export type { ManagerMembersEnquiriesDetailPageProps };



export default function ManagerMembersEnquiriesDetailPage({ id }: ManagerMembersEnquiriesDetailPageProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const locale = useLocale();
  const statusLabels = { New: tManagerUi('new'), Visited: tManagerUi('visited'), Interested: tManagerUi('interested'), Converted: tManagerUi('converted'), Lost: tManagerUi('lost') };
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day'), 'Not specified': tManagerUi('not_specified') };
  const sourceLabels: Record<string, string> = { 'Walk-in': tManagerUi('source_walk_in'), WhatsApp: tManagerUi('source_whatsapp'), Referral: tManagerUi('source_referral'), 'Social Media': tManagerUi('source_social_media'), 'Phone Call': tManagerUi('source_phone_call'), 'Google Ads': tManagerUi('source_google_ads'), Instagram: tManagerUi('source_instagram'), Facebook: tManagerUi('source_facebook'), Other: tManagerUi('source_other'), 'Not specified': tManagerUi('not_specified') };
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerMembersEnquiriesConfirm();
  const [followUpDirty, setFollowUpDirty] = useState(false);
  const navigateWithUnsavedChanges = (href: string) => {
    if (!followUpDirty) { router.push(href); return; }
    void confirm(tManagerUi('confirm_leave_with_unsaved_changes'), tManagerUi('cancel'), tManagerUi('continue')).then((confirmed) => {
      if (confirmed) router.push(href);
    });
  };
  const enquiryQuery = useQuery({ queryKey: MANAGER_CRM_QUERY_KEYS.enquiry(id), queryFn: () => fetchManagerEnquiriesEnquiryById(id), staleTime: 15_000 });
  const enquiry = enquiryQuery.data;
  const followUpForm = useForm<ManagerMembersEnquiriesFollowUpFormData>({ resolver: zodResolver(managerCrmFollowUpDraftSchema), defaultValues: { date: '', remark: '' } });

  if (enquiryQuery.isPending) return <div className="crm-page crm-empty-state"><p>{tManagerUi('loading_enquiry')}</p></div>;
  if (enquiryQuery.isError) return <div className="crm-page crm-empty-state crm-not-found" role="alert"><XCircle size={40} className="crm-empty-icon" /><p className="crm-empty-title">{tManagerUi('unable_to_load_enquiry')}</p><p className="crm-empty-sub">{tManagerUi('the_enquiry_could_not_be_loaded_for_id')}{id}.</p><button type="button" className="crm-btn-primary crm-mt-12" onClick={() => { void enquiryQuery.refetch(); }} disabled={enquiryQuery.isFetching}>{enquiryQuery.isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</button><button type="button" className="crm-btn-ghost crm-mt-12" onClick={() => navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST)}><ArrowLeft size={15} />{tManagerUi('back_to_pipeline')}</button></div>;
  if (!enquiry) return <div className="crm-page crm-empty-state crm-not-found"><XCircle size={40} className="crm-empty-icon" /><p className="crm-empty-title">{tManagerUi('enquiry_not_found')}</p><p className="crm-empty-sub">{tManagerUi('the_enquiry_could_not_be_loaded_for_id')}{id}.</p><button type="button" className="crm-btn-ghost crm-mt-12" onClick={() => navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST)}><ArrowLeft size={15} />{tManagerUi('back_to_pipeline')}</button></div>;

  const handleConvert = () => navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION());
  const nextFollowUpLabel = enquiry.isOverdue ? tManagerUi('overdue') : enquiry.isToday ? tManagerUi('today') : enquiry.isUpcoming ? tManagerUi('upcoming') : tManagerUi('not_scheduled');
  const nextFollowUpClass = enquiry.isOverdue ? 'crm-followup-date-overdue' : enquiry.isToday ? 'crm-followup-date-today' : 'crm-followup-date-upcoming';

  return <>
    {unsavedConfirmDialog}
<div className="crm-page">
      <div className="crm-detail-topbar"><button type="button" className="crm-btn-icon crm-btn-icon-back" onClick={() => navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST)} title={tManagerUi('back_to_pipeline')} aria-label={tManagerUi('back_to_pipeline_dfdf61')}><ArrowLeft size={18} /></button><nav className="crm-breadcrumb">{tManagerUi('crm_enquiries')} <span className="crm-breadcrumb-current">{enquiry.name}</span></nav></div>
      <p className="crm-contract-warning" role="status" data-testid="manager-crm-detail-contract-warning">{tManagerUi('crm_mutations_unavailable_host_contract')}</p>
      <div className="crm-detail-grid">
        <div className="crm-detail-left">
          <ManagerMembersEnquiriesEnquiryProfileCard
            enquiry={enquiry}
            locale={locale}
            statusLabel={statusLabels[enquiry.status]}
            sourceFieldLabel={tManagerUi('source')}
            sourceLabel={sourceLabels[enquiry.source] ?? enquiry.source}
            shiftFieldLabel={tManagerUi('preferred_shift')}
            shiftLabel={shiftLabels[enquiry.shift] ?? enquiry.shift}
            handledByFieldLabel={tManagerUi('handled_by')}
            handledByLabel={enquiry.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enquiry.handledBy}
            branchFieldLabel={tManagerUi('branch_preference')}
            branchLabel={enquiry.preferredBranch === 'Not specified' ? tManagerUi('not_specified') : enquiry.preferredBranch}
            enquiryDateLabel={tManagerUi('enquiry_date')}
            phoneMaskedLabel={tManagerUi('phone_masked')}
            todayLabel={tManagerUi('today')}
            yesterdayLabel={tManagerUi('yesterday')}
          />
          <ManagerMembersEnquiriesActivityTimeline
            followUps={enquiry.followUps}
            locale={locale}
            title={tManagerUi('activity_timeline')}
            emptyLabel={tManagerUi('no_follow_ups_recorded_yet')}
            byLabel={tManagerUi('by')}
            todayLabel={tManagerUi('today')}
            yesterdayLabel={tManagerUi('yesterday')}
          />
        </div>
        <div className="crm-detail-right">
          <ManagerMembersEnquiriesEnquiryActionsPanel
            status={enquiry.status}
            statusOptions={MANAGER_CRM_STATUS_OPTIONS}
            statusLabels={statusLabels}
            unavailableMessage={tManagerUi('crm_mutations_unavailable_host_contract')}
            currentStatusLabel={tManagerUi('current_status')}
            updateUnavailableLabel={tManagerUi('crm_update_unavailable')}
            actionsLabel={tManagerUi('actions')}
            onConvert={handleConvert}
            alreadyConvertedLabel={tManagerUi('already_converted')}
            convertLabel={tManagerUi('convert_to_admission')}
            alreadyLostLabel={tManagerUi('already_marked_lost')}
            markLostUnavailableLabel={tManagerUi('crm_mark_lost_unavailable')}
          />
          <ManagerMembersEnquiriesFollowUpFormPanel
            onDirtyChange={setFollowUpDirty}
            form={followUpForm}
            minimumDate={getManagerEnquiriesLocalDateInputMinimum()}
            title={tManagerUi('add_follow_up')}
            dateLabel={tManagerUi('follow_up_date')}
            remarkLabel={tManagerUi('remark')}
            unavailableTitle={tManagerUi('crm_mutations_unavailable_host_contract')}
            submitLabel={tManagerUi('crm_follow_up_unavailable')}
            nextFollowUpLabel={tManagerUi('next_follow_up')}
            nextFollowUpStatus={nextFollowUpLabel}
            nextFollowUpStatusClassName={nextFollowUpClass}
            editFollowUpLabel={tManagerUi('edit_follow_up_date')}
          />

        </div>
      </div>
    </div>
  </>;
}
