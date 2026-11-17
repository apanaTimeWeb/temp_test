'use client';

import { Building2, Search } from 'lucide-react';
import { ALL_BRANCHES_ID, type AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';

interface AdminCommunicationNoticesBranchBarProps {
  branches: readonly AdminBranchItem[];
  selectedBranchId: string;
  selectedBranch: AdminBranchItem | null | undefined;
  setSelectedBranchId: (id: string) => void;
  isAllBranches: boolean;
  totalNotices: number;
  search: string;
  onSearchChange: (val: string) => void;
}

export function AdminCommunicationNoticesBranchBar({
  branches,
  selectedBranchId,
  selectedBranch,
  setSelectedBranchId,
  isAllBranches,
  totalNotices,
  search,
  onSearchChange,
}: AdminCommunicationNoticesBranchBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notices by title, message, target branch..."
            aria-label="Search notices"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
  );
}

export default AdminCommunicationNoticesBranchBar;

