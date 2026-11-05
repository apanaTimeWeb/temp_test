'use client';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

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
    setTimeout(() => {
      setAddFeedback(null);
      onClose();
      setNewSeatLabel('');
    }, 1000);
  };

  return (
    <div className="ss-modal-overlay flex items-center justify-center fixed inset-0 z-50 bg-overlay" onClick={onClose}>
      <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-primary mb-4">Add New Library Desk / Seat</h3>
        {addFeedback && (
          <div className="mb-4 p-3 bg-success-bg border border-border text-success text-sm rounded-lg flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{addFeedback}</span>
          </div>
        )}
        <form onSubmit={handleCreateSeat} className="space-y-4">
          <div>
            <label htmlFor="new-seat-id" className="text-xs font-semibold text-secondary uppercase block mb-1">
              Seat Number / Code
            </label>
            <input
              id="new-seat-id"
              type="text"
              required
              placeholder="e.g. A-21, B-05"
              value={newSeatLabel}
              onChange={(e) => setNewSeatLabel(e.target.value)}
              className="mgr-input w-full"
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
              className="mgr-select w-full"
            >
              <option value="Ground Floor — AC Silent Reading Hall">Ground Floor — AC Silent Reading Hall</option>
              <option value="Ground Floor — Discussion & Group Area">Ground Floor — Discussion & Group Area</option>
              <option value="1st Floor — Main Study Hall">1st Floor — Main Study Hall</option>
              <option value="1st Floor — AC Cubicles & Premium Seats">1st Floor — AC Cubicles & Premium Seats</option>
              <option value="2nd Floor — Silent Zone (Non-AC)">2nd Floor — Silent Zone (Non-AC)</option>
              <option value="2nd Floor — Group Study & Discussion Room">2nd Floor — Group Study & Discussion Room</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="mgr-btn-ghost flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="mgr-btn-primary flex-1">
              Create Seat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

