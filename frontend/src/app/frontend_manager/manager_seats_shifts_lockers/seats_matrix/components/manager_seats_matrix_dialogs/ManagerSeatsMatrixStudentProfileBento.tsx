'use client';

import { Armchair, Calendar, CheckCircle2, Clock, Phone } from 'lucide-react';

interface ManagerSeatsMatrixStudentProfileBentoProps {
  seatId: string;
  shift: string;
  shiftDisplay: string;
  expiry: string;
  isExpiring: boolean;
  maskedPhone: string;
}

/** 4-block bento summary of seat, shift timings, plan expiry, and masked phone details. */
export function ManagerSeatsMatrixStudentProfileBento({
  seatId,
  shift,
  shiftDisplay,
  expiry,
  isExpiring,
  maskedPhone,
}: ManagerSeatsMatrixStudentProfileBentoProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary motion-safe:transition-colors">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
          <Armchair size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
            Assigned Desk
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-black font-mono text-primary bg-primary-subtle px-2 py-0.5 rounded-md">
              S-{seatId}
            </span>
            <span className="text-[11px] font-semibold text-secondary truncate">
              AC Silent Hall
            </span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary motion-safe:transition-colors">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
          <Clock size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
            Shift Timings
          </span>
          <p className="text-xs font-bold text-primary mt-0.5 truncate">{shift} Slot</p>
          <p className="text-[11px] text-secondary font-mono mt-0.5 truncate">{shiftDisplay}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary motion-safe:transition-colors">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <Calendar size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
            Plan Expiry
          </span>
          <p className={`text-xs font-bold mt-0.5 ${isExpiring ? 'text-amber-400' : 'text-primary'}`}>
            {expiry}
          </p>
          <p className="text-[11px] text-secondary mt-0.5">Monthly Reserved Plan</p>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3 hover:border-primary motion-safe:transition-colors">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
          <Phone size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
            Phone & SMS Alerts
          </span>
          <p className="text-xs font-bold text-primary font-mono mt-0.5">{maskedPhone}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 size={11} /> Auto Reminders Enabled
          </p>
        </div>
      </div>
    </div>
  );
}
