'use client';
// RESPONSIBILITY: Bulk CSV import modal for Admin Shifts Management.

import {
  AdminShiftsManagementImportPreview,
  type ParsedImportShift,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/components/AdminShiftsManagementImportPreview';
import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Download, FileSpreadsheet, Plus, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export interface AdminShiftsManagementImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportShifts: (newShifts: AdminShiftsShift[]) => void;
  defaultBranchName?: string;
}

export function AdminShiftsManagementImportModal({
  isOpen,
  onClose,
  onImportShifts,
  defaultBranchName = 'All Branches',
}: AdminShiftsManagementImportModalProps) {
  const [parsedRows, setParsedRows] = useState<ParsedImportShift[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleTemplate = () => {
    const headers = ['Shift Name', 'Start Time (HH:MM)', 'End Time (HH:MM)', 'Monthly Fee (INR)', 'Desk Capacity', 'Branch'];
    const sampleRows = [
      ['Early Bird Morning', '06:00', '12:00', '800', '24', defaultBranchName],
      ['Afternoon Prime', '12:00', '17:00', '700', '24', defaultBranchName],
      ['Evening Rush', '17:00', '22:00', '900', '24', defaultBranchName],
      ['Night Owl Special', '22:00', '06:00', '1100', '24', defaultBranchName],
      ['Full Day Dedicated 24x7', '00:00', '23:59', '2000', '24', 'All Branches'],
    ];

    const csvContent = '\uFEFF' + [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart_library_shifts_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Sample shifts CSV template downloaded', { id: 'admin-shifts-import-template' });
  };

  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      toast.error('CSV file must have a header row and at least one shift row.', { id: 'admin-shifts-import-empty' });
      return;
    }

    const header = lines[0].toLowerCase();
    const cols = header.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
    const nameIdx = cols.findIndex((c) => c.includes('name') || c.includes('title') || c.includes('shift'));
    const startIdx = cols.findIndex((c) => c.includes('start') || c.includes('from'));
    const endIdx = cols.findIndex((c) => c.includes('end') || c.includes('to'));
    const priceIdx = cols.findIndex((c) => c.includes('price') || c.includes('fee') || c.includes('cost') || c.includes('rent'));
    const capIdx = cols.findIndex((c) => c.includes('capacity') || c.includes('desk') || c.includes('seats'));
    const branchIdx = cols.findIndex((c) => c.includes('branch') || c.includes('hub'));

    const rows: ParsedImportShift[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values: string[] = [];
      let currentVal = '';
      let inQuotes = false;
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
          currentVal = '';
        } else currentVal += char;
      }
      values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

      const name = nameIdx >= 0 && values[nameIdx] ? values[nameIdx] : (values[0] || '');
      const startTime = startIdx >= 0 && values[startIdx] ? values[startIdx] : '06:00';
      const endTime = endIdx >= 0 && values[endIdx] ? values[endIdx] : '14:00';
      const priceStr = priceIdx >= 0 && values[priceIdx] ? values[priceIdx] : '700';
      const capStr = capIdx >= 0 && values[capIdx] ? values[capIdx] : '24';
      const branch = branchIdx >= 0 && values[branchIdx] ? values[branchIdx] : defaultBranchName;
      const monthlyPrice = parseInt(priceStr.replace(/\D/g, '') || '700', 10);
      const capacity = parseInt(capStr.replace(/\D/g, '') || '24', 10);
      const isValidName = name.trim().length >= 2;
      const isValidTimes = /^\d{1,2}:\d{2}/.test(startTime) && /^\d{1,2}:\d{2}/.test(endTime);

      rows.push({
        name,
        startTime,
        endTime,
        monthlyPrice,
        capacity,
        branchName: branch || defaultBranchName,
        isValid: isValidName && isValidTimes,
        validationError: !isValidName ? 'Missing shift name' : !isValidTimes ? 'Invalid time format (HH:MM)' : undefined,
      });
    }

    setParsedRows(rows);
    const validCount = rows.filter((r) => r.isValid).length;
    toast.success(`Parsed ${rows.length} shifts (${validCount} valid shifts ready).`, { id: 'admin-shifts-import-parsed' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => parseCsvContent(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => parseCsvContent(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid shift rows to import.', { id: 'admin-shifts-import-none' });
      return;
    }

    const createdShifts: AdminShiftsShift[] = validRows.map((r, idx) => ({
      id: `shift-imp-${Date.now()}-${idx + 1}`,
      name: r.name,
      startTime: r.startTime,
      endTime: r.endTime,
      monthlyPrice: r.monthlyPrice,
      capacity: r.capacity,
      occupancy: 0,
      active: true,
      branchName: r.branchName,
    }));

    onImportShifts(createdShifts);
    toast.success(`Successfully imported ${createdShifts.length} study shifts!`, { id: 'admin-shifts-import-success' });
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
              <Upload size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Bulk Import Shift Schedules (CSV)
              </DialogTitle>
              <p className="text-xs text-text-secondary">Upload multiple shift timings, monthly fees, and desk capacities at once</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border-focus bg-primary-subtle p-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-primary">Need the exact CSV layout?</span>
              <p className="text-xs text-text-secondary">Columns: Shift Name, Start Time, End Time, Monthly Fee, Desk Capacity, Branch.</p>
            </div>
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-border-focus bg-card px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card shrink-0"
            >
              <Download size={14} aria-hidden="true" />
              <span>Download Template</span>
            </button>
          </div>

          {parsedRows.length === 0 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed p-8 text-center motion-safe:transition-colors ${
                isDragging ? 'border-border-focus bg-primary-subtle' : 'border-border bg-surface-highlight hover:border-border-focus'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center space-y-3 cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
                  <FileSpreadsheet size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Click or drag &amp; drop Shift CSV file here</p>
                  <p className="text-xs text-text-secondary mt-1">Accepts UTF-8 comma separated (.csv) shift schedules</p>
                </div>
              </button>
            </div>
          ) : (
            <AdminShiftsManagementImportPreview
              fileName={fileName}
              parsedRows={parsedRows}
              validCount={validCount}
              onReset={() => setParsedRows([])}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-border bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={validCount === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Import {validCount > 0 ? `${validCount} Shifts` : 'Shifts'}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminShiftsManagementImportModal;
