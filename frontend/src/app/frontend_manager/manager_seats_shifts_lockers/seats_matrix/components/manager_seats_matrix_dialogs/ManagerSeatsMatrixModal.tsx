'use client';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useManagerSeatMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/ManagerSeatsMatrixDialogFocus';

import { UserPlus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { SHIFT_BADGE } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import type { ManagerSeatsMatrixModalProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixComponentTypes';



export function ManagerSeatsMatrixModal({ selectedSeat, onClose }: ManagerSeatsMatrixModalProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerSeatMatrixDialogFocus(dialogRef, onClose, Boolean(selectedSeat));

  if (!selectedSeat) return null;

  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Evening: tManagerUi('evening'),
    'Full Day': tManagerUi('full_day'),
  };
  const shiftLabel = selectedSeat.shift ? (shiftLabels[selectedSeat.shift] ?? selectedSeat.shift) : '';

  return (
    <div className="ss-modal-overlay flex items-center justify-center fixed inset-0 z-50 bg-overlay" onClick={onClose}>
      <div ref={dialogRef} tabIndex={-1} className="ss-modal bg-card p-6 rounded-xl shadow-xl w-full max-w-lg border border-border" role="dialog" aria-modal="true" aria-labelledby="ss-seat-modal-title" onClick={e => e.stopPropagation()}>
        <h2 id="ss-seat-modal-title" className="sr-only">{tManagerUi('seat_b90b32')} {selectedSeat.id}</h2>
        {selectedSeat.status === 'free' ? (
          <>
            <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
              <span className="ss-badge ss-badge--success">{tManagerUi('free')}</span>
              <span className="ss-occupied-header__seat text-lg font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
            </div>
            <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('this_seat_is_available_for_assignment')}</p>
            <div className="ss-modal-footer flex gap-3">
              <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>{tManagerUi('close')}</button>
              <button type="button"
                className="mgr-btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={() => router.push(`${MANAGER_SEATS_MATRIX_ROUTES.ASSIGN_STUDENT}?seat=${encodeURIComponent(selectedSeat.id)}`)}
              >
                <UserPlus size={15} /> {tManagerUi('assign_student')}
              </button>
            </div>
          </>
        ) : selectedSeat.status === 'unknown' ? (
          <>
            <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
              <span className="mgr-badge bg-floating text-secondary">{tManagerUi('unknown_status')}</span>
              <span className="ss-occupied-header__seat text-lg font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
            </div>
            <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('unknown_status')}</p>
            <div className="ss-modal-footer flex">
              <button type="button" className="mgr-btn-ghost w-full" onClick={onClose}>{tManagerUi('close')}</button>
            </div>
          </>
        ) : selectedSeat.status === 'maintenance' ? (
          <>
            <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
              <span className="mgr-badge bg-floating text-secondary">{tManagerUi('maintenance')}</span>
              <span className="ss-occupied-header__seat text-lg font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
            </div>
            <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('this_seat_is_under_maintenance_and_unavailable')}</p>
            <div className="ss-modal-footer flex">
              <button type="button" className="mgr-btn-ghost w-full" onClick={onClose}>{tManagerUi('close')}</button>
            </div>
          </>
        ) : (
          <>
            <div className="ss-occupied-header -m-6 mb-6 p-6 bg-floating rounded-t-xl">
              <div className="ss-occupied-header__row flex justify-between items-center mb-4">
                <span className={`mgr-badge ${selectedSeat.status === 'expiring' ? 'mgr-badge--warning' : 'mgr-badge--danger'}`}>
                  {selectedSeat.status === 'expiring' ? tManagerUi('expiring_soon') : tManagerUi('occupied')}
                </span>
                <span className="ss-occupied-header__seat font-bold">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
              </div>
              <div className="ss-occupied-avatar-wrap flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-3">
                  <User size={32} className="text-secondary" />
                </div>
                <h3 className="text-primary font-semibold text-lg">{selectedSeat.student}</h3>
                <p className="text-secondary text-sm">{selectedSeat.smartId}</p>
              </div>
            </div>
            <div className="ss-detail-grid grid grid-cols-2 gap-4">
              <div className="ss-detail-cell bg-floating p-3 rounded-lg">
                <p className="text-secondary text-xs uppercase mb-1">{tManagerUi('shift_469d5b')}</p>
                <span className={SHIFT_BADGE[selectedSeat.shift ?? ''] ?? 'mgr-badge bg-floating'}>
                  {shiftLabel}
                </span>
              </div>
              <div className="ss-detail-cell bg-floating p-3 rounded-lg">
                <p className="text-secondary text-xs uppercase mb-1">{tManagerUi('expires')}</p>
                <p className={`font-semibold ${selectedSeat.status === 'expiring' ? 'text-danger' : 'text-primary'}`}>
                  {selectedSeat.expiry}
                </p>
              </div>
            </div>
            <div className="ss-modal-footer flex gap-3 mt-6">
              <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>{tManagerUi('close')}</button>
              <button type="button" className="mgr-btn-primary flex-1" disabled={!selectedSeat.smartId} title={!selectedSeat.smartId ? tManagerUi('student_profile_cannot_be_opened_until_this_seat_respons_e570ab') : undefined} onClick={() => { if (selectedSeat.smartId) router.push(MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(selectedSeat.smartId)); }}>{tManagerUi('view_full_profile')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
