'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
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
        <div className="mc-modal-footer">
          <button type="button" onClick={onClose} className="mc-btn-ghost">
            {tManagerUi('close')}
          </button>
        </div>
      </div>
    </div>
  );
}

