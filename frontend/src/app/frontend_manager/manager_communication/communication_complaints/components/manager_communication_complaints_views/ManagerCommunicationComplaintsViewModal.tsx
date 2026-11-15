'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { X, MessageSquare, Printer, Copy, User, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '../../types/ManagerCommunicationComplaintsTypes';

interface ManagerCommunicationComplaintsViewModalProps {
  viewItem: ManagerCommunicationComplaintsComplaint;
  dialogRef: React.Ref<HTMLDivElement>;
  locale: string;
  onClose: () => void;
  formatKnownIsoCalendarDate: (value: string, locale: string) => string;
  statusBadge: (status: ManagerCommunicationComplaintsComplaintStatus) => React.ReactNode;
}

export function ManagerCommunicationComplaintsViewModal({
  viewItem,
  dialogRef,
  locale,
  onClose,
  formatKnownIsoCalendarDate,
  statusBadge,
}: ManagerCommunicationComplaintsViewModalProps) {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');

  const handleWhatsAppStudent = () => {
    const studentName = viewItem.student || 'Student';
    let cleanPhone = (viewItem.phone || '9876543210').replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const resolutionText = viewItem.resolvedNote ? `\n\nResolution: ${viewItem.resolvedNote}` : '';
    const text = encodeURIComponent(
      `Hello ${studentName},\nThis is an update regarding your query/complaint (#${viewItem.id} - "${viewItem.title}") at Central Library.\n` +
      `Current Status: ${viewItem.status}${resolutionText}\n\n` +
      `Please let us know if you require any further assistance.\n— Central Library Administration`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`WhatsApp opened for ${studentName} (+91 ${cleanPhone})`);
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(
      `Complaint #${viewItem.id}\nTitle: ${viewItem.title}\nStudent: ${viewItem.student || 'Anonymous'}\nStatus: ${viewItem.status}\nDate: ${viewItem.date}\nDescription: ${viewItem.description}`
    );
    toast.success('Complaint summary copied to clipboard');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="complaint-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Ticket #{viewItem.id}
              </span>
              {statusBadge(viewItem.status)}
            </div>
            <h3 id="complaint-view-title" className="text-lg font-bold text-primary">
              {viewItem.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
            aria-label={tManagerUi('close_complaint')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface/50 border border-border">
            <div className="flex items-center gap-2">
              <User size={14} className="text-secondary shrink-0" />
              <div>
                <span className="text-[11px] text-secondary font-semibold block">Student</span>
                <p className="font-bold text-primary truncate">{viewItem.student ?? 'Anonymous'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-secondary shrink-0" />
              <div>
                <span className="text-[11px] text-secondary font-semibold block">Date Lodged</span>
                <p className="font-mono text-secondary">{formatKnownIsoCalendarDate(viewItem.date, locale)}</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface/30 border border-border space-y-1.5">
            <span className="text-[11px] font-semibold text-secondary">Complaint Description</span>
            <p className="text-xs sm:text-sm text-primary leading-relaxed bg-card p-3 rounded-lg border border-border/70">
              {viewItem.description}
            </p>
          </div>

          {viewItem.resolvedNote && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 size={13} />
                <span>{tManagerUi('resolution')}</span>
              </div>
              <p className="text-xs text-emerald-300 leading-relaxed">
                {viewItem.resolvedNote}
              </p>
              {viewItem.resolvedBy && (
                <span className="text-[11px] text-emerald-400/80 block mt-1">
                  Resolved by {viewItem.resolvedBy}
                  {viewItem.resolvedDate ? ` on ${formatKnownIsoCalendarDate(viewItem.resolvedDate, locale)}` : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyDetails}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <Copy size={12} />
              <span>Copy</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <Printer size={12} />
              <span>Print Slip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppStudent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Send resolution update via WhatsApp"
            >
              <MessageSquare size={13} />
              <span>WhatsApp Student</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              {tManagerUi('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

