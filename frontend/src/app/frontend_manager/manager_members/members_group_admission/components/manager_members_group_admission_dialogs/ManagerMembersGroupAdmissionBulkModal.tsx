'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheet, X, Upload, CheckCircle2, Users } from 'lucide-react';
import type { RecentGroupAdmission } from '../manager_members_group_admission_tables/ManagerMembersGroupAdmissionRecentGroupsTable';

interface GroupStudentEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: string;
  shift: string;
}

interface ManagerMembersGroupAdmissionBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentGroupsCount: number;
  onConfirmBatch: (newBatch: RecentGroupAdmission) => void;
}

export function ManagerMembersGroupAdmissionBulkModal({
  isOpen,
  onClose,
  recentGroupsCount,
  onConfirmBatch,
}: ManagerMembersGroupAdmissionBulkModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<GroupStudentEntry[]>([]);
  const [batchName, setBatchName] = useState('');

  if (!isOpen) return null;

  const handleCsvFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Only .csv files are supported. Please select a valid CSV file.');
      event.target.value = '';
      return;
    }

    setUploadedFile(file);
    if (!batchName) setBatchName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').slice(0, 80));

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const rows: GroupStudentEntry[] = [];
      const startIndex = lines[0]?.toLowerCase().includes('name') ? 1 : 0;
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i]?.split(',').map((p) => p.trim());
        if (parts && parts[0]) {
          const cleanPhone = (parts[1] || '').replace(/\D/g, '').slice(0, 10);
          rows.push({
            id: String(i),
            name: parts[0].slice(0, 50),
            phone: cleanPhone,
            email: (parts[2] || '').slice(0, 80),
            plan: parts[3] || 'Pro Monthly',
            shift: parts[4] || 'Morning',
          });
        }
      }
      setParsedRows(rows);
    };
    reader.readAsText(file);
  };

  const confirmBulkUpload = () => {
    if (parsedRows.length === 0) {
      toast.error('Please select a valid CSV file with student records.');
      return;
    }

    const invalidNameRows = parsedRows.filter((r) => !r.name || r.name.trim().length < 2);
    if (invalidNameRows.length > 0) {
      toast.error(`${invalidNameRows.length} student row(s) have missing or invalid names (min 2 letters).`);
      return;
    }

    const invalidPhoneRows = parsedRows.filter((r) => r.phone.length !== 10 || !/^[6-9]\d{9}$/.test(r.phone));
    if (invalidPhoneRows.length > 0) {
      toast.error(`${invalidPhoneRows.length} student row(s) have invalid or non-10-digit mobile numbers (must start with 6-9).`);
      return;
    }

    const phoneSet = new Set<string>();
    for (const r of parsedRows) {
      if (phoneSet.has(r.phone)) {
        toast.error(`Duplicate mobile number detected in CSV: ${r.phone}`);
        return;
      }
      phoneSet.add(r.phone);
    }

    const invalidEmailRows = parsedRows.filter(
      (r) => r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)
    );
    if (invalidEmailRows.length > 0) {
      toast.error(`${invalidEmailRows.length} student row(s) have invalid email format.`);
      return;
    }

    const generatedBatchId = `GRP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newBatch: RecentGroupAdmission = {
      batchId: generatedBatchId,
      batchName: batchName.trim() || 'Bulk Uploaded Batch',
      date: new Date().toISOString().slice(0, 10),
      count: parsedRows.length,
      shift: parsedRows[0]?.shift || 'Morning',
      status: 'Active',
    };
    onConfirmBatch(newBatch);
    setUploadedFile(null);
    setParsedRows([]);
    setBatchName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-2 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="bulk-upload-title">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-dialog space-y-4 sm:space-y-5 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <h2 id="bulk-upload-title" className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-primary shrink-0" /> Bulk Group CSV Import
          </h2>
          <button type="button" onClick={onClose} className="text-secondary hover:text-primary p-1 rounded">
            <X size={20} />
          </button>
        </div>

        <div>
          <label className="mgr-label text-xs" htmlFor="bulk-batch-name">
            Batch / Group Name
          </label>
          <div className="mgr-input-icon-wrap">
            <Users size={15} className="mgr-input-icon text-primary" />
            <input
              id="bulk-batch-name"
              type="text"
              maxLength={80}
              className="mgr-input mgr-input-with-icon text-xs"
              placeholder="e.g. UPSC Morning Batch A"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value.slice(0, 80))}
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-4 sm:p-6 text-center bg-floating">
          <input type="file" accept=".csv" id="group-csv-file" className="sr-only" onChange={handleCsvFileUpload} />
          <label htmlFor="group-csv-file" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={30} className="text-primary" />
            <span className="text-sm font-semibold text-primary">
              {uploadedFile ? uploadedFile.name : 'Click to select CSV file from your computer'}
            </span>
            <span className="text-xs text-secondary">Columns: Name, Phone (10 digits), Email, Plan, Shift</span>
          </label>
        </div>

        {parsedRows.length > 0 && (
          <div className="space-y-2 flex-1 min-h-0 flex flex-col">
            <p className="text-xs font-bold uppercase text-secondary shrink-0">
              Preview: {parsedRows.length} Students Parsed
            </p>
            <div className="max-h-48 overflow-y-auto overflow-x-auto border border-border rounded-lg text-xs">
              <table className="w-full text-left min-w-[460px]">
                <thead className="bg-surface-highlight border-b border-border font-semibold sticky top-0">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Shift</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="p-2 font-medium">{row.name}</td>
                      <td className="p-2 font-mono">{row.phone}</td>
                      <td className="p-2">{row.email}</td>
                      <td className="p-2">{row.shift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-border shrink-0">
          <button type="button" onClick={onClose} className="mgr-btn-ghost text-xs py-2 px-3">
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmBulkUpload}
            disabled={parsedRows.length === 0}
            className="mgr-btn-primary flex items-center justify-center gap-2 text-xs py-2 px-3 disabled:opacity-50"
          >
            <CheckCircle2 size={16} /> Confirm & Import {parsedRows.length > 0 ? `(${parsedRows.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

