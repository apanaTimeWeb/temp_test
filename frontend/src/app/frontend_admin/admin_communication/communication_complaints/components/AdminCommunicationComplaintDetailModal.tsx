'use client';

import { useTranslations } from 'next-intl';
import { X, Building2, AlertTriangle, MessageSquare, CheckCircle2, User, Clock, ShieldCheck } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import type { ReactNode } from 'react';

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

  return (
    <>
      {/* View Detail Modal */}
      {viewItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseView(); }}>
          <DialogContent className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-400" />
                  {viewItem.title}
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Logged by <strong className="text-white">{viewItem.student}</strong> on {formatComplaintDate(viewItem.date)}
                </p>
              </div>
              <button
                type="button"
                aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')}
                data-testid="admin_communication-page-control-007"
                onClick={onCloseView}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <DialogDescription className="sr-only">{t('COMPLAINT_DIALOG_DESCRIPTION')}</DialogDescription>

            <div className="flex flex-wrap items-center gap-2">
              {statusBadge(viewItem.status)}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300">
                <Building2 size={12} className="text-emerald-400" />
                {viewItem.branchName ?? 'Downtown Central'}
              </span>
              {viewItem.isEscalatedToHq && (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-xs font-bold text-rose-400">
                  <AlertTriangle size={12} className="shrink-0" />
                  Escalated to HQ
                </span>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Issue Description
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {viewItem.description}
              </p>
            </div>

            {viewItem.resolvedNote && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={14} />
                  Resolution Summary ({viewItem.resolvedBy ?? 'Branch Manager'})
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {viewItem.resolvedNote}
                </p>
                {viewItem.resolvedDate && (
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Resolved at: {formatComplaintDate(viewItem.resolvedDate)}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={onCloseView}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Resolve Action Modal */}
      {resolveItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseResolve(); }}>
          <DialogContent className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  Resolve Grievance
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm remedial action taken for {resolveItem.title}
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseResolve}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <DialogDescription className="sr-only">Resolve complaint resolution dialog</DialogDescription>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Resolution Notes / Remedial Action Taken
              </label>
              <textarea
                value={resolveNote}
                onChange={(e) => onChangeResolveNote(e.target.value)}
                placeholder="e.g. AC technician replaced condenser capacitor. Room temperature restored to 22°C."
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={onCloseResolve}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
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
