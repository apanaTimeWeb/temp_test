'use client';

import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import { ALL_BRANCHES_ID, type AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import type { CStatus, Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';

interface AdminCommunicationComplaintsBranchBarProps {
  branches: readonly AdminBranchItem[];
  selectedBranchId: string;
  selectedBranch: AdminBranchItem | null | undefined;
  setSelectedBranchId: (id: string) => void;
  isAllBranches: boolean;
  complaints: Complaint[];
  tab: CStatus | 'All';
  setTab: (tab: CStatus | 'All') => void;
  tabs: (CStatus | 'All')[];
}

export function AdminCommunicationComplaintsBranchBar({
  branches,
  selectedBranchId,
  selectedBranch,
  setSelectedBranchId,
  isAllBranches,
  complaints,
  tab,
  setTab,
  tabs,
}: AdminCommunicationComplaintsBranchBarProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  return (
    <>
      {/* Multi-Branch Complaint Filter Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Building2 size={14} className="text-primary shrink-0" />
            Branch:
          </span>
          <button
            type="button"
            onClick={() => setSelectedBranchId(ALL_BRANCHES_ID)}
            className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isAllBranches
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            All Branches ({complaints.length})
          </button>
          {branches.map((b) => {
            const count = complaints.filter((c) => c.branchName?.toLowerCase().includes(b.name.toLowerCase())).length;
            const isSelected = selectedBranchId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBranchId(b.id)}
                className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {b.name} ({count})
              </button>
            );
          })}
        </div>
        {selectedBranch && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2.5 py-1 text-xs text-text-secondary">
            <span className="font-medium text-text-primary">{selectedBranch.name}</span>
            <span>({selectedBranch.code})</span>
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="gap-1 rounded-lg border border-border bg-input p-1 inline-flex mb-6">
        {tabs.map((status) => (
          <button
            type="button"
            data-testid={`admin_communication-complaints-tab-${String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            key={status}
            onClick={() => setTab(status)}
            aria-pressed={tab === status}
            className={`inline-flex min-h-11 items-center rounded-md px-3 py-2 text-ui font-medium text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary${
              tab === status ? ' bg-card text-text-primary shadow-card' : ''
            }`}
          >
            {status === 'All'
              ? t('FILTER_ALL')
              : status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN
              ? t('COMPLAINT_STATUS_OPEN')
              : status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS
              ? t('COMPLAINT_STATUS_IN_PROGRESS')
              : t('COMPLAINT_STATUS_RESOLVED')}
          </button>
        ))}
      </div>
    </>
  );
}

export default AdminCommunicationComplaintsBranchBar;

