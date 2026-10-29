'use client';
// RESPONSIBILITY: Render the members enquiries enquiry profile card component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the members enquiries enquiry profile card component within the components feature. It does not own backend persistence or cross-feature business logic.
import { CalendarDays, Clock, MapPin, Phone, Tag, User } from 'lucide-react';
import { MANAGER_CRM_STATUS_BADGE } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';

import { formatManagerEnquiriesDisplayDate, getManagerEnquiriesInitials, maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { ManagerMembersEnquiriesInfoItem } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesInfoItem.tsx';
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
    <section className="crm-card" aria-labelledby="crm-enquiry-profile-title">
      <div className="crm-lead-header">
        <div className="crm-avatar crm-avatar--lg" aria-hidden="true">{getManagerEnquiriesInitials(enquiry.name)}</div>
        <div className="crm-lead-header-body">
          <div className="crm-lead-title-row">
            <h1 id="crm-enquiry-profile-title" className="crm-lead-name">{enquiry.name}</h1>
            <span className={`crm-badge ${MANAGER_CRM_STATUS_BADGE[enquiry.status]}`}>{statusLabel}</span>
          </div>
          <p className="crm-lead-phone"><Phone size={13} aria-hidden="true" />+91 {maskManagerEnquiriesPhone(enquiry.phone)}</p>
        </div>
      </div>
      <div className="crm-info-grid">
        <ManagerMembersEnquiriesInfoItem icon={<Tag size={14} aria-hidden="true" />} label={sourceFieldLabel} value={sourceLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<Clock size={14} aria-hidden="true" />} label={shiftFieldLabel} value={shiftLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<User size={14} aria-hidden="true" />} label={handledByFieldLabel} value={handledByLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<MapPin size={14} aria-hidden="true" />} label={branchFieldLabel} value={branchLabel} />
        <ManagerMembersEnquiriesInfoItem icon={<CalendarDays size={14} aria-hidden="true" />} label={enquiryDateLabel} value={formatManagerEnquiriesDisplayDate(enquiry.enquiryDate, locale, { today: todayLabel, yesterday: yesterdayLabel })} />
        <ManagerMembersEnquiriesInfoItem icon={<Phone size={14} aria-hidden="true" />} label={phoneMaskedLabel} value={maskManagerEnquiriesPhone(enquiry.phone)} />
      </div>
    </section>
  );
}
