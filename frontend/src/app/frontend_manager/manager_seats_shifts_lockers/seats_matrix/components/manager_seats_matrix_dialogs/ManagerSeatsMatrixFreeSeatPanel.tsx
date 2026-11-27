'use client';

import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { CheckCircle, UserPlus, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import { REGISTERED_STUDENT_CANDIDATES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import type { SeatData, ShiftType } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

export interface ManagerSeatsMatrixFreeSeatPanelProps {
  selectedSeat: SeatData;
  isAssigning: boolean;
  setIsAssigning: (val: boolean) => void;
  studentName: string;
  setStudentName: (val: string) => void;
  studentShift: ShiftType;
  setStudentShift: (val: ShiftType) => void;
  handleQuickAssign: (e: React.FormEvent) => void;
  handleToggleMaintenance: () => void;
  onClose: () => void;
  router: { push: (url: string) => void };
}

/** Vacant seat status banner, quick allocation workflow, and maintenance toggle actions. */
export function ManagerSeatsMatrixFreeSeatPanel({
  selectedSeat,
  isAssigning,
  setIsAssigning,
  studentName,
  setStudentName,
  studentShift,
  setStudentShift,
  handleQuickAssign,
  handleToggleMaintenance,
  onClose,
  router,
}: ManagerSeatsMatrixFreeSeatPanelProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const [allocationMode, setAllocationMode] = useState<'registered' | 'custom'>('registered');

  const studentOptions: ComboboxOption[] = useMemo(
    () =>
      REGISTERED_STUDENT_CANDIDATES.map((student) => ({
        value: student.name,
        label: student.name,
        subLabel: `${student.smartId} · ${student.exam}`,
        badge: `${student.preferredShift} Shift`,
      })),
    []
  );

  const selectedCandidate = useMemo(
    () => REGISTERED_STUDENT_CANDIDATES.find((s) => s.name === studentName),
    [studentName]
  );

  const handleSelectCandidate = (val: string) => {
    setStudentName(val);
    const found = REGISTERED_STUDENT_CANDIDATES.find((s) => s.name === val);
    if (found) {
      setStudentShift(found.preferredShift);
    }
  };

  return (
    <div className="space-y-4">
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
                className={`px-2 py-0.5 rounded font-semibold motion-safe:transition-colors cursor-pointer ${
                  allocationMode === 'registered' ? 'bg-primary-subtle text-primary font-bold' : 'text-secondary hover:text-primary'
                }`}
              >
                Student List
              </button>
              <button
                type="button"
                onClick={() => setAllocationMode('custom')}
                className={`px-2 py-0.5 rounded font-semibold motion-safe:transition-colors cursor-pointer ${
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
                maxLength={30}
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
              className="mgr-btn-ghost flex-1 h-9 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
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
              className="mgr-btn-primary flex-1 h-9 text-xs font-bold rounded-xl motion-safe:transition-colors cursor-pointer disabled:opacity-40"
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
              className="mgr-btn-primary flex-1 h-9 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-xl motion-safe:transition-colors cursor-pointer"
              onClick={() => setIsAssigning(true)}
            >
              <UserPlus size={15} /> Quick Allocate
            </button>
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
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-border bg-surface text-secondary hover:text-primary hover:border-primary motion-safe:transition-colors cursor-pointer"
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
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-xl border border-warning bg-warning-bg text-warning hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
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
