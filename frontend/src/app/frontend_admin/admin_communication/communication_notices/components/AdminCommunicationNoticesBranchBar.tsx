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
    <>
      {/* Multi-Branch Notice Filter Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Building2 size={14} className="text-primary shrink-0" />
            Branch Filter:
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
            All Notices ({totalNotices})
          </button>
          {branches.map((b) => {
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
                {b.name}
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
    </>
  );
}

export default AdminCommunicationNoticesBranchBar;

