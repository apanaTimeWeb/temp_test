'use client';

import { Armchair,CheckCircle,History,Layers,Settings,X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRef,useState } from 'react';

import { useManagerSeatMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/ManagerSeatsMatrixDialogFocus';
import type { ManagerSeatsMatrixModalProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixComponentTypes';
import type { ShiftType } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { REGISTERED_STUDENT_CANDIDATES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { ManagerSeatsMatrixModalActionsTab } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModalActionsTab';
import { ManagerSeatsMatrixModalConfigTab } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModalConfigTab';
import { ManagerSeatsMatrixModalHistoryTab } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModalHistoryTab';

export function ManagerSeatsMatrixModal({
  selectedSeat,
  onClose,
  onUpdateSeat,
  onOpenStudentProfile,
  onOpenSwapModal,
}: ManagerSeatsMatrixModalProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activeModalTab, setActiveModalTab] = useState<'actions' | 'config' | 'history'>('actions');
  const [isAssigning, setIsAssigning] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentShift, setStudentShift] = useState<ShiftType>('Morning');
  const [feedback, setFeedback] = useState<string | null>(null);

  useManagerSeatMatrixDialogFocus(dialogRef, onClose, Boolean(selectedSeat));

  if (!selectedSeat) return null;

  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('morning'),
    Afternoon: 'Afternoon',
    Evening: tManagerUi('evening'),
    Night: 'Night',
    'Full Day': tManagerUi('full_day'),
  };
  const shiftLabel = selectedSeat.shift ? (shiftLabels[selectedSeat.shift] ?? selectedSeat.shift) : '';

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    const candidate = REGISTERED_STUDENT_CANDIDATES.find((s) => s.name === studentName.trim());
    const studentSmartId = candidate ? candidate.smartId : `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentGender = candidate
      ? candidate.gender
      : /priya|neha|ritu|pooja|shweta|anita|kavita|sunita|sneha|aditi/i.test(studentName)
      ? 'Female'
      : 'Male';

    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        status: 'occupied',
        student: studentName.trim(),
        smartId: studentSmartId,
        studentGender,
        shift: studentShift,
        expiry: '2026-12-31',
      });
    }
    setFeedback(`Seat ${selectedSeat.id} successfully allocated to ${studentName.trim()}`);
    setTimeout(() => {
      setFeedback(null);
      setIsAssigning(false);
      onClose();
    }, 1200);
  };

  const handleVacateSeat = () => {
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        status: 'free',
        student: '',
        smartId: '',
        shift: undefined,
        expiry: undefined,
      });
    }
    setFeedback(`Seat ${selectedSeat.id} has been vacated`);
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleToggleMaintenance = () => {
    const nextStatus = selectedSeat.status === 'maintenance' ? 'free' : 'maintenance';
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, { status: nextStatus });
    }
    setFeedback(
      nextStatus === 'maintenance'
        ? `Seat ${selectedSeat.id} marked under maintenance`
        : `Seat ${selectedSeat.id} marked available`
    );
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleSaveConfiguration = (wing: string, hasSocket: boolean) => {
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        wing,
        socketAvailable: hasSocket,
      });
    }
    setFeedback(`Seat ${selectedSeat.id} configuration updated`);
    setTimeout(() => {
      setFeedback(null);
      setActiveModalTab('actions');
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ss-seat-modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <Armchair size={22} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ss-seat-modal-title" className="text-base sm:text-lg font-bold text-primary">
                  {tManagerUi('seat_b90b32')} {selectedSeat.id}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    selectedSeat.status === 'free'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : selectedSeat.status === 'occupied'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : selectedSeat.status === 'expiring'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-surface text-secondary border border-border'
                  }`}
                >
                  {selectedSeat.status}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5 truncate max-w-xs sm:max-w-sm">
                {selectedSeat.wing || 'Ground Floor — AC Silent Reading Hall'}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-secondary hover:text-primary hover:bg-floating rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-surface border border-border shrink-0">
          <button
            type="button"
            onClick={() => setActiveModalTab('actions')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeModalTab === 'actions'
                ? 'bg-card text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Layers size={14} /> Actions
          </button>
          <button
            type="button"
            onClick={() => setActiveModalTab('config')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeModalTab === 'config'
                ? 'bg-card text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <Settings size={14} /> Configure
          </button>
          <button
            type="button"
            onClick={() => setActiveModalTab('history')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeModalTab === 'history'
                ? 'bg-card text-primary font-bold shadow-sm'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <History size={14} /> History
          </button>
        </div>

        {/* Modal Body Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {feedback && (
            <div
              className="p-3 bg-success-bg border border-success text-success text-xs font-semibold rounded-xl flex items-center gap-2"
              role="status"
            >
              <CheckCircle size={16} className="text-success shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* TAB 1: ACTIONS TAB */}
          {activeModalTab === 'actions' && (
            <ManagerSeatsMatrixModalActionsTab
              selectedSeat={selectedSeat}
              isAssigning={isAssigning}
              setIsAssigning={setIsAssigning}
              studentName={studentName}
              setStudentName={setStudentName}
              studentShift={studentShift}
              setStudentShift={setStudentShift}
              handleQuickAssign={handleQuickAssign}
              handleToggleMaintenance={handleToggleMaintenance}
              handleVacateSeat={handleVacateSeat}
              onClose={onClose}
              router={router}
              shiftLabel={shiftLabel}
              onOpenStudentProfile={onOpenStudentProfile}
              onOpenSwapModal={onOpenSwapModal}
            />
          )}

          {/* TAB 2: EDIT CONFIGURATION TAB */}
          {activeModalTab === 'config' && (
            <ManagerSeatsMatrixModalConfigTab
              selectedSeat={selectedSeat}
              onSaveConfiguration={handleSaveConfiguration}
              onBack={() => setActiveModalTab('actions')}
            />
          )}

          {/* TAB 3: OCCUPANCY & MAINTENANCE HISTORY */}
          {activeModalTab === 'history' && (
            <ManagerSeatsMatrixModalHistoryTab
              selectedSeat={selectedSeat}
              onBack={() => setActiveModalTab('actions')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
