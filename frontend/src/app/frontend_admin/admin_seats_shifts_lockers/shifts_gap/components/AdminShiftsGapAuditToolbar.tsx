'use client';

import { useTranslations } from 'next-intl';
import { Search, Building2, Filter } from 'lucide-react';

interface AdminShiftsGapAuditToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  branchFilter: string;
  onBranchFilterChange: (b: string) => void;
  branches: string[];
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
}

export function AdminShiftsGapAuditToolbar({
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchFilterChange,
  branches,
  statusFilter,
  onStatusFilterChange,
}: AdminShiftsGapAuditToolbarProps) {
  const t = useTranslations('ADMIN_SHIFTS');

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
        <input
          type="text"
          placeholder="Search student, smart ID, seat, branch..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-h-10 w-full rounded-md border border-border bg-input pl-9 pr-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-text-secondary" />
        <select
          aria-label={t('tableBranchSeat')}
          value={branchFilter}
          onChange={(e) => onBranchFilterChange(e.target.value)}
          className="min-h-10 rounded-md border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="ALL">{t('filterAllBranches')}</option>
          {branches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-text-secondary" />
        <select
          aria-label={t('tableStatus')}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="min-h-10 rounded-md border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="ALL">All Audit Statuses</option>
          <option value="RECOVERED">{t('statusRecovered')}</option>
          <option value="PENDING_CLEARANCE">{t('statusPendingClearance')}</option>
          <option value="WAIVED">{t('statusWaived')}</option>
        </select>
      </div>
    </div>
  );
}

export default AdminShiftsGapAuditToolbar;

