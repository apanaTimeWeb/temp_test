'use client';

import { ManagerSeatsMatrixFreeSeatPanel } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixFreeSeatPanel';
import { ManagerSeatsMatrixShiftRoster } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixShiftRoster';
import { ManagerSeatsMatrixStudentProfileModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixStudentProfileModal';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import type { SeatData, ShiftType } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { ArrowLeftRight, CheckCircle, LogOut, User, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

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
  onOpenStudentProfile?: (seat: SeatData) => void;
  onOpenSwapModal?: (seat: SeatData) => void;
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
  onOpenStudentProfile,
  onOpenSwapModal,
}: ManagerSeatsMatrixModalActionsTabProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  if (selectedSeat.status === 'free') {
    return (
      <ManagerSeatsMatrixFreeSeatPanel
        selectedSeat={selectedSeat}
        isAssigning={isAssigning}
        setIsAssigning={setIsAssigning}
        studentName={studentName}
        setStudentName={setStudentName}
        studentShift={studentShift}
        setStudentShift={setStudentShift}
        handleQuickAssign={handleQuickAssign}
        handleToggleMaintenance={handleToggleMaintenance}
        onClose={onClose}
        router={router}
      />
    );
  }

  if (selectedSeat.status === 'unknown') {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary">{tManagerUi('unknown_status')}</span>
          <span className="text-xs font-bold text-primary">{tManagerUi('seat_b90b32')} {selectedSeat.id}</span>
        </div>
        <button
          type="button"
          className="mgr-btn-ghost w-full h-9 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
          onClick={onClose}
        >
          {tManagerUi('close')}
        </button>
      </div>
    );
  }

  if (selectedSeat.status === 'maintenance') {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning flex items-center justify-center shrink-0">
            <Wrench size={20} className="text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-primary">Seat Under Maintenance</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface text-secondary border border-border shrink-0">
                {tManagerUi('maintenance')}
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              {tManagerUi('this_seat_is_under_maintenance_and_unavailable')}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            className="mgr-btn-primary flex-1 h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl motion-safe:transition-colors cursor-pointer"
            onClick={handleToggleMaintenance}
          >
            <CheckCircle size={15} /> Mark Available
          </button>
          <button
            type="button"
            className="mgr-btn-ghost text-xs font-semibold px-4 h-9 rounded-xl border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            onClick={onClose}
          >
            {tManagerUi('close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary border border-border flex items-center justify-center shrink-0 font-bold text-sm">
            {selectedSeat.student ? (
              selectedSeat.student
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
            ) : (
              <User size={22} className="text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-primary truncate">{selectedSeat.student}</h3>
            <p className="text-xs text-secondary font-mono flex items-center gap-1.5 mt-0.5">
              <span>Smart ID:</span>
              <strong className="text-primary">{selectedSeat.smartId || '—'}</strong>
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
              selectedSeat.status === 'expiring'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {selectedSeat.status === 'expiring' ? tManagerUi('expiring_soon') : tManagerUi('occupied')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border text-xs">
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[11px] text-secondary uppercase font-semibold block mb-0.5">
              {tManagerUi('shift_469d5b')}
            </span>
            <span className="font-semibold text-primary">{shiftLabel}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border border-border">
            <span className="text-[11px] text-secondary uppercase font-semibold block mb-0.5">
              {tManagerUi('expires')}
            </span>
            <span className={`font-semibold ${selectedSeat.status === 'expiring' ? 'text-danger font-bold' : 'text-primary'}`}>
              {selectedSeat.expiry || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <ManagerSeatsMatrixShiftRoster selectedSeat={selectedSeat} />

      <div className="space-y-2.5 pt-1">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="mgr-btn-primary flex-1 min-w-[130px] h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl motion-safe:transition-colors cursor-pointer disabled:opacity-50"
            disabled={!selectedSeat.student}
            onClick={() => {
              if (onOpenStudentProfile) {
                onOpenStudentProfile(selectedSeat);
              } else {
                setIsProfileModalOpen(true);
              }
            }}
          >
            <User size={14} />
            <span>{tManagerUi('view_full_profile')}</span>
          </button>
          {onOpenSwapModal && (
            <button
              type="button"
              data-testid="manager-seat-swap-action-btn"
              className="inline-flex items-center justify-center gap-1.5 px-3 h-9 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold motion-safe:transition-colors cursor-pointer"
              onClick={() => onOpenSwapModal(selectedSeat)}
              title="Directly swap or relocate this seat allocation"
            >
              <ArrowLeftRight size={13} />
              <span>Swap / Move</span>
            </button>
          )}
          <button
            type="button"
            className="mgr-btn-ghost text-xs font-semibold px-4 h-9 rounded-xl border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            onClick={onClose}
          >
            {tManagerUi('close')}
          </button>
        </div>

        <div className="flex gap-2.5 pt-2 border-t border-border">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-danger bg-danger-bg text-danger hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
            onClick={handleVacateSeat}
          >
            <LogOut size={13} />
            <span>Vacate Seat</span>
          </button>
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-warning bg-warning-bg text-warning hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
            onClick={handleToggleMaintenance}
          >
            <Wrench size={13} />
            <span>Mark Maintenance</span>
          </button>
        </div>
      </div>

      {!onOpenStudentProfile && (
        <ManagerSeatsMatrixStudentProfileModal
          isOpen={isProfileModalOpen}
          seat={selectedSeat}
          onClose={() => setIsProfileModalOpen(false)}
          onNavigateToDirectory={(smartId) => {
            setIsProfileModalOpen(false);
            router.push(MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId));
          }}
        />
      )}
    </div>
  );
}
