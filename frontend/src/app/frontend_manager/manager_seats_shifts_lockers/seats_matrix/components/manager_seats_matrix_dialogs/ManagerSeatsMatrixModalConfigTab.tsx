'use client';
import { useState } from 'react';
import { Zap } from 'lucide-react';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

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

      <div className="flex items-center gap-3 p-3 rounded-xl bg-floating border border-border">
        <input
          id="seat-config-socket"
          type="checkbox"
          checked={hasSocket}
          onChange={(e) => setHasSocket(e.target.checked)}
          className="rounded border-border text-primary focus:ring-primary h-4 w-4"
        />
        <label htmlFor="seat-config-socket" className="text-sm font-medium text-primary flex items-center gap-2 cursor-pointer">
          <Zap size={16} className="text-warning" />
          Dedicated Electrical Power Socket Available
        </label>
      </div>

      <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1.5">
        <p className="font-semibold text-primary">Physical Desk Specifications</p>
        <p className="text-secondary">
          • Seat Numbering: <span className="font-mono font-bold text-primary">{selectedSeat.id}</span>
        </p>
        <p className="text-secondary">• Desk Type: Standard Study Carrel with Partition</p>
        <p className="text-secondary">
          • Status: <span className="capitalize font-semibold text-primary">{selectedSeat.status}</span>
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" className="mgr-btn-ghost flex-1" onClick={onBack}>
          Back
        </button>
        <button type="submit" className="mgr-btn-primary flex-1">
          Save Configuration
        </button>
      </div>
    </form>
  );
}

