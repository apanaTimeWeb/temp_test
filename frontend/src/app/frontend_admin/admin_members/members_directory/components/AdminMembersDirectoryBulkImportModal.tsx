'use client';
// RESPONSIBILITY: Bulk CSV import modal for Admin Members Directory.

import {
  AdminMembersDirectoryBulkImportPreview,
  type ParsedImportMember,
} from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryBulkImportPreview';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Download, FileSpreadsheet, Upload, UserPlus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export interface AdminMembersDirectoryBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newMembers: Array<Omit<AdminMembersMember, 'id' | 'status' | 'feeStatus' | 'expiryDate'>>) => void;
  defaultBranch?: string;
}

export default function AdminMembersDirectoryBulkImportModal({
  isOpen,
  onClose,
  onImport,
  defaultBranch = 'Main Branch',
}: AdminMembersDirectoryBulkImportModalProps) {
  const [parsedRows, setParsedRows] = useState<ParsedImportMember[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleTemplate = () => {
    const headers = ['Full Name', 'Mobile Number', 'Email Address', 'Shift', 'Plan Type', 'Seat Number', 'Branch'];
    const sampleRows = [
      ['Aditya Sharma', '9876543210', 'aditya.sharma@example.com', 'Morning (6 AM - 2 PM)', 'Standard Monthly', 'A-12', defaultBranch],
      ['Priya Verma', '9123456780', 'priya.verma@example.com', 'Full Day (24x7)', 'Premium Dedicated', 'B-05', defaultBranch],
      ['Rahul Singh', '9811223344', 'rahul.singh@example.com', 'Evening (2 PM - 10 PM)', 'Standard Monthly', 'C-18', defaultBranch],
      ['Ananya Patel', '9988776655', 'ananya.patel@example.com', 'Morning (6 AM - 2 PM)', 'Quarterly Pro', 'A-22', defaultBranch],
      ['Vikram Malhotra', '9712341234', 'vikram.m@example.com', 'Night (10 PM - 6 AM)', 'Night Owl Plan', 'D-04', defaultBranch],
    ];
    const csvContent = '\uFEFF' + [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart_library_members_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Sample CSV template downloaded successfully', { id: 'admin-members-import-template' });
  };

  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      toast.error('CSV file must contain a header row and at least one data row.', { id: 'admin-members-import-empty' });
      return;
    }

    const headerCols = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    const nameIdx = headerCols.findIndex((h) => h.includes('name'));
    const phoneIdx = headerCols.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('contact'));
    const emailIdx = headerCols.findIndex((h) => h.includes('email') || h.includes('mail'));
    const shiftIdx = headerCols.findIndex((h) => h.includes('shift') || h.includes('timing') || h.includes('slot'));
    const planIdx = headerCols.findIndex((h) => h.includes('plan') || h.includes('package') || h.includes('tier'));
    const seatIdx = headerCols.findIndex((h) => h.includes('seat') || h.includes('desk'));
    const branchIdx = headerCols.findIndex((h) => h.includes('branch') || h.includes('hub') || h.includes('center'));

    const rows: ParsedImportMember[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values: string[] = [];
      let currentVal = '';
      let inQuotes = false;
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { values.push(currentVal.trim().replace(/^["']|["']$/g, '')); currentVal = ''; }
        else currentVal += char;
      }
      values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

      const name = nameIdx >= 0 && values[nameIdx] ? values[nameIdx] : (values[0] || '');
      const phone = phoneIdx >= 0 && values[phoneIdx] ? values[phoneIdx] : (values[1] || '');
      const email = emailIdx >= 0 && values[emailIdx] ? values[emailIdx] : (values[2] || '');
      const shift = shiftIdx >= 0 && values[shiftIdx] ? values[shiftIdx] : 'Full Day';
      const plan = planIdx >= 0 && values[planIdx] ? values[planIdx] : 'Standard Monthly';
      const seat = seatIdx >= 0 && values[seatIdx] ? values[seatIdx] : '';
      const branch = branchIdx >= 0 && values[branchIdx] ? values[branchIdx] : defaultBranch;
      const isValidName = name.length >= 2;
      const isValidPhone = phone.replace(/\D/g, '').length >= 10;

      rows.push({
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.') || 'student'}@example.com`,
        shift,
        plan,
        seat: seat || undefined,
        branch,
        isValid: isValidName && isValidPhone,
        validationError: !isValidName ? 'Missing student name' : !isValidPhone ? 'Invalid 10-digit phone' : undefined,
      });
    }

    setParsedRows(rows);
    const parsedValidCount = rows.filter((r) => r.isValid).length;
    toast.success(`Parsed ${rows.length} records (${parsedValidCount} valid ready for import).`, { id: 'admin-members-import-parsed' });
  };

  const readFile = (file: File, readErrMsg: string) => {
    setFileName(file.name);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      parseCsvContent(String(event.target?.result ?? ''));
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error(readErrMsg, { id: 'admin-members-import-read-error' });
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file, 'Failed to read file. Please ensure it is a valid CSV format.');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a .csv or .txt file', { id: 'admin-members-import-bad-type' });
      return;
    }
    readFile(file, 'Failed to read file.');
  };

  const handleImportSubmit = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid records found to import. Please check validation warnings.', { id: 'admin-members-import-no-valid' });
      return;
    }
    onImport(validRows.map((r) => ({ name: r.name, phone: r.phone, email: r.email, plan: r.plan, shift: r.shift, seat: r.seat, branch: r.branch })));
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-focus bg-primary-subtle text-primary">
              <Upload size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">Bulk Import Students (CSV / Excel)</DialogTitle>
              <p className="text-xs text-text-secondary">Upload 50-100+ new student records in seconds with automatic column detection</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors" title="Close modal" aria-label="Close bulk import modal">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border-focus bg-primary-subtle p-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-primary">Need the exact CSV format?</span>
              <p className="text-xs text-text-secondary">Download our pre-formatted template with standard headers (Name, Phone, Email, Shift, Plan, Seat, Branch).</p>
            </div>
            <button type="button" onClick={downloadSampleTemplate} className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-border-focus bg-card px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card shrink-0">
              <Download size={14} aria-hidden="true" /> <span>Download Sample CSV</span>
            </button>
          </div>

          {parsedRows.length === 0 ? (
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full rounded-2xl border-2 border-dashed p-8 text-center motion-safe:transition-colors ${
                  isDragging ? 'border-primary bg-primary-subtle' : 'border-border bg-surface-highlight hover:border-border-focus hover:bg-surface-hover'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-focus bg-primary-subtle text-primary">
                    <FileSpreadsheet size={28} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Click to browse or drag & drop CSV file</p>
                    <p className="text-xs text-text-secondary mt-1">Supports standard CSV exports from Excel, Google Sheets, or previous software</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-text-secondary">
                    <span>Standard UTF-8 CSV</span>
                    <span>•</span>
                    <span>Up to 500 rows</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <AdminMembersDirectoryBulkImportPreview
              fileName={fileName}
              parsedRows={parsedRows}
              validCount={validCount}
              invalidCount={invalidCount}
              onReset={() => { setParsedRows([]); setFileName(null); }}
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
          <div className="text-xs text-text-secondary">
            {parsedRows.length > 0 && <span>Ready to add <strong className="text-success-text">{validCount}</strong> new students to member records</span>}
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors">Cancel</button>
            <button type="button" onClick={handleImportSubmit} disabled={validCount === 0 || isProcessing} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <UserPlus size={15} aria-hidden="true" />
              <span>Import {validCount > 0 ? `${validCount} Students` : 'Students'}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
