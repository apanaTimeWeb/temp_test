'use client';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ManagerSeatsMatrixAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSeat: (seat: SeatData) => void;
}

export function ManagerSeatsMatrixAddModal({
  isOpen,
  onClose,
  onAddSeat,
}: ManagerSeatsMatrixAddModalProps) {
  const [newSeatLabel, setNewSeatLabel] = useState('');
  const [newSeatWing, setNewSeatWing] = useState('Ground Floor — AC Silent Reading Hall');
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const addTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (addTimerRef.current !== null) window.clearTimeout(addTimerRef.current);
  }, []);

  if (!isOpen) return null;

  const handleCreateSeat = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newSeatLabel.trim();
    if (!label) return;
    const newSeat: SeatData = {
      uuid: `seat-custom-${Date.now()}`,
      id: label.toUpperCase(),
      status: 'free',
      wing: newSeatWing,
      socketAvailable: true,
    };
    onAddSeat(newSeat);
    setAddFeedback(`Seat ${newSeat.id} created successfully!`);
    if (addTimerRef.current !== null) window.clearTimeout(addTimerRef.current);
    addTimerRef.current = window.setTimeout(() => {
      addTimerRef.current = null;
      setAddFeedback(null);
      onClose();
      setNewSeatLabel('');
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base sm:text-lg font-bold text-primary">Add New Library Desk / Seat</h3>
        {addFeedback && (
          <div className="p-3 bg-success-bg border border-success text-success text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle size={16} className="text-success shrink-0" />
            <span>{addFeedback}</span>
          </div>
        )}
        <form onSubmit={handleCreateSeat} className="space-y-4 text-xs">
          <div>
            <label htmlFor="new-seat-id" className="text-xs font-semibold text-secondary uppercase block mb-1">
              Seat Number / Code
            </label>
            <input maxLength={30}
              id="new-seat-id"
              type="text"
              required
              placeholder="e.g. A-21, B-05"
              value={newSeatLabel}
              onChange={(e) => setNewSeatLabel(e.target.value)}
              className="mgr-input text-xs w-full h-9 rounded-xl border border-border bg-surface px-3 text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="new-seat-wing" className="text-xs font-semibold text-secondary uppercase block mb-1">
              Floor / Reading Hall
            </label>
            <select
              id="new-seat-wing"
              value={newSeatWing}
              onChange={(e) => setNewSeatWing(e.target.value)}
              className="mgr-select text-xs w-full h-9 rounded-xl border border-border bg-surface px-3 text-primary cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Ground Floor — AC Silent Reading Hall">Ground Floor — AC Silent Reading Hall</option>
              <option value="Ground Floor — Discussion & Group Area">Ground Floor — Discussion & Group Area</option>
              <option value="1st Floor — Main Study Hall">1st Floor — Main Study Hall</option>
              <option value="1st Floor — AC Cubicles & Premium Seats">1st Floor — AC Cubicles & Premium Seats</option>
              <option value="2nd Floor — Silent Zone (Non-AC)">2nd Floor — Silent Zone (Non-AC)</option>
              <option value="2nd Floor — Group Study & Discussion Room">2nd Floor — Group Study & Discussion Room</option>
            </select>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              className="mgr-btn-ghost flex-1 h-9 text-xs font-semibold rounded-xl border border-danger bg-danger-bg text-danger hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mgr-btn-primary flex-1 h-9 text-xs font-bold rounded-xl motion-safe:transition-colors cursor-pointer"
            >
              Create Seat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

