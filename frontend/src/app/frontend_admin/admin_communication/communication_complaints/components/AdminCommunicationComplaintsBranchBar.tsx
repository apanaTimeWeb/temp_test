'use client';

import { ADMIN_COMMUNICATION_COMPLAINT_STATUS } from '@/app/frontend_admin/admin_communication/communication_complaints/config/admin_communication_complaints.url_config';
import type { CStatus,Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import type { AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import { AlertCircle,CheckCircle2,FileSpreadsheet,MessageSquare,Printer,RefreshCw,Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface AdminCommunicationComplaintsBranchBarProps {
  branches?: readonly AdminBranchItem[];
  selectedBranchId?: string;
  selectedBranch?: AdminBranchItem | null;
  setSelectedBranchId?: (id: string) => void;
  isAllBranches: boolean;
  complaints: Complaint[];
  tab: CStatus | 'All';
  setTab: (tab: CStatus | 'All') => void;
  tabs: (CStatus | 'All')[];
  search: string;
  onSearchChange: (val: string) => void;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  onPrint?: () => void;
}

export function AdminCommunicationComplaintsBranchBar({
  selectedBranch,
  isAllBranches,
  complaints,
  tab,
  setTab,
  tabs,
  search,
  onSearchChange,
  onExportCsv,
  onExportExcel,
  onPrint,
}: AdminCommunicationComplaintsBranchBarProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
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

        {/* Search Bar & Export / Print Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input maxLength={100}
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student, seat/room, ticket ID, title..."
              aria-label="Search complaints"
              className="w-full pl-9 pr-7 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[38px]"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Clear complaint search"
              >
                ✕
              </button>
            )}
          </div>

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors shadow-xs"
              title="Print Complaints Summary Report"
            >
              <Printer size={14} className="text-slate-400" />
              <span>Print</span>
            </button>
          )}

          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors shadow-xs"
              title="Export Complaints to CSV"
            >
              <FileSpreadsheet size={14} className="text-emerald-500" />
              <span>CSV</span>
            </button>
          )}

          {onExportExcel && (
            <button
              type="button"
              onClick={onExportExcel}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors shadow-xs"
              title="Export Complaints to Formatted Excel (.xls)"
            >
              <FileSpreadsheet size={14} className="text-sky-500" />
              <span>Excel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCommunicationComplaintsBranchBar;
