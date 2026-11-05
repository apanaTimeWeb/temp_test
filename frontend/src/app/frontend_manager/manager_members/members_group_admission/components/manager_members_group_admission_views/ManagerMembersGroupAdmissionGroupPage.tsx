'use client';
// RESPONSIBILITY: Render the canonical group-admission feature view with incoming route context.
// DATA FLOW: Next.js route page -> Main -> GroupPage.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Users2, Plus, Download, Upload, Trash2, CheckCircle2, X, FileSpreadsheet, AlertCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { ManagerMembersGroupAdmissionManualModal } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal';
import { MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_group_admission/config/manager_members_group_admission.url_config';
import type { ManagerMembersGroupAdmissionGroupPageRouteProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';

interface GroupStudentEntry {
  id: string; name: string; phone: string; email: string; plan: string; shift: string;
}

interface RecentGroupAdmission {
  batchId: string; batchName: string; date: string; count: number; shift: string; status: 'Active' | 'Processed';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recentGroups.filter(
      (g) => !q || g.batchId.toLowerCase().includes(q) || g.batchName.toLowerCase().includes(q) || g.shift.toLowerCase().includes(q)
    );
  }, [recentGroups, searchQuery]);

  const totalRows = filteredGroups.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedGroups = filteredGroups.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  // Bulk Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<GroupStudentEntry[]>([]);
  const [batchName, setBatchName] = useState('');

  const showNotification = (msg: string) => {
    toast.success(msg);
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
      toast.error('Please select a valid CSV file with student records.');
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

  const handleManualConfirm = (confirmedBatchName: string, students: GroupStudentEntry[]) => {
    const newBatch: RecentGroupAdmission = {
      batchId: `GRP-2026-${String(recentGroups.length + 1).padStart(3, '0')}`,
      batchName: confirmedBatchName,
      date: new Date().toISOString().slice(0, 10),
      count: students.length,
      shift: students[0]?.shift || 'Morning',
      status: 'Active',
    };
    setRecentGroups([newBatch, ...recentGroups]);
    setShowManualModal(false);
    showNotification(`Group admission registered successfully! Enrolled ${students.length} members in batch ${newBatch.batchId}.`);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="font-bold text-lg text-primary">{tManagerUi('recent_group_admissions')}</h3>
            <span className="text-xs text-secondary">{recentGroups.length} batches enrolled</span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="search"
              placeholder="Search batch name, ID, or shift..."
              className="mgr-input pl-8 text-xs w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>
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
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-secondary text-xs">
                    No group admission batches match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedGroups.map((group) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRows > 0 && (
          <div className="border-t border-border mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} batch records
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="group-admissions-rows-per-page" className="text-xs text-secondary whitespace-nowrap">Rows per page:</label>
                <select
                  id="group-admissions-rows-per-page"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="rounded border border-border bg-input px-2 py-1 text-xs text-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={effectivePage === 0}
                  onClick={() => setPage(effectivePage - 1)}
                  className="mgr-btn mgr-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs">
                  Page {effectivePage + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => setPage(effectivePage + 1)}
                  className="mgr-btn mgr-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
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
      <ManagerMembersGroupAdmissionManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onConfirm={handleManualConfirm}
      />
    </div>
  );
}
