'use client';
import { useLocale, useTranslations } from 'next-intl';

import { Phone, CalendarDays, CheckCircle, User, Clock } from 'lucide-react';
import { formatManagerEnquiriesDisplayDate, maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import type { ManagerMembersEnquiriesKanbanCardProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';




export function ManagerMembersEnquiriesKanbanCard({ enq, colClass, onClick }: ManagerMembersEnquiriesKanbanCardProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const locale = useLocale();
  const shiftLabels: Record<string, string> = { Morning: tManagerUi('shift_morning'), Afternoon: tManagerUi('shift_afternoon'), Evening: tManagerUi('shift_evening'), Night: tManagerUi('shift_night'), 'Full Day': tManagerUi('shift_full_day'), 'Not specified': tManagerUi('not_specified') };
  return (
    <div className={`crm-kanban-card ${colClass}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}>
      <div className="crm-card-name-block">
        <p className="crm-card-name">{enq.name}</p>
        <p className="crm-card-phone">
          <Phone size={11} />
          {maskManagerEnquiriesPhone(enq.phone)}
        </p>
      </div>
      <div className="crm-card-badges">
        <span className="crm-badge crm-badge--info">{shiftLabels[enq.shift] ?? enq.shift}</span>
        {enq.isOverdue ? <span className="crm-badge crm-badge--danger"><Clock size={10} /> {tManagerUi('overdue')}</span> : enq.isToday ? <span className="crm-badge crm-badge--warning"><Clock size={10} /> {tManagerUi('today')}</span> : enq.isUpcoming ? <span className="crm-badge crm-badge--success"><Clock size={10} /> {tManagerUi('upcoming')}</span> : null}
      </div>
      <div className="crm-card-footer">
        <span className="crm-card-footer-item"><CalendarDays size={11} />{formatManagerEnquiriesDisplayDate(enq.addedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</span>
        {enq.convertedDate && (
          <span className="crm-card-footer-converted"><CheckCircle size={11} />{formatManagerEnquiriesDisplayDate(enq.convertedDate, locale, { today: tManagerUi('today'), yesterday: tManagerUi('yesterday') })}</span>
        )}
        <span className="crm-card-footer-item"><User size={11} />{enq.handledBy === 'Unassigned' ? tManagerUi('unassigned') : enq.handledBy.split(' ')[0]}</span>
      </div>
    </div>
  );
}
