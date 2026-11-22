// RESPONSIBILITY: Render high-visibility policy notice guaranteeing zero silent extra billing and highlighting cap blocks.
import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { SUPERADMIN_USAGE_OVERVIEW_ROUTES } from '../config/superadmin_usage_overview.url_config';

interface SuperadminUsageOverviewOverageBannerProps {
  exceededCount: number;
  pendingRequestsCount: number;
}

export function SuperadminUsageOverviewOverageBanner({
  exceededCount,
  pendingRequestsCount,
}: SuperadminUsageOverviewOverageBannerProps) {
  return (
    <div className="space-y-3">
      {/* ── Policy Guarantee Strip ── */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-[#0a0d24] to-slate-950/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <span className="font-bold text-emerald-300">Zero Silent Extra Billing Guarantee:</span>{' '}
            Strict hard-stops are enforced when plan quotas (e.g. 3/3 branches) are reached. No surprise fee charges occur without explicit SuperAdmin approval and plan upgrade.
          </div>
        </div>
      </div>

      {/* ── Exceeded Cap Warning ── */}
      {exceededCount > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#0a0d24] to-slate-950/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5 shadow-xs">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                Quota Limit Reached & Creation Blocked
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 font-semibold border border-red-500/30">
                  Hard Stop Active
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white underline">Patna Central Reading Rooms</span> has reached its plan limit of <strong>3/3 branches</strong>. Fourth branch creation was blocked. Library admin submitted an add-on branch request.
              </p>
            </div>
          </div>
          {pendingRequestsCount > 0 && (
            <Link
              href={SUPERADMIN_USAGE_OVERVIEW_ROUTES.quotaRequests}
              className="inline-flex items-center gap-1.5 shrink-0 rounded-xl px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              Review {pendingRequestsCount} Quota Request <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}