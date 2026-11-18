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
      {/* Branch selector pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedBranchId(ALL_BRANCHES_ID)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            isAllBranches
              ? 'bg-primary text-primary-contrast shadow-sm'
              : 'border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-card-hover'
          }`}
        >
          <Building2 size={13} />
          <span>All Branches</span>
          <span className="rounded-full bg-surface-muted px-1.5 py-0.2 text-[10px] font-bold">
            {totalNotices}
          </span>
        </button>
        {branches.map((b) => {
          const isSelected = selectedBranchId === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBranchId(b.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary text-primary-contrast shadow-sm'
                  : 'border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-card-hover'
              }`}
            >
              <Building2 size={13} />
              <span>{b.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative flex-1 min-w-[240px] max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notices by title, message, target branch, author..."
          aria-label="Search notices"
          className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-text-secondary hover:text-text-primary"
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

