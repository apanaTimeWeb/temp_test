'use client';

import type { ManagerMembersEnquiriesEnquiry,ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { formatManagerEnquiriesDisplayDate,maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import {
Calendar,
CheckCircle,
CheckCircle2,
Clock,
Eye,
Flame,
MapPin,
MessageCircle,
Moon,
PhoneCall,
Sun,
Sunset,
User,
UserPlus,
XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

export interface ManagerMembersEnquiriesMobileCardsProps {
  paginated: ManagerMembersEnquiriesEnquiry[];
  effectivePage: number;
  pageSize: number;
  selectedIds: string[];
  onToggleSelectOne?: (id: string) => void;
  onOpenDetails: (id: string) => void;
  onQuickConvert: (e: MouseEvent, enq?: ManagerMembersEnquiriesEnquiry) => void;
  onSendWhatsApp: (e: MouseEvent, enq: ManagerMembersEnquiriesEnquiry) => void;
  onMarkLost?: (enq: ManagerMembersEnquiriesEnquiry) => void;
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
  onMarkLost,
  shiftLabels,
  statusLabels,
  locale,
}: ManagerMembersEnquiriesMobileCardsProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');

  const renderShiftBadge = (shift: string) => {
    const label = shiftLabels[shift] ?? shift;
    switch (shift) {
      case 'Morning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Sun size={10} className="text-amber-400" />
            {label}
          </span>
        );
      case 'Afternoon':
      case 'Evening':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sunset size={10} className="text-indigo-400" />
            {label}
          </span>
        );
      case 'Night':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Moon size={10} className="text-purple-400" />
            {label}
          </span>
        );
      case 'Full Day':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Clock size={10} className="text-cyan-400" />
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            {label}
          </span>
        );
    }
  };

  const renderStatusBadge = (status: ManagerMembersEnquiriesEnquiryStatus, lostReason?: string) => {
    const label = statusLabels[status];
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <UserPlus size={10} className="text-sky-400" />
            {label}
          </span>
        );
      case 'Visited':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <MapPin size={10} className="text-amber-400" />
            {label}
          </span>
        );
      case 'Interested':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Flame size={10} className="text-purple-400" />
            {label}
          </span>
        );
      case 'Converted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={10} className="text-emerald-400" />
            {label}
          </span>
        );
      case 'Lost':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30"
            title={lostReason ? `Lost Reason: ${lostReason}` : undefined}
          >
            <XCircle size={10} className="text-rose-400" />
            {label}
            {lostReason && (
              <span className="text-[10px] font-normal text-rose-300/80 ml-1">
                ({lostReason.split('/')[0].trim()})
              </span>
            )}
          </span>
        );
    }
  };

  return (
    <div className="crm-mobile-enquiry-list flex flex-col gap-3 p-3">
      {paginated.map((enq, idx) => {
        const cleanDigits = enq.phone.replace(/\D/g, '');
        return (
          <article className="crm-mobile-enquiry-card bg-[#0c0f28]/95 border border-indigo-500/25 rounded-2xl p-4 shadow-md transition-all hover:border-indigo-400" key={`mobile-${enq.id}`}>
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
              <button type="button" className="crm-mobile-enquiry-main flex-1 text-left cursor-pointer" onClick={() => onOpenDetails(enq.id)}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      Sr. {effectivePage * pageSize + idx + 1}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">{enq.name}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {maskManagerEnquiriesPhone(enq.phone)}
                  </span>
                </div>
              </button>
            </div>

            <div className="crm-mobile-enquiry-meta text-xs text-slate-300 grid grid-cols-2 gap-2.5 py-2.5 border-t border-b border-indigo-500/15 my-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">{tManagerUi('shift')}</span>
                {renderShiftBadge(enq.shift)}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">{tManagerUi('status')}</span>
                {renderStatusBadge(enq.status, enq.lostReason)}
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">{tManagerUi('handled_by')}</span>
                <span className="inline-flex items-center gap-1 text-slate-200">
                  <User size={12} className="text-indigo-400" />
                  {enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">{tManagerUi('date_added')}</span>
                <span className="inline-flex items-center gap-1 text-slate-200">
                  <Calendar size={12} className="text-slate-400" />
                  {formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}
                </span>
              </div>
            </div>

            <div className="crm-mobile-enquiry-actions flex items-center justify-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
              {/* WhatsApp Button (Emerald) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 transition-all cursor-pointer shadow-sm shadow-emerald-950/50"
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
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/35 hover:text-amber-200 transition-all cursor-pointer shadow-sm shadow-amber-950/50"
                aria-label={`Call ${enq.name}`}
                title={`Call ${enq.name}`}
              >
                <PhoneCall size={14} />
              </a>

              {/* View Button (Cyan) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 transition-all cursor-pointer shadow-sm shadow-sky-950/50"
                aria-label={tManagerUi('view_details')}
                title={tManagerUi('view_details')}
                onClick={() => onOpenDetails(enq.id)}
              >
                <Eye size={14} />
              </button>

              {/* Convert Button (Indigo) */}
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/35 hover:text-indigo-200 transition-all cursor-pointer shadow-sm shadow-indigo-950/50"
                aria-label={tManagerUi('convert_to_admission')}
                title={tManagerUi('convert_to_admission')}
                onClick={(e) => onQuickConvert(e, enq)}
              >
                <CheckCircle size={14} />
              </button>

              {/* Close / Mark Lost Button (Rose) */}
              <button
                type="button"
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 transition-all shadow-sm shadow-rose-950/50 ${
                  enq.status === 'Lost'
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-rose-500/35 hover:text-rose-200 cursor-pointer opacity-90 hover:opacity-100'
                }`}
                aria-label={enq.status === 'Lost' ? tManagerUi('already_marked_lost') : 'Mark Enquiry as Lost'}
                title={enq.status === 'Lost' ? tManagerUi('already_marked_lost') : 'Mark Enquiry as Lost'}
                disabled={enq.status === 'Lost'}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkLost?.(enq);
                }}
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
