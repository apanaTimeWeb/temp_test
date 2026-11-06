'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { User, Armchair, Sparkles } from 'lucide-react';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';

interface ManagerSeatsMatrixGridViewProps {
  visibleGridSeats: SeatData[];
  isPending: boolean;
  freeCount: number;
  onSelectSeat: (seat: SeatData) => void;
  shiftLabel: (val?: string) => string;
  searchQuery?: string;
}

interface ShiftOccupancy {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
}

function computeShiftOccupancy(seat: SeatData): ShiftOccupancy {
  if (seat.status === 'free' || seat.status === 'maintenance') {
    return { morning: false, afternoon: false, evening: false, night: false };
  }

  const shiftStr = (seat.shift || '').toLowerCase();
  if (shiftStr.includes('full') || seat.status === 'occupied' && !seat.shift) {
    return { morning: true, afternoon: true, evening: true, night: true };
  }

  const m = shiftStr.includes('morning');
  const a = shiftStr.includes('afternoon');
  const e = shiftStr.includes('evening');
  const n = shiftStr.includes('night');

  return {
    morning: m || (!a && !e && !n),
    afternoon: a,
    evening: e,
    night: n,
  };
}

export function ManagerSeatsMatrixGridView({
  visibleGridSeats,
  isPending,
  freeCount,
  onSelectSeat,
  shiftLabel,
  searchQuery = '',
}: ManagerSeatsMatrixGridViewProps) {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');
  const query = searchQuery.trim().toLowerCase();

  const matchingSeats = query
    ? visibleGridSeats.filter(
        (s) =>
          s.id.toLowerCase().includes(query) ||
          (s.student && s.student.toLowerCase().includes(query)) ||
          (s.smartId && s.smartId.toLowerCase().includes(query))
      )
    : [];

  return (
    <>
      {/* ── Top Legend & Shift LED Explainer ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-card border border-border rounded-xl">
        <div className="flex flex-wrap items-center gap-5 text-xs text-secondary">
          {LEGEND_ITEMS.map(({ cls, labelKey }) => (
            <div key={labelKey} className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  cls === 'ss-legend-dot--success'
                    ? 'bg-success'
                    : cls === 'ss-legend-dot--danger'
                    ? 'bg-danger'
                    : cls === 'ss-legend-dot--warning'
                    ? 'bg-warning'
                    : 'bg-surface-highlight'
                }`}
              />
              <span>{tManagerUi(labelKey)}</span>
            </div>
          ))}
        </div>

        {/* 4-Shift Glowing LED Guide */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs">
          <Sparkles size={14} className="text-primary shrink-0" />
          <span className="font-semibold text-primary">Shift LEDs:</span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500">M/A/E/N = Vacant</span>
            <span className="px-1 py-0.5 rounded bg-danger text-white">M/A/E/N = Booked</span>
          </div>
        </div>
      </div>

      {/* Matching Search Alert Banner */}
      {query && (
        <div className="mb-4 p-3 rounded-xl bg-primary-subtle border border-primary text-xs text-primary flex items-center justify-between">
          <span className="font-medium">
            Search active: Matched <strong className="font-bold">{matchingSeats.length}</strong> seat(s) for &quot;{searchQuery}&quot;
          </span>
          {matchingSeats.length > 0 && (
            <span className="text-[11px] text-secondary">
              Highlighting: {matchingSeats.map((s) => `S-${s.id}`).join(', ')}
            </span>
          )}
        </div>
      )}

      {/* Grid Container */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Armchair size={22} className="text-primary" /> {tManagerUi('a_wing_floor_plan')}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Ground Floor — AC Silent Reading Hall (Interactive Multi-Shift Grid)
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success-bg text-success border border-border">
            {isPending ? '…' : freeCount} {tManagerUi('seats_free_41c53c')}
          </span>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-24 text-secondary text-sm">
            {tManagerUi('loading_seat_matrix')}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {visibleGridSeats.map((seat) => {
              const shiftDots = computeShiftOccupancy(seat);
              const isMatch =
                query &&
                (seat.id.toLowerCase().includes(query) ||
                  (seat.student && seat.student.toLowerCase().includes(query)) ||
                  (seat.smartId && seat.smartId.toLowerCase().includes(query)));
              const isDimmed = Boolean(query && !isMatch);

              return (
                <button
                  type="button"
                  key={seat.uuid || seat.id}
                  disabled={seat.status === 'unknown'}
                  onClick={() => onSelectSeat(seat)}
                  className={`h-20 rounded-xl p-2 flex flex-col items-center justify-between text-xs font-semibold motion-safe:transition-all cursor-pointer relative group ${
                    isMatch
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-card shadow-xl scale-105 z-10'
                      : isDimmed
                      ? 'opacity-30'
                      : 'hover:scale-105 active:scale-95'
                  } ${
                    seat.status === 'free'
                      ? 'bg-floating border border-success text-success hover:bg-success hover:text-white'
                      : seat.status === 'occupied'
                      ? 'bg-floating border border-danger text-primary'
                      : seat.status === 'expiring'
                      ? 'bg-floating border border-warning text-warning'
                      : 'bg-floating border border-border text-secondary opacity-50 cursor-not-allowed'
                  }`}
                  title={
                    seat.student
                      ? `${seat.student} (${seat.smartId || 'ID'}) · ${shiftLabel(seat.shift)} · Expires: ${seat.expiry || 'Active'}`
                      : seat.status === 'maintenance'
                      ? 'Under Maintenance'
                      : 'Seat Available for Booking'
                  }
                >
                  {/* Seat Identifier */}
                  <span className="font-mono text-xs font-bold tracking-wider">
                    S-{seat.id}
                  </span>

                  {/* Student Name Preview if Occupied */}
                  {seat.student ? (
                    <span className="text-[10px] text-secondary truncate max-w-full font-normal leading-none px-1">
                      {seat.student.split(' ')[0]}
                    </span>
                  ) : (
                    <span className="text-[10px] text-success font-medium">Free</span>
                  )}

                  {/* 4 Shift Glowing LED Indicators (M, A, E, N) */}
                  <div className="flex items-center justify-center gap-1 w-full pt-1 border-t border-border">
                    <span
                      title={`Morning Shift: ${shiftDots.morning ? 'Booked' : 'Vacant'}`}
                      className={`text-[9px] font-mono font-bold px-1 rounded transition-colors ${
                        shiftDots.morning
                          ? 'bg-danger text-white shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                      }`}
                    >
                      M
                    </span>
                    <span
                      title={`Afternoon Shift: ${shiftDots.afternoon ? 'Booked' : 'Vacant'}`}
                      className={`text-[9px] font-mono font-bold px-1 rounded transition-colors ${
                        shiftDots.afternoon
                          ? 'bg-danger text-white shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                      }`}
                    >
                      A
                    </span>
                    <span
                      title={`Evening Shift: ${shiftDots.evening ? 'Booked' : 'Vacant'}`}
                      className={`text-[9px] font-mono font-bold px-1 rounded transition-colors ${
                        shiftDots.evening
                          ? 'bg-danger text-white shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                      }`}
                    >
                      E
                    </span>
                    <span
                      title={`Night Shift: ${shiftDots.night ? 'Booked' : 'Vacant'}`}
                      className={`text-[9px] font-mono font-bold px-1 rounded transition-colors ${
                        shiftDots.night
                          ? 'bg-danger text-white shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                      }`}
                    >
                      N
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
