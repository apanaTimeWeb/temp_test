'use client';

import { useTranslations } from 'next-intl';
import { Eye, CheckCircle, XCircle, MessageCircle, PhoneCall } from 'lucide-react';
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
      {paginated.map((enq, idx) => {
        const cleanDigits = enq.phone.replace(/\D/g, '');
        return (
          <article className="crm-mobile-enquiry-card bg-[#0c0f28]/95 border border-indigo-500/25 rounded-2xl p-4 mb-3" key={`mobile-${enq.id}`}>
            <div className="flex items-center gap-2.5 pb-2">
              {onToggleSelectOne && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(enq.id)}
                  onChange={() => onToggleSelectOne(enq.id)}
                  aria-label={`Select ${enq.name}`}
                  className="rounded border-indigo-500/40 bg-[#07091c] text-indigo-500 focus:ring-indigo-400 h-4 w-4 cursor-pointer"
                />
              )}
              <button type="button" className="crm-mobile-enquiry-main flex-1 text-left" onClick={() => onOpenDetails(enq.id)}>
                <span className="text-xs font-bold text-indigo-400 mr-2">Sr. {effectivePage * pageSize + idx + 1}</span>
                <span className="font-bold text-slate-100 text-sm block sm:inline">{enq.name}</span>
                <span className="text-xs font-mono text-slate-400 ml-0 sm:ml-2">{maskManagerEnquiriesPhone(enq.phone)}</span>
              </button>
            </div>
            <div className="crm-mobile-enquiry-meta text-xs text-slate-300 grid grid-cols-2 gap-2 py-2 border-t border-b border-indigo-500/15 my-2">
              <span><span className="text-slate-400 text-[11px] block">{tManagerUi('shift')}</span><span className="font-semibold text-indigo-300">{shiftLabels[enq.shift] ?? enq.shift}</span></span>
              <span><span className="text-slate-400 text-[11px] block">{tManagerUi('status')}</span><span className={`mgr-badge ${MANAGER_CRM_STATUS_BADGE[enq.status]}`}>{statusLabels[enq.status]}</span></span>
              <span><span className="text-slate-400 text-[11px] block">{tManagerUi('handled_by')}</span><span>{enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy}</span></span>
              <span><span className="text-slate-400 text-[11px] block">{tManagerUi('date_added')}</span><span>{formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</span></span>
            </div>
            <div className="crm-mobile-enquiry-actions flex items-center justify-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
              {/* WhatsApp Button (Emerald) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 transition-all cursor-pointer"
                aria-label={`WhatsApp: ${enq.name}`}
                title="Send WhatsApp"
                onClick={(e) => onSendWhatsApp(e, enq)}
              >
                <MessageCircle size={15} />
              </button>

              {/* Call Button (Amber) */}
              <a
                href={`tel:${cleanDigits}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/35 hover:text-amber-200 transition-all cursor-pointer"
                aria-label={`Call ${enq.name}`}
                title={`Call ${enq.name}`}
              >
                <PhoneCall size={14} />
              </a>

              {/* View Button (Cyan) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 transition-all cursor-pointer"
                aria-label={tManagerUi('view_details')}
                title={tManagerUi('view_details')}
                onClick={() => onOpenDetails(enq.id)}
              >
                <Eye size={14} />
              </button>

              {/* Convert Button (Indigo) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/35 hover:text-indigo-200 transition-all cursor-pointer"
                aria-label={tManagerUi('convert_to_admission')}
                title={tManagerUi('convert_to_admission')}
                onClick={onQuickConvert}
              >
                <CheckCircle size={14} />
              </button>

              {/* Close Button (Rose) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 opacity-80 cursor-not-allowed transition-all"
                aria-label={tManagerUi('crm_mark_lost_unavailable')}
                title={tManagerUi('crm_mutations_unavailable_host_contract')}
                disabled
              >
                <XCircle size={14} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
