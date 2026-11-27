'use client';

import { LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerSeatsMatrixGridLegend } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_views/ManagerSeatsMatrixGridLegend';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { Armchair } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  if ((seat.status !== 'occupied' && seat.status !== 'expiring') || !seat.student) {
    return { morning: false, afternoon: false, evening: false, night: false };
  }

  const shiftStr = (seat.shift || '').toLowerCase();
  if (shiftStr.includes('full') || !seat.shift) {
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
      <ManagerSeatsMatrixGridLegend />

      {query && (
        <div className="my-3 p-3 rounded-xl bg-primary-subtle border border-primary text-xs text-primary flex items-center justify-between">
          <span className="font-medium">
            Search active: Matched <strong className="font-bold">{matchingSeats.length}</strong> seat(s) for "{searchQuery}"
          </span>
          {matchingSeats.length > 0 && (
            <span className="text-[11px] text-secondary">
              Highlighting: {matchingSeats.map((s) => `S-${s.id}`).join(', ')}
            </span>
          )}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-3.5 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
              <Armchair size={22} className="text-primary shrink-0" /> {tManagerUi('a_wing_floor_plan')}
            </h2>
            <p className="text-xs text-secondary mt-0.5">
              Ground Floor — AC Silent Reading Hall (Interactive Multi-Shift Grid)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface text-primary border border-border">
              {visibleGridSeats.length} {visibleGridSeats.length === 1 ? 'seat' : 'seats'}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              {visibleGridSeats.filter((s) => s.status === 'free').length} Free
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30">
              {visibleGridSeats.filter((s) => s.status === 'occupied' || s.status === 'expiring').length} Booked
            </span>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-20" role="status">
            <LibraryLoader size="md" icon="grid-3x3" variant="contra" />
          </div>
        ) : visibleGridSeats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
            <Armchair size={36} className="text-secondary opacity-40" />
            <p className="text-sm font-semibold text-primary">No seats found matching active filters</p>
            <p className="text-xs text-secondary">
              Try adjusting your search query, shift, status, or gender filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5 sm:gap-3">
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
                  onClick={() => onSelectSeat(seat)}
                  className={`h-20 rounded-xl p-2 flex flex-col items-center justify-between text-xs font-semibold motion-safe:transition-all cursor-pointer relative group ${
                    isMatch
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-card shadow-xl scale-105 z-10'
                      : isDimmed
                        ? 'opacity-30'
                        : 'hover:scale-105 active:scale-95'
                  } ${
                    seat.status === 'free'
                      ? 'bg-surface border border-emerald-500/70 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : seat.status === 'occupied'
                        ? 'bg-surface border border-rose-500/70 text-rose-400 hover:bg-rose-500/15 hover:border-rose-400 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : seat.status === 'expiring'
                          ? 'bg-surface border border-amber-400 text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.2)] hover:bg-amber-500/15 hover:border-amber-300 hover:shadow-[0_0_14px_rgba(251,191,36,0.4)]'
                          : 'bg-floating border border-dashed border-border text-secondary opacity-60 hover:opacity-90'
                  }`}
                  title={
                    seat.student
                      ? `${seat.student} (${seat.smartId || 'ID'}) · ${shiftLabel(seat.shift)} · Expires: ${seat.expiry || 'Active'}`
                      : seat.status === 'maintenance'
                        ? 'Under Maintenance'
                        : 'Seat Available for Booking'
                  }
                >
                  <span className="font-mono text-xs font-bold tracking-wider text-primary">
                    S-{seat.id}
                  </span>

                  {seat.student ? (
                    <span
                      className={`text-[10px] truncate max-w-full leading-none px-1 ${
                        seat.status === 'expiring' ? 'text-amber-400 font-bold' : 'text-secondary font-medium'
                      }`}
                    >
                      {seat.student.split(' ')[0]}
                    </span>
                  ) : seat.status === 'maintenance' ? (
                    <span className="text-[10px] text-secondary italic">Maint.</span>
                  ) : seat.status === 'unknown' ? (
                    <span className="text-[10px] text-secondary italic">Unknown</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold">Free</span>
                  )}

                  <div className="flex items-center justify-center gap-1 w-full pt-1 border-t border-border">
                    {(['morning', 'afternoon', 'evening', 'night'] as const).map((shiftKey) => {
                      const letter = shiftKey[0].toUpperCase();
                      const isBooked = shiftDots[shiftKey];
                      const isMaint = seat.status === 'maintenance';
                      const shiftTitleName =
                        shiftKey === 'morning'
                          ? 'Morning (06:00-12:00)'
                          : shiftKey === 'afternoon'
                            ? 'Afternoon (12:00-16:00)'
                            : shiftKey === 'evening'
                              ? 'Evening (16:00-20:00)'
                              : 'Night (20:00-06:00)';

                      return (
                        <span
                          key={shiftKey}
                          title={
                            isMaint
                              ? `${shiftTitleName}: Seat Under Maintenance`
                              : isBooked
                                ? `${shiftTitleName}: Booked (Occupied)`
                                : `${shiftTitleName}: Vacant (Available to book)`
                          }
                          className={`text-[9px] font-mono font-bold w-4 h-4 rounded flex items-center justify-center motion-safe:transition-all ${
                            isMaint
                              ? 'bg-surface text-secondary border border-border opacity-50'
                              : isBooked
                                ? 'bg-rose-500 text-white shadow-[0_0_6px_rgba(244,63,94,0.7)]'
                                : 'bg-emerald-500 text-white shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                          }`}
                        >
                          {letter}
                        </span>
                      );
                    })}
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
