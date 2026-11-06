'use client';

import Link from 'next/link';
import { Clock, Users, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ManagerDashboardOverviewLiveShiftBarProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';

export function ManagerDashboardOverviewLiveShiftBar({
  currentShiftName = 'Afternoon Shift',
  shiftTiming = '02:00 PM – 08:00 PM',
  timeRemaining = '2h 15m remaining',
  activeOccupancy = 38,
  totalCapacity = 60,
  overstayCount = 3,
  timeRangeLabel,
}: ManagerDashboardOverviewLiveShiftBarProps) {
  const occupancyPercentage = Math.round((activeOccupancy / totalCapacity) * 100);

  return (
    <section
      aria-label="Live Shift and Floor Operations"
      className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Shift Status & Timing */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-subtle border border-border text-primary flex items-center justify-center font-bold shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Current Shift
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live Active
              </span>
              {timeRangeLabel && (
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                  [{timeRangeLabel}]
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                {currentShiftName}
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                ({shiftTiming}) • <span className="font-semibold text-foreground">{timeRemaining}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Live Floor Counters & Overstay */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Hall Occupancy Counter */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-highlight border border-border">
            <Users size={16} className="text-primary shrink-0" />
            <div className="text-xs">
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span>{activeOccupancy}</span>
                <span className="text-muted-foreground font-normal">/ {totalCapacity}</span>
                <span className="text-[10px] font-semibold text-primary ml-1">
                  ({occupancyPercentage}%)
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">In Hall Now</p>
            </div>
          </div>

          {/* Overstay Alert Chip */}
          {overstayCount > 0 ? (
            <Link
              href="/frontend_manager/manager_accounts_assets/accounts_seat_gap_report"
              className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-warning-bg border border-border text-warning-text hover:border-warning transition-colors"
              title="View overstaying students past shift buffer"
            >
              <AlertTriangle size={16} className="text-warning shrink-0" />
              <div className="text-xs text-left">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <span>{overstayCount} Overstay Alerts</span>
                  <ArrowRight size={12} className="text-warning group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[10px] text-muted-foreground">Past morning cutoff</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success-bg border border-border text-xs text-success font-medium">
              <CheckCircle2 size={15} />
              <span>No Overstay Violations</span>
            </div>
          )}

          {/* Shift Matrix CTA */}
          <Link
            href="/frontend_manager/manager_seats_shifts_lockers/seats_matrix"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-primary transition-all cursor-pointer shadow-xs shrink-0"
          >
            <span>Floor Matrix</span>
            <ArrowRight size={13} className="text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}

