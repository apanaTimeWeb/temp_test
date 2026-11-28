'use client';

// RESPONSIBILITY: Render aggregate monthly attendance KPI summary cards.

interface ManagerAttendanceMonthlyHistoryKpisProps {
  totalEnrolled: number;
  avgAttendance: number;
  highAttendanceCount: number;
  lowAttendanceCount: number;
  totalHoursLogged: number;
}

export function ManagerAttendanceMonthlyHistoryKpis({
  totalEnrolled,
  avgAttendance,
  highAttendanceCount,
  lowAttendanceCount,
  totalHoursLogged,
}: ManagerAttendanceMonthlyHistoryKpisProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
      <div className="mgr-att-surface--indigo group relative overflow-hidden p-4 rounded-2xl border border-indigo-500/40 shadow-lg shadow-indigo-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="text-indigo-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Enrolled In Scope
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalEnrolled}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active members</p>
        </div>
      </div>

      <div className="mgr-att-surface--emerald group relative overflow-hidden p-4 rounded-2xl border border-emerald-500/40 shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="text-emerald-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Avg Monthly Rate
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{avgAttendance}%</div>
          <p className="text-[11px] text-emerald-200/70 mt-0.5">Average turnstile score</p>
        </div>
      </div>

      <div className="mgr-att-surface--sky group relative overflow-hidden p-4 rounded-2xl border border-sky-500/40 shadow-lg shadow-sky-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="text-sky-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
            High Consistent (&ge;90%)
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">
            {highAttendanceCount}
          </div>
          <p className="text-[11px] text-sky-200/70 mt-0.5">Gold tier consistency</p>
        </div>
      </div>

      <div className="mgr-att-surface--rose group relative overflow-hidden p-4 rounded-2xl border border-rose-500/40 shadow-lg shadow-rose-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-rose-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="text-rose-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
            Dropout Risk (&lt;75%)
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
            {lowAttendanceCount}
          </div>
          <p className="text-[11px] text-rose-200/70 mt-0.5">Requires manager review</p>
        </div>
      </div>

      <div className="mgr-att-surface--amber group relative overflow-hidden col-span-2 sm:col-span-1 p-4 rounded-2xl border border-amber-500/40 shadow-lg shadow-amber-950/40 motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex flex-col justify-between">
        <svg aria-hidden="true" className="text-amber-400 absolute bottom-0 right-0 w-24 h-12 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
          <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Study Hours Logged
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{totalHoursLogged}h</div>
          <p className="text-[11px] text-amber-200/70 mt-0.5">Total hours in hall</p>
        </div>
      </div>
    </div>
  );
}
