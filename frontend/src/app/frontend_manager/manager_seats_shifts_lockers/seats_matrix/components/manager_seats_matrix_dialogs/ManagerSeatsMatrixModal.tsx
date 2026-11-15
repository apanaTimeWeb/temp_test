'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Settings, History, Layers, Armchair, X } from 'lucide-react';

import { useManagerSeatMatrixDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/hooks/ManagerSeatsMatrixDialogFocus';
import type { ManagerSeatsMatrixModalProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixComponentTypes';
import type { ShiftType } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { ManagerSeatsMatrixModalActionsTab } from './ManagerSeatsMatrixModalActionsTab';
import { ManagerSeatsMatrixModalConfigTab } from './ManagerSeatsMatrixModalConfigTab';
import { ManagerSeatsMatrixModalHistoryTab } from './ManagerSeatsMatrixModalHistoryTab';

export function ManagerSeatsMatrixModal({ selectedSeat, onClose, onUpdateSeat }: ManagerSeatsMatrixModalProps) {
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
    const generatedId = `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    if (onUpdateSeat) {
      onUpdateSeat(selectedSeat.id, {
        status: 'occupied',
        student: studentName.trim(),
        smartId: generatedId,
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
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    selectedSeat.status === 'free'
                      ? 'bg-success-bg text-success border border-success/30'
                      : selectedSeat.status === 'occupied'
                      ? 'bg-danger-bg text-danger border border-danger/30'
                      : selectedSeat.status === 'expiring'
                      ? 'bg-warning-bg text-warning border border-warning/30'
                      : 'bg-floating text-secondary border border-border'
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
              className="p-3 bg-success-bg border border-success/30 text-success text-xs font-semibold rounded-xl flex items-center gap-2"
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
