'use client';

import React from 'react';
import { User, UserPlus, Wrench, CheckCircle, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SeatData, ShiftType } from '../../types/ManagerSeatsMatrixTypes';
import { SHIFT_BADGE } from '../../constants/ManagerSeatsMatrixConstants';
import { MANAGER_SEATS_MATRIX_ROUTES } from '../../config/manager_seats_matrix.url_config';

interface ManagerSeatsMatrixModalActionsTabProps {
  selectedSeat: SeatData;
  isAssigning: boolean;
  setIsAssigning: (val: boolean) => void;
  studentName: string;
  setStudentName: (val: string) => void;
  studentShift: ShiftType;
  setStudentShift: (val: ShiftType) => void;
  handleQuickAssign: (e: React.FormEvent) => void;
  handleToggleMaintenance: () => void;
  handleVacateSeat: () => void;
  onClose: () => void;
  router: { push: (url: string) => void };
  shiftLabel: string;
}

export function ManagerSeatsMatrixModalActionsTab({
  selectedSeat,
  isAssigning,
  setIsAssigning,
  studentName,
  setStudentName,
  studentShift,
  setStudentShift,
  handleQuickAssign,
  handleToggleMaintenance,
  handleVacateSeat,
  onClose,
  router,
  shiftLabel,
}: ManagerSeatsMatrixModalActionsTabProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');

  if (selectedSeat.status === 'free') {
    return (
      <>
        <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
          <span className="ss-badge ss-badge--success">{tManagerUi('free')}</span>
          <span className="ss-occupied-header__seat text-lg font-bold">
            {tManagerUi('seat_b90b32')} {selectedSeat.id}
          </span>
        </div>

        {isAssigning ? (
          <form onSubmit={handleQuickAssign} className="space-y-4 mb-4">
            <div>
              <label htmlFor="quick-student-name" className="text-xs font-semibold text-secondary uppercase block mb-1">
                Student Name
              </label>
              <input
                id="quick-student-name"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name"
                className="mgr-input w-full"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="quick-student-shift" className="text-xs font-semibold text-secondary uppercase block mb-1">
                Shift
              </label>
              <select
                id="quick-student-shift"
                value={studentShift}
                onChange={(e) => setStudentShift(e.target.value as ShiftType)}
                className="mgr-select w-full"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" className="mgr-btn-ghost flex-1" onClick={() => setIsAssigning(false)}>
                {tManagerUi('close')}
              </button>
              <button type="submit" className="mgr-btn-primary flex-1">
                Confirm Allocation
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="ss-text-secondary ss-text-caption mb-6">
              {tManagerUi('this_seat_is_available_for_assignment')}
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>
                  {tManagerUi('close')}
                </button>
                <button
                  type="button"
                  className="mgr-btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={() => setIsAssigning(true)}
                >
                  <UserPlus size={15} /> Quick Allocate
                </button>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  className="mgr-btn-ghost flex-1 text-xs text-secondary flex items-center justify-center gap-1.5"
                  onClick={() =>
                    router.push(
                      `${MANAGER_SEATS_MATRIX_ROUTES.ASSIGN_STUDENT}?seat=${encodeURIComponent(selectedSeat.id)}`
                    )
                  }
                >
                  <UserPlus size={13} /> {tManagerUi('assign_student')} (Form)
                </button>
                <button
                  type="button"
                  className="mgr-btn-ghost flex-1 text-xs text-warning flex items-center justify-center gap-1.5"
                  onClick={handleToggleMaintenance}
                >
                  <Wrench size={13} /> Mark Maintenance
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  if (selectedSeat.status === 'unknown') {
    return (
      <>
        <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
          <span className="mgr-badge bg-floating text-secondary">{tManagerUi('unknown_status')}</span>
          <span className="ss-occupied-header__seat text-lg font-bold">
            {tManagerUi('seat_b90b32')} {selectedSeat.id}
          </span>
        </div>
        <p className="ss-text-secondary ss-text-caption mb-6">{tManagerUi('unknown_status')}</p>
        <div className="ss-modal-footer flex">
          <button type="button" className="mgr-btn-ghost w-full" onClick={onClose}>
            {tManagerUi('close')}
          </button>
        </div>
      </>
    );
  }

  if (selectedSeat.status === 'maintenance') {
    return (
      <>
        <div className="ss-occupied-header__row mb-4 flex justify-between items-center">
          <span className="mgr-badge bg-floating text-secondary">{tManagerUi('maintenance')}</span>
          <span className="ss-occupied-header__seat text-lg font-bold">
            {tManagerUi('seat_b90b32')} {selectedSeat.id}
          </span>
        </div>
        <p className="ss-text-secondary ss-text-caption mb-6">
          {tManagerUi('this_seat_is_under_maintenance_and_unavailable')}
        </p>
        <div className="ss-modal-footer flex gap-3">
          <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>
            {tManagerUi('close')}
          </button>
          <button
            type="button"
            className="mgr-btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={handleToggleMaintenance}
          >
            <CheckCircle size={15} /> Mark Available
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ss-occupied-header -m-6 mb-6 p-6 bg-floating rounded-t-xl">
        <div className="ss-occupied-header__row flex justify-between items-center mb-4">
          <span
            className={`mgr-badge ${
              selectedSeat.status === 'expiring' ? 'mgr-badge--warning' : 'mgr-badge--danger'
            }`}
          >
            {selectedSeat.status === 'expiring' ? tManagerUi('expiring_soon') : tManagerUi('occupied')}
          </span>
          <span className="ss-occupied-header__seat font-bold">
            {tManagerUi('seat_b90b32')} {selectedSeat.id}
          </span>
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
      <div className="ss-modal-footer flex flex-col gap-3 mt-6">
        <div className="flex gap-3">
          <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>
            {tManagerUi('close')}
          </button>
          <button
            type="button"
            className="mgr-btn-primary flex-1"
            disabled={!selectedSeat.smartId}
            title={
              !selectedSeat.smartId
                ? tManagerUi('student_profile_cannot_be_opened_until_this_seat_respons_e570ab')
                : undefined
            }
            onClick={() => {
              if (selectedSeat.smartId) {
                router.push(MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(selectedSeat.smartId));
              }
            }}
          >
            {tManagerUi('view_full_profile')}
          </button>
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <button
            type="button"
            className="mgr-btn-ghost flex-1 text-xs text-danger flex items-center justify-center gap-1.5"
            onClick={handleVacateSeat}
          >
            <LogOut size={13} /> Vacate Seat
          </button>
          <button
            type="button"
            className="mgr-btn-ghost flex-1 text-xs text-warning flex items-center justify-center gap-1.5"
            onClick={handleToggleMaintenance}
          >
            <Wrench size={13} /> Maintenance
          </button>
        </div>
      </div>
    </>
  );
}
