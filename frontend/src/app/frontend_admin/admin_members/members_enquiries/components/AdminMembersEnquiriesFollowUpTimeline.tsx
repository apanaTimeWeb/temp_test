'use client';

import type { FollowUp } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { formatAdminEnquiriesDate } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminMembersEnquiriesFollowUpTimelineProps {
  followUps: readonly FollowUp[];
  locale: string;
}

export function AdminMembersEnquiriesFollowUpTimeline({
  followUps,
  locale,
}: AdminMembersEnquiriesFollowUpTimelineProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Clock size={16} className="text-primary" aria-hidden="true" />
            Manager Follow-up Trail & Notes
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">Chronological record of manager conversations & updates</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-surface-highlight text-text-secondary">
          {followUps.length} {followUps.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      <div className="mt-5">
        {followUps.length === 0 ? (
          <div data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-003" className="flex flex-col items-center justify-center py-12 text-center">
            <Clock size={32} className="text-text-disabled mb-2" strokeWidth={1.5} aria-hidden="true" />
            <p data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-004" className="text-sm font-medium text-text-secondary">
              {t('VIEW_NO_FOLLOWUPS')}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Branch manager has not recorded call logs yet for this enquiry lead.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-border">
            {followUps.map((followUp) => (
              <div key={followUp.id} className="relative group">
                <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-primary shadow-card" />
                <div className="rounded-xl border border-border bg-surface-highlight p-4 motion-safe:transition-colors hover:border-border-focus">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                    <span className="text-xs font-semibold text-text-primary">
                      {formatAdminEnquiriesDate(followUp.date, locale)}
                      {followUp.time && <span className="text-text-secondary font-normal ml-1.5">({followUp.time})</span>}
                    </span>
                    <span className="text-xs font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded border border-border-focus">
                      Logged by: {followUp.by}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{followUp.remark}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
