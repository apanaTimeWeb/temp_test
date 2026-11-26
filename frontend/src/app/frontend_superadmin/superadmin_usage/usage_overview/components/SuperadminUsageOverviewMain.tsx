'use client';
// RESPONSIBILITY: Orchestrates layout and child components for Usage & Limit Monitoring overview. No direct fetch calls.
import React from 'react';
import { SuperadminUsageOverviewOverageBanner } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewOverageBanner';
import { SuperadminUsageOverviewKpiCards } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewKpiCards';
import { SuperadminUsageOverviewFilters } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewFilters';
import { SuperadminUsageOverviewTable } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewTable';
import { SuperadminUsageOverviewDetailDrawer } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewDetailDrawer';
import { SuperadminUsageOverviewEmptyState } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/components/SuperadminUsageOverviewEmptyState';
import { useSuperadminUsageOverviewList } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/hooks/useSuperadminUsageOverviewList';
import { useSuperadminUsageOverviewDetail } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/hooks/useSuperadminUsageOverviewDetail';
import { useSuperadminUsageOverviewStore } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/state/useSuperadminUsageOverviewStore';

export default function SuperadminUsageOverviewMain() {
  const { libraries, summary, isPending } = useSuperadminUsageOverviewList();
  const {
    selectedLibraryId,
    isDetailDrawerOpen,
    openDetailDrawer,
    closeDetailDrawer,
    resetFilters,
  } = useSuperadminUsageOverviewStore();

  const { data: selectedLibrary } = useSuperadminUsageOverviewDetail(selectedLibraryId);

  return (
    <div className="space-y-6">
      {/* ── 1. Policy & Overage Notice Banner ── */}
      <SuperadminUsageOverviewOverageBanner
        exceededCount={summary?.exceededLibrariesCount ?? 1}
        pendingRequestsCount={summary?.pendingRequestsCount ?? 1}
      />

      {/* ── 2. Global Resource Consumption Meters ── */}
      <SuperadminUsageOverviewKpiCards summary={summary} />

      {/* ── 3. Filters & Category Navigation ── */}
      <div className="space-y-4">
        <SuperadminUsageOverviewFilters />

        {/* ── 4. Main Quota Consumption Table / Empty State ── */}
        {isPending ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400">
            Loading real-time resource telemetry across libraries...
          </div>
        ) : libraries.length === 0 ? (
          <SuperadminUsageOverviewEmptyState onReset={resetFilters} />
        ) : (
          <SuperadminUsageOverviewTable
            libraries={libraries}
            onSelectLibrary={openDetailDrawer}
          />
        )}
      </div>

      {/* ── 5. Granular 12-Resource Inspection Drawer ── */}
      <SuperadminUsageOverviewDetailDrawer
        library={selectedLibrary ?? libraries.find((l) => l.id === selectedLibraryId) ?? null}
        isOpen={isDetailDrawerOpen}
        onClose={closeDetailDrawer}
      />
    </div>
  );
}
