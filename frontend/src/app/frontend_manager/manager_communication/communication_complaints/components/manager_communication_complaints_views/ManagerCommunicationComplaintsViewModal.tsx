'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { X, MessageSquare } from 'lucide-react';
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

  return (
    <div className="mc-overlay">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="mc-modal mc-modal--md bg-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-view-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="mc-modal-close"
          aria-label={tManagerUi('close_complaint')}
        >
          <X size={16} />
        </button>
        <p id="complaint-view-title" className="mc-modal-title">
          {viewItem.title}
        </p>
        <div className="mc-modal-badge-row">
          {statusBadge(viewItem.status)}
          <span className="mc-badge mc-badge--outline">
            {formatKnownIsoCalendarDate(viewItem.date, locale)}
          </span>
        </div>
        <p className="mc-complaint-by">
          {tManagerUi('by')} <span>{viewItem.student ?? '—'}</span>
        </p>
        <p className="mc-complaint-desc">{viewItem.description}</p>
        {viewItem.resolvedNote && (
          <div className="mc-info-box mt-4">
            <strong>{tManagerUi('resolution')}</strong> {viewItem.resolvedNote}
            {viewItem.resolvedBy ? ` — ${viewItem.resolvedBy}` : ''}
            {viewItem.resolvedDate
              ? ` ${tManagerUi('on')} ${formatKnownIsoCalendarDate(viewItem.resolvedDate, locale)}`
              : ''}
          </div>
        )}
        <div className="mc-modal-footer flex items-center justify-between">
          <button
            type="button"
            onClick={handleWhatsAppStudent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
            title="Send resolution update via WhatsApp"
          >
            <MessageSquare size={13} />
            <span>WhatsApp Student</span>
          </button>
          <button type="button" onClick={onClose} className="mc-btn-ghost">
            {tManagerUi('close')}
          </button>
        </div>
      </div>
    </div>
  );
}

