'use client';

import { Download, FileSpreadsheet, Layers, LayoutGrid, List, Printer, Armchair } from 'lucide-react';

interface AdminSeatsMatrixHeaderProps {
  activeBranchFilter: string;
  viewMode: 'grid' | 'table';
  onSetViewMode: (mode: 'grid' | 'table') => void;
  onOpenBulkGenerate: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrintRoster: () => void;
}

export function AdminSeatsMatrixHeader({
  activeBranchFilter,
  viewMode,
  onSetViewMode,
  onOpenBulkGenerate,
  onExportCsv,
  onExportExcel,
  onPrintRoster,
}: AdminSeatsMatrixHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <Armchair size={24} className="text-primary" aria-hidden="true" />
            {activeBranchFilter === 'All Branches' ? 'Smart Library Network · Seat Matrix' : `${activeBranchFilter} · Floor Plan & Seat Matrix`}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Visual desk layout, 4-shift real-time occupancy (Morning, Afternoon, Evening, Night), and student allocations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-xl border border-border bg-surface-highlight p-1">
            <button
              type="button"
              onClick={() => onSetViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold motion-safe:transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LayoutGrid size={14} aria-hidden="true" />
              <span>Floor Plan</span>
            </button>
            <button
              type="button"
              onClick={() => onSetViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold motion-safe:transition-colors ${
                viewMode === 'table' ? 'bg-primary text-on-primary shadow-card' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <List size={14} aria-hidden="true" />
              <span>Table View</span>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors cursor-pointer"
            onClick={onOpenBulkGenerate}
            title="Bulk Generate consecutive desks for new hall/branch"
          >
            <Layers size={14} aria-hidden="true" />
            <span>Bulk Generate Seats</span>
          </button>

          <button
            type="button"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3.5 py-1.5 text-xs font-medium text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
            onClick={onExportCsv}
            title="Export Seat Matrix to CSV"
          >
            <Download size={14} strokeWidth={2} aria-hidden="true" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3.5 py-1.5 text-xs font-medium text-success-text hover:opacity-90 motion-safe:transition-opacity shadow-card"
            onClick={onExportExcel}
            title="Export Formatted Seat Matrix to Excel (.xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} aria-hidden="true" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
            onClick={onPrintRoster}
            title="Print Floor Plan & Seat Matrix Roster"
          >
            <Printer size={14} strokeWidth={2} aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
