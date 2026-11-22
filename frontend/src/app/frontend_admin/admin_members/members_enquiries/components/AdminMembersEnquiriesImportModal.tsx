'use client';
// RESPONSIBILITY: Admin CRM leads bulk CSV import modal for Admin Members Enquiries.

import type { Enquiry,EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { AlertTriangle,Check,CheckCircle2,Download,FileText,Target,Upload,X } from 'lucide-react';
import { useRef,useState } from 'react';
import { toast } from 'sonner';

interface ParsedEnquiryLead {
  name: string;
  phone: string;
  source: string;
  shift: string;
  preferredBranch?: string;
  notes?: string;
  isValid: boolean;
  validationError?: string;
}

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

  if (!isOpen) return null;

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
    toast.success('Leads CSV template downloaded successfully');
  };

  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      toast.error('CSV file must contain a header row and at least one lead row.');
      return;
    }

    const headerLine = lines[0];
    const headerCols = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

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
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
          currentVal = '';
        } else {
          currentVal += char;
        }
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
      const isValid = isValidName && isValidPhone;

      rows.push({
        name,
        phone,
        source,
        shift,
        preferredBranch,
        notes,
        isValid,
        validationError: !isValidName ? 'Missing lead name' : !isValidPhone ? 'Invalid phone (min 10 digits)' : undefined,
      });
    }

    setParsedRows(rows);
    const validCount = rows.filter((r) => r.isValid).length;
    toast.success(`Parsed ${rows.length} leads (${validCount} valid leads ready).`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvContent(text);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error('Failed to read file.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a .csv file');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsvContent(text);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      toast.error('Failed to read file.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid lead rows found.');
      return;
    }

    const timestamp = Date.now();
    const createdEnquiries: Enquiry[] = validRows.map((r, idx) => ({
      id: `ENQ-IMP-${timestamp}-${idx + 1}`,
      name: r.name,
      phone: r.phone,
      shift: r.shift,
      status: 'New' as EnquiryStatus,
      addedDate: new Date().toISOString(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/60 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Import Leads & Enquiries (CSV)</h2>
              <p className="text-xs text-slate-400">Import campaigns from Facebook Ads, Google Ads, Walk-in registers, or Websites</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Instructions & Sample Template Card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-amber-300">Supported Lead Sources</span>
              <p className="text-xs text-slate-400">Facebook Ads, Instagram Ads, Google Search, Walk-in, Website, or JustDial.</p>
            </div>
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-all shadow-sm shrink-0"
            >
              <Download size={14} className="text-amber-400" />
              <span>Download Leads CSV Template</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {parsedRows.length === 0 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-950/40 hover:border-amber-500/40 hover:bg-slate-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Target size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Click or drag & drop Leads CSV file here</p>
                  <p className="text-xs text-slate-400 mt-1">Accepts CSV files with student prospect names, mobile numbers, and lead channel</p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
                  <span>UTF-8 Comma-Separated (.csv)</span>
                  <span className="text-slate-500">•</span>
                  <span>Instant CRM Pipeline Ingestion</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Metrics Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-xs">{fileName || 'Leads File'}</p>
                    <p className="text-[11px] text-slate-400">Total detected: {parsedRows.length} prospects</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={13} /> {validCount} Valid Leads
                  </span>
                  {invalidCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                      <AlertTriangle size={13} /> {invalidCount} Invalid Rows
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setParsedRows([]);
                      setFileName(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white underline underline-offset-2 ml-2"
                  >
                    Change File
                  </button>
                </div>
              </div>

              {/* Preview Table */}
              <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/30 max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 font-semibold text-slate-400 z-10">
                    <tr>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5">Prospect Name</th>
                      <th className="px-3.5 py-2.5">Phone Number</th>
                      <th className="px-3.5 py-2.5">Lead Source</th>
                      <th className="px-3.5 py-2.5">Preferred Shift</th>
                      <th className="px-3.5 py-2.5">Branch</th>
                      <th className="px-3.5 py-2.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedRows.map((row, idx) => (
                      <tr key={`enq-import-row-${idx}`} className={`hover:bg-slate-800/40 ${!row.isValid ? 'bg-rose-500/5' : ''}`}>
                        <td className="px-3.5 py-2">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <Check size={13} /> Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400" title={row.validationError}>
                              <AlertTriangle size={13} /> {row.validationError}
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2 font-medium text-white">{row.name || '—'}</td>
                        <td className="px-3.5 py-2 font-mono text-slate-300">{row.phone || '—'}</td>
                        <td className="px-3.5 py-2">
                          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                            {row.source}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 text-indigo-300">{row.shift}</td>
                        <td className="px-3.5 py-2 text-slate-400">{row.preferredBranch}</td>
                        <td className="px-3.5 py-2 text-slate-400 truncate max-w-xs">{row.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-900/90 px-6 py-4">
          <div className="text-xs text-slate-400">
            {parsedRows.length > 0 && <span>Ready to inject <strong className="text-amber-400">{validCount}</strong> leads into the enquiry pipeline</span>}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImportSubmit}
              disabled={validCount === 0 || isProcessing}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Target size={15} />
              <span>Import {validCount > 0 ? `${validCount} Leads` : 'Leads'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
