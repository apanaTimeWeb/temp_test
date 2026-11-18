// RESPONSIBILITY: AdminAccountingSeatGapSummarySection component owned by admin_accounting; responsibility folder: admin_accounting_components_cards.
import { Armchair, AlertTriangle, Clock, Wrench } from 'lucide-react';
import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';

export default function AdminAccountingSeatGapSummarySection({
  rows,
  totalLossLabel,
  labels,
  periodBadge,
}: {
  rows: readonly AdminAccountingSeatGapRow[];
  totalLossLabel: string;
  labels: { totalGapSeats: string; revenueLoss: string; averageGapDays: string; underMaintenance: string };
  periodBadge?: string;
}) {
  const averageGapDays = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.gapDays, 0) / rows.length) : 0;
  const maintenanceSeatCount = rows.filter((row) => row.status === 'maintenance').length;

  return (
    <section aria-label={labels.totalGapSeats} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {/* Total Gap Seats - Cyan */}
      <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{labels.totalGapSeats}</p>
            {periodBadge && (
              <span className="self-start rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400 shadow-xs">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Armchair size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums tracking-tight text-white">{rows.length}</p>
      </div>

      {/* Revenue Loss - Rose */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{labels.revenueLoss}</p>
            {periodBadge && (
              <span className="self-start rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400 shadow-xs">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <AlertTriangle size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums tracking-tight text-rose-400">{totalLossLabel}</p>
      </div>

      {/* Average Gap Days - Amber */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{labels.averageGapDays}</p>
            {periodBadge && (
              <span className="self-start rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400 shadow-xs">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Clock size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums tracking-tight text-amber-400">{averageGapDays}d</p>
      </div>

      {/* Under Maintenance - Purple */}
      <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-purple-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="relative z-10 flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{labels.underMaintenance}</p>
            {periodBadge && (
              <span className="self-start rounded-full bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-400 shadow-xs">
                {periodBadge}
              </span>
            )}
          </div>
          <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
            <Wrench size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums tracking-tight text-white">{maintenanceSeatCount}</p>
      </div>
    </section>
  );
}
