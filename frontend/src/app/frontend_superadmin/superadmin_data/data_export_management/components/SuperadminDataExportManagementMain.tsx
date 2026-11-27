// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementMain.tsx
'use client';

/**
 * @file SuperadminDataExportManagementMain.tsx
 * @description Main orchestrator for Tenant Data Export (Feature 4), Branch Data Export (Feature 5),
 * and Asynchronous Export Queue Management.
 */

import React from 'react';
import { useSuperadminDataExportManagement } from '@/app/frontend_superadmin/superadmin_data/data_export_management/hooks/useSuperadminDataExportManagement';
import { SuperadminDataExportManagementSkeleton } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementSkeleton';
import { SuperadminDataExportManagementTenantExportCard } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementTenantExportCard';
import { SuperadminDataExportManagementBranchExportCard } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementBranchExportCard';
import { SuperadminDataExportManagementJobQueueTable } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementJobQueueTable';
import { SuperadminDataExportManagementExportModal } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementExportModal';
import { SuperadminDataExportManagementEmptyState } from '@/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementEmptyState';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function SuperadminDataExportManagementMain() {
  const {
    jobs,
    isJobsPending,
    jobsError,
    tenants,
    isTenantsPending,
    branches,
    isBranchesPending,
    triggerExport,
    isTriggeringExport,
    cancelExport,
    isExportModalOpen,
    preselectedScope,
    preselectedTenantId,
    preselectedBranchId,
    filterScope,
    filterStatus,
    openExportModal,
    closeExportModal,
    setFilterScope,
    setFilterStatus,
    resetFilters,
  } = useSuperadminDataExportManagement();

  if (isJobsPending || isTenantsPending || isBranchesPending) {
    return <SuperadminDataExportManagementSkeleton />;
  }

  if (jobsError) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="text-xs font-medium">
            Failed to load data export jobs: {jobsError.message}
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:text-rose-200 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Quick Export Cards: Tenant Export (Feature 4) & Branch Export (Feature 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SuperadminDataExportManagementTenantExportCard
          tenants={tenants}
          onInitiateExport={(tenantId) => openExportModal('TENANT', tenantId)}
        />
        <SuperadminDataExportManagementBranchExportCard
          tenants={tenants}
          branches={branches}
          onInitiateExport={(tenantId, branchId) =>
            openExportModal('BRANCH', tenantId, branchId)
          }
        />
      </div>

      {/* 2. Asynchronous Export Job Queue & Download Center */}
      {jobs.length === 0 ? (
        <SuperadminDataExportManagementEmptyState onResetFilters={resetFilters} />
      ) : (
        <SuperadminDataExportManagementJobQueueTable
          jobs={jobs}
          filterScope={filterScope}
          onFilterScopeChange={setFilterScope}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onCancelJob={cancelExport}
        />
      )}

      {/* 3. Export Configuration Dialog */}
      <SuperadminDataExportManagementExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        onSubmit={(data) => triggerExport(data)}
        isSubmitting={isTriggeringExport}
        tenants={tenants}
        branches={branches}
        initialScope={preselectedScope}
        initialTenantId={preselectedTenantId}
        initialBranchId={preselectedBranchId}
      />
    </div>
  );
}
