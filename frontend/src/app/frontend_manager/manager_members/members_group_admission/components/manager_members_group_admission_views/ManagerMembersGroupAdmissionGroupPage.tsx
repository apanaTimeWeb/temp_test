'use client';
// RESPONSIBILITY: Render the canonical group-admission feature view with incoming route context.
// DATA FLOW: Next.js route page -> Main -> GroupPage.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users2, Plus, Download, Upload, Trash2, CheckCircle2, X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_group_admission/config/manager_members_group_admission.url_config';
import type { ManagerMembersGroupAdmissionGroupPageRouteProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';

interface GroupStudentEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  plan: string;
  shift: string;
}

interface RecentGroupAdmission {
  batchId: string;
  batchName: string;
  date: string;
  count: number;
  shift: string;
  status: 'Active' | 'Processed';
}

const INITIAL_RECENT_GROUPS: RecentGroupAdmission[] = [
  { batchId: 'GRP-2026-001', batchName: 'UPSC Aspirants Study Circle', date: '2026-10-25', count: 6, shift: 'Morning', status: 'Active' },
  { batchId: 'GRP-2026-002', batchName: 'Engineering Batch Semester Prep', date: '2026-10-20', count: 4, shift: 'Evening', status: 'Processed' },
];

export default function ManagerMembersGroupAdmissionGroupPage(_routeQuery: ManagerMembersGroupAdmissionGroupPageRouteProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');

  const [recentGroups, setRecentGroups] = useState<RecentGroupAdmission[]>(INITIAL_RECENT_GROUPS);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<GroupStudentEntry[]>([]);
  const [batchName, setBatchName] = useState('');

  // Manual Entry state
  const [manualRows, setManualRows] = useState<GroupStudentEntry[]>([
    { id: '1', name: '', phone: '', email: '', plan: 'Pro Monthly', shift: 'Morning' },
    { id: '2', name: '', phone: '', email: '', plan: 'Pro Monthly', shift: 'Morning' },
  ]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const downloadTemplate = () => {
    const csv = 'Name,Phone,Email,Plan,Shift\nRahul Sharma,9876543210,rahul@example.com,Pro Monthly,Morning\nPriya Verma,9876543211,priya@example.com,Basic Monthly,Evening\nAmit Kumar,9876543212,amit@example.com,Full Day Saver,Full Day\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'student-group-admission-template.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    showNotification('Sample CSV template downloaded successfully.');
  };

  const handleCsvFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    if (!batchName) setBatchName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const rows: GroupStudentEntry[] = [];
      // skip header if present
      const startIndex = lines[0]?.toLowerCase().includes('name') ? 1 : 0;
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i]?.split(',').map(p => p.trim());
        if (parts && parts[0]) {
          rows.push({
            id: String(i),
            name: parts[0] || `Student ${i}`,
            phone: parts[1] || '9876500000',
            email: parts[2] || 'student@example.com',
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
      alert('Please select a valid CSV file with student records.');
      return;
    }
    const newBatch: RecentGroupAdmission = {
      batchId: `GRP-2026-${String(recentGroups.length + 1).padStart(3, '0')}`,
      batchName: batchName || 'Bulk Uploaded Batch',
      date: new Date().toISOString().slice(0, 10),
      count: parsedRows.length,
      shift: parsedRows[0]?.shift || 'Morning',
      status: 'Active',
    };
    setRecentGroups([newBatch, ...recentGroups]);
    setShowBulkModal(false);
    setUploadedFile(null);
    setParsedRows([]);
    setBatchName('');
    showNotification(`Bulk admission successful! Enrolled ${newBatch.count} members in batch ${newBatch.batchId}.`);
  };

  const addManualRow = () => {
    setManualRows([
      ...manualRows,
      { id: String(Date.now()), name: '', phone: '', email: '', plan: 'Pro Monthly', shift: 'Morning' },
    ]);
  };

  const removeManualRow = (index: number) => {
    if (manualRows.length <= 1) return;
    setManualRows(manualRows.filter((_, i) => i !== index));
  };

  const updateManualRow = (index: number, field: keyof GroupStudentEntry, value: string) => {
    const updated = [...manualRows];
    const target = updated[index];
    if (target) {
      target[field] = value;
      setManualRows(updated);
    }
  };

  const confirmManualGroup = () => {
    const validRows = manualRows.filter(r => r.name.trim().length > 0 && r.phone.trim().length >= 10);
    if (validRows.length === 0) {
      alert('Please fill out at least one student with a valid Name and 10-digit Phone.');
      return;
    }
    const newBatch: RecentGroupAdmission = {
      batchId: `GRP-2026-${String(recentGroups.length + 1).padStart(3, '0')}`,
      batchName: batchName || 'Manual Group Admission',
      date: new Date().toISOString().slice(0, 10),
      count: validRows.length,
      shift: validRows[0]?.shift || 'Morning',
      status: 'Active',
    };
    setRecentGroups([newBatch, ...recentGroups]);
    setShowManualModal(false);
    setBatchName('');
    setManualRows([
      { id: '1', name: '', phone: '', email: '', plan: 'Pro Monthly', shift: 'Morning' },
      { id: '2', name: '', phone: '', email: '', plan: 'Pro Monthly', shift: 'Morning' },
    ]);
    showNotification(`Group created successfully! Enrolled ${validRows.length} members under batch ${newBatch.batchId}.`);
  };

  return (
    <div className="mgr-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div className="mgr-page-header">
        <div>
          <Link href={MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES.LIST} className="mgr-back-link">{tManagerUi('back_to_students')}</Link>
          <h1 className="mgr-page-title">{tManagerUi('group_admission')}</h1>
          <p className="mgr-page-subtitle">Batch admission for study groups, coaching batches, and institution groups with special group pricing.</p>
        </div>
        <div className="mgr-page-actions">
          <button type="button" className="mgr-btn-ghost flex items-center gap-2" onClick={downloadTemplate}>
            <Download size={16} /><span>{tManagerUi('download_csv_template')}</span>
          </button>
          <button type="button" onClick={() => setShowManualModal(true)} className="mgr-btn-primary flex items-center gap-2">
            <Plus size={16} /><span>New Group Admission</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success bg-success-bg p-4 text-sm text-success" role="alert">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Upload Card */}
        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-primary/40 bg-floating hover:border-primary transition-all">
          <div className="w-16 h-16 rounded-full bg-primary-subtle flex items-center justify-center text-primary mb-1">
            <Upload size={28} />
          </div>
          <div>
            <h3 className="text-primary font-bold text-lg mb-1">{tManagerUi('bulk_upload_excel_csv')}</h3>
            <p className="text-secondary text-sm max-w-sm">Upload bulk student records in CSV or Excel format to register multiple candidates at once.</p>
          </div>
          <button type="button" onClick={() => setShowBulkModal(true)} className="mgr-btn-primary mt-2 flex items-center gap-2">
            <FileSpreadsheet size={16} />
            <span>Upload CSV File</span>
          </button>
        </div>

        {/* Manual Group Entry Card */}
        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-success/40 bg-floating hover:border-success transition-all">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center text-success mb-1">
            <Users2 size={28} />
          </div>
          <div>
            <h3 className="text-primary font-bold text-lg mb-1">{tManagerUi('manual_group_entry')}</h3>
            <p className="text-secondary text-sm max-w-sm">Enter student details manually in an interactive batch spreadsheet and register together.</p>
          </div>
          <button type="button" onClick={() => setShowManualModal(true)} className="mgr-btn-primary mt-2 flex items-center gap-2">
            <Plus size={16} />
            <span>Start Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Recent Group Admissions Table */}
      <div className="mgr-card p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-primary">{tManagerUi('recent_group_admissions')}</h3>
          <span className="text-xs text-secondary">{recentGroups.length} batches enrolled</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs text-secondary uppercase font-semibold text-left">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Batch / Group Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Students Count</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentGroups.map((group) => (
                <tr key={group.batchId} className="border-b border-border hover:bg-surface-hover">
                  <td className="py-3 px-4 font-mono font-bold text-primary">{group.batchId}</td>
                  <td className="py-3 px-4 font-semibold text-primary">{group.batchName}</td>
                  <td className="py-3 px-4 text-secondary">{group.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-subtle text-primary">
                      {group.count} Students
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary">{group.shift}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">
                      {group.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-primary" /> Bulk Group CSV Import
              </h2>
              <button type="button" onClick={() => setShowBulkModal(false)} className="text-secondary hover:text-primary">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="mgr-label" htmlFor="bulk-batch-name">Batch / Group Name</label>
              <input id="bulk-batch-name" type="text" className="mgr-input" placeholder="e.g. UPSC Morning Batch A" value={batchName} onChange={(e) => setBatchName(e.target.value)} />
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-floating">
              <input type="file" accept=".csv" id="group-csv-file" className="sr-only" onChange={handleCsvFileUpload} />
              <label htmlFor="group-csv-file" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {uploadedFile ? uploadedFile.name : 'Click to select CSV file from your computer'}
                </span>
                <span className="text-xs text-secondary">Columns: Name, Phone, Email, Plan, Shift</span>
              </label>
            </div>

            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-secondary">Preview: {parsedRows.length} Students Parsed</p>
                <div className="max-h-48 overflow-y-auto border border-border rounded-lg text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-surface-highlight border-b border-border font-semibold">
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

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button type="button" onClick={() => setShowBulkModal(false)} className="mgr-btn-ghost">Cancel</button>
              <button type="button" onClick={confirmBulkUpload} disabled={parsedRows.length === 0} className="mgr-btn-primary flex items-center gap-2 disabled:opacity-50">
                <CheckCircle2 size={16} /> Confirm & Import {parsedRows.length > 0 ? `(${parsedRows.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Group Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Users2 size={20} className="text-success" /> Manual Group Entry
              </h2>
              <button type="button" onClick={() => setShowManualModal(false)} className="text-secondary hover:text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="shrink-0">
              <label className="mgr-label" htmlFor="manual-batch-name">Batch / Group Name</label>
              <input id="manual-batch-name" type="text" className="mgr-input" placeholder="e.g. Combined SSC Study Group" value={batchName} onChange={(e) => setBatchName(e.target.value)} />
            </div>

            <div className="flex-1 overflow-y-auto border border-border rounded-xl">
              <table className="w-full text-xs">
                <thead className="bg-surface-highlight border-b border-border text-left font-bold text-secondary uppercase sticky top-0">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Phone (10 digits)</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {manualRows.map((row, index) => (
                    <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                      <td className="p-3 font-bold text-secondary">{index + 1}</td>
                      <td className="p-2">
                        <input type="text" className="mgr-input py-1.5 text-xs" placeholder="Full Name" value={row.name} onChange={(e) => updateManualRow(index, 'name', e.target.value)} />
                      </td>
                      <td className="p-2">
                        <input type="tel" className="mgr-input py-1.5 text-xs font-mono" placeholder="9876543210" value={row.phone} onChange={(e) => updateManualRow(index, 'phone', e.target.value)} />
                      </td>
                      <td className="p-2">
                        <select className="mgr-select py-1.5 text-xs" value={row.shift} onChange={(e) => updateManualRow(index, 'shift', e.target.value)}>
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                          <option value="Full Day">Full Day</option>
                          <option value="Night">Night</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select className="mgr-select py-1.5 text-xs" value={row.plan} onChange={(e) => updateManualRow(index, 'plan', e.target.value)}>
                          <option value="Basic Monthly">Basic Monthly</option>
                          <option value="Pro Monthly">Pro Monthly</option>
                          <option value="Quarterly Standard">Quarterly Standard</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <button type="button" onClick={() => removeManualRow(index)} disabled={manualRows.length <= 1} className="text-danger hover:text-danger-text disabled:opacity-30">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center shrink-0 pt-3 border-t border-border">
              <button type="button" onClick={addManualRow} className="mgr-btn-ghost flex items-center gap-2 text-xs">
                <Plus size={14} /> Add Another Student Row
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowManualModal(false)} className="mgr-btn-ghost">Cancel</button>
                <button type="button" onClick={confirmManualGroup} className="mgr-btn-primary flex items-center gap-2">
                  <CheckCircle2 size={16} /> Enroll Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
