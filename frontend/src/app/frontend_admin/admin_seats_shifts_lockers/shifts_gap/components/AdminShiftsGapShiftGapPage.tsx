// Responsibility: AdminShiftsShiftGapPage component owned by admin_shifts; responsibility folder: admin_shifts_components_views.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

import { useTranslations } from 'next-intl';
// RESPONSIBILITY: Entry page for the admin_shifts module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ChevronDown, Zap } from 'lucide-react';
import { ADMIN_SHIFTS_DEMO_SHIFT_GAPS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/mocks/AdminShiftsGapShiftGapFixtures';

const DAY_START_H = 6;
const DAY_END_H   = 23;
const TOTAL_HOURS = DAY_END_H - DAY_START_H;

function pct(h: number) { return ((h - DAY_START_H) / TOTAL_HOURS) * 100; }

function fmtH(h: number) {
  const suffix  = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

export function AdminShiftsShiftGapPage() {
  const t = useTranslations('ADMIN_SHIFTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [shiftFilter, setShiftFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('shiftFilter', 'All', { validValues: ['All', 'Morning', 'Afternoon', 'Evening'] });

  const visible = shiftFilter === 'All' ? ADMIN_SHIFTS_DEMO_SHIFT_GAPS : ADMIN_SHIFTS_DEMO_SHIFT_GAPS.filter((shift) => shift.name === shiftFilter);

  if (!isDemoMode) return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-section-title font-semibold text-text-primary">{t('shiftGapTitle')}</h1><p role="status" className="text-warning-text">{t('shiftGapLiveUnavailable')}</p></section>;

  return (
    <>

      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">{t('shiftGapTitle')}</h1>
            <p className="text-sm text-text-secondary">{t('shiftGapSubtitle')}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-56">
            <select aria-label={t('shift')} data-testid="admin_shifts-page-control-001" className="min-h-11 w-full appearance-none rounded-md border border-border bg-input px-3 py-2 pr-9 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60" value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option value="All">{t('allShifts')}</option>
              {ADMIN_SHIFTS_DEMO_SHIFT_GAPS.map((shift) => <option key={shift.id} value={shift.name}>{shift.name}</option>)}
            </select>
            <ChevronDown size={18} strokeWidth={2} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          <p className="text-sm text-text-secondary" role="note">{t('periodSingleDay')}</p>
        </div>

        {visible.map(shift => {
          const utilPct = Math.round((shift.occupied / shift.capacity) * 100);
          return (
            <div key={shift.id} className="min-w-0 rounded-xl border border-border bg-card p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">{t('shiftNameWithShift', { name: shift.name })}</h2>
                  <p className="mt-1 text-xs text-text-secondary">{t('occupiedSeatsCount', { occupied: shift.occupied, capacity: shift.capacity })}</p>
                </div>
                <div className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-card min-w-36 space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t('utilization')}</span>
                  <span className="text-xl font-bold tabular-nums text-primary">{utilPct}%</span>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-highlight">
                    {/* dynamic computed width — only allowed inline style */}
                    <div className={`h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-base admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(utilPct)))}`} />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">

                {/* Time-slot bar — left/width are runtime-computed positions */}
                <div className="relative min-h-10 w-full overflow-hidden rounded-md bg-surface-highlight">
                  {shift.booked.map((b) => (
                    <div
                      key={`${b.startH}-${b.endH}`}
                      className={`absolute inset-y-0 flex min-w-0 items-center justify-center overflow-hidden rounded px-1 text-xs font-medium bg-info-bg text-info-text admin-dynamic-left-${Math.min(100, Math.max(0, Math.round(pct(b.startH))))} admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(pct(b.endH) - pct(b.startH))))}`}
                      title={b.label}
                    >
                      {b.label}
                    </div>
                  ))}
                  {shift.gaps.map((g) => (
                    <div
                      key={`${g.startH}-${g.endH}`}
                      className={`absolute inset-y-0 flex min-w-0 items-center justify-center overflow-hidden rounded px-1 text-xs font-medium border border-warning-text bg-warning-bg text-warning-text admin-dynamic-left-${Math.min(100, Math.max(0, Math.round(pct(g.startH))))} admin-dynamic-width-${Math.min(100, Math.max(0, Math.round(pct(g.endH) - pct(g.startH))))}`}
                      title={t('gapTimeTitle', { start: fmtH(g.startH), end: fmtH(g.endH) })}
                    >{t('gap')}</div>
                  ))}
                </div>

                {/* Time axis labels */}
                <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
                  <span className="text-xs text-text-secondary">{fmtH(DAY_START_H)}</span>
                  <span className="text-xs text-text-secondary">{fmtH(Math.round((DAY_START_H + DAY_END_H) / 2))}</span>
                  <span className="text-xs text-text-secondary">{fmtH(DAY_END_H)}</span>
                </div>

                {shift.gaps.length === 0 ? (
                  <p className="text-text-secondary text-xs">{t('noGaps')}</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {shift.gaps.map((g) => (
                      <div key={`${g.startH}-${g.endH}`} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <span data-testid="admin_shifts-page-state-003" className="inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium border-warning-text bg-warning-bg text-warning-text">🕳️ {t('gap')}</span>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{fmtH(g.startH)} – {fmtH(g.endH)} · {t('gapSeatsFreeLabel', { count: g.seats })}</p>
                            <p className="mt-1 text-xs text-warning-text">{t('estRevenueLossLabel', { amount: g.revLoss })}</p>
                          </div>
                        </div>
                        <button data-testid="admin_shifts-page-control-004"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary motion-safe:transition-colors motion-safe:duration-base hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 px-3 text-sm opacity-60"
                          disabled
                          title={t('demoQuickFillUnavailable')}
                        >
                          <Zap size={18}  strokeWidth={2}/>{t('quickFill')}</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
