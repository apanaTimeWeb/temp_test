'use client';
// RESPONSIBILITY: AdminEnquiriesEnquiryKanbanCard component owned by admin_enquiries.

import { useTranslations } from 'next-intl';
import { Phone, Clock, CalendarDays, CheckCircle, User } from 'lucide-react';
import { maskPhone } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import type { AdminEnquiriesEnquiryKanbanCardProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';

export default function AdminEnquiriesEnquiryKanbanCard({ enq, colClass, onClick }: AdminEnquiriesEnquiryKanbanCardProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };
  const handledBy = typeof enq.handledBy === 'string' ? enq.handledBy.split(' ')[0] || t('UNASSIGNED') : t('UNASSIGNED');
  return (
    <div
      data-testid="admin_enquiries-AdminEnquiriesEnquiryKanbanCard-control-001"
      className={`rounded-lg border border-border bg-card p-3 shadow-card ${colClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-w-0 items-start gap-2">
        <p className="truncate text-body font-semibold text-text-primary">{enq.name}</p>
        <p className="mt-1 text-caption text-text-secondary"><Phone size={18} strokeWidth={2}/>{maskPhone(enq.phone)}</p>
      </div>
      <div data-testid="admin_enquiries-AdminEnquiriesEnquiryKanbanCard-state-002" className="mt-3 flex flex-wrap gap-1">
        <span data-testid="admin_enquiries-AdminEnquiriesEnquiryKanbanCard-state-003" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-info-bg text-info-text">{enq.shift}</span>
        {enq.isOverdue ? (
          <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-001" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-danger-bg text-danger-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_OVERDUE')}</span>
        ) : enq.isToday ? (
          <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-002" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-warning-bg text-warning-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_TODAY')}</span>
        ) : enq.isUpcoming ? (
          <span data-testid="admin_enquiries-AdminMembersEnquiriesEnquiryFollowUpBadge-state-003" className="inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold bg-success-bg text-success-text"><Clock size={18} strokeWidth={2}/>{t('FOLLOWUP_UPCOMING')}</span>
        ) : null}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1 text-caption text-text-secondary"><CalendarDays size={18} strokeWidth={2}/>{enq.addedDate}</span>
        {enq.convertedDate && <span className="bg-success-bg text-success-text"><CheckCircle size={18} strokeWidth={2}/>{enq.convertedDate}</span>}
        <span className="inline-flex items-center gap-1 text-caption text-text-secondary"><User size={18} strokeWidth={2}/>{handledBy}</span>
      </div>
    </div>
  );
}

export { AdminEnquiriesEnquiryKanbanCard };

