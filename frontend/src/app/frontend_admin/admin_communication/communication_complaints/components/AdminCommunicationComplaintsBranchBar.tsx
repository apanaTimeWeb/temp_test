'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, MessageSquare, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
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

  // Compute branch grievance counts
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_BRANCHES_ID]: complaints.length };
    for (const b of branches) {
      counts[b.id] = complaints.filter(
        (c) => c.branchName && c.branchName.toLowerCase().includes(b.name.toLowerCase())
      ).length;
    }
    return counts;
  }, [branches, complaints]);

  // Compute status counts for currently filtered branch
  const branchFilteredComplaints = useMemo(() => {
    if (isAllBranches || !selectedBranch) return complaints;
    return complaints.filter((c) => {
      if (!c.branchName) return true;
      return c.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase());
    });
  }, [isAllBranches, selectedBranch, complaints]);

  const statusCounts = useMemo(() => ({
    All: branchFilteredComplaints.length,
    Open: branchFilteredComplaints.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN).length,
    InProgress: branchFilteredComplaints.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS).length,
    Resolved: branchFilteredComplaints.filter((c) => c.status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED).length,
  }), [branchFilteredComplaints]);

  return (
    <div className="space-y-3 mb-6">
      {/* Branch Quick Selector Bar */}
      {branches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-card rounded-xl border border-border shadow-xs">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>Branch:</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedBranchId(ALL_BRANCHES_ID)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium motion-safe:transition-all ${
              isAllBranches
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'bg-surface hover:bg-card-hover text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>All Branches</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isAllBranches
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {branchCounts[ALL_BRANCHES_ID] ?? complaints.length}
            </span>
          </button>
          {branches.map((b) => {
            const isSelected = !isAllBranches && selectedBranchId === b.id;
            const count = branchCounts[b.id] ?? 0;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBranchId(b.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium motion-safe:transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'bg-surface hover:bg-card-hover text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{b.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter Tabs with count badges and indicators */}
      <div className="gap-1.5 rounded-xl border border-border bg-card p-1.5 inline-flex flex-wrap shadow-xs">
        {tabs.map((status) => {
          const isSelected = tab === status;
          let label = t('FILTER_ALL');
          let count = statusCounts.All;
          let Icon = MessageSquare;
          let badgeColor = 'bg-muted text-muted-foreground';

          if (status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.OPEN) {
            label = t('COMPLAINT_STATUS_OPEN');
            count = statusCounts.Open;
            Icon = AlertCircle;
            badgeColor = 'bg-rose-500/20 text-rose-400';
          } else if (status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.IN_PROGRESS) {
            label = t('COMPLAINT_STATUS_IN_PROGRESS');
            count = statusCounts.InProgress;
            Icon = RefreshCw;
            badgeColor = 'bg-amber-500/20 text-amber-400';
          } else if (status === ADMIN_COMMUNICATION_COMPLAINT_STATUS.RESOLVED) {
            label = t('COMPLAINT_STATUS_RESOLVED');
            count = statusCounts.Resolved;
            Icon = CheckCircle2;
            badgeColor = 'bg-emerald-500/20 text-emerald-400';
          }

          return (
            <button
              type="button"
              data-testid={`admin_communication-complaints-tab-${String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              key={status}
              onClick={() => setTab(status)}
              aria-pressed={isSelected}
              className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
              }`}
            >
              <Icon size={13} className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'} />
              <span>{label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : badgeColor
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AdminCommunicationComplaintsBranchBar;
