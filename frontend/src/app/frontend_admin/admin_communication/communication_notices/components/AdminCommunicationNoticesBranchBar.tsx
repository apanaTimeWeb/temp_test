'use client';

import { Search } from 'lucide-react';
import type { AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';

interface AdminCommunicationNoticesBranchBarProps {
  branches?: readonly AdminBranchItem[];
  selectedBranchId?: string;
  selectedBranch?: AdminBranchItem | null | undefined;
  setSelectedBranchId?: (id: string) => void;
  isAllBranches?: boolean;
  totalNotices?: number;
  search: string;
  onSearchChange: (val: string) => void;
}

export function AdminCommunicationNoticesBranchBar({
  search,
  onSearchChange,
}: AdminCommunicationNoticesBranchBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      {/* Search Input Bar (Branch filtering is governed solely via the global Admin Shell Header) */}
      <div className="relative flex-1 min-w-[260px] max-w-lg">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notices by title, message, target branch, author..."
          aria-label="Search notices"
          className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Clear notice search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminCommunicationNoticesBranchBar;
