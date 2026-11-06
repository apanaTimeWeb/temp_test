'use client';

import { useTranslations } from 'next-intl';
import { Eye, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { formatManagerEnquiriesDisplayDate, maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { MANAGER_CRM_STATUS_BADGE } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import type { MouseEvent } from 'react';

export interface ManagerMembersEnquiriesMobileCardsProps {
  paginated: ManagerMembersEnquiriesEnquiry[];
  effectivePage: number;
  pageSize: number;
  selectedIds: string[];
  onToggleSelectOne?: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onQuickConvert: (e: MouseEvent) => void;
  onSendWhatsApp: (e: MouseEvent, enq: ManagerMembersEnquiriesEnquiry) => void;
  shiftLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  locale: string;
}

export function ManagerMembersEnquiriesMobileCards({
  paginated,
  effectivePage,
  pageSize,
  selectedIds,
  onToggleSelectOne,
  onOpenDetails,
  onQuickConvert,
  onSendWhatsApp,
  shiftLabels,
  statusLabels,
  locale,
}: ManagerMembersEnquiriesMobileCardsProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');

  return (
    <div className="crm-mobile-enquiry-list">
      {paginated.map((enq, idx) => (
        <article className="crm-mobile-enquiry-card" key={`mobile-${enq.id}`}>
          <div className="flex items-center gap-2 pb-1">
            {onToggleSelectOne && (
              <input
                type="checkbox"
                checked={selectedIds.includes(enq.id)}
                onChange={() => onToggleSelectOne(enq.id)}
                aria-label={`Select ${enq.name}`}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              />
            )}
            <button type="button" className="crm-mobile-enquiry-main flex-1 text-left" onClick={() => onOpenDetails(enq.id)}>
              <span className="crm-mobile-enquiry-index">#{effectivePage * pageSize + idx + 1}</span>
              <span className="crm-mobile-enquiry-name">{enq.name}</span>
              <span className="crm-mobile-enquiry-phone">{maskManagerEnquiriesPhone(enq.phone)}</span>
            </button>
          </div>
          <div className="crm-mobile-enquiry-meta">
            <span><span className="crm-mobile-enquiry-label">{tManagerUi('shift')}</span><span className="mgr-badge mgr-badge--info">{shiftLabels[enq.shift] ?? enq.shift}</span></span>
            <span><span className="crm-mobile-enquiry-label">{tManagerUi('status')}</span><span className={`mgr-badge ${MANAGER_CRM_STATUS_BADGE[enq.status]}`}>{statusLabels[enq.status]}</span></span>
            <span><span className="crm-mobile-enquiry-label">{tManagerUi('handled_by')}</span><span>{enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy}</span></span>
            <span><span className="crm-mobile-enquiry-label">{tManagerUi('date_added')}</span><span>{formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</span></span>
          </div>
          <div className="crm-mobile-enquiry-actions flex items-center justify-end gap-1.5 pt-2">
            <button type="button" className="mgr-btn-icon text-emerald-600 hover:text-emerald-700" aria-label={`WhatsApp: ${enq.name}`} title="Send WhatsApp" onClick={(e) => onSendWhatsApp(e, enq)}><MessageCircle size={16} /></button>
            <button type="button" className="mgr-btn-icon" aria-label={tManagerUi('view_details')} title={tManagerUi('view_details')} onClick={() => onOpenDetails(enq.id)}><Eye size={16} /></button>
            <button type="button" className="mgr-btn-icon text-success" aria-label={tManagerUi('convert_to_admission')} title={tManagerUi('convert_to_admission')} onClick={onQuickConvert}><CheckCircle size={16} /></button>
            <button type="button" className="mgr-btn-icon text-danger cursor-not-allowed" aria-label={tManagerUi('crm_mark_lost_unavailable')} title={tManagerUi('crm_mutations_unavailable_host_contract')} disabled><XCircle size={16} /></button>
          </div>
        </article>
      ))}
    </div>
  );
}

