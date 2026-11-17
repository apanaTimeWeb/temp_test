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

