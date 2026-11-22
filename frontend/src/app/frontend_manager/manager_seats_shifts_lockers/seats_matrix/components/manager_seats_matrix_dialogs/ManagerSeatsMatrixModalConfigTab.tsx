'use client';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { Zap } from 'lucide-react';
import { useState } from 'react';

interface ManagerSeatsMatrixModalConfigTabProps {
  selectedSeat: SeatData;
  onSaveConfiguration: (wing: string, hasSocket: boolean) => void;
  onBack: () => void;
}

export function ManagerSeatsMatrixModalConfigTab({
  selectedSeat,
  onSaveConfiguration,
  onBack,
}: ManagerSeatsMatrixModalConfigTabProps) {
  const [configuredWing, setConfiguredWing] = useState(
    selectedSeat.wing ?? 'Ground Floor — AC Silent Reading Hall'
  );
  const [hasSocket, setHasSocket] = useState(selectedSeat.socketAvailable ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfiguration(configuredWing, hasSocket);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="seat-config-wing" className="text-xs font-semibold text-secondary uppercase block">
          Floor / Reading Hall
        </label>
        <select
          id="seat-config-wing"
          value={configuredWing}
          onChange={(e) => setConfiguredWing(e.target.value)}
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

      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border">
        <input
          id="seat-config-socket"
          type="checkbox"
          checked={hasSocket}
          onChange={(e) => setHasSocket(e.target.checked)}
          className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
        />
        <label htmlFor="seat-config-socket" className="text-xs font-medium text-primary flex items-center gap-2 cursor-pointer select-none">
          <Zap size={15} className="text-warning shrink-0" />
          <span>Dedicated Electrical Power Socket Available</span>
        </label>
      </div>

      <div className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-1.5">
        <p className="font-bold text-primary">Physical Desk Specifications</p>
        <p className="text-secondary">
          • Seat Numbering: <span className="font-mono font-bold text-primary">{selectedSeat.id}</span>
        </p>
        <p className="text-secondary">• Desk Type: Standard Study Carrel with Privacy Partition</p>
        <p className="text-secondary">
          • Current Status: <span className="capitalize font-semibold text-primary">{selectedSeat.status}</span>
        </p>
      </div>

      <div className="flex gap-2.5 pt-2">
        <button
          type="button"
          className="mgr-btn-ghost flex-1 h-9 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
          onClick={onBack}
        >
          Back to Actions
        </button>
        <button
          type="submit"
          className="mgr-btn-primary flex-1 h-9 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
}

