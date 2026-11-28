'use client';

import { AdminShiftsGapKpiGrid } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/components/AdminShiftsGapKpiGrid';
import AdminShiftsGapOverstayAuditTable from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/components/AdminShiftsGapOverstayAuditTable';
import { ADMIN_SHIFTS_DEMO_SHIFT_GAPS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/config/admin_shifts_gap.demo_data';
import { formatAdminShiftsGapCurrency } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/utils/formatAdminShiftsGapCurrency';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { AlertCircle, CheckCircle2, Clock, Filter, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

function fmtH(h: number) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export function AdminShiftsShiftGapPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const [shiftFilter, setShiftFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('shiftFilter', 'All', {
    validValues: ['All', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'],
  });

  const visible = useMemo(() => {
    if (shiftFilter === 'All') return ADMIN_SHIFTS_DEMO_SHIFT_GAPS;
    return ADMIN_SHIFTS_DEMO_SHIFT_GAPS.filter((shift) => shift.name === shiftFilter);
  }, [shiftFilter]);

  const gapStats = useMemo(() => {
    const totalShifts = visible.length;
    const totalGapSeats = visible.reduce((acc, s) => acc + (s.capacity - s.occupied), 0);
    const estRevLoss = visible.reduce((acc, s) => acc + s.gaps.reduce((gAcc, g) => gAcc + g.revLoss, 0), 0);
    const totalCapacity = visible.reduce((acc, s) => acc + s.capacity, 0);
    const totalOccupied = visible.reduce((acc, s) => acc + s.occupied, 0);
    const avgGapPct = totalCapacity > 0 ? Math.round(((totalCapacity - totalOccupied) / totalCapacity) * 100) : 0;
    return { totalShifts, totalGapSeats, estRevLoss, avgGapPct };
  }, [visible]);

  if (!isDemoMode) {
    return (
      <section className="space-y-3 rounded-2xl border border-warning bg-card p-8 text-text-primary shadow-card">
        <h1 className="text-xl font-bold text-text-primary">Shift Gap Analytics</h1>
        <p role="status" className="text-warning-text text-sm">
          {t('shiftGapLiveUnavailable')}
        </p>
      </section>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              Seat Capacity Optimization
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2.5 mt-1">
            <TrendingUp size={24} className="text-primary" aria-hidden="true" />
            Shift Gap Analytics
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Comprehensive audit of unassigned desk gaps, low-occupancy shift intervals, and recoverable revenue leakage
          </p>
        </div>
      </div>

      <AdminShiftsGapKpiGrid
        totalShifts={gapStats.totalShifts}
        avgGapPct={gapStats.avgGapPct}
        totalGapSeats={gapStats.totalGapSeats}
        estRevLoss={gapStats.estRevLoss}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-input px-3 py-1.5">
            <Filter size={13} className="text-info-text shrink-0" aria-hidden="true" />
            <select
              aria-label={t('shift')}
              data-testid="admin_shifts-page-control-001"
              className="bg-transparent text-xs text-text-primary focus:outline-none cursor-pointer font-medium"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
            >
              <option value="All" className="bg-card text-text-primary">All Shifts Overview</option>
              {ADMIN_SHIFTS_DEMO_SHIFT_GAPS.map((shift) => (
                <option key={shift.id} value={shift.name} className="bg-card text-text-primary">
                  {shift.name} Shift
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-text-secondary font-medium">
          Showing real-time desk vacancy and idle gap opportunities
        </p>
      </div>

      <div className="space-y-4">
        {visible.map((shift) => {
          const utilPct = Math.round((shift.occupied / shift.capacity) * 100);
          const gapPct = 100 - utilPct;
          const idleSeats = shift.capacity - shift.occupied;

          return (
            <div
              key={shift.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4"
            >
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-text-primary">{shift.name} Shift</h2>
                    <span className="inline-flex items-center gap-1 rounded-md border border-info bg-info-bg px-2 py-0.5 text-[11px] font-semibold text-info-text">
                      <Clock size={11} aria-hidden="true" />
                      {shift.booked.length > 0 ? `${fmtH(shift.booked[0].startH)} – ${fmtH(shift.booked[shift.booked.length - 1].endH)}` : 'Standard Hours'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    Total Capacity: <strong className="text-text-primary font-mono">{shift.capacity} Desks</strong> · Occupied:{' '}
                    <strong className="text-success-text font-mono">{shift.occupied}</strong> · Idle Gap:{' '}
                    <strong className="text-danger-text font-mono">{idleSeats} desks</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary block">
                      Occupancy vs Gap
                    </span>
                    <span className="text-base font-extrabold text-success-text font-mono">
                      {utilPct}% <span className="text-xs text-text-secondary font-normal">occupied</span>
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-border">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary block">
                      Gap Leakage
                    </span>
                    <span className="text-base font-extrabold text-danger-text font-mono">
                      {gapPct}% <span className="text-xs text-text-secondary font-normal">idle</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-text-secondary font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success-text" />
                    <strong>Booked Desks:</strong> {shift.occupied} ({utilPct}%)
                  </span>
                  <span className="flex items-center gap-1.5 text-danger-text">
                    <span className="h-2 w-2 rounded-full bg-danger-text" />
                    <strong>Idle Capacity Gap:</strong> {idleSeats} ({gapPct}%)
                  </span>
                </div>
                <div className="flex h-3.5 w-full rounded-xl overflow-hidden bg-surface-highlight border border-border">
                  <div
                    className={`h-full bg-success-text motion-safe:transition-all motion-safe:duration-500 admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(utilPct)))}`}
                    title={`Occupied: ${shift.occupied} desks (${utilPct}%)`}
                  />
                  <div
                    className={`h-full bg-warning-text motion-safe:transition-all motion-safe:duration-500 admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(gapPct)))}`}
                    title={`Idle Gap: ${idleSeats} desks (${gapPct}%)`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="min-w-0 rounded-xl border border-border bg-surface-highlight p-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-success-text" aria-hidden="true" />
                    Active Student Batches
                  </span>
                  <div className="space-y-1.5">
                    {shift.booked.map((b) => (
                      <div
                        key={`${b.startH}-${b.endH}`}
                        className="flex flex-wrap items-center justify-between gap-1 rounded-lg border border-border-focus bg-primary-subtle px-2.5 py-1.5 text-xs"
                      >
                        <span className="font-semibold text-text-primary">{b.label}</span>
                        <span className="font-mono text-[11px] text-primary">
                          {fmtH(b.startH)} – {fmtH(b.endH)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-xl border border-border bg-surface-highlight p-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-warning-text flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-warning-text" aria-hidden="true" />
                    Detected Gap Windows &amp; Opportunity
                  </span>
                  <div className="space-y-1.5">
                    {shift.gaps.length === 0 ? (
                      <p className="text-xs text-text-secondary italic py-1">No significant gap windows detected.</p>
                    ) : (
                      shift.gaps.map((g) => (
                        <div
                          key={`${g.startH}-${g.endH}`}
                          className="flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-warning bg-warning-bg px-2.5 py-1.5 text-xs"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              data-testid="admin_shifts-page-state-003"
                              className="rounded-md border border-warning bg-card px-1.5 py-0.5 text-[10px] font-bold text-warning-text"
                            >
                              Gap Window
                            </span>
                            <span className="font-semibold text-text-primary">
                              {fmtH(g.startH)} – {fmtH(g.endH)} ({g.seats} seats empty)
                            </span>
                          </div>
                          <span className="font-mono font-bold text-danger-text">
                            {t('negativeRatePerDay', { amount: formatAdminShiftsGapCurrency(g.revLoss, locale) })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AdminShiftsGapOverstayAuditTable />
    </div>
  );
}

export default AdminShiftsShiftGapPage;
