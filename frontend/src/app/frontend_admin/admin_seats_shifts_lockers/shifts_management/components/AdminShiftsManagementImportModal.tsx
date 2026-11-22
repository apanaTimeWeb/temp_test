'use client';
// RESPONSIBILITY: Bulk CSV import modal for Admin Shifts Management.

import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';
import { AlertTriangle,Check,CheckCircle2,Download,FileSpreadsheet,FileText,Plus,Upload,X } from 'lucide-react';
import { useRef,useState } from 'react';
import { toast } from 'sonner';

interface ParsedImportShift {
  name: string;
  startTime: string;
  endTime: string;
  monthlyPrice: number;
  capacity: number;
  branchName: string;
  isValid: boolean;
  validationError?: string;
}

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

  if (!isOpen) return null;

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
    toast.success('Sample shifts CSV template downloaded');
  };

  const parseCsvContent = (content: string) => {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      toast.error('CSV file must have a header row and at least one shift row.');
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
      const isValid = isValidName && isValidTimes;

      rows.push({
        name,
        startTime,
        endTime,
        monthlyPrice,
        capacity,
        branchName: branch || defaultBranchName,
        isValid,
        validationError: !isValidName ? 'Missing shift name' : !isValidTimes ? 'Invalid time format (HH:MM)' : undefined,
      });
    }

    setParsedRows(rows);
    const validCount = rows.filter((r) => r.isValid).length;
    toast.success(`Parsed ${rows.length} shifts (${validCount} valid shifts ready).`);
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
      toast.error('No valid shift rows to import.');
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
    toast.success(`Successfully imported ${createdShifts.length} study shifts!`);
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/70 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Bulk Import Shift Schedules (CSV)</h2>
              <p className="text-xs text-slate-400">Upload multiple shift timings, monthly fees, and desk capacities at once</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-indigo-300">Need the exact CSV layout?</span>
              <p className="text-xs text-slate-400">Columns: Shift Name, Start Time, End Time, Monthly Fee, Desk Capacity, Branch.</p>
            </div>
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all shadow-sm shrink-0"
            >
              <Download size={14} className="text-indigo-400" />
              <span>Download Template</span>
            </button>
          </div>

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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Click or drag & drop Shift CSV file here</p>
                  <p className="text-xs text-slate-400 mt-1">Accepts UTF-8 comma separated (.csv) shift schedules</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-white">{fileName}</span>
                  <span className="text-xs text-slate-400">({parsedRows.length} rows)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 size={13} /> {validCount} Valid
                  </span>
                  <button
                    type="button"
                    onClick={() => setParsedRows([])}
                    className="text-xs text-slate-400 hover:text-white underline ml-2"
                  >
                    Change File
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 font-semibold text-slate-400">
                    <tr>
                      <th className="px-3.5 py-2">Status</th>
                      <th className="px-3.5 py-2">Shift Name</th>
                      <th className="px-3.5 py-2">Timing</th>
                      <th className="px-3.5 py-2">Price</th>
                      <th className="px-3.5 py-2">Capacity</th>
                      <th className="px-3.5 py-2">Branch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {parsedRows.map((r, idx) => (
                      <tr key={idx} className={r.isValid ? '' : 'bg-rose-500/5'}>
                        <td className="px-3.5 py-2">
                          {r.isValid ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Check size={12} /> Valid
                            </span>
                          ) : (
                            <span className="text-rose-400 font-semibold flex items-center gap-1" title={r.validationError}>
                              <AlertTriangle size={12} /> {r.validationError}
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2 font-medium text-white">{r.name}</td>
                        <td className="px-3.5 py-2 font-mono text-slate-300">{r.startTime} → {r.endTime}</td>
                        <td className="px-3.5 py-2 text-emerald-400">₹{r.monthlyPrice}/mo</td>
                        <td className="px-3.5 py-2 text-slate-400">{r.capacity} seats</td>
                        <td className="px-3.5 py-2 text-indigo-300">{r.branchName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 bg-slate-900/90 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={validCount === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={15} />
            <span>Import {validCount > 0 ? `${validCount} Shifts` : 'Shifts'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminShiftsManagementImportModal;
