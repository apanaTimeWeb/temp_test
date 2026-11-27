'use client';

import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import {
  resolveComplaintCategory,
  resolvePriority,
} from '@/app/frontend_admin/admin_communication/communication_complaints/utils/adminCommunicationComplaintsExports';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import {
  Building2, Calendar, Check, CheckCircle2, Clock, Copy, MapPin,
  MessageSquare, Printer, Share2, ShieldAlert, User, X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useState } from 'react';

export interface AdminCommunicationComplaintDetailModalProps {
  viewItem: Complaint | null;
  resolveItem: Complaint | null;
  resolveNote: string;
  isDemoMode: boolean;
  onCloseView: () => void;
  onCloseResolve: () => void;
  onChangeResolveNote: (note: string) => void;
  onConfirmResolve: () => void;
  statusBadge: (status: Complaint['status']) => ReactNode;
  formatComplaintDate: (date: string) => string;
}

export function AdminCommunicationComplaintDetailModal({
  viewItem,
  resolveItem,
  resolveNote,
  onCloseView,
  onCloseResolve,
  onChangeResolveNote,
  onConfirmResolve,
  statusBadge,
  formatComplaintDate,
}: AdminCommunicationComplaintDetailModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const [copied, setCopied] = useState(false);

  const category = viewItem ? resolveComplaintCategory(viewItem) : null;
  const priority = viewItem ? resolvePriority(viewItem) : null;
  const CategoryIcon = category ? category.icon : MessageSquare;

  const handleCopyTicket = () => {
    if (!viewItem) return;
    const text = `Library Grievance Ticket #${viewItem.id}\nBranch: ${viewItem.branchName ?? 'Downtown Central'}\nStudent: ${viewItem.student}\nSubject: ${viewItem.title}\nStatus: ${viewItem.status}\nDetails: ${viewItem.description}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!viewItem) return;
    const msg = `*Library Grievance Update - Ticket #${viewItem.id}*\nHello ${viewItem.student}, regarding your ticket: "${viewItem.title}".\nCurrent Status: ${viewItem.status}\nBranch: ${viewItem.branchName ?? 'Downtown Central'}\n${viewItem.resolvedNote ? `Resolution: ${viewItem.resolvedNote}` : 'Our facility engineering team is actively investigating.'}`;
    const popup = window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  return (
    <>
      {viewItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseView(); }}>
          <DialogContent className="relative w-full max-w-2xl rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog space-y-5">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border border-border-focus bg-primary-subtle text-primary">
                    Ticket #{viewItem.id}
                  </span>
                  {category && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${category.badgeClass}`}>
                      <CategoryIcon size={12} className="shrink-0" aria-hidden="true" />
                      <span>{category.label}</span>
                    </span>
                  )}
                  {priority && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs border ${priority.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${priority.dotClass}`} />
                      <span>{priority.label}</span>
                    </span>
                  )}
                  {viewItem.isEscalatedToHq && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-danger bg-danger-bg px-2 py-0.5 text-xs font-bold text-danger-text">
                      <ShieldAlert size={12} className="shrink-0 text-danger-text" aria-hidden="true" />
                      HQ Escalated
                    </span>
                  )}
                </div>
                <DialogTitle className="text-lg font-bold text-text-primary">{viewItem.title}</DialogTitle>
                <p className="text-xs text-text-secondary flex items-center gap-1.5">
                  <span>Logged by</span>
                  <strong className="text-text-primary">{viewItem.student}</strong>
                  <span>on</span>
                  <span className="font-mono">{formatComplaintDate(viewItem.date)}</span>
                </p>
              </div>
              <button
                type="button"
                aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')}
                data-testid="admin_communication-page-control-007"
                onClick={onCloseView}
                className="rounded-xl p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <DialogDescription className="sr-only">{t('COMPLAINT_DIALOG_DESCRIPTION')}</DialogDescription>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                  <User size={12} className="text-primary" aria-hidden="true" />
                  Complainant
                </span>
                <p className="text-xs font-bold text-text-primary truncate">{viewItem.student}</p>
                <p className="text-[11px] text-text-secondary font-mono">{viewItem.seatNumber ? `Seat ${viewItem.seatNumber}` : 'Active Member'}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                  <Building2 size={12} className="text-success-text" aria-hidden="true" />
                  Branch
                </span>
                <p className="text-xs font-bold text-text-primary truncate">{viewItem.branchName ?? 'Downtown Central'}</p>
                <p className="text-[11px] text-text-secondary flex items-center gap-0.5"><MapPin size={10} aria-hidden="true" /> Physical Facility</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                  <Clock size={12} className="text-warning-text" aria-hidden="true" />
                  Current Status
                </span>
                <div className="mt-0.5">{statusBadge(viewItem.status)}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                  <Calendar size={12} className="text-info-text" aria-hidden="true" />
                  Registered
                </span>
                <p className="text-xs font-mono font-bold text-text-primary">{formatComplaintDate(viewItem.date)}</p>
                <p className="text-[11px] text-text-secondary">Library Desk Portal</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-highlight p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-primary" aria-hidden="true" />
                  Detailed Grievance Statement
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
                >
                  {copied ? <Check size={12} className="text-success-text" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
              <p className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap rounded-lg bg-card p-3 border border-border">
                {viewItem.description}
              </p>
            </div>

            {viewItem.resolvedNote ? (
              <div className="rounded-xl border border-success bg-success-bg p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-success-text">
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>Resolution Summary (Official Action Log)</span>
                  </div>
                  {viewItem.resolvedDate && (
                    <span className="text-[11px] font-mono text-success-text">Resolved: {formatComplaintDate(viewItem.resolvedDate)}</span>
                  )}
                </div>
                <p className="text-xs text-text-primary leading-relaxed whitespace-pre-wrap bg-card p-2.5 rounded-lg border border-success">
                  {viewItem.resolvedNote}
                </p>
                <p className="text-[11px] text-text-secondary font-mono">
                  Closed by: <span className="text-text-primary font-semibold">{viewItem.resolvedBy ?? 'Downtown HQ Admin'}</span>
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-warning bg-warning-bg p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-warning-text shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium text-warning-text">This grievance is currently unresolved and under active review.</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
                >
                  <Share2 size={13} aria-hidden="true" />
                  <span>Notify via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary motion-safe:transition-colors shadow-card"
                >
                  <Printer size={13} aria-hidden="true" />
                  <span>Print Slip</span>
                </button>
              </div>
              <button
                type="button"
                onClick={onCloseView}
                className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {resolveItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseResolve(); }}>
          <DialogContent className="relative w-full max-w-lg rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-success-text" aria-hidden="true" />
                  Resolve Grievance
                </DialogTitle>
                <p className="text-xs text-text-secondary mt-0.5">
                  Confirm remedial action taken for <strong className="text-text-primary">{resolveItem.title}</strong>
                </p>
              </div>
              <button
                type="button"
                aria-label="Close resolve dialog"
                onClick={onCloseResolve}
                className="rounded-xl p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <DialogDescription className="sr-only">Resolve complaint resolution dialog</DialogDescription>
            <div>
              <label htmlFor="resolve-complaint-note" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                Resolution Notes / Remedial Action Taken
              </label>
              <textarea
                id="resolve-complaint-note"
                maxLength={1000}
                value={resolveNote}
                onChange={(e) => onChangeResolveNote(e.target.value)}
                placeholder="e.g. AC technician replaced condenser capacitor. Room temperature restored to 22°C."
                rows={3}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-end gap-2.5 border-t border-border pt-3">
              <button
                type="button"
                onClick={onCloseResolve}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmResolve}
                disabled={!resolveNote.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-success px-4 py-2 text-xs font-semibold text-on-primary hover:opacity-90 motion-safe:transition-opacity disabled:opacity-40"
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                Confirm &amp; Mark Resolved
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AdminCommunicationComplaintDetailModal;
