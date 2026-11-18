'use client';
// RESPONSIBILITY: AdminMembersEnquiriesDetailModal provides executive quick-view oversight of enquiry leads for admins.

import { useEffect } from 'react';
import {
  X,
  Phone,
  Building2,
  Clock,
  Tag,
  UserCheck,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CalendarDays,
  FileText,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Enquiry, FollowUp } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import { getInitials, maskPhone, formatAdminEnquiriesDate } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';

export interface AdminMembersEnquiriesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Enquiry | null;
  onNavigateFullPage?: (id: string) => void;
}

export default function AdminMembersEnquiriesDetailModal({
  isOpen,
  onClose,
  enquiry,
  onNavigateFullPage,
}: AdminMembersEnquiriesDetailModalProps) {
  const t = useTranslations('ADMIN_ENQUIRIES');
  const locale = useLocale();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !enquiry) return null;

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

  const statusBadgeCls = ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE[enquiry.status] || ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE.New;

  const cleanPhoneDigits = enquiry.phone.replace(/\D/g, '');
  const waPhone =
    cleanPhoneDigits.length === 10
      ? `91${cleanPhoneDigits}`
      : cleanPhoneDigits.startsWith('0')
      ? `91${cleanPhoneDigits.slice(1)}`
      : cleanPhoneDigits;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hello ${enquiry.name}, greetings from Smart Library! We are reaching out regarding your enquiry.`
  )}`;

  const followUps = enquiry.followUps || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/60 p-5 sm:p-6">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-base font-bold text-indigo-300 shadow-inner">
              {getInitials(enquiry.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="enquiry-modal-title" className="text-lg sm:text-xl font-bold text-white truncate">
                  {enquiry.name}
                </h2>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeCls}`}>
                  {statusLabel(enquiry.status)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                <span>Enquiry ID: #{enquiry.id.slice(0, 6)}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Phone size={12} className="text-slate-400" />
                  +91 {maskPhone(enquiry.phone)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <CalendarDays size={12} />
                  {formatAdminEnquiriesDate(enquiry.addedDate || enquiry.enquiryDate, locale)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            {onNavigateFullPage && (
              <button
                type="button"
                onClick={() => onNavigateFullPage(enquiry.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                title="Open full page view"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Full Page</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Executive Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 size={13} className="text-emerald-400" /> Branch
              </span>
              <p className="mt-1 text-sm font-semibold text-emerald-300 truncate">
                {enquiry.preferredBranch || 'Downtown Hub'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" /> Shift
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-200 truncate">
                {enquiry.shift || 'Flexible / Any'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag size={13} className="text-indigo-400" /> Lead Source
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-200 truncate">
                {enquiry.source || 'Direct Walk-in'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck size={13} className="text-amber-400" /> Handled By
              </span>
              <p className="mt-1 text-sm font-semibold text-amber-300 truncate">
                {enquiry.handledBy || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* Follow-up SLA Alert Banner */}
          {enquiry.isOverdue ? (
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300">
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
              <div className="text-xs">
                <span className="font-bold">Follow-Up SLA Missed:</span> Branch manager has an overdue follow-up on this prospect.
              </div>
            </div>
          ) : enquiry.isToday ? (
            <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-300">
              <Clock size={18} className="shrink-0 text-amber-400" />
              <div className="text-xs">
                <span className="font-bold">Follow-Up Scheduled Today:</span> Assigned manager is scheduled to contact the candidate today.
              </div>
            </div>
          ) : enquiry.isUpcoming ? (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              <div className="text-xs">
                <span className="font-bold">On Schedule:</span> Upcoming manager follow-up is scheduled.
              </div>
            </div>
          ) : null}

          {/* Manager Follow-up Trail & Notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Manager Follow-Up Trail & Call Notes</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
                {followUps.length} {followUps.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            <div className="mt-4">
              {followUps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock size={28} className="text-slate-600 mb-2" strokeWidth={1.5} />
                  <p className="text-xs font-medium text-slate-400">
                    No follow-up notes recorded yet by branch manager.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Call remarks and progress updates will appear here once recorded.
                  </p>
                </div>
              ) : (
                <div className="relative pl-5 space-y-3.5 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:bg-slate-800">
                  {followUps.map((fu: FollowUp) => (
                    <div key={fu.id} className="relative group">
                      <div className="absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-indigo-500 shadow-sm" />
                      <div className="rounded-lg border border-slate-800/80 bg-slate-900/80 p-3.5 transition-colors hover:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800/60 pb-1.5">
                          <span className="text-xs font-semibold text-slate-200">
                            {formatAdminEnquiriesDate(fu.date, locale)}
                            {fu.time && <span className="text-slate-400 font-normal ml-1.5">({fu.time})</span>}
                          </span>
                          <span className="text-[11px] font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            Logged by: {fu.by}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {fu.remark}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/60 p-4 px-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
            <span>Admin Supervisory View • Student enquiries and admissions are managed at branch manager desks.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
