'use client';
// RESPONSIBILITY: Render the members enquiries activity timeline component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the members enquiries activity timeline component within the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerMembersEnquiriesEmptyState } from '@/app/frontend_manager/manager_members/members_enquiries/components/ManagerMembersEnquiriesEmptyState';
import { Clock } from 'lucide-react';
import { formatManagerEnquiriesDisplayDate } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import type { ManagerMembersEnquiriesActivityTimelineProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';




function timelineDotClass(by: string): string {
  const lower = by.toLowerCase();
  if (lower.includes('system')) return 'crm-timeline-dot--system';
  if (lower.includes('sarah')) return 'crm-timeline-dot--success';
  if (lower.includes('mike')) return 'crm-timeline-dot--info';
  if (lower.includes('admin')) return 'crm-timeline-dot--warning';
  return '';
}

export function ManagerMembersEnquiriesActivityTimeline({
  followUps,
  locale,
  title,
  emptyLabel,
  byLabel,
  todayLabel,
  yesterdayLabel,
}: ManagerMembersEnquiriesActivityTimelineProps) {
  return (
    <section className="crm-card" aria-labelledby="crm-activity-timeline-title">
      <h2 id="crm-activity-timeline-title" className="crm-section-title">{title}</h2>
      {followUps.length === 0 ? (
        <ManagerMembersEnquiriesEmptyState className="crm-empty-state-sm" testId="manager-enquiries-activity-empty">
          <Clock size={32} className="crm-empty-icon" />
          <p className="crm-empty-sub">{emptyLabel}</p>
        </ManagerMembersEnquiriesEmptyState>
      ) : (
        <div className="crm-timeline">
          {followUps.map((followUp) => (
            <div className="crm-timeline-entry" key={followUp.id}>
              <div className={`crm-timeline-dot ${timelineDotClass(followUp.by)}`} aria-hidden="true" />
              <div className="crm-timeline-card">
                <div className="crm-timeline-card-header">
                  <p className="crm-timeline-date">
                    {formatManagerEnquiriesDisplayDate(followUp.date, locale, { today: todayLabel, yesterday: yesterdayLabel })}
                    <span className="crm-timeline-time">{followUp.time}</span>
                  </p>
                  <p className="crm-timeline-by">{byLabel} {followUp.by}</p>
                </div>
                <p className="crm-timeline-remark">{followUp.remark}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
