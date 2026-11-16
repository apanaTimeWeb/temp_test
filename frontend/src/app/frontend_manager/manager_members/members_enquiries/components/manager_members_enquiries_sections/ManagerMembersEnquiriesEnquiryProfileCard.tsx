'use client';
import { CalendarDays, Clock, MapPin, Phone, Tag, User } from 'lucide-react';
import { MANAGER_CRM_STATUS_BADGE } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import { formatManagerEnquiriesDisplayDate, getManagerEnquiriesInitials, maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { ManagerMembersEnquiriesInfoItem } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesInfoItem';
import type { ManagerMembersEnquiriesEnquiryProfileCardProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';

export function ManagerMembersEnquiriesEnquiryProfileCard({
  enquiry,
  locale,
  statusLabel,
  sourceFieldLabel,
  sourceLabel,
  shiftFieldLabel,
  shiftLabel,
  handledByFieldLabel,
  handledByLabel,
  branchFieldLabel,
  branchLabel,
  enquiryDateLabel,
  phoneMaskedLabel,
  todayLabel,
  yesterdayLabel,
}: ManagerMembersEnquiriesEnquiryProfileCardProps) {
  return (
    <section className="crm-card rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 p-5 shadow-lg" aria-labelledby="crm-enquiry-profile-title">
      <div className="crm-lead-header flex items-center gap-4 mb-5 pb-4 border-b border-indigo-500/15">
        <div className="crm-avatar crm-avatar--lg w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-950/50" aria-hidden="true">
          {getManagerEnquiriesInitials(enquiry.name)}
        </div>
        <div className="crm-lead-header-body flex-1">
          <div className="crm-lead-title-row flex items-center gap-3 flex-wrap">
            <h1 id="crm-enquiry-profile-title" className="crm-lead-name text-xl font-bold text-white">{enquiry.name}</h1>
            <span className={`crm-badge ${MANAGER_CRM_STATUS_BADGE[enquiry.status]}`}>{statusLabel}</span>
          </div>
          <p className="crm-lead-phone inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono mt-1">
            <Phone size={13} className="text-amber-400" aria-hidden="true" />
            +91 {maskManagerEnquiriesPhone(enquiry.phone)}
          </p>
        </div>
      </div>

      {enquiry.status === 'Lost' && enquiry.lostReason && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
          <span className="font-bold text-rose-200 shrink-0">Lost Reason:</span>
          <span>{enquiry.lostReason}</span>
          {enquiry.lostDate && <span className="text-slate-400 font-mono ml-auto">({enquiry.lostDate})</span>}
        </div>
      )}

      <div className="crm-info-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ManagerMembersEnquiriesInfoItem icon={<Tag size={14} className="text-sky-400" aria-hidden="true" />} label={sourceFieldLabel} value={sourceLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<Clock size={14} className="text-amber-400" aria-hidden="true" />} label={shiftFieldLabel} value={shiftLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<User size={14} className="text-indigo-400" aria-hidden="true" />} label={handledByFieldLabel} value={handledByLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<MapPin size={14} className="text-rose-400" aria-hidden="true" />} label={branchFieldLabel} value={branchLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<CalendarDays size={14} className="text-indigo-400" aria-hidden="true" />} label={enquiryDateLabel} value={formatManagerEnquiriesDisplayDate(enquiry.enquiryDate, locale, { today: todayLabel, yesterday: yesterdayLabel })} />
        <ManagerMembersEnquiriesInfoItem icon={<Phone size={14} className="text-emerald-400" aria-hidden="true" />} label={phoneMaskedLabel} value={maskManagerEnquiriesPhone(enquiry.phone)} />
      </div>
    </section>
  );
}
