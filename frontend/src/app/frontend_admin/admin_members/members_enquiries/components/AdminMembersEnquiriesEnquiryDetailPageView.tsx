'use client';

import { AdminMembersEnquiriesFollowUpTimeline } from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesFollowUpTimeline';
import { ADMIN_ENQUIRIES_URLS } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import useAdminEnquiriesEnquiryDetailPage from '@/app/frontend_admin/admin_members/members_enquiries/hooks/useAdminMembersEnquiriesEnquiryDetailPage';
import type { AdminEnquiriesEnquiryDetailPageViewProps } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';
import { formatAdminEnquiriesDate, getInitials, maskPhone } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { AlertCircle, ArrowLeft, Building2, CalendarDays, CheckCircle2, Clock, ExternalLink, MessageSquare, Pencil, Phone, ShieldCheck, Tag, UserCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Toaster } from 'sonner';

export default function AdminEnquiriesEnquiryDetailPageView({ params }: AdminEnquiriesEnquiryDetailPageViewProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const locale = useLocale();
  const model = useAdminEnquiriesEnquiryDetailPage(params);

  if (!isFrontendDemoModeEnabled()) {
    return (
      <section className="space-y-3 rounded-2xl border border-warning bg-card p-8 text-text-primary shadow-card">
        <h1 className="text-xl font-bold text-text-primary">{t('VIEW_NOT_AVAILABLE')}</h1>
        <p role="status" className="text-warning-text text-sm">{t('PREVIEW_ONLY')}</p>
      </section>
    );
  }

  const statusLabel = (status: string) => {
    const keys: Record<string, string> = { New: 'STATUS_NEW', Visited: 'STATUS_VISITED', Interested: 'STATUS_INTERESTED', Converted: 'STATUS_CONVERTED', Lost: 'STATUS_LOST' };
    return t(keys[status] ?? 'STATUS');
  };

  const { router, enquiry, loading, statusBadgeCls, currentStatus } = model;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-12 text-text-secondary" role="status">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 motion-safe:animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium">{t('VIEW_LOADING')}</span>
        </div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card" role="alert">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-danger bg-danger-bg text-danger-text">
            <AlertCircle size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-text-primary">{t('VIEW_NOT_FOUND')}</h1>
          <p className="mt-1 text-sm text-text-secondary">{t('VIEW_NOT_AVAILABLE')}</p>
          <button type="button" className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-card motion-safe:transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES)}>
            {t('VIEW_BACK_TO_PIPELINE')}
          </button>
        </div>
      </div>
    );
  }

  const cleanPhoneDigits = enquiry.phone.replace(/\D/g, '');
  const waPhone = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits.startsWith('0') ? `91${cleanPhoneDigits.slice(1)}` : cleanPhoneDigits;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${enquiry.name}, greetings from Smart Library! We are following up regarding your enquiry.`)}`;

  return (
    <div className="space-y-6">
      <Toaster position="bottom-right" />

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3.5 min-w-0">
          <button type="button" data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-001" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-highlight text-text-secondary shadow-card motion-safe:transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES)} title={t('VIEW_BACK_TO_PIPELINE')} aria-label={t('VIEW_BACK_TO_PIPELINE')}>
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <nav className="text-xs font-medium text-text-secondary" aria-label={t('BREADCRUMB_ARIA')}>
              {t('BREADCRUMB')} &rsaquo; <span className="text-text-primary">Enquiry Lead #{enquiry.id.slice(0, 6)}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary truncate">{enquiry.name}</h1>
              <span data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-002" className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold ${statusBadgeCls}`}>
                {statusLabel(enquiry.status)}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-border-focus bg-primary-subtle text-primary font-semibold">
                Admin Supervisory Dossier
              </span>
            </div>
          </div>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-success bg-success-bg px-4 py-2.5 text-xs font-semibold text-success-text shadow-card motion-safe:transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <MessageSquare size={15} strokeWidth={2} aria-hidden="true" />
          Quick WhatsApp
          <ExternalLink size={12} className="opacity-70" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border pb-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-focus bg-primary-subtle text-lg font-bold text-primary shadow-card">
                {getInitials(enquiry.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-text-primary">{enquiry.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1 font-mono text-text-primary"><Phone size={13} className="text-text-secondary" aria-hidden="true" /> +91 {maskPhone(enquiry.phone)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><CalendarDays size={13} className="text-text-secondary" aria-hidden="true" /> Enquiry Date: {formatAdminEnquiriesDate(enquiry.enquiryDate || enquiry.addedDate, locale)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-surface-highlight p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Building2 size={14} className="text-success-text" aria-hidden="true" /> Allocated Branch</span>
                <p className="mt-1.5 text-sm font-semibold text-success-text">{enquiry.preferredBranch || 'Downtown Central'}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary">Registered campus target</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-highlight p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Clock size={14} className="text-info-text" aria-hidden="true" /> Preferred Shift</span>
                <p className="mt-1.5 text-sm font-semibold text-text-primary">{enquiry.shift || 'Flexible / Any'}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary">Candidate study schedule</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-highlight p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Tag size={14} className="text-primary" aria-hidden="true" /> Lead Source</span>
                <p className="mt-1.5 text-sm font-semibold text-text-primary">{enquiry.source || 'Direct Walk-in'}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary">Channel attribution</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-highlight p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><UserCheck size={14} className="text-warning-text" aria-hidden="true" /> Assigned Manager</span>
                <p className="mt-1.5 text-sm font-semibold text-warning-text">{enquiry.handledBy || 'Operational Manager'}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary">Responsible branch staff</p>
              </div>
            </div>
          </div>

          <AdminMembersEnquiriesFollowUpTimeline followUps={enquiry.followUps} locale={locale} />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" aria-hidden="true" />
              Manager SLA & Governance
            </h3>
            <p className="text-xs text-text-secondary mt-1">Operational follow-ups and admissions are executed by Branch Managers.</p>

            <div className="mt-5 space-y-4">
              <div data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-005" className="rounded-xl border border-border bg-surface-highlight p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Current Lifecycle Stage</span>
                <div className="mt-2.5 flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border bg-card">
                  <span className="text-sm font-bold text-text-primary">{statusLabel(currentStatus)}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeCls}`}>Active Stage</span>
                </div>
                <select data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-006" className="hidden" value={currentStatus} disabled aria-label={t('VIEW_CURRENT_STATUS')}>
                  <option value={currentStatus}>{statusLabel(currentStatus)}</option>
                </select>
                <p className="text-[11px] text-text-secondary mt-2">Status changes are performed by assigned Branch Managers through the CRM operational interface.</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-highlight p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Follow-up SLA Health</span>
                <div className="mt-2.5">
                  {enquiry.isOverdue ? (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg border border-danger bg-danger-bg text-danger-text">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <div><p className="text-xs font-bold">Overdue by Branch Manager</p><p className="text-[11px] mt-0.5">Manager follow-up deadline was missed.</p></div>
                    </div>
                  ) : enquiry.isToday ? (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg border border-warning bg-warning-bg text-warning-text">
                      <Clock size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <div><p className="text-xs font-bold">Due Today</p><p className="text-[11px] mt-0.5">Manager is scheduled to contact this prospect today.</p></div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg border border-success bg-success-bg text-success-text">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                      <div><p className="text-xs font-bold">On Schedule</p><p className="text-[11px] mt-0.5">Interaction scheduled according to branch workflow.</p></div>
                    </div>
                  )}
                </div>
                <button type="button" data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-007" className="hidden" title={t('VIEW_FOLLOWUP_BLOCKED')} aria-label={t('VIEW_EDIT_FOLLOWUP')} disabled>
                  <Pencil size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { AdminEnquiriesEnquiryDetailPageViewProps };
