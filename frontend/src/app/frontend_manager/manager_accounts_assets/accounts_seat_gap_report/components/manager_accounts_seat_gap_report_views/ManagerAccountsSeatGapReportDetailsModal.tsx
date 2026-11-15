'use client';

import { useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  IndianRupee,
  Layers,
  Wrench,
  CheckCircle2,
  Printer,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { GapRow } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';

interface ManagerAccountsSeatGapReportDetailsModalProps {
  isOpen: boolean;
  seat: GapRow | null;
  formatCurrency: (val: number) => string;
  onClose: () => void;
  onToggleStatus?: (seat: GapRow) => void;
}

export function ManagerAccountsSeatGapReportDetailsModal({
  isOpen,
  seat,
  formatCurrency,
  onClose,
  onToggleStatus,
}: ManagerAccountsSeatGapReportDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !seat) return null;

  const isCritical = seat.gapDays > 20;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="seat-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                isCritical
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-highlight border border-border text-secondary">
                  SEAT {seat.seatNo}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-highlight border border-border text-secondary uppercase font-semibold">
                  {seat.shift} Shift
                </span>
              </div>
              <h2 id="seat-details-title" className="text-base font-bold text-primary mt-1">
                Seat {seat.seatNo} — Floor {seat.floor}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Vacancy Status Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-highlight/70 border border-border">
          <span className="text-xs text-secondary font-medium">Occupancy Condition:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              seat.status === 'vacant'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {seat.status === 'vacant' ? (
              <>
                <Clock size={13} /> Vacant ({seat.gapDays} Days)
              </>
            ) : (
              <>
                <Wrench size={13} /> Maintenance / Blocked
              </>
            )}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Calendar size={12} className="text-primary" /> Last Occupied Date
            </span>
            <p className="font-semibold text-primary">{seat.lastOccupied}</p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Clock size={12} className="text-amber-500" /> Total Gap Duration
            </span>
            <p className={`font-semibold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
              {seat.gapDays} Consecutive Days Vacant
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <IndianRupee size={12} className="text-rose-400" /> Estimated Revenue Loss
            </span>
            <p className="font-semibold text-rose-400 text-sm">
              {formatCurrency(seat.revenueLoss)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/80 space-y-1">
            <span className="text-[11px] text-secondary flex items-center gap-1.5 font-medium">
              <Layers size={12} className="text-primary" /> Branch Location
            </span>
            <p className="font-semibold text-primary">Floor {seat.floor} · {seat.shift} Shift</p>
          </div>
        </div>

        {/* Recommendation Box */}
        <div className="p-3 rounded-xl bg-primary-subtle/40 border border-primary/20 space-y-1">
          <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <Sparkles size={13} /> Allocation Recommendation
          </span>
          <p className="text-[11px] text-secondary leading-relaxed">
            Prioritize this seat for upcoming member admissions or temporary trial passes to recover estimated daily revenue of ₹50.00/day.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
          >
            <Printer size={14} /> Print Seat Audit
          </button>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onToggleStatus(seat);
                }}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all ${
                  seat.status === 'vacant'
                    ? 'bg-amber-500 hover:bg-amber-600 !text-black'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {seat.status === 'vacant' ? (
                  <>
                    <Wrench size={14} /> Send to Maintenance
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} /> Mark as Vacant
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsSeatGapReportDetailsModal;
