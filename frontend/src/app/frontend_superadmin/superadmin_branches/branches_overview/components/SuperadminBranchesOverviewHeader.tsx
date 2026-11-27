'use client';
// RESPONSIBILITY: Render hero header with primary Create Branch CTA and export actions.
import { GitBranch, Plus, ShieldCheck, Download, FileSpreadsheet, Printer, Armchair } from 'lucide-react';

interface SuperadminBranchesOverviewHeaderProps {
  onCreateBranch: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export default function SuperadminBranchesOverviewHeader({
  onCreateBranch,
  onExportCsv,
  onExportExcel,
  onPrint,
}: SuperadminBranchesOverviewHeaderProps) {
  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success border border-success-border">
              <span className="w-1.5 h-1.5 rounded-full bg-success motion-safe:animate-pulse" />
              Multi-Branch Architecture
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-subtle text-primary border border-border">
              <Armchair size={11} className="text-primary" />
              Multi-Branch Infrastructure • Study Hall Operations
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-info-bg text-info border border-info-border">
              <ShieldCheck size={11} /> SuperAdmin Control
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <GitBranch className="text-primary shrink-0" size={28} />
              <span>Branch Management — Complete Control</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-secondary w-full leading-relaxed">
            Centralized branch lifecycle across all Library Accounts. Create branches, update entitlements, transfer managers, execute safe closures with pre-flight checks, and monitor branch-level audit logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={onExportCsv}
              className="p-2.5 rounded-xl border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              title="Export to CSV"
            >
              <Download size={15} />
            </button>
            <button
              type="button"
              onClick={onExportExcel}
              className="p-2.5 rounded-xl border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              title="Export to Excel (.xls)"
            >
              <FileSpreadsheet size={15} />
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="p-2.5 rounded-xl border border-border bg-surface text-secondary hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              title="Print Branch Directory"
            >
              <Printer size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateBranch}
            id="superadmin-create-branch-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs sm:text-sm font-bold shadow-sm motion-safe:transition-all motion-safe:hover:scale-[1.02] motion-safe:active:scale-95 cursor-pointer"
          >
            <Plus size={16} className="text-on-primary" />
            <span>Create New Branch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
