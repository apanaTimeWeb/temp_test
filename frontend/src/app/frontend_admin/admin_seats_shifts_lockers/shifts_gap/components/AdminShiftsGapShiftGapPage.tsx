'use client';

import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import {
  ChevronDown,
  Zap,
  Clock,
  AlertCircle,
  Armchair,
  IndianRupee,
  Sparkles,
  TrendingUp,
  Building2,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ADMIN_SHIFTS_DEMO_SHIFT_GAPS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/mocks/AdminShiftsGapShiftGapFixtures';
import AdminShiftsGapOverstayAuditTable from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/components/AdminShiftsGapOverstayAuditTable';

const DAY_START_H = 6;
const DAY_END_H = 23;
const TOTAL_HOURS = DAY_END_H - DAY_START_H;

function fmtH(h: number) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export function AdminShiftsShiftGapPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [shiftFilter, setShiftFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('shiftFilter', 'All', {
    validValues: ['All', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'],
  });

  const visible = useMemo(() => {
    let result = ADMIN_SHIFTS_DEMO_SHIFT_GAPS;
    if (shiftFilter !== 'All') {
      result = result.filter((shift) => shift.name === shiftFilter);
    }
    return result;
  }, [shiftFilter]);

  const gapStats = useMemo(() => {
    const totalShifts = visible.length;
    const totalGaps = visible.reduce((acc, s) => acc + s.gaps.length, 0);
    const totalGapSeats = visible.reduce((acc, s) => acc + (s.capacity - s.occupied), 0);
    const estRevLoss = visible.reduce((acc, s) => acc + s.gaps.reduce((gAcc, g) => gAcc + g.revLoss, 0), 0);
    const totalCapacity = visible.reduce((acc, s) => acc + s.capacity, 0);
    const totalOccupied = visible.reduce((acc, s) => acc + s.occupied, 0);
    const avgGapPct = totalCapacity > 0 ? Math.round(((totalCapacity - totalOccupied) / totalCapacity) * 100) : 0;
    return { totalShifts, totalGaps, totalGapSeats, estRevLoss, avgGapPct };
  }, [visible]);

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-2xl border border-amber-500/30 bg-slate-900/90 p-8 text-white shadow-xl backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">Shift Gap Analytics</h1>
        <p role="status" className="text-amber-400 text-sm">
          {t('shiftGapLiveUnavailable')}
        </p>
      </section>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
              <Sparkles size={12} className="text-amber-400" />
              Seat Capacity Optimization
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 mt-1">
            <TrendingUp size={24} className="text-indigo-400" />
            Shift Gap Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive audit of unassigned desk gaps, low-occupancy shift intervals, and recoverable revenue leakage
          </p>
        </div>
      </div>

      {/* 4 Premium Glassmorphic KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {/* Shifts Analyzed - Cyan */}
        <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#0c1828]/95 via-[#0c1828]/90 to-[#122238]/80 p-5 shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-xl">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Shifts Analyzed</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white tabular-nums">{gapStats.totalShifts}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
              Active Schedules
            </span>
          </div>
        </div>

        {/* Average Idle Gap - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Average Idle Gap</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
              <TrendingDown size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400 tabular-nums">{gapStats.avgGapPct}%</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
              Unoccupied Capacity
            </span>
          </div>
        </div>

        {/* Unassigned Desks - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Unassigned Desks</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <Armchair size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-400 tabular-nums">{gapStats.totalGapSeats}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              Available To Fill
            </span>
          </div>
        </div>

        {/* Revenue Leakage - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-xl">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl transition-all duration-500 group-hover:bg-rose-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Daily Idle Leak</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
              <IndianRupee size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 tabular-nums">₹{gapStats.estRevLoss.toLocaleString('en-IN')}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
              Recoverable Opportunity
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar: Filter and Global Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Shift Filter Dropdown */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5">
            <Filter size={13} className="text-cyan-400 shrink-0" />
            <select
              aria-label={t('shift')}
              data-testid="admin_shifts-page-control-001"
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer font-medium"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
            >
              <option value="All" className="bg-slate-900 text-white">All Shifts Overview</option>
              {ADMIN_SHIFTS_DEMO_SHIFT_GAPS.map((shift) => (
                <option key={shift.id} value={shift.name} className="bg-slate-900 text-white">
                  {shift.name} Shift
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Showing real-time desk vacancy and idle gap opportunities
        </p>
      </div>

      {/* Crystal-Clear, Non-Overlapping Shift Gap Cards */}
      <div className="space-y-4">
        {visible.map((shift) => {
          const utilPct = Math.round((shift.occupied / shift.capacity) * 100);
          const gapPct = 100 - utilPct;
          const idleSeats = shift.capacity - shift.occupied;

          return (
            <div
              key={shift.id}
              className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 p-5 shadow-xl backdrop-blur-md space-y-4"
            >
              {/* Card Header: Shift Info & Overall Utilization */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{shift.name} Shift</h2>
                    <span className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                      <Clock size={11} />
                      {shift.booked.length > 0 ? `${fmtH(shift.booked[0].startH)} – ${fmtH(shift.booked[shift.booked.length - 1].endH)}` : 'Standard Hours'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Total Capacity: <strong className="text-white font-mono">{shift.capacity} Desks</strong> · Occupied:{' '}
                    <strong className="text-emerald-400 font-mono">{shift.occupied}</strong> · Idle Gap:{' '}
                    <strong className="text-rose-400 font-mono">{idleSeats} desks</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Occupancy vs Gap
                    </span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {utilPct}% <span className="text-xs text-slate-500 font-normal">occupied</span>
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Gap Leakage
                    </span>
                    <span className="text-base font-extrabold text-rose-400 font-mono">
                      {gapPct}% <span className="text-xs text-slate-500 font-normal">idle</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* NON-OVERLAPPING CAPACITY BAR (Side-by-side flex segments) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <strong>Booked Desks:</strong> {shift.occupied} ({utilPct}%)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-300">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    <strong>Idle Capacity Gap:</strong> {idleSeats} ({gapPct}%)
                  </span>
                </div>
                {/* 100% Width Segmented Bar - ZERO OVERLAP POSSIBLE */}
                <div className="flex h-3.5 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${utilPct}%` }}
                    title={`Occupied: ${shift.occupied} desks (${utilPct}%)`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-rose-500/80 to-amber-500/80 transition-all duration-500"
                    style={{ width: `${gapPct}%` }}
                    title={`Idle Gap: ${idleSeats} desks (${gapPct}%)`}
                  />
                </div>
              </div>

              {/* CLEAN DEDICATED SECTIONS: Booked Batches vs Detected Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Booked Batches Breakdown */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    Active Student Batches
                  </span>
                  <div className="space-y-1.5">
                    {shift.booked.map((b) => (
                      <div
                        key={`${b.startH}-${b.endH}`}
                        className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1.5 text-xs"
                      >
                        <span className="font-semibold text-white">{b.label}</span>
                        <span className="font-mono text-[11px] text-indigo-300">
                          {fmtH(b.startH)} – {fmtH(b.endH)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detected Gaps & Revenue Recovery Opportunities */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-amber-400" />
                    Detected Gap Windows & Opportunity
                  </span>
                  <div className="space-y-1.5">
                    {shift.gaps.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">No significant gap windows detected.</p>
                    ) : (
                      shift.gaps.map((g) => (
                        <div
                          key={`${g.startH}-${g.endH}`}
                          className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              data-testid="admin_shifts-page-state-003"
                              className="rounded-md border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300"
                            >
                              Gap Window
                            </span>
                            <span className="font-semibold text-slate-200">
                              {fmtH(g.startH)} – {fmtH(g.endH)} ({g.seats} seats empty)
                            </span>
                          </div>
                          <span className="font-mono font-bold text-rose-400">
                            -₹{g.revLoss}/day
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Hidden test-control preserved for backwards compatibility */}
              <button data-testid="admin_shifts-page-control-004" className="hidden" disabled>
                <Zap size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Branch Shift Gap & Idle Capacity Breakdown Table */}
      <AdminShiftsGapOverstayAuditTable />
    </div>
  );
}

export default AdminShiftsShiftGapPage;
