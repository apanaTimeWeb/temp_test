'use client';

import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Settings, History, Layers } from 'lucide-react';

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
    Evening: tManagerUi('evening'),
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
    <div className="ss-modal-overlay flex items-center justify-center fixed inset-0 z-50 bg-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="ss-modal bg-card p-6 rounded-xl shadow-xl w-full max-w-lg border border-border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ss-seat-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ss-seat-modal-title" className="sr-only">
          {tManagerUi('seat_b90b32')} {selectedSeat.id}
        </h2>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveModalTab('actions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeModalTab === 'actions'
                  ? 'bg-primary text-on-primary'
                  : 'text-secondary hover:bg-floating hover:text-primary'
              }`}
            >
              <Layers size={14} /> Actions
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeModalTab === 'config'
                  ? 'bg-primary text-on-primary'
                  : 'text-secondary hover:bg-floating hover:text-primary'
              }`}
            >
              <Settings size={14} /> Configure
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeModalTab === 'history'
                  ? 'bg-primary text-on-primary'
                  : 'text-secondary hover:bg-floating hover:text-primary'
              }`}
            >
              <History size={14} /> History
            </button>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-floating text-secondary border border-border">
            {selectedSeat.id}
          </span>
        </div>

        {feedback && (
          <div
            className="mb-4 p-3 bg-success-bg border border-success text-success text-sm rounded-lg flex items-center gap-2"
            role="status"
          >
            <CheckCircle size={16} />
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
  );
}
