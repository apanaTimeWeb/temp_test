'use client';
// RESPONSIBILITY: Main orchestrator for Branch Management (Module 03) adhering to WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1 (< 300 lines).
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSuperadminBranchesOverview } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/hooks/useSuperadminBranchesOverview';
import SuperadminBranchesOverviewHeader from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewHeader';
import SuperadminBranchesOverviewKpiCards from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewKpiCards';
import SuperadminBranchesOverviewFilterBar from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewFilterBar';
import SuperadminBranchesOverviewSemanticTable from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewSemanticTable';
import SuperadminBranchesOverviewActionButtons from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewActionButtons';
import SuperadminBranchesOverviewCreateModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewCreateModal';
import SuperadminBranchesOverviewCloseSafetyModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewCloseSafetyModal';
import SuperadminBranchesOverviewTransferManagerModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewTransferManagerModal';
import SuperadminBranchesOverviewDetailsModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewDetailsModal';
import SuperadminBranchesOverviewActivityModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewActivityModal';
import SuperadminBranchesOverviewReportsModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewReportsModal';
import SuperadminBranchesOverviewSuspendModal from '@/app/frontend_superadmin/superadmin_branches/branches_overview/components/SuperadminBranchesOverviewSuspendModal';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import {
  downloadSuperadminBranchesCsv,
  downloadSuperadminBranchesExcel,
  printSuperadminBranchesRoster,
} from '@/app/frontend_superadmin/superadmin_branches/branches_overview/utils/superadmin_branches_overview_utils';

export default function SuperadminBranchesOverviewPageClient() {
  const searchParams = useSearchParams();
  const {
    branches,
    filteredBranches,
    auditLogs,
    search,
    setSearch,
    selectedLibraryId,
    setSelectedLibraryId,
    statusFilter,
    setStatusFilter,
    availableLibraries,
    createBranch,
    activateBranch,
    suspendBranch,
    closeBranch,
    restoreBranch,
    transferManager,
  } = useSuperadminBranchesOverview();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<SuperadminBranchRecord | null>(null);
  const [safetyCloseTarget, setSafetyCloseTarget] = useState<SuperadminBranchRecord | null>(null);
  const [transferTarget, setTransferTarget] = useState<SuperadminBranchRecord | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<SuperadminBranchRecord | null>(null);
  const [activityTarget, setActivityTarget] = useState<SuperadminBranchRecord | null>(null);
  const [reportsTarget, setReportsTarget] = useState<SuperadminBranchRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL query param ?action=create or ?tab=lifecycle
  useEffect(() => {
    if (searchParams?.get('action') === 'create') {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const existingCodes = useMemo(() => branches.map((b) => b.code), [branches]);

  const handleExportCsv = () => {
    downloadSuperadminBranchesCsv(filteredBranches);
    showToast('Branch directory exported as UTF-8 CSV');
  };

  const handleExportExcel = () => {
    downloadSuperadminBranchesExcel(filteredBranches);
    showToast('Branch directory exported as Excel (.xls)');
  };

  const handlePrint = () => {
    printSuperadminBranchesRoster(filteredBranches);
  };

  const handleSuspend = (branch: SuperadminBranchRecord) => {
    setSuspendTarget(branch);
  };

  return (
    <div className="w-full max-w-full min-w-0 px-2 sm:px-4 lg:px-6 py-4 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 rounded-xl border border-emerald-500/50 bg-emerald-950/90 text-emerald-200 px-4 py-3 shadow-xl flex items-center gap-2 backdrop-blur-md animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <SuperadminBranchesOverviewHeader
        onCreateBranch={() => setIsCreateOpen(true)}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
      />

      {/* KPI Cards */}
      <SuperadminBranchesOverviewKpiCards branches={branches} />

      {/* Filter & Search Bar */}
      <SuperadminBranchesOverviewFilterBar
        search={search}
        setSearch={setSearch}
        selectedLibraryId={selectedLibraryId}
        setSelectedLibraryId={setSelectedLibraryId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        availableLibraries={availableLibraries}
        onReset={() => {
          setSearch('');
          setSelectedLibraryId('all');
          setStatusFilter('all');
        }}
        filteredCount={filteredBranches.length}
        totalCount={branches.length}
      />

      {/* Paginated Accessible Table */}
      <SuperadminBranchesOverviewSemanticTable
        branches={filteredBranches}
        onView={(b) => setDetailsTarget(b)}
        onEdit={(b) => setDetailsTarget(b)}
        onActivate={(id) => {
          activateBranch(id);
          showToast('Branch operational status updated to Active.');
        }}
        onSuspend={handleSuspend}
        onCloseSafety={(b) => setSafetyCloseTarget(b)}
        onRestore={(id) => {
          restoreBranch(id);
          showToast('Archived branch successfully restored to active status.');
        }}
        onTransferManager={(b) => setTransferTarget(b)}
        onViewActivity={(b) => setActivityTarget(b)}
        onViewReports={(b) => setReportsTarget(b)}
        renderActionButtons={(branch) => (
          <SuperadminBranchesOverviewActionButtons
            branch={branch}
            onView={(b) => setDetailsTarget(b)}
            onEdit={(b) => setDetailsTarget(b)}
            onActivate={(id) => {
              activateBranch(id);
              showToast('Branch activated.');
            }}
            onSuspend={handleSuspend}
            onCloseSafety={(b) => setSafetyCloseTarget(b)}
            onRestore={(id) => {
              restoreBranch(id);
              showToast('Branch restored.');
            }}
            onTransferManager={(b) => setTransferTarget(b)}
            onViewActivity={(b) => setActivityTarget(b)}
            onViewReports={(b) => setReportsTarget(b)}
          />
        )}
      />

      {/* Modals */}
      <SuperadminBranchesOverviewCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        availableLibraries={availableLibraries}
        existingCodes={existingCodes}
        onSubmit={(data) => {
          const res = createBranch(data);
          if (res.success) {
            setIsCreateOpen(false);
            showToast(`New branch "${data.name}" (${data.code}) successfully created!`);
          }
          return res;
        }}
      />

      {safetyCloseTarget && (
        <SuperadminBranchesOverviewCloseSafetyModal
          branch={safetyCloseTarget}
          onClose={() => setSafetyCloseTarget(null)}
          onConfirmClose={(id, notes) => {
            const res = closeBranch(id, notes);
            if (res.success) {
              setSafetyCloseTarget(null);
              showToast(`Branch "${safetyCloseTarget.name}" safely closed and archived.`);
            }
            return res;
          }}
        />
      )}

      {transferTarget && (
        <SuperadminBranchesOverviewTransferManagerModal
          branch={transferTarget}
          onClose={() => setTransferTarget(null)}
          onConfirmTransfer={(id, newManager, reason) => {
            transferManager(id, newManager, reason);
            setTransferTarget(null);
            showToast(`Branch manager successfully updated to ${newManager.name}.`);
          }}
        />
      )}

      {detailsTarget && (
        <SuperadminBranchesOverviewDetailsModal
          branch={detailsTarget}
          onClose={() => setDetailsTarget(null)}
        />
      )}

      {activityTarget && (
        <SuperadminBranchesOverviewActivityModal
          branch={activityTarget}
          logs={auditLogs}
          onClose={() => setActivityTarget(null)}
        />
      )}

      {reportsTarget && (
        <SuperadminBranchesOverviewReportsModal
          branch={reportsTarget}
          onClose={() => setReportsTarget(null)}
        />
      )}

      {suspendTarget && (
        <SuperadminBranchesOverviewSuspendModal
          branch={suspendTarget}
          onClose={() => setSuspendTarget(null)}
          onConfirm={(branchId, reason) => {
            suspendBranch(branchId, reason);
            showToast(`Branch "${suspendTarget.name}" suspended. Sibling branches remain operational.`);
          }}
        />
      )}
    </div>
  );
}
