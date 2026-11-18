'use client';

import { toast, Toaster } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Phone,
  MapPin,
  User,
  CalendarDays,
  Tag,
  Clock,
  Pencil,
  MessageSquare,
  ShieldCheck,
  Building2,
  Sparkles,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
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

  if (!isFrontendDemoModeEnabled()) {
    return (
      <section className="space-y-3 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-8 text-white shadow-xl backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">{t('VIEW_NOT_AVAILABLE')}</h1>
        <p role="status" className="text-amber-400 text-sm">{t('PREVIEW_ONLY')}</p>
      </section>
    );
  }

  const statusLabel = (status: string) => {
    const keys: Record<string, string> = {
      New: 'STATUS_NEW',
      Visited: 'STATUS_VISITED',
      Interested: 'STATUS_INTERESTED',
      Converted: 'STATUS_CONVERTED',
      Lost: 'STATUS_LOST',
    };
    return t(keys[status] ?? 'STATUS');
  };

  const {
    router,
    enquiry,
    loading,
    statusBadgeCls,
    currentStatus,
    followUpDateClass,
    followUpDateLabel,
    timelineDotClass,
  } = model;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-slate-400" role="status">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm font-medium">{t('VIEW_LOADING')}</span>
        </div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md" role="alert">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <AlertCircle size={24} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">{t('VIEW_NOT_FOUND')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('VIEW_NOT_AVAILABLE')}</p>
          <button
            type="button"
            className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES)}
          >
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

      {/* Top Breadcrumb & Executive Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-001"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 shadow-sm transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={() => router.push(ADMIN_ENQUIRIES_URLS.ENQUIRIES)}
            title={t('VIEW_BACK_TO_PIPELINE')}
            aria-label={t('VIEW_BACK_TO_PIPELINE')}
          >
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <div>
            <nav className="text-xs font-medium text-slate-400" aria-label={t('BREADCRUMB_ARIA')}>
              {t('BREADCRUMB')} &rsaquo; <span className="text-slate-200">Enquiry Lead #{enquiry.id.slice(0, 6)}</span>
            </nav>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
              {enquiry.name}
              <span className="text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold">
                Executive Dossier
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500/20 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <MessageSquare size={15} strokeWidth={2} />
            Quick WhatsApp
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>
      </div>

      {/* Executive KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Lead Status</span>
            <Sparkles size={14} className="text-indigo-400" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-002"
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusBadgeCls}`}
            >
              {statusLabel(enquiry.status)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Current pipeline milestone</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Handling Manager</span>
            <UserCheck size={14} className="text-cyan-400" />
          </div>
          <p className="mt-2 text-base font-bold text-white truncate">{enquiry.handledBy || 'Assigned Branch Lead'}</p>
          <p className="mt-1 text-[11px] text-slate-400">Accountable operational manager</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Branch Allocation</span>
            <Building2 size={14} className="text-emerald-400" />
          </div>
          <p className="mt-2 text-base font-bold text-emerald-300 truncate">{enquiry.preferredBranch || 'Downtown Central'}</p>
          <p className="mt-1 text-[11px] text-slate-400">Registered campus target</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Follow-Up Health</span>
            <Clock size={14} className="text-amber-400" />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {enquiry.isOverdue ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                <AlertCircle size={14} /> Overdue by Manager
              </span>
            ) : enquiry.isToday ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                <Clock size={14} /> Scheduled Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 size={14} /> On Schedule
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{enquiry.followUps.length} logged manager interactions</p>
        </div>
      </div>

      {/* Main Grid: Detailed Specs & Manager Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Prospect Profile & Lead Attribution */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-lg font-bold text-indigo-300 shadow-inner">
                {getInitials(enquiry.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-white">{enquiry.name}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-500" />
                    +91 {maskPhone(enquiry.phone)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} className="text-slate-500" />
                    Created: {formatAdminEnquiriesDate(enquiry.enquiryDate, locale)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Tag size={13} className="text-indigo-400" /> Lead Source
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{enquiry.source || 'Direct Walk-in'}</p>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Clock size={13} className="text-cyan-400" /> Preferred Shift
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{enquiry.shift || 'Flexible / Any'}</p>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-400" /> Allocated Branch
                </span>
                <p className="mt-1 text-sm font-semibold text-emerald-300">{enquiry.preferredBranch || 'Downtown Central'}</p>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User size={13} className="text-amber-400" /> Assigned Officer
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{enquiry.handledBy || 'Operational Manager'}</p>
              </div>
            </div>
          </div>

          {/* Manager Interaction History & Timeline */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-indigo-400" />
                  Manager Follow-up Trail & Notes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Chronological record of manager conversations & updates</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
                {enquiry.followUps.length} Records
              </span>
            </div>

            <div className="mt-5">
              {enquiry.followUps.length === 0 ? (
                <div data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-003" className="flex flex-col items-center justify-center py-10 text-center">
                  <Clock size={32} className="text-slate-600 mb-2" strokeWidth={1.5} />
                  <p data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-004" className="text-sm font-medium text-slate-400">
                    {t('VIEW_NO_FOLLOWUPS')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Branch manager has not recorded call logs yet for this enquiry lead.</p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-slate-800">
                  {enquiry.followUps.map((followUp: FollowUp) => (
                    <div key={followUp.id} className="relative group">
                      <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-indigo-500 shadow-sm" />
                      <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                          <span className="text-xs font-semibold text-slate-200">
                            {formatAdminEnquiriesDate(followUp.date, locale)}
                            <span className="text-slate-400 font-normal ml-1.5">({followUp.time})</span>
                          </span>
                          <span className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            Logged by: {followUp.by}
                          </span>
                        </div>
                        <p className="mt-2.5 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {followUp.remark}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Executive Governance & Controls */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" />
              Administrative Governance
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Operational execution is managed by Branch Managers. Admin maintains executive oversight.
            </p>

            <div className="mt-5 space-y-4">
              <div data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-state-005" className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Current Lifecycle State</span>
                <div className="mt-2">
                  <select
                    data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-006"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 cursor-not-allowed opacity-90"
                    value={currentStatus}
                    disabled
                    aria-label={t('VIEW_CURRENT_STATUS')}
                  >
                    <option value={currentStatus}>{statusLabel(currentStatus)}</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Status changes are performed by assigned Branch Managers through the CRM operational interface.
                </p>
              </div>

              {(enquiry.isToday || enquiry.isUpcoming || enquiry.isOverdue) && (
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <div className="flex items-start gap-2.5">
                    <CalendarDays size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-indigo-200">
                        {t('VIEW_NEXT_FOLLOWUP', { date: followUpDateLabel })}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Assigned manager SLA deadline.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid="admin_enquiries-AdminEnquiriesEnquiryDetailPageView-control-007"
                    className="hidden"
                    title={t('VIEW_FOLLOWUP_BLOCKED')}
                    aria-label={t('VIEW_EDIT_FOLLOWUP')}
                    disabled
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              Direct Communication
            </h3>
            <p className="text-xs text-slate-400 mt-1">Instant outreach without leaving the admin portal</p>

            <div className="mt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-4 py-3 text-xs font-bold text-emerald-300 shadow-md transition-all hover:bg-emerald-600/30 hover:text-emerald-200"
              >
                <MessageSquare size={16} />
                Open WhatsApp Chat
              </a>
              <p className="mt-2 text-center text-[11px] text-slate-500">
                Pre-filled greeting to prospect (+91 {maskPhone(enquiry.phone)})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { AdminEnquiriesEnquiryDetailPageViewProps };
