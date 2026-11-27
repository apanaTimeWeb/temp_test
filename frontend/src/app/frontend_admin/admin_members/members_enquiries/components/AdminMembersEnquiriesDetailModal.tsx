'use client';
// RESPONSIBILITY: AdminMembersEnquiriesDetailModal provides executive quick-view oversight of enquiry leads for admins.

import { ADMIN_ENQUIRIES_ENQUIRY_STATUS_BADGE } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import type { Enquiry, FollowUp } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { formatAdminEnquiriesDate, getInitials, maskPhone } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertCircle, Building2, CalendarDays, CheckCircle2, Clock, ExternalLink, FileText, MessageSquare, Phone, ShieldCheck, Tag, UserCheck, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

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

  if (!enquiry) return null;

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
  const waPhone = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits.startsWith('0') ? `91${cleanPhoneDigits.slice(1)}` : cleanPhoneDigits;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${enquiry.name}, greetings from Smart Library! We are reaching out regarding your enquiry.`)}`;
  const followUps = enquiry.followUps || [];

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl border border-border bg-overlay shadow-dialog text-text-primary p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border-focus bg-primary-subtle text-base font-bold text-primary shadow-card">
              {getInitials(enquiry.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg sm:text-xl font-bold text-text-primary truncate">
                  {enquiry.name}
                </DialogTitle>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeCls}`}>
                  {statusLabel(enquiry.status)}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5 flex flex-wrap items-center gap-2">
                <span>Enquiry ID: #{enquiry.id.slice(0, 6)}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-text-primary">
                  <Phone size={12} className="text-text-secondary" aria-hidden="true" />
                  +91 {maskPhone(enquiry.phone)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <CalendarDays size={12} aria-hidden="true" />
                  {formatAdminEnquiriesDate(enquiry.addedDate || enquiry.enquiryDate, locale)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title="Chat on WhatsApp">
              <MessageSquare size={14} aria-hidden="true" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            {onNavigateFullPage && (
              <button type="button" onClick={() => onNavigateFullPage(enquiry.id)} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title="Open full page view">
                <ExternalLink size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Full Page</span>
              </button>
            )}
            <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Close dialog">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-surface-highlight p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Building2 size={13} className="text-success-text" aria-hidden="true" /> Branch</span>
              <p className="mt-1 text-sm font-semibold text-success-text truncate">{enquiry.preferredBranch || 'Downtown Hub'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-highlight p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Clock size={13} className="text-info-text" aria-hidden="true" /> Shift</span>
              <p className="mt-1 text-sm font-semibold text-text-primary truncate">{enquiry.shift || 'Flexible / Any'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-highlight p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Tag size={13} className="text-primary" aria-hidden="true" /> Lead Source</span>
              <p className="mt-1 text-sm font-semibold text-text-primary truncate">{enquiry.source || 'Direct Walk-in'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-highlight p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><UserCheck size={13} className="text-warning-text" aria-hidden="true" /> Handled By</span>
              <p className="mt-1 text-sm font-semibold text-warning-text truncate">{enquiry.handledBy || 'Unassigned'}</p>
            </div>
          </div>

          {enquiry.isOverdue ? (
            <div className="flex items-center gap-3 rounded-xl border border-danger bg-danger-bg p-3 text-danger-text">
              <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
              <div className="text-xs"><span className="font-bold">Follow-Up SLA Missed:</span> Branch manager has an overdue follow-up on this prospect.</div>
            </div>
          ) : enquiry.isToday ? (
            <div className="flex items-center gap-3 rounded-xl border border-warning bg-warning-bg p-3 text-warning-text">
              <Clock size={18} className="shrink-0" aria-hidden="true" />
              <div className="text-xs"><span className="font-bold">Follow-Up Scheduled Today:</span> Assigned manager is scheduled to contact the candidate today.</div>
            </div>
          ) : enquiry.isUpcoming ? (
            <div className="flex items-center gap-3 rounded-xl border border-success bg-success-bg p-3 text-success-text">
              <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
              <div className="text-xs"><span className="font-bold">On Schedule:</span> Upcoming manager follow-up is scheduled.</div>
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-surface-highlight p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text-primary">Manager Follow-Up Trail & Call Notes</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-border bg-card text-text-secondary">
                {followUps.length} {followUps.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            <div className="mt-4">
              {followUps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock size={28} className="text-text-disabled mb-2" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-xs font-medium text-text-secondary">No follow-up notes recorded yet by branch manager.</p>
                  <p className="text-[11px] text-text-secondary mt-0.5">Call remarks and progress updates will appear here once recorded.</p>
                </div>
              ) : (
                <div className="relative pl-5 space-y-3.5 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:bg-border">
                  {followUps.map((fu: FollowUp) => (
                    <div key={fu.id} className="relative group">
                      <div className="absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 border-card bg-primary shadow-card" />
                      <div className="rounded-lg border border-border bg-card p-3.5 motion-safe:transition-colors hover:border-border-focus">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border pb-1.5">
                          <span className="text-xs font-semibold text-text-primary">
                            {formatAdminEnquiriesDate(fu.date, locale)}
                            {fu.time && <span className="text-text-secondary font-normal ml-1.5">({fu.time})</span>}
                          </span>
                          <span className="text-[11px] font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded border border-border-focus">
                            Logged by: {fu.by}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{fu.remark}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card p-4 px-6 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <ShieldCheck size={14} className="text-primary shrink-0" aria-hidden="true" />
            <span>Admin Supervisory View • Student enquiries and admissions are managed at branch manager desks.</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-border bg-surface-highlight px-4 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
