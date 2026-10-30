'use client';
// RESPONSIBILITY: AdminEnquiriesEnquiryDetailPageView component owned by admin_enquiries; responsibility folder: admin_enquiries_components_views.

import { toast, Toaster } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Phone, MapPin, User, CalendarDays, Tag, Clock, Pencil } from 'lucide-react';
import { ADMIN_ENQUIRIES_URLS } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import { getInitials, maskPhone } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import useAdminEnquiriesEnquiryDetailPage from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesEnquiryDetailPage';
import { formatAdminEnquiriesDate } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import type { FollowUp } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import type { AdminEnquiriesEnquiryDetailPageViewProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';


export default function AdminEnquiriesEnquiryDetailPageView({ params }: AdminEnquiriesEnquiryDetailPageViewProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const locale = useLocale();
  const model = useAdminEnquiriesEnquiryDetailPage(params);
  if (!isFrontendDemoModeEnabled()) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('VIEW_NOT_AVAILABLE')}</h1><p role="status" className="text-warning-text">{t('PREVIEW_ONLY')}</p></section>;
  const statusLabel = (status: string) => {
    const keys: Record<string, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status] ?? 'STATUS');
  };
  const { router, enquiry, loading, statusBadgeCls, currentStatus, followUpDateClass, followUpDateLabel, timelineDotClass } = model;

  if (loading) {
    return <div className="min-w-0 space-y-6 text-text-primary" role="status">{t('VIEW_LOADING')}</div>;
  }

  if (!enquiry) {
    return (
      <div className="min-w-0 space-y-6 text-text-primary">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card" role="alert">
          <h1 className="text-section-title font-semibold text-text-primary">{t('VIEW_NOT_FOUND')}</h1>
          <p className="text-caption text-text-secondary">{t('VIEW_NOT_AVAILABLE')}</p>
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-body font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 mt-2" onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES)}>{t('VIEW_BACK_TO_PIPELINE')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4"><p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('PREVIEW_FORM_NOTICE')}</p><>
      <Toaster position="bottom-right" />
      <div className="min-w-0 space-y-6 text-text-primary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-001"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES)}
            title={t('VIEW_BACK_TO_PIPELINE')}
            aria-label={t('VIEW_BACK_TO_PIPELINE')}
          >
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <nav className="text-caption text-text-secondary" aria-label={t('BREADCRUMB_ARIA')}>{t('BREADCRUMB')} &rsaquo; <span className="font-semibold text-text-primary">{enquiry.name}</span></nav>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
          <div className="min-w-0 space-y-4">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle font-semibold text-primary h-12 w-12 text-section-title" aria-hidden="true">{getInitials(enquiry.name)}</div>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <h1 className="text-section-title font-semibold text-text-primary">{enquiry.name}</h1>
                    <span data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-002" className={`inline-flex min-h-6 items-center rounded-full px-2 py-1 text-caption font-semibold ${statusBadgeCls}`}>{statusLabel(enquiry.status)}</span>
                  </div>
                  <p className="mt-1 text-body text-text-secondary"><Phone size={18} strokeWidth={2} aria-hidden="true" /> +91 {maskPhone(enquiry.phone)}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-caption font-medium text-text-secondary"><Tag size={18} strokeWidth={2} />{t('VIEW_SOURCE')}</p><p className="mt-1 break-words text-body text-text-primary">{enquiry.source || t('VALUE_NOT_PROVIDED')}</p></div>
                <div><p className="text-caption font-medium text-text-secondary"><Clock size={18} strokeWidth={2} />{t('VIEW_PREFERRED_SHIFT')}</p><p className="mt-1 break-words text-body text-text-primary">{enquiry.shift}</p></div>
                <div><p className="text-caption font-medium text-text-secondary"><User size={18} strokeWidth={2} />{t('VIEW_HANDLED_BY')}</p><p className="mt-1 break-words text-body text-text-primary">{enquiry.handledBy}</p></div>
                <div><p className="text-caption font-medium text-text-secondary"><MapPin size={18} strokeWidth={2} />{t('VIEW_BRANCH')}</p><p className="mt-1 break-words text-body text-text-primary">{enquiry.preferredBranch || t('VALUE_NOT_PROVIDED')}</p></div>
                <div><p className="text-caption font-medium text-text-secondary"><CalendarDays size={18} strokeWidth={2} />{t('VIEW_ENQUIRY_DATE')}</p><p className="mt-1 break-words text-body text-text-primary">{formatAdminEnquiriesDate(enquiry.enquiryDate, locale)}</p></div>
                <div><p className="text-caption font-medium text-text-secondary"><Phone size={18} strokeWidth={2} />{t('VIEW_MASKED_PHONE')}</p><p className="mt-1 break-words text-body text-text-primary">{maskPhone(enquiry.phone)}</p></div>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <h2 className="text-section-title font-semibold text-text-primary">{t('VIEW_TIMELINE')}</h2>
              {enquiry.followUps.length === 0 ? (
                <div data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-003" className="min-h-32 p-4">
                  <Clock size={18} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true"  strokeWidth={2}/>
                  <p data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-004" className="max-w-lg text-body text-text-secondary">{t('VIEW_NO_FOLLOWUPS')}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {enquiry.followUps.map((followUp: FollowUp) => (
                    <div className="grid grid-cols-[1rem_minmax(0,1fr)] gap-3" key={followUp.id}>
                      <div className={`mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary-subtle ${timelineDotClass()}`} aria-hidden="true" />
                      <div className="min-w-0 rounded-lg border border-border bg-card p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="text-caption font-medium text-text-primary">{formatAdminEnquiriesDate(followUp.date, locale)}<span className="text-caption text-text-secondary">{followUp.time}</span></p>
                          <p className="mt-2 text-caption text-text-secondary">{t('VIEW_BY', { name: followUp.by })}</p>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap break-words text-body text-text-primary">{followUp.remark}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <h3 className="text-caption font-semibold uppercase tracking-wide text-text-secondary">{t('VIEW_CURRENT_STATUS')}</h3>
              <div data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-005" className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-0">
                  <select data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-006" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={currentStatus} disabled aria-label={t('VIEW_CURRENT_STATUS')}>
                    <option value={currentStatus}>{statusLabel(currentStatus)}</option>
                  </select>
                </div>
              </div>
              <p className="text-caption text-text-secondary mt-2">{t('VIEW_STATUS_DISABLED')}</p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <h3 className="text-caption font-semibold uppercase tracking-wide text-text-secondary">{t('VIEW_FOLLOWUP_ACTIONS')}</h3>
              <p className="text-caption text-text-secondary">{t('VIEW_FOLLOWUP_DISABLED')}</p>
              {(enquiry.isToday || enquiry.isUpcoming || enquiry.isOverdue) && (
                <>
                  <div className="border-t border-border" />
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-info-bg bg-info-bg p-3">
                    <div className="flex min-w-0 items-start gap-2"><CalendarDays size={18} strokeWidth={2} aria-hidden="true" /><span>{t('VIEW_NEXT_FOLLOWUP', { date: followUpDateLabel })}</span></div>
                    <button type="button" data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-007" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" title={t('VIEW_FOLLOWUP_BLOCKED')} aria-label={t('VIEW_EDIT_FOLLOWUP')} disabled>
                      <Pencil size={18} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card grid gap-4">
              <h3 className="text-caption font-semibold uppercase tracking-wide text-text-secondary">{t('ACTIONS_TITLE')}</h3>
              <p className="text-caption text-text-secondary">{t('VIEW_ACTIONS_DISABLED')}</p>
            </div>
          </div>
        </div>
      </div>
    </></div>
  );
}


export type { AdminEnquiriesEnquiryDetailPageViewProps };
