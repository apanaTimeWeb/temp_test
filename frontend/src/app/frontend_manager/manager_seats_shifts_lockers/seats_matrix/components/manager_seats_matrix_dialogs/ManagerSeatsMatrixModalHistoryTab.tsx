'use client';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

interface ManagerSeatsMatrixModalHistoryTabProps {
  selectedSeat: SeatData;
  onBack: () => void;
}

export function ManagerSeatsMatrixModalHistoryTab({
  selectedSeat,
  onBack,
}: ManagerSeatsMatrixModalHistoryTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-primary">Recent Seat Log & Audit</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
        <div className="p-3 rounded-lg bg-floating border border-border">
          <div className="flex items-center justify-between font-semibold text-primary mb-1">
            <span>Current Allotment</span>
            <span className="text-success font-mono">Active</span>
          </div>
          <p className="text-secondary">Student: {selectedSeat.student || 'None (Seat Free)'}</p>
          <p className="text-secondary">
            Shift: {selectedSeat.shift || 'None'} • Expiry: {selectedSeat.expiry || 'N/A'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between font-semibold text-primary mb-1">
            <span>Maintenance Check</span>
            <span className="text-secondary">2026-01-05</span>
          </div>
          <p className="text-secondary">Routine electrical safety inspection and chair armrest tightening completed.</p>
        </div>

        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between font-semibold text-primary mb-1">
            <span>Previous Occupant (Priya Verma)</span>
            <span className="text-secondary">Expired</span>
          </div>
          <p className="text-secondary">Evening Shift (SM-3190) • Completed without incidents.</p>
        </div>
      </div>

      <div className="pt-2">
        <button type="button" className="mgr-btn-ghost w-full" onClick={onBack}>
          Back to Actions
        </button>
      </div>
    </div>
  );
}

