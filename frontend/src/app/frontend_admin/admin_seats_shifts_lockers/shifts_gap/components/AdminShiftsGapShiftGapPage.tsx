'use client';

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ChevronDown, Zap, Clock, AlertCircle, Armchair, IndianRupee, Sparkles, TrendingUp } from 'lucide-react';
import { ADMIN_SHIFTS_DEMO_SHIFT_GAPS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/mocks/AdminShiftsGapShiftGapFixtures';
import AdminShiftsGapOverstayAuditTable from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/components/AdminShiftsGapOverstayAuditTable';

const DAY_START_H = 6;
const DAY_END_H   = 23;
const TOTAL_HOURS = DAY_END_H - DAY_START_H;

function pct(h: number) { return Math.max(0, Math.min(100, ((h - DAY_START_H) / TOTAL_HOURS) * 100)); }

function fmtH(h: number) {
  const suffix  = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export function AdminShiftsShiftGapPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [shiftFilter, setShiftFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('shiftFilter', 'All', { validValues: ['All', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'] });

  const visible = shiftFilter === 'All' ? ADMIN_SHIFTS_DEMO_SHIFT_GAPS : ADMIN_SHIFTS_DEMO_SHIFT_GAPS.filter((shift) => shift.name === shiftFilter);

  const gapStats = useMemo(() => {
    const totalShifts = visible.length;
    const totalGaps = visible.reduce((acc, s) => acc + s.gaps.length, 0);
    const totalGapSeats = visible.reduce((acc, s) => acc + s.gaps.reduce((gAcc, g) => gAcc + g.seats, 0), 0);
    const estRevLoss = visible.reduce((acc, s) => acc + s.gaps.reduce((gAcc, g) => gAcc + g.revLoss, 0), 0);
    return { totalShifts, totalGaps, totalGapSeats, estRevLoss };
  }, [visible]);

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-8 text-white shadow-xl backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">Shift Gap Analytics</h1>
        <p role="status" className="text-amber-400 text-sm">{t('shiftGapLiveUnavailable')}</p>
      </section>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <TrendingUp size={22} className="text-indigo-400" />
            Shift Gap Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Executive oversight of unutilized desk intervals, changeover buffers, and seat monetization
          </p>
        </div>
      </div>

      {/* 4 Superadmin-Style Glowing KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {/* Shifts Analyzed - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#0c1828]/95 via-[#0c1828]/90 to-[#122238]/80 p-5 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shifts Analyzed</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{gapStats.totalShifts}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
              Active Schedules
            </span>
          </div>
        </div>

        {/* Gap Windows - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gap Windows</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
              <AlertCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-amber-400">{gapStats.totalGaps}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              Idle Intervals
            </span>
          </div>
        </div>

        {/* Unassigned Desks - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unassigned Desks</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <Armchair size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-indigo-400">{gapStats.totalGapSeats}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              Available For Fill
            </span>
          </div>
        </div>

        {/* Revenue Leakage - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Idle Leak</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
              <IndianRupee size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">₹{gapStats.estRevLoss}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              Recoverable Opportunity
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Shift Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shift Scope:</span>
          <div className="relative min-w-[200px]">
            <select
              aria-label={t('shift')}
              data-testid="admin_shifts-page-control-001"
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 pr-9 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
              value={shiftFilter}
              onChange={e => setShiftFilter(e.target.value)}
            >
              <option value="All">All Shifts Overview</option>
              {ADMIN_SHIFTS_DEMO_SHIFT_GAPS.map((shift) => (
                <option key={shift.id} value={shift.name}>{shift.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Showing calculated desk occupancy gaps across active library shifts
        </p>
      </div>

      {/* Shift Timeline Cards with clean visual progress bars */}
      <div className="space-y-4">
        {visible.map(shift => {
          const utilPct = Math.round((shift.occupied / shift.capacity) * 100);
          return (
            <div key={shift.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    {shift.name} Shift
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Occupancy: <strong className="text-white">{shift.occupied}</strong> / {shift.capacity} Desks ({shift.capacity - shift.occupied} idle desks)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block">Utilization</span>
                    <span className="text-lg font-extrabold text-indigo-400">{utilPct}%</span>
                  </div>
                  <div className="w-28 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        utilPct >= 75 ? 'bg-emerald-500' : utilPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Time axis visualization */}
              <div className="mt-5 space-y-3">
                <div className="relative h-10 w-full overflow-hidden rounded-xl bg-slate-950/80 border border-slate-800 p-1">
                  {shift.booked.map((b) => {
                    const left = pct(b.startH);
                    const width = pct(b.endH) - left;
                    return (
                      <div
                        key={`${b.startH}-${b.endH}`}
                        className="absolute inset-y-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[11px] font-semibold text-indigo-200 px-2 overflow-hidden truncate"
                        style={{ left: `${left}%`, width: `${width}%` }}
                        title={b.label}
                      >
                        {b.label}
                      </div>
                    );
                  })}
                  {shift.gaps.map((g) => {
                    const left = pct(g.startH);
                    const width = pct(g.endH) - left;
                    return (
                      <div
                        key={`${g.startH}-${g.endH}`}
                        className="absolute inset-y-1 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-300 px-1 overflow-hidden truncate"
                        style={{ left: `${left}%`, width: `${width}%` }}
                        title={`Gap Window: ${fmtH(g.startH)} to ${fmtH(g.endH)}`}
                      >
                        Gap
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{fmtH(DAY_START_H)}</span>
                  <span>{fmtH(Math.round((DAY_START_H + DAY_END_H) / 2))}</span>
                  <span>{fmtH(DAY_END_H)}</span>
                </div>

                {shift.gaps.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {shift.gaps.map((g) => (
                      <div
                        key={`${g.startH}-${g.endH}`}
                        className="flex items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 p-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            data-testid="admin_shifts-page-state-003"
                            className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300"
                          >
                            Gap Window
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-200">
                              {fmtH(g.startH)} – {fmtH(g.endH)} ({g.seats} seats unoccupied)
                            </p>
                            <p className="text-[11px] text-rose-400 font-medium">
                              Estimated daily opportunity leak: ₹{g.revLoss}
                            </p>
                          </div>
                        </div>
                        <button
                          data-testid="admin_shifts-page-control-004"
                          className="hidden"
                          disabled
                        >
                          <Zap size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Branch Shift Gap & Idle Capacity Audit Table */}
      <AdminShiftsGapOverstayAuditTable />
    </div>
  );
}

export default AdminShiftsShiftGapPage;
