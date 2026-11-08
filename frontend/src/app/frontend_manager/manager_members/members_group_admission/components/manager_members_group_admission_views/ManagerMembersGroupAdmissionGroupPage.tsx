'use client';
// RESPONSIBILITY: Render the canonical group-admission feature view with incoming route context.
// DATA FLOW: Next.js route page -> Main -> GroupPage.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Users2, Plus, Download, Upload, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { ManagerMembersGroupAdmissionManualModal, type GroupStudentEntry } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal';
import { MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_group_admission/config/manager_members_group_admission.url_config';
import type { ManagerMembersGroupAdmissionGroupPageRouteProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';
import {
  ManagerMembersGroupAdmissionRecentGroupsTable,
  type RecentGroupAdmission,
  type GroupSortField,
} from '../manager_members_group_admission_tables/ManagerMembersGroupAdmissionRecentGroupsTable';
import { ManagerMembersGroupAdmissionBulkModal } from '../manager_members_group_admission_dialogs/ManagerMembersGroupAdmissionBulkModal';
import { sanitizeManagerGroupAdmissionCsvCell } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionCsv';

const INITIAL_RECENT_GROUPS: RecentGroupAdmission[] = [
  { batchId: 'GRP-2026-001', batchName: 'UPSC Aspirants Study Circle', date: '2026-10-25', count: 6, shift: 'Morning', status: 'Active' },
  { batchId: 'GRP-2026-002', batchName: 'Engineering Batch Semester Prep', date: '2026-10-20', count: 4, shift: 'Evening', status: 'Processed' },
];

export default function ManagerMembersGroupAdmissionGroupPage(_routeQuery: ManagerMembersGroupAdmissionGroupPageRouteProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');

  const [recentGroups, setRecentGroups] = useState<RecentGroupAdmission[]>(() => {
    if (typeof window === 'undefined') return INITIAL_RECENT_GROUPS;
    try {
      const stored = localStorage.getItem('manager_group_admissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // storage fallback
    }
    return INITIAL_RECENT_GROUPS;
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<GroupSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: GroupSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recentGroups.filter(
      (g) => !q || g.batchId.toLowerCase().includes(q) || g.batchName.toLowerCase().includes(q) || g.shift.toLowerCase().includes(q)
    );
  }, [recentGroups, searchQuery]);

  const sortedGroups = useMemo(() => {
    if (!sortField) return filteredGroups;
    return [...filteredGroups].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredGroups, sortField, sortDirection]);

  const totalRows = sortedGroups.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedGroups = sortedGroups.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const downloadTemplate = () => {
    const headers = ['Name', 'Phone', 'Email', 'Plan', 'Shift'].map(sanitizeManagerGroupAdmissionCsvCell).join(',');
    const sampleRow1 = ['Rahul Sharma', '9876543210', 'rahul@example.com', 'Pro Monthly (₹1,500/mo)', 'Morning (06:00 AM – 02:00 PM)'].map(sanitizeManagerGroupAdmissionCsvCell).join(',');
    const sampleRow2 = ['Priya Verma', '9876543211', 'priya@example.com', 'Basic Monthly (₹1,000/mo)', 'Evening (02:00 PM – 10:00 PM)'].map(sanitizeManagerGroupAdmissionCsvCell).join(',');
    const csv = `${headers}\n${sampleRow1}\n${sampleRow2}\n`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'student-group-admission-template.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Sample CSV template downloaded successfully.');
  };

  const handleBulkConfirmBatch = (newBatch: RecentGroupAdmission) => {
    setRecentGroups((prev) => {
      const updated = [newBatch, ...prev];
      try {
        localStorage.setItem('manager_group_admissions', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('manager_group_batch_created', { detail: newBatch }));
      } catch {
        // storage fallback
      }
      return updated;
    });
    toast.success(`Bulk admission successful! Enrolled ${newBatch.count} members in batch ${newBatch.batchId}.`);
  };

  const handleManualConfirm = (confirmedBatchName: string, students: GroupStudentEntry[]) => {
    const newBatch: RecentGroupAdmission = {
      batchId: `GRP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      batchName: confirmedBatchName,
      date: new Date().toISOString().slice(0, 10),
      count: students.length,
      shift: students[0]?.shift || 'Morning',
      status: 'Active',
    };
    setRecentGroups((prev) => {
      const updated = [newBatch, ...prev];
      try {
        localStorage.setItem('manager_group_admissions', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('manager_group_batch_created', { detail: newBatch }));
      } catch {
        // storage fallback
      }
      return updated;
    });
    setShowManualModal(false);
    toast.success(`Group admission registered successfully! Enrolled ${students.length} members in batch ${newBatch.batchId}.`);
  };

  return (
    <div
      className="mgr-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      
      
      
    >
      <div className="mgr-page-header">
        <div>
          <Link href={MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES.LIST} className="mgr-back-link">
            {tManagerUi('back_to_students')}
          </Link>
          <h1 className="mgr-page-title">{tManagerUi('group_admission')}</h1>
          <p className="mgr-page-subtitle">Batch admission for study groups, coaching batches, and institution groups with special group pricing.</p>
        </div>
        <div className="mgr-page-actions">
          <button type="button" className="mgr-btn-ghost flex items-center gap-2" onClick={downloadTemplate}>
            <Download size={16} />
            <span>{tManagerUi('download_csv_template')}</span>
          </button>
          <button type="button" onClick={() => setShowManualModal(true)} className="mgr-btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span>New Group Admission</span>
          </button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Upload Card */}
        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-primary bg-floating hover:border-primary transition-all">
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
        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-border bg-floating hover:border-success transition-all">
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
      <ManagerMembersGroupAdmissionRecentGroupsTable
        recentGroups={recentGroups}
        paginatedGroups={paginatedGroups}
        filteredGroups={filteredGroups}
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setPage(0);
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        totalRows={totalRows}
        effectivePage={effectivePage}
        pageCount={pageCount}
        pageSize={pageSize}
        startItem={startItem}
        endItem={endItem}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
      />

      {/* Bulk Upload Modal */}
      <ManagerMembersGroupAdmissionBulkModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        recentGroupsCount={recentGroups.length}
        onConfirmBatch={handleBulkConfirmBatch}
      />

      {/* Manual Group Entry Modal */}
      <ManagerMembersGroupAdmissionManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onConfirm={handleManualConfirm}
      />
    </div>
  );
}
