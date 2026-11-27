'use client';

import { LEGEND_ITEMS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/constants/ManagerSeatsMatrixConstants';
import { Armchair, Clock, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SHIFT_CODE_BADGES = [
  { code: 'M', name: 'Morning', hours: '06:00–12:00' },
  { code: 'A', name: 'Afternoon', hours: '12:00–16:00' },
  { code: 'E', name: 'Evening', hours: '16:00–20:00' },
  { code: 'N', name: 'Night', hours: '20:00–06:00' },
] as const;

/** Desk status and 4-shift LED indicator legend for the interactive Seat Matrix grid. */
export function ManagerSeatsMatrixGridLegend() {
  const tManagerUi = useTranslations('manager.manager_seat_matrix.ui');

  return (
    <div className="p-3.5 sm:p-4 bg-card border border-border rounded-2xl shadow-sm space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 shrink-0">
            <Armchair size={14} className="text-primary" /> Desk Status:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            {LEGEND_ITEMS.map(({ cls, labelKey }) => (
              <div key={labelKey} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    cls === 'ss-legend-dot--success'
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      : cls === 'ss-legend-dot--danger'
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                        : cls === 'ss-legend-dot--warning'
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'bg-slate-400 border border-border'
                  }`}
                />
                <span className="text-primary font-semibold">{tManagerUi(labelKey)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 shrink-0">
            <Clock size={13} className="text-primary" /> Shift LED Colors:
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              Green = Vacant (Available)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
              Red = Booked (Occupied)
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 shrink-0">
            <Clock size={13} className="text-primary" /> 4 Daily Shifts (M/A/E/N):
          </span>
          <div className="flex flex-wrap items-center gap-2 font-medium">
            {SHIFT_CODE_BADGES.map((badge) => (
              <div key={badge.code} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border">
                <span className="w-5 h-5 rounded font-mono font-bold text-[11px] flex items-center justify-center bg-primary-subtle text-primary border border-border">
                  {badge.code}
                </span>
                <span className="text-primary font-semibold">{badge.name}</span>
                <span className="text-[10px] text-secondary font-mono">{badge.hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-secondary flex items-center gap-1.5 shrink-0 bg-surface px-3 py-1 rounded-lg border border-border">
          <Info size={13} className="text-primary shrink-0" />
          <span>Each desk supports 4 daily shifts. Green LED = shift is vacant; Red LED = shift is booked.</span>
        </div>
      </div>
    </div>
  );
}
