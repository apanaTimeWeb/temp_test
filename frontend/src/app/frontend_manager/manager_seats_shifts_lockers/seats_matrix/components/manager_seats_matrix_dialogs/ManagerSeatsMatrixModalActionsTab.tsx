'use client';

import React, { useState, useMemo } from 'react';
import { User, UserPlus, Wrench, CheckCircle, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import type { SeatData, ShiftType } from '../../types/ManagerSeatsMatrixTypes';
import { SHIFT_BADGE, REGISTERED_STUDENT_CANDIDATES } from '../../constants/ManagerSeatsMatrixConstants';
import { MANAGER_SEATS_MATRIX_ROUTES } from '../../config/manager_seats_matrix.url_config';
import { ManagerSeatsMatrixStudentProfileModal } from './ManagerSeatsMatrixStudentProfileModal';

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
}: ManagerSeatsMatrixModalActionsTabProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [allocationMode, setAllocationMode] = useState<'registered' | 'custom'>('registered');

  const studentOptions: ComboboxOption[] = useMemo(() => {
    return REGISTERED_STUDENT_CANDIDATES.map((student) => ({
      value: student.name,
      label: student.name,
      subLabel: `${student.smartId} · ${student.exam}`,
      badge: `${student.preferredShift} Shift`,
    }));
  }, []);

  const selectedCandidate = useMemo(() => {
    return REGISTERED_STUDENT_CANDIDATES.find((s) => s.name === studentName);
  }, [studentName]);

  const handleSelectCandidate = (val: string) => {
    setStudentName(val);
    const found = REGISTERED_STUDENT_CANDIDATES.find((s) => s.name === val);
    if (found) {
      setStudentShift(found.preferredShift);
    }
  };

  if (selectedSeat.status === 'free') {
    return (
      <div className="space-y-4">
        {/* Vacant Info Card */}
        <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-bg text-success flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-primary">Seat Available for Allocation</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                {tManagerUi('free')}
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              {tManagerUi('this_seat_is_available_for_assignment')}
            </p>
          </div>
        </div>

        {isAssigning ? (
          <form onSubmit={handleQuickAssign} className="p-4 rounded-xl bg-surface border border-border space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Quick Allocate Student</h4>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-card border border-border text-[11px]">
                <button
                  type="button"
                  onClick={() => setAllocationMode('registered')}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                    allocationMode === 'registered' ? 'bg-primary-subtle text-primary font-bold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  Student List
                </button>
                <button
                  type="button"
                  onClick={() => setAllocationMode('custom')}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                    allocationMode === 'custom' ? 'bg-primary-subtle text-primary font-bold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  + New Walk-in
                </button>
              </div>
            </div>

            {allocationMode === 'registered' ? (
              <div>
                <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                  Select Registered Student (Searchable)
                </label>
                <SearchableCombobox
                  options={studentOptions}
                  value={studentName}
                  onChange={handleSelectCandidate}
                  placeholder="Select student from directory..."
                  searchPlaceholder="Type student name, smart ID, or exam..."
                  countLabel="students"
                />

                {selectedCandidate && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary font-bold flex items-center justify-center text-xs">
                        {selectedCandidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{selectedCandidate.name}</p>
                        <p className="text-[11px] text-secondary font-mono">{selectedCandidate.smartId} · {selectedCandidate.exam}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {selectedCandidate.gender}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="quick-student-name" className="text-xs font-semibold text-secondary uppercase block mb-1">
                  New / Walk-in Student Full Name
                </label>
                <input
                  id="quick-student-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter full name (e.g. Vikram Malhotra)"
                  className="mgr-input text-xs w-full h-10 rounded-xl border border-border bg-card px-3 text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            )}

            <div>
              <label htmlFor="quick-student-shift" className="text-xs font-semibold text-secondary uppercase block mb-1">
                Preferred Shift Slot
              </label>
              <select
                id="quick-student-shift"
                value={studentShift}
                onChange={(e) => setStudentShift(e.target.value as ShiftType)}
                className="mgr-select text-xs w-full h-9 rounded-xl border border-border bg-card px-3 text-primary cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Morning">Morning (06:00 AM – 12:00 PM)</option>
                <option value="Afternoon">Afternoon (12:00 PM – 04:00 PM)</option>
                <option value="Evening">Evening (04:00 PM – 08:00 PM)</option>
                <option value="Night">Night (08:00 PM – 06:00 AM)</option>
                <option value="Full Day">Full Day (24 Hours All Access)</option>
              </select>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                className="mgr-btn-ghost flex-1 h-9 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                onClick={() => {
                  setIsAssigning(false);
                  setStudentName('');
                }}
              >
                {tManagerUi('close')}
              </button>
              <button
                type="submit"
                disabled={!studentName.trim()}
                className="mgr-btn-primary flex-1 h-9 text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-40"
              >
                Confirm Allocation
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2.5">
              <button
                type="button"
                className="mgr-btn-primary flex-1 h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl transition-colors cursor-pointer"
                onClick={() => setIsAssigning(true)}
              >
                <UserPlus size={15} /> Quick Allocate
              </button>
              <button
                type="button"
                className="mgr-btn-ghost text-xs font-semibold px-4 h-9 rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                onClick={onClose}
              >
                {tManagerUi('close')}
              </button>
            </div>
            <div className="flex gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-border bg-surface text-secondary hover:text-primary hover:border-primary transition-colors cursor-pointer"
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
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-warning/30 bg-warning-bg text-warning hover:bg-warning/20 transition-colors cursor-pointer"
                onClick={handleToggleMaintenance}
              >
                <Wrench size={13} /> Mark Maintenance
              </button>
            </div>
          </div>
        )}
      </div>
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
          className="mgr-btn-ghost w-full h-9 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
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
        {/* Maintenance Info Card */}
        <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-bg text-warning flex items-center justify-center shrink-0">
            <Wrench size={20} className="text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-primary">Seat Under Maintenance</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/15 text-secondary border border-border shrink-0">
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
            className="mgr-btn-primary flex-1 h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl transition-colors cursor-pointer"
            onClick={handleToggleMaintenance}
          >
            <CheckCircle size={15} /> Mark Available
          </button>
          <button
            type="button"
            className="mgr-btn-ghost text-xs font-semibold px-4 h-9 rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
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
      {/* Student Profile Card */}
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

        {/* 2-column Detail Specs */}
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

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <div className="flex gap-2.5">
          <button
            type="button"
            className="mgr-btn-primary flex-1 h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
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
          <button
            type="button"
            className="mgr-btn-ghost text-xs font-semibold px-4 h-9 rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
            onClick={onClose}
          >
            {tManagerUi('close')}
          </button>
        </div>

        {/* Danger & Maintenance Controls */}
        <div className="flex gap-2.5 pt-2 border-t border-border">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-danger/30 bg-danger-bg text-danger hover:bg-danger/20 transition-colors cursor-pointer"
            onClick={handleVacateSeat}
          >
            <LogOut size={13} />
            <span>Vacate Seat</span>
          </button>
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-warning/30 bg-warning-bg text-warning hover:bg-warning/20 transition-colors cursor-pointer"
            onClick={handleToggleMaintenance}
          >
            <Wrench size={13} />
            <span>Mark Maintenance</span>
          </button>
        </div>
      </div>

      {/* Fallback Student Profile Popup Modal if not hoisted */}
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
