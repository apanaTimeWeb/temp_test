'use client';

import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import {
Building2,
Calendar,
Check,
CheckCircle2,
Clock,
Copy,
MapPin,
MessageSquare,
Printer,
Share2,
ShieldAlert,
User,
X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { resolveComplaintCategory,resolvePriority } from './AdminCommunicationComplaintsTable';

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
  isDemoMode,
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
    const text = `Library Grievance Ticket #${viewItem.id}
Branch: ${viewItem.branchName ?? 'Downtown Central'}
Student: ${viewItem.student}
Subject: ${viewItem.title}
Status: ${viewItem.status}
Details: ${viewItem.description}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!viewItem) return;
    const msg = `*Library Grievance Update - Ticket #${viewItem.id}*
Hello ${viewItem.student}, regarding your ticket: "${viewItem.title}".
Current Status: ${viewItem.status}
Branch: ${viewItem.branchName ?? 'Downtown Central'}
${viewItem.resolvedNote ? `Resolution: ${viewItem.resolvedNote}` : 'Our facility engineering team is actively investigating.'}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* View Detail Modal - Full Executive Grievance Dossier */}
      {viewItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseView(); }}>
          <DialogContent className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border border-primary/30 bg-primary/10 text-primary">
                    Ticket #{viewItem.id}
                  </span>
                  {category && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${category.badgeClass}`}>
                      <CategoryIcon size={12} className="shrink-0" />
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
                    <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-300">
                      <ShieldAlert size={12} className="shrink-0 text-rose-400" />
                      HQ Escalated
                    </span>
                  )}
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {viewItem.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>Logged by</span>
                  <strong className="text-foreground">{viewItem.student}</strong>
                  <span>on</span>
                  <span className="font-mono">{formatComplaintDate(viewItem.date)}</span>
                </p>
              </div>

              <button
                type="button"
                aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')}
                data-testid="admin_communication-page-control-007"
                onClick={onCloseView}
                className="rounded-xl p-2 text-muted-foreground hover:bg-card-hover hover:text-foreground transition-colors"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <DialogDescription className="sr-only">
              {t('COMPLAINT_DIALOG_DESCRIPTION')}
            </DialogDescription>

            {/* 4 Executive Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Complainant Card */}
              <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <User size={12} className="text-primary" />
                  Complainant
                </span>
                <p className="text-xs font-bold text-foreground truncate">{viewItem.student}</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {viewItem.seatNumber ? `Seat ${viewItem.seatNumber}` : 'Active Member'}
                </p>
              </div>

              {/* Branch & Location */}
              <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Building2 size={12} className="text-emerald-400" />
                  Branch
                </span>
                <p className="text-xs font-bold text-foreground truncate">{viewItem.branchName ?? 'Downtown Central'}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                  <MapPin size={10} /> Physical Facility
                </p>
              </div>

              {/* Status */}
              <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Clock size={12} className="text-amber-400" />
                  Current Status
                </span>
                <div className="mt-0.5">{statusBadge(viewItem.status)}</div>
              </div>

              {/* Date Logged */}
              <div className="rounded-xl border border-border bg-surface p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} className="text-cyan-400" />
                  Registered
                </span>
                <p className="text-xs font-mono font-bold text-foreground">{formatComplaintDate(viewItem.date)}</p>
                <p className="text-[11px] text-muted-foreground">Library Desk Portal</p>
              </div>
            </div>

            {/* Issue Description Container */}
            <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-primary" />
                  Detailed Grievance Statement
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap rounded-lg bg-card/60 p-3 border border-border/50">
                {viewItem.description}
              </p>
            </div>

            {/* Resolution History / Actions */}
            {viewItem.resolvedNote ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 size={15} />
                    <span>Resolution Summary (Official Action Log)</span>
                  </div>
                  {viewItem.resolvedDate && (
                    <span className="text-[11px] font-mono text-emerald-300">
                      Resolved: {formatComplaintDate(viewItem.resolvedDate)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap bg-card/40 p-2.5 rounded-lg border border-emerald-500/20">
                  {viewItem.resolvedNote}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Closed by: <span className="text-foreground font-semibold">{viewItem.resolvedBy ?? 'Downtown HQ Admin'}</span>
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-400 shrink-0" />
                  <span className="text-xs font-medium text-amber-200">
                    This grievance is currently unresolved and under active review.
                  </span>
                </div>
              </div>
            )}

            {/* Footer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-xs"
                >
                  <Share2 size={13} />
                  <span>Notify via WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all shadow-xs"
                >
                  <Printer size={13} />
                  <span>Print Slip</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCloseView}
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-card-hover hover:text-foreground transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Resolve Action Modal */}
      {resolveItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseResolve(); }}>
          <DialogContent className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  Resolve Grievance
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Confirm remedial action taken for <strong className="text-foreground">{resolveItem.title}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseResolve}
                className="rounded-xl p-2 text-muted-foreground hover:bg-card-hover hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <DialogDescription className="sr-only">Resolve complaint resolution dialog</DialogDescription>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Resolution Notes / Remedial Action Taken
              </label>
              <textarea maxLength={1000}
                value={resolveNote}
                onChange={(e) => onChangeResolveNote(e.target.value)}
                placeholder="e.g. AC technician replaced condenser capacitor. Room temperature restored to 22°C."
                rows={3}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-border pt-3">
              <button
                type="button"
                onClick={onCloseResolve}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-card-hover hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmResolve}
                disabled={!resolveNote.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all disabled:opacity-40"
              >
                <CheckCircle2 size={14} />
                Confirm & Mark Resolved
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AdminCommunicationComplaintDetailModal;
