// components/SuperadminUsageQuotaRequestsMain.tsx
// RESPONSIBILITY: Main orchestrator for Quota Upgrade Requests sub-module. Zero direct fetch calls.
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SuperadminUsageQuotaRequestsKpiCards } from './SuperadminUsageQuotaRequestsKpiCards';
import { SuperadminUsageQuotaRequestsFilters } from './SuperadminUsageQuotaRequestsFilters';
import { SuperadminUsageQuotaRequestsTable } from './SuperadminUsageQuotaRequestsTable';
import { SuperadminUsageQuotaRequestsEmptyState } from './SuperadminUsageQuotaRequestsEmptyState';
import { SuperadminUsageQuotaRequestsApproveModal } from './SuperadminUsageQuotaRequestsApproveModal';
import { SuperadminUsageQuotaRequestsRejectModal } from './SuperadminUsageQuotaRequestsRejectModal';
import { useSuperadminUsageQuotaRequestsQueries } from '../hooks/useSuperadminUsageQuotaRequestsQueries';
import { useSuperadminUsageQuotaRequestsStore } from '../state/useSuperadminUsageQuotaRequestsStore';
import { SUPERADMIN_USAGE_QUOTA_REQUESTS_ROUTES } from '../config/superadmin_usage_quota_requests.url_config';

export function SuperadminUsageQuotaRequestsMain() {
  const { requests, kpis, isPending } = useSuperadminUsageQuotaRequestsQueries();
  const {
    selectedRequest,
    isApproveModalOpen,
    isRejectModalOpen,
    openApproveModal,
    closeApproveModal,
    openRejectModal,
    closeRejectModal,
    resetFilters,
  } = useSuperadminUsageQuotaRequestsStore();

  return (
    <div className="space-y-6">
      {/* ── Sub-header Banner & Back Navigation ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href={SUPERADMIN_USAGE_QUOTA_REQUESTS_ROUTES.overview}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Back to Usage Overview"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Branch & Quota Upgrade Requests
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SuperAdmin Approval Gate
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Review and act on 4th branch expansion attempts and resource quota increases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Zero Silent Extra Billing Enforced
          </span>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <SuperadminUsageQuotaRequestsKpiCards kpis={kpis} />

      {/* ── Filters Bar ── */}
      <div className="space-y-4">
        <SuperadminUsageQuotaRequestsFilters />

        {/* ── Main Quota Requests Table or Empty State ── */}
        {isPending ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400">
            Loading quota upgrade requests...
          </div>
        ) : requests.length === 0 ? (
          <SuperadminUsageQuotaRequestsEmptyState onReset={resetFilters} />
        ) : (
          <SuperadminUsageQuotaRequestsTable
            requests={requests}
            onApprove={openApproveModal}
            onReject={openRejectModal}
          />
        )}
      </div>

      {/* ── Approve Modal ── */}
      <SuperadminUsageQuotaRequestsApproveModal
        request={selectedRequest}
        isOpen={isApproveModalOpen}
        onClose={closeApproveModal}
      />

      {/* ── Reject Modal ── */}
      <SuperadminUsageQuotaRequestsRejectModal
        request={selectedRequest}
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
      />
    </div>
  );
}
