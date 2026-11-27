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
      <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Recent Seat Log & Audit</h3>
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
        <div className="p-3 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between font-semibold text-primary mb-1">
            <span>Current Allotment</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-success-bg text-success border border-success font-mono">
              Active
            </span>
          </div>
          <p className="text-secondary">Student: <strong className="text-primary">{selectedSeat.student || 'None (Seat Free)'}</strong></p>
          <p className="text-secondary mt-0.5">
            Shift: {selectedSeat.shift || 'None'} • Expiry: {selectedSeat.expiry || 'N/A'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between font-semibold text-primary mb-1">
            <span>Maintenance Check</span>
            <span className="text-secondary text-[11px] font-mono">2026-01-05</span>
          </div>
          <p className="text-secondary">Routine electrical safety inspection and chair armrest tightening completed.</p>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between font-semibold text-primary mb-1">
            <span>Previous Occupant (Priya Verma)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-warning-bg text-warning border border-warning font-mono">
              Expired
            </span>
          </div>
          <p className="text-secondary">Evening Shift (SM-3190) • Completed without incidents.</p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          className="mgr-btn-ghost w-full h-9 text-xs font-semibold rounded-xl border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
          onClick={onBack}
        >
          Back to Actions
        </button>
      </div>
    </div>
  );
}

