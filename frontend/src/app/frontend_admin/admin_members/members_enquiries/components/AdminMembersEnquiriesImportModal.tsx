'use client';
// RESPONSIBILITY: Admin CRM leads bulk CSV import modal for Admin Members Enquiries.

import {
  AdminMembersEnquiriesImportPreview,
  type ParsedEnquiryLead,
} from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesImportPreview';
import type { Enquiry, EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { format } from 'date-fns';
import { Download, Target, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export interface AdminMembersEnquiriesImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newLeads: Enquiry[]) => void;
  defaultBranch?: string;
}

export default function AdminMembersEnquiriesImportModal({
  isOpen,
  onClose,
  onImport,
  defaultBranch = 'Main Branch',
}: AdminMembersEnquiriesImportModalProps) {
  const [parsedRows, setParsedRows] = useState<ParsedEnquiryLead[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleTemplate = () => {
    const headers = ['Full Name', 'Phone Number', 'Lead Source', 'Preferred Shift', 'Preferred Branch', 'Notes'];
    const sampleRows = [
      ['Aman Gupta', '9811224455', 'Facebook Ads', 'Full Day (24x7)', defaultBranch, 'Interested in UPSC desk reserved'],
      ['Ritu Sen', '9877665544', 'Google Search', 'Morning (6 AM - 2 PM)', defaultBranch, 'Needs peaceful desk for CA prep'],
      ['Mohit Kumar', '9911002233', 'Walk-in', 'Evening (2 PM - 10 PM)', defaultBranch, 'Visited in person, trial demo given'],
      ['Sneha Rao', '9722334455', 'Instagram Ads', 'Full Day (24x7)', defaultBranch, 'Preparing for NEET, asked for air-conditioned hall'],
      ['Kunal Singhania', '9833445566', 'Website', 'Night Owl', defaultBranch, 'Inquired via landing page contact form'],
    ];

    const csvContent = '\uFEFF' + [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart_library_leads_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Leads CSV template downloaded successfully', { id: 'admin-enquiries-import-template' });
  };

  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      toast.error('CSV file must contain a header row and at least one lead row.', { id: 'admin-enquiries-import-empty' });
      return;
    }

    const headerCols = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    const nameIdx = headerCols.findIndex((h) => h.includes('name'));
    const phoneIdx = headerCols.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('contact'));
    const sourceIdx = headerCols.findIndex((h) => h.includes('source') || h.includes('channel') || h.includes('campaign'));
    const shiftIdx = headerCols.findIndex((h) => h.includes('shift') || h.includes('timing') || h.includes('slot'));
    const branchIdx = headerCols.findIndex((h) => h.includes('branch') || h.includes('hub') || h.includes('location'));
    const notesIdx = headerCols.findIndex((h) => h.includes('note') || h.includes('remark') || h.includes('comment'));

    const rows: ParsedEnquiryLead[] = [];
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
      const source = sourceIdx >= 0 && values[sourceIdx] ? values[sourceIdx] : 'CSV Import';
      const shift = shiftIdx >= 0 && values[shiftIdx] ? values[shiftIdx] : 'Full Day';
      const preferredBranch = branchIdx >= 0 && values[branchIdx] ? values[branchIdx] : defaultBranch;
      const notes = notesIdx >= 0 && values[notesIdx] ? values[notesIdx] : 'Lead imported from campaign CSV';
      const isValidName = name.length >= 2;
      const isValidPhone = phone.replace(/\D/g, '').length >= 10;

      rows.push({
        name,
        phone,
        source,
        shift,
        preferredBranch,
        notes,
        isValid: isValidName && isValidPhone,
        validationError: !isValidName ? 'Missing lead name' : !isValidPhone ? 'Invalid phone (min 10 digits)' : undefined,
      });
    }

    setParsedRows(rows);
    const parsedValidCount = rows.filter((r) => r.isValid).length;
    toast.success(`Parsed ${rows.length} leads (${parsedValidCount} valid leads ready).`, { id: 'admin-enquiries-import-parsed' });
  };

  const readFile = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      parseCsvContent(String(event.target?.result ?? ''));
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error('Failed to read file.', { id: 'admin-enquiries-import-read-error' });
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a .csv file', { id: 'admin-enquiries-import-bad-type' });
      return;
    }
    readFile(file);
  };

  const handleImportSubmit = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid lead rows found.', { id: 'admin-enquiries-import-no-valid' });
      return;
    }
    const timestamp = Date.now();
    const createdEnquiries: Enquiry[] = validRows.map((r, idx) => ({
      id: `ENQ-IMP-${timestamp}-${idx + 1}`,
      name: r.name,
      phone: r.phone,
      shift: r.shift,
      status: 'New' as EnquiryStatus,
      addedDate: format(new Date(), 'yyyy-MM-dd'),
      source: r.source || 'Facebook Ads',
      notes: r.notes || 'Imported via CSV',
      handledBy: 'Admin Operations',
      preferredBranch: r.preferredBranch || defaultBranch,
      avatar: r.name.trim().slice(0, 2).toUpperCase() || 'EN',
      followUps: [],
    }));
    onImport(createdEnquiries);
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-overlay shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-warning bg-warning-bg text-warning-text">
              <Upload size={20} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Import Leads & Enquiries (CSV)
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Import campaigns from Facebook Ads, Google Ads, Walk-in registers, or Websites
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors" title="Close modal" aria-label="Close import modal">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-warning bg-warning-bg p-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-warning-text">Supported Lead Sources</span>
              <p className="text-xs text-text-primary">Facebook Ads, Instagram Ads, Google Search, Walk-in, Website, or JustDial.</p>
            </div>
            <button type="button" onClick={downloadSampleTemplate} className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-warning bg-card px-3.5 py-1.5 text-xs font-semibold text-warning-text hover:bg-surface-hover motion-safe:transition-colors shadow-card shrink-0">
              <Download size={14} aria-hidden="true" />
              <span>Download Leads CSV Template</span>
            </button>
          </div>

          {parsedRows.length === 0 ? (
            <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full rounded-2xl border-2 border-dashed p-8 text-center motion-safe:transition-colors ${
                  isDragging ? 'border-warning bg-warning-bg' : 'border-border bg-surface-highlight hover:border-border-focus hover:bg-surface-hover'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-warning bg-warning-bg text-warning-text">
                    <Target size={28} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Click or drag & drop Leads CSV file here</p>
                    <p className="text-xs text-text-secondary mt-1">Accepts CSV files with student prospect names, mobile numbers, and lead channel</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-text-secondary">
                    <span>UTF-8 Comma-Separated (.csv)</span>
                    <span>•</span>
                    <span>Instant CRM Pipeline Ingestion</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <AdminMembersEnquiriesImportPreview
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
            {parsedRows.length > 0 && <span>Ready to inject <strong className="text-warning-text">{validCount}</strong> leads into the enquiry pipeline</span>}
          </div>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleImportSubmit} disabled={validCount === 0 || isProcessing} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Target size={15} aria-hidden="true" />
              <span>Import {validCount > 0 ? `${validCount} Leads` : 'Leads'}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
