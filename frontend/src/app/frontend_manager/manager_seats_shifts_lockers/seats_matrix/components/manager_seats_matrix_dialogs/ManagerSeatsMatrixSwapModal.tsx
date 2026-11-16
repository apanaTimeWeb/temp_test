'use client';
// RESPONSIBILITY: Modal dialog for directly swapping or exchanging seats between students without vacating or losing allocation data.
import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, CheckCircle2, User, Armchair, AlertCircle, X } from 'lucide-react';
import type { SeatData } from '../../types/ManagerSeatsMatrixTypes';

export interface ManagerSeatsMatrixSwapModalProps {
  isOpen: boolean;
  sourceSeat: SeatData | null;
  allSeats: SeatData[];
  onClose: () => void;
  onConfirmSwap: (sourceSeatId: string, targetSeatId: string, reason?: string) => void;
}

const SWAP_REASONS = [
  'Student Request (AC cooling preference)',
  'Student Request (Silent / Quiet zone)',
  'Student Request (Girls cabin preference)',
  'Friends studying together (Adjacent pairing)',
  'Power socket / Laptop desk requirement',
  'Disciplinary / Administrative relocation',
  'Other administrative adjustment',
];

export function ManagerSeatsMatrixSwapModal({
  isOpen,
  sourceSeat,
  allSeats = [],
  onClose,
  onConfirmSwap,
}: ManagerSeatsMatrixSwapModalProps) {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [swapReason, setSwapReason] = useState<string>(SWAP_REASONS[0]);
  const [targetSearch, setTargetSearch] = useState<string>('');
  const [targetFilter, setTargetFilter] = useState<'all' | 'free' | 'occupied'>('all');

  // Available destination seats excluding the source seat itself
  const candidateSeats = useMemo(() => {
    if (!sourceSeat) return [];
    return allSeats.filter((s) => s.id !== sourceSeat.id);
  }, [allSeats, sourceSeat]);

  const filteredCandidates = useMemo(() => {
    const q = targetSearch.trim().toLowerCase();
    return candidateSeats.filter((s) => {
      const matchFilter =
        targetFilter === 'all' ||
        (targetFilter === 'free' && s.status === 'free') ||
        (targetFilter === 'occupied' && (s.status === 'occupied' || s.status === 'expiring'));
      const matchQuery =
        !q ||
        s.id.toLowerCase().includes(q) ||
        (s.student && s.student.toLowerCase().includes(q)) ||
        (s.wing && s.wing.toLowerCase().includes(q));
      return matchFilter && matchQuery;
    });
  }, [candidateSeats, targetFilter, targetSearch]);

  const targetSeat = useMemo(() => {
    return allSeats.find((s) => s.id === selectedTargetId) || null;
  }, [allSeats, selectedTargetId]);

  if (!isOpen || !sourceSeat) return null;

  const isTargetFree = targetSeat?.status === 'free';
  const isTargetOccupied = Boolean(targetSeat?.student);

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    onConfirmSwap(sourceSeat.id, selectedTargetId, swapReason);
    setSelectedTargetId('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-3 sm:p-4 overflow-y-auto backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-seat-swap-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <h2 id="manager-seat-swap-modal-title" className="text-base font-bold text-primary">
                Seat Swap & Exchange Tool
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Directly relocate or exchange student seat allocations in one atomic click
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2-Side Visual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
          {/* Source Seat Card */}
          <div className="p-3.5 rounded-xl border border-primary/30 bg-primary-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Source Seat (Current)
              </span>
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-card text-primary border border-primary/20">
                Seat {sourceSeat.id}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-primary flex items-center gap-1.5 truncate">
                <User size={13} className="text-primary shrink-0" />
                <span>{sourceSeat.student || '— No Student Allocated —'}</span>
              </p>
              <p className="text-secondary text-[11px]">
                Shift: <strong className="text-primary">{sourceSeat.shift || 'Full Day'}</strong> · Smart ID: <span className="font-mono">{sourceSeat.smartId || 'N/A'}</span>
              </p>
              <p className="text-secondary text-[11px]">
                Zone: <span className="text-primary font-medium">{sourceSeat.wing || 'Reading Hall'}</span>
              </p>
            </div>
          </div>

          {/* Destination Seat Card */}
          <div className="p-3.5 rounded-xl border border-border bg-surface space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                Destination Seat (Target)
              </span>
              {targetSeat ? (
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-card text-primary border border-border">
                  Seat {targetSeat.id}
                </span>
              ) : (
                <span className="text-[10px] text-amber-500 font-semibold">Select Target Below</span>
              )}
            </div>

            {targetSeat ? (
              <div className="space-y-1 text-xs">
                <p className="font-bold text-primary flex items-center gap-1.5 truncate">
                  <User size={13} className={isTargetOccupied ? 'text-rose-400 shrink-0' : 'text-emerald-400 shrink-0'} />
                  <span>{targetSeat.student || '🟢 Available / Free Seat'}</span>
                </p>
                <p className="text-secondary text-[11px]">
                  Status:{' '}
                  <span className={isTargetFree ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {isTargetFree ? 'Free for Move' : `Occupied by ${targetSeat.student}`}
                  </span>
                </p>
                <p className="text-secondary text-[11px]">
                  Zone: <span className="text-primary font-medium">{targetSeat.wing || 'Reading Hall'}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-secondary italic py-2">
                Choose a seat from the selector below to swap or move.
              </p>
            )}
          </div>
        </div>

        {/* Action Type Banner */}
        {targetSeat && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
              isTargetFree
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
            }`}
          >
            <CheckCircle2 size={16} className="shrink-0" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px]">
                {isTargetFree ? 'Mode: Direct Relocation (To Free Seat)' : 'Mode: Bilateral Mutual Swap (Exchange)'}
              </span>
              <p className="text-[11px] opacity-90 mt-0.5">
                {isTargetFree
                  ? `${sourceSeat.student || 'Student'} will be moved to Seat ${targetSeat.id}. Seat ${sourceSeat.id} will become vacant.`
                  : `${sourceSeat.student} (Seat ${sourceSeat.id}) and ${targetSeat.student} (Seat ${targetSeat.id}) will swap seats instantly with all records preserved.`}
              </p>
            </div>
          </div>
        )}

        {/* Destination Seat Selector Form */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label htmlFor="target-seat-select" className="font-bold text-secondary uppercase tracking-wider text-[11px]">
              Select Destination Seat
            </label>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-border text-[10px]">
              <button
                type="button"
                onClick={() => setTargetFilter('all')}
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                  targetFilter === 'all' ? 'bg-primary text-primary-foreground font-bold' : 'text-secondary hover:text-primary'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTargetFilter('free')}
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                  targetFilter === 'free' ? 'bg-emerald-600 text-white font-bold' : 'text-secondary hover:text-primary'
                }`}
              >
                Free Only
              </button>
              <button
                type="button"
                onClick={() => setTargetFilter('occupied')}
                className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                  targetFilter === 'occupied' ? 'bg-rose-600 text-white font-bold' : 'text-secondary hover:text-primary'
                }`}
              >
                Occupied Only
              </button>
            </div>
          </div>

          <div className="relative">
            <select
              id="target-seat-select"
              data-testid="manager-swap-target-seat-select"
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-surface text-primary text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">-- Choose destination seat to swap with --</option>
              {filteredCandidates.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  Seat {seat.id} — {seat.status === 'free' ? '🟢 Available (Free)' : `🔴 Occupied (${seat.student || 'Unknown'})`} — {seat.wing || 'Reading Hall'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason for Swap */}
        <div className="space-y-1.5 text-xs">
          <label htmlFor="swap-reason-select" className="font-bold text-secondary uppercase tracking-wider text-[11px]">
            Reason for Swap / Relocation
          </label>
          <select
            id="swap-reason-select"
            value={swapReason}
            onChange={(e) => setSwapReason(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-border bg-surface text-primary text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {SWAP_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="manager-confirm-seat-swap-btn"
            disabled={!selectedTargetId}
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeftRight size={14} />
            <span>Confirm Seat Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ManagerSeatsMatrixSwapModal;
