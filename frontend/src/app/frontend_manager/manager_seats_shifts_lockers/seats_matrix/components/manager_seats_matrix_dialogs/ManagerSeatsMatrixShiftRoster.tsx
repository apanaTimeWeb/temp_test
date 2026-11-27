'use client';

import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { Layers } from 'lucide-react';

interface ShiftDefinition {
  key: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  label: string;
  dotClass: string;
}

const SHIFT_ROSTER_ITEMS: ShiftDefinition[] = [
  { key: 'Morning', label: 'Morning (06:00 AM – 02:00 PM)', dotClass: 'bg-amber-400' },
  { key: 'Afternoon', label: 'Afternoon (11:00 AM – 04:00 PM)', dotClass: 'bg-sky-400' },
  { key: 'Evening', label: 'Evening (02:00 PM – 10:00 PM)', dotClass: 'bg-indigo-400' },
  { key: 'Night', label: 'Night (10:00 PM – 06:00 AM)', dotClass: 'bg-purple-400' },
];

/** Renders the 4-shift availability breakdown for an occupied or expiring seat. */
export function ManagerSeatsMatrixShiftRoster({ selectedSeat }: { selectedSeat: SeatData }) {
  const getShiftStatus = (shiftName: 'Morning' | 'Afternoon' | 'Evening' | 'Night') => {
    const alloc = selectedSeat.shiftAllocations?.[shiftName];
    if (alloc) {
      return {
        isBooked: true,
        label: alloc.student || 'Occupied',
      };
    }
    const isBooked = Boolean(selectedSeat.shift?.includes(shiftName) || selectedSeat.shift === 'Full Day');
    return {
      isBooked,
      label: isBooked ? (selectedSeat.student || 'Occupied') : 'Available for Booking',
    };
  };

  return (
    <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <Layers size={13} className="text-indigo-400" />
          <span>Shift Sharing Roster (Seat {selectedSeat.id})</span>
        </span>
        <span className="text-[11px] font-semibold text-emerald-400">Multi-Shift Enabled</span>
      </div>
      <div className="space-y-1.5 text-xs">
        {SHIFT_ROSTER_ITEMS.map(({ key, label, dotClass }) => {
          const slot = getShiftStatus(key);
          return (
            <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dotClass} shrink-0`} />
                <span className="font-semibold text-primary">{label}</span>
              </div>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold ${
                  slot.isBooked
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {slot.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
