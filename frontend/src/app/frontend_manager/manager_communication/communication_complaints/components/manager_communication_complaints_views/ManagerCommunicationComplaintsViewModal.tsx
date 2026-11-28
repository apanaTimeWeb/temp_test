'use client';

import { Armchair,Calendar,CheckCircle2,Copy,MessageSquare,Printer,User,X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';
import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsTypes';

interface ManagerCommunicationComplaintsViewModalProps {
  viewItem: ManagerCommunicationComplaintsComplaint;
  dialogRef: React.Ref<HTMLDivElement>;
  locale: string;
  onClose: () => void;
  formatKnownIsoCalendarDate: (value: string, locale: string) => string;
  statusBadge: (status: ManagerCommunicationComplaintsComplaintStatus) => React.ReactNode;
  onResolveClick?: (complaint: ManagerCommunicationComplaintsComplaint) => void;
}

export function ManagerCommunicationComplaintsViewModal({
  viewItem,
  dialogRef,
  locale,
  onClose,
  formatKnownIsoCalendarDate,
  statusBadge,
  onResolveClick,
}: ManagerCommunicationComplaintsViewModalProps) {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');

  const locationTag = viewItem.seatTag || 'General Study Area';

  const handleWhatsAppStudent = () => {
    const studentName = viewItem.student || 'Student';
    let cleanPhone = (viewItem.phone || '9876543210').replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const resolutionText = viewItem.resolvedNote ? `\n\nAction Taken: ${viewItem.resolvedNote}` : '';
    const text = encodeURIComponent(
      `Hello ${studentName},\nThis is an update regarding your complaint (#${viewItem.id} - "${viewItem.title}") regarding [${locationTag}] at Central Library.\n` +
      `Current Status: ${viewItem.status}${resolutionText}\n\n` +
      `Please let us know if you require any further assistance.\n— Central Library Administration`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    toast.success(`WhatsApp opened for ${studentName} (+91 ${cleanPhone})`, {
      id: 'manager-complaints-view-wa-opened',
    });
  };

  const handleCopyDetails = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(
        `Complaint #${viewItem.id}\nTitle: ${viewItem.title}\nSeat / Hall: ${locationTag}\nStudent: ${viewItem.student || 'Anonymous'}\nStatus: ${viewItem.status}\nDate: ${viewItem.date}\nDescription: ${viewItem.description}`
      );
    }
    toast.success('Complaint summary copied to clipboard', {
      id: 'manager-complaints-view-copy-success',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="complaint-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm motion-safe:animate-fade-in"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
                Ticket #{viewItem.id}
              </span>
              {statusBadge(viewItem.status)}
              {viewItem.priority === 'Urgent' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  URGENT
                </span>
              )}
            </div>
            <h3 id="complaint-view-title" className="text-lg font-bold text-primary">
              {viewItem.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            aria-label={tManagerUi('close_complaint')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          {/* Metadata 3-col Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-surface/50 border border-border">
            <div className="flex items-center gap-2 min-w-0">
              <User size={14} className="text-secondary shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-secondary font-semibold block">Student</span>
                <p className="font-bold text-primary truncate text-xs">{viewItem.student ?? 'Anonymous'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Armchair size={14} className="text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-amber-300 font-semibold block">Seat / Location</span>
                <p className="font-mono font-bold text-amber-300 truncate text-xs">{locationTag}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <Calendar size={14} className="text-secondary shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-secondary font-semibold block">Date Lodged</span>
                <p className="font-mono text-secondary text-xs truncate">
                  {formatKnownIsoCalendarDate(viewItem.date, locale)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-surface/30 border border-border space-y-1.5">
            <span className="text-[11px] font-semibold text-secondary">Complaint Description</span>
            <p className="text-xs sm:text-sm text-primary leading-relaxed bg-card p-3 rounded-lg border border-border/70">
              {viewItem.description}
            </p>
          </div>

          {/* Resolution Card if resolved */}
          {viewItem.resolvedNote && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 size={13} />
                <span>{tManagerUi('resolution')}</span>
              </div>
              <p className="text-xs text-emerald-300 leading-relaxed">{viewItem.resolvedNote}</p>
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
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            >
              <Copy size={12} />
              <span>Copy</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            >
              <Printer size={12} />
              <span>Print Slip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {viewItem.status !== 'Resolved' && onResolveClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResolveClick(viewItem);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 motion-safe:transition-colors cursor-pointer"
              >
                <CheckCircle2 size={13} />
                <span>Resolve Ticket</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleWhatsAppStudent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs motion-safe:transition-colors cursor-pointer"
              title="Send resolution update via WhatsApp"
            >
              <MessageSquare size={13} />
              <span>WhatsApp Student</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            >
              {tManagerUi('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
