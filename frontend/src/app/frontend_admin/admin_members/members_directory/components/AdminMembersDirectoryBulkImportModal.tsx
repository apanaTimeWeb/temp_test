'use client';
// RESPONSIBILITY: Bulk CSV import modal for Admin Members Directory.

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { AlertTriangle,Check,CheckCircle2,Download,FileSpreadsheet,FileText,Upload,UserPlus,X } from 'lucide-react';
import { useRef,useState } from 'react';
import { toast } from 'sonner';

interface ParsedImportMember {
  name: string;
  phone: string;
  email: string;
  plan: string;
  shift?: string;
  seat?: string;
  branch?: string;
  isValid: boolean;
  validationError?: string;
}

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

  if (!isOpen) return null;

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
    toast.success('Sample CSV template downloaded successfully');
  };

  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      toast.error('CSV file must contain a header row and at least one data row.');
      return;
    }

    const headerLine = lines[0];
    const headerCols = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

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

      // Handle comma inside quotes
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
      const email = emailIdx >= 0 && values[emailIdx] ? values[emailIdx] : (values[2] || '');
      const shift = shiftIdx >= 0 && values[shiftIdx] ? values[shiftIdx] : 'Full Day';
      const plan = planIdx >= 0 && values[planIdx] ? values[planIdx] : 'Standard Monthly';
      const seat = seatIdx >= 0 && values[seatIdx] ? values[seatIdx] : '';
      const branch = branchIdx >= 0 && values[branchIdx] ? values[branchIdx] : defaultBranch;

      const isValidName = name.length >= 2;
      const isValidPhone = phone.replace(/\D/g, '').length >= 10;
      const isValid = isValidName && isValidPhone;

      rows.push({
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.') || 'student'}@example.com`,
        shift,
        plan,
        seat: seat || undefined,
        branch,
        isValid,
        validationError: !isValidName ? 'Missing student name' : !isValidPhone ? 'Invalid 10-digit phone' : undefined,
      });
    }

    setParsedRows(rows);
    const validCount = rows.filter((r) => r.isValid).length;
    toast.success(`Parsed ${rows.length} records (${validCount} valid ready for import).`);
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
      toast.error('Failed to read file. Please ensure it is a valid CSV format.');
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
      toast.error('Please upload a .csv or .txt file');
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
      toast.error('No valid records found to import. Please check validation warnings.');
      return;
    }

    const membersToCreate = validRows.map((r) => ({
      name: r.name,
      phone: r.phone,
      email: r.email,
      plan: r.plan,
      shift: r.shift,
      seat: r.seat,
      branch: r.branch,
    }));

    onImport(membersToCreate);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Bulk Import Students (CSV / Excel)</h2>
              <p className="text-xs text-slate-400">Upload 50-100+ new student records in seconds with automatic column detection</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-indigo-300">Need the exact CSV format?</span>
              <p className="text-xs text-slate-400">Download our pre-formatted template with standard headers (Name, Phone, Email, Shift, Plan, Seat, Branch).</p>
            </div>
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all shadow-sm shrink-0"
            >
              <Download size={14} className="text-indigo-400" />
              <span>Download Sample CSV</span>
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
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/40 hover:border-indigo-500/40 hover:bg-slate-900/60'
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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                  <FileSpreadsheet size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Click to browse or drag & drop CSV file</p>
                  <p className="text-xs text-slate-400 mt-1">Supports standard CSV exports from Excel, Google Sheets, or previous software</p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
                  <span>Standard UTF-8 CSV</span>
                  <span className="text-slate-500">•</span>
                  <span>Up to 500 rows</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Metrics Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-xs">{fileName || 'Imported File'}</p>
                    <p className="text-[11px] text-slate-400">Total detected: {parsedRows.length} rows</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={13} /> {validCount} Ready to Import
                  </span>
                  {invalidCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                      <AlertTriangle size={13} /> {invalidCount} Issues
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
                      <th className="px-3.5 py-2.5">Student Name</th>
                      <th className="px-3.5 py-2.5">Phone</th>
                      <th className="px-3.5 py-2.5">Email</th>
                      <th className="px-3.5 py-2.5">Plan</th>
                      <th className="px-3.5 py-2.5">Shift</th>
                      <th className="px-3.5 py-2.5">Seat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedRows.map((row, idx) => (
                      <tr key={`import-row-${idx}`} className={`hover:bg-slate-800/40 ${!row.isValid ? 'bg-rose-500/5' : ''}`}>
                        <td className="px-3.5 py-2">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <Check size={13} /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400" title={row.validationError}>
                              <AlertTriangle size={13} /> {row.validationError || 'Invalid'}
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2 font-medium text-white">{row.name || '—'}</td>
                        <td className="px-3.5 py-2 font-mono text-slate-300">{row.phone || '—'}</td>
                        <td className="px-3.5 py-2 font-mono text-slate-400">{row.email || '—'}</td>
                        <td className="px-3.5 py-2 text-indigo-300">{row.plan}</td>
                        <td className="px-3.5 py-2 text-slate-400">{row.shift || 'Full Day'}</td>
                        <td className="px-3.5 py-2 text-teal-300">{row.seat ? `Seat ${row.seat}` : '—'}</td>
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
            {parsedRows.length > 0 && <span>Ready to add <strong className="text-emerald-400">{validCount}</strong> new students to member records</span>}
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
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserPlus size={15} />
              <span>Import {validCount > 0 ? `${validCount} Students` : 'Students'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
