'use client';

import Link from 'next/link';
import { ShieldAlert, UserX, Wrench, PhoneCall, ArrowRight } from 'lucide-react';
import type { ManagerDashboardOverviewOperationalAlertsProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';

export function ManagerDashboardOverviewOperationalAlerts({
  dropoutRiskCount = 4,
  facilityTicketsCount = 1,
  hotLeadsCount = 3,
  timeRangeLabel,
}: ManagerDashboardOverviewOperationalAlertsProps) {
  return (
    <section
      aria-labelledby="manager-operational-alerts-heading"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all flex flex-col justify-between h-full"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-bg border border-border text-danger flex items-center justify-center font-bold shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="manager-operational-alerts-heading" className="text-base sm:text-lg font-bold text-foreground">
                  Floor & Ops Attention
                </h2>
                {timeRangeLabel && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                    [{timeRangeLabel}]
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Urgent operational interventions</p>
            </div>
          </div>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-bg text-danger border border-border">
            {dropoutRiskCount + facilityTicketsCount + hotLeadsCount} Action Items
          </span>
        </div>

        {/* Actionable Alerts Stack */}
        <div className="space-y-3">
          {/* Dropout Risk / Consecutive Absentees */}
          <Link
            href="/frontend_manager/manager_engagement/engagement_attendance"
            className="group block p-3 rounded-xl border border-border bg-surface-highlight hover:border-danger hover:bg-surface-hover transition-all"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-danger-bg text-danger border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <UserX size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {dropoutRiskCount} Consecutive Absentees
                    </span>
                    <span className="text-[10px] font-semibold bg-danger-bg text-danger px-1.5 py-0.2 rounded border border-border">
                      Dropout Risk
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Absent for 3+ consecutive days. Call member to resolve issues.
                  </p>
                </div>
              </div>
              <ArrowRight size={13} className="text-muted-foreground group-hover:text-danger group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
          </Link>

          {/* Active Facility & Complaints Ticket */}
          <Link
            href="/frontend_manager/manager_communication/communication_complaints"
            className="group block p-3 rounded-xl border border-border bg-surface-highlight hover:border-warning hover:bg-surface-hover transition-all"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-warning-bg text-warning flex items-center justify-center shrink-0 mt-0.5 border border-border">
                  <Wrench size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {facilityTicketsCount} Facility & Noise Ticket
                    </span>
                    <span className="text-[10px] font-semibold bg-warning-bg text-warning-text px-1.5 py-0.2 rounded border border-border">
                      Pending Ops
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    AC servicing due (Zone B) • 2 noise discipline complaints.
                  </p>
                </div>
              </div>
              <ArrowRight size={13} className="text-muted-foreground group-hover:text-warning group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
          </Link>

          {/* Hot Walk-in Enquiries */}
          <Link
            href="/frontend_manager/manager_members/members_enquiries"
            className="group block p-3 rounded-xl border border-border bg-surface-highlight hover:border-info hover:bg-surface-hover transition-all"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-info-bg text-info flex items-center justify-center shrink-0 mt-0.5 border border-border">
                  <PhoneCall size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      {hotLeadsCount} Hot Walk-in Enquiries
                    </span>
                    <span className="text-[10px] font-semibold bg-info-bg text-info px-1.5 py-0.2 rounded border border-border">
                      Fast Follow-up
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Walked in today for trial seat demo. Callback due within 2h.
                  </p>
                </div>
              </div>
              <ArrowRight size={13} className="text-muted-foreground group-hover:text-info group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
          </Link>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Floor discipline checklist</span>
        <span className="font-semibold text-primary">All Zones Operational</span>
      </div>
    </section>
  );
}

