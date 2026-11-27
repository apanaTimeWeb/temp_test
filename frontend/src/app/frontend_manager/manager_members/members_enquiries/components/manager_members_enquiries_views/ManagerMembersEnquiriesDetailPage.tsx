'use client';
import { useLocale,useTranslations } from 'next-intl';

import { MANAGER_MEMBERS_ENQUIRIES_ROUTES } from '@/app/frontend_manager/manager_members/members_enquiries/config/manager_members_enquiries.url_config';

import { ButtonLoader,LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { fetchManagerEnquiriesEnquiryById } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.api';
import { MANAGER_CRM_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_enquiries/api/manager_members_enquiries.query_keys';
import { ManagerMembersEnquiriesFollowUpFormPanel } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_forms/ManagerMembersEnquiriesFollowUpFormPanel';
import { ManagerMembersEnquiriesActivityTimeline } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesActivityTimeline';
import { ManagerMembersEnquiriesEnquiryProfileCard } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_sections/ManagerMembersEnquiriesEnquiryProfileCard';
import { ManagerMembersEnquiriesEnquiryActionsPanel } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesEnquiryActionsPanel';
import { ManagerMembersEnquiriesLostReasonModal } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesLostReasonModal';
import { MANAGER_CRM_STATUS_OPTIONS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import { useManagerMembersEnquiriesConfirm } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesConfirm';
import { managerCrmFollowUpDraftSchema,type ManagerMembersEnquiriesFollowUpFormData } from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import type { ManagerMembersEnquiriesDetailPageProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
import type { ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { getManagerEnquiriesDemoPassWhatsAppUrl,getManagerEnquiriesLocalDateInputMinimum,getManagerEnquiriesLocationWhatsAppUrl } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { readBrowserSessionStorageItem, writeBrowserSessionStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft,XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ManagerMembersEnquiriesEnquiryStatus | null>(null);
  const [lostInfo, setLostInfo] = useState<{ reason: string; date: string } | null>(null);
  const navigateWithUnsavedChanges = (href: string) => {
    if (!followUpDirty) { router.push(href); return; }
    void confirm(tManagerUi('confirm_leave_with_unsaved_changes'), tManagerUi('cancel'), tManagerUi('continue')).then((confirmed) => {
      if (confirmed) router.push(href);
    });
  };
  const enquiryQuery = useQuery({ queryKey: MANAGER_CRM_QUERY_KEYS.enquiry(id), queryFn: () => fetchManagerEnquiriesEnquiryById(id), staleTime: 15_000 });
  const enquiry = enquiryQuery.data;
  const followUpForm = useForm<ManagerMembersEnquiriesFollowUpFormData>({ resolver: zodResolver(managerCrmFollowUpDraftSchema), defaultValues: { date: '', remark: '' } });
  const [localFollowUps, setLocalFollowUps] = useState<Array<{ id: string; date: string; time: string; remark: string; by: string }>>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = readBrowserSessionStorageItem(`manager_crm_followups_${id}`);
      return stored.available && stored.value ? JSON.parse(stored.value) : [];
    } catch {
      return [];
    }
  });

  const handleAddFollowUp = (data: { date: string; remark: string }) => {
    const newEntry = {
      id: `local-flw-${Date.now()}`,
      date: data.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      remark: data.remark,
      by: 'Manager (Desk)',
    };
    setLocalFollowUps((prev) => {
      const updated = [newEntry, ...prev];
      try {
        writeBrowserSessionStorageItem(`manager_crm_followups_${id}`, JSON.stringify(updated));
      } catch {
        // Safe storage fallback
      }
      return updated;
    });
  };

  if (enquiryQuery.isPending) {
    return (
      <div className="crm-page crm-empty-state flex items-center justify-center p-16" role="status">
        <LibraryLoader size="md" icon="search" variant="breath" />
      </div>
    );
  }
  if (enquiryQuery.isError) return <div className="crm-page crm-empty-state crm-not-found" role="alert"><XCircle size={40} className="crm-empty-icon" /><p className="crm-empty-title">{tManagerUi('unable_to_load_enquiry')}</p><p className="crm-empty-sub">{tManagerUi('the_enquiry_could_not_be_loaded_for_id')}{id}.</p><button type="button" className="crm-btn-primary crm-mt-12 inline-flex items-center gap-1.5" onClick={() => { void enquiryQuery.refetch(); }} disabled={enquiryQuery.isFetching}>{enquiryQuery.isFetching ? <ButtonLoader icon="search" /> : null}<span>{enquiryQuery.isFetching ? tManagerUi('retrying') : tManagerUi('try_again')}</span></button><button type="button" className="crm-btn-ghost crm-mt-12" onClick={() => navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST)}><ArrowLeft size={15} />{tManagerUi('back_to_pipeline')}</button></div>;
  if (!enquiry) return <div className="crm-page crm-empty-state crm-not-found"><XCircle size={40} className="crm-empty-icon" /><p className="crm-empty-title">{tManagerUi('enquiry_not_found')}</p><p className="crm-empty-sub">{tManagerUi('the_enquiry_could_not_be_loaded_for_id')}{id}.</p><button type="button" className="crm-btn-ghost crm-mt-12" onClick={() => navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.LIST)}><ArrowLeft size={15} />{tManagerUi('back_to_pipeline')}</button></div>;

  const effectiveStatus = currentStatus ?? enquiry.status;
  const displayEnquiry = {
    ...enquiry,
    status: effectiveStatus,
    lostReason: lostInfo?.reason ?? enquiry.lostReason,
    lostDate: lostInfo?.date ?? enquiry.lostDate,
  };

  const handleConvert = () => {
    try {
      const payload = JSON.stringify({
        enquiryId: enquiry.id,
        name: enquiry.name,
        phone: enquiry.phone,
        shift: enquiry.shift,
        source: enquiry.source,
        preferredBranch: enquiry.preferredBranch,
      });
      writeBrowserSessionStorageItem('manager_pending_enquiry_conversion', payload);
      writeBrowserSessionStorageItem('enquiry_conversion_prefill', payload);
      writeBrowserSessionStorageItem('new_admission_prefill', payload);
      writeBrowserStorageItem('manager_pending_enquiry_conversion', payload);
      writeBrowserStorageItem('enquiry_conversion_prefill', payload);
    } catch {
      // Storage fallback
    }
    navigateWithUnsavedChanges(MANAGER_MEMBERS_ENQUIRIES_ROUTES.ADMISSION_CONVERSION(enquiry.id));
  };

  const handleConfirmLost = (reason: string, notes?: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const remarkText = notes
      ? `Marked as Lost | Reason: ${reason} | Note: ${notes}`
      : `Marked as Lost | Reason: ${reason}`;
    handleAddFollowUp({ date: todayStr, remark: remarkText });
    setCurrentStatus('Lost');
    setLostInfo({ reason, date: todayStr });
    try {
      writeBrowserSessionStorageItem(`manager_crm_lost_${id}`, JSON.stringify({ reason, notes, date: todayStr }));
    } catch {
      // Storage fallback
    }
  };

  const handleSendDemoPass = () => {
    const url = getManagerEnquiriesDemoPassWhatsAppUrl(enquiry);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  const handleSendLocation = () => {
    const url = getManagerEnquiriesLocationWhatsAppUrl(enquiry);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };
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
            enquiry={displayEnquiry}
            locale={locale}
            statusLabel={statusLabels[effectiveStatus]}
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
            followUps={[...localFollowUps, ...(enquiry.followUps || [])]}
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
            status={effectiveStatus}
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
            onMarkLost={() => setIsLostModalOpen(true)}
            onSendDemoPass={handleSendDemoPass}
            onSendLocation={handleSendLocation}
          />
          <ManagerMembersEnquiriesFollowUpFormPanel
            onDirtyChange={setFollowUpDirty}
            onAddFollowUp={handleAddFollowUp}
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
    <ManagerMembersEnquiriesLostReasonModal
      isOpen={isLostModalOpen}
      onClose={() => setIsLostModalOpen(false)}
      enquiry={displayEnquiry}
      onConfirm={handleConfirmLost}
    />
  </>;
}
