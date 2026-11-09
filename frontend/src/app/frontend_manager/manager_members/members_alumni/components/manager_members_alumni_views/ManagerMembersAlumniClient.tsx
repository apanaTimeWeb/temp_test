'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Plus } from 'lucide-react';
import { ManagerMembersAlumniAddModal } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_dialogs/ManagerMembersAlumniAddModal';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import {
  ManagerMembersAlumniTable,
  type AlumniSortField,
} from './ManagerMembersAlumniTable';

const ALUMNI_RECORDS: MembersAlumniRow[] = [
  { id: 'ALM-001', name: 'Rahul Sharma', phone: '9876543210', leftDate: '2025-08-15', duration: '14 Months', exam: 'UPSC Civil Services', designation: 'AIR 142 (IAS)', testimonial: 'The silent 14-hr air-conditioned library environment was key to my consistency.', currentStatus: 'Cleared Exam' },
  { id: 'ALM-002', name: 'Neha Gupta', phone: '9876543211', leftDate: '2024-11-20', duration: '8 Months', exam: 'SBI Probationary Officer', designation: 'Probationary Officer (Scale I)', testimonial: 'Regular test series practice at designated silent desk helped me clear prelims & mains.', currentStatus: 'Employed' },
  { id: 'ALM-003', name: 'Aman Verma', phone: '9876543212', leftDate: '2025-05-10', duration: '18 Months', exam: 'CA Final Both Groups', designation: 'Chartered Accountant', testimonial: 'Uninterrupted power & high-speed wifi made virtual classes completely seamless.', currentStatus: 'Cleared Exam' },
  { id: 'ALM-004', name: 'Ritu Saxena', phone: '9876543213', leftDate: '2024-09-30', duration: '12 Months', exam: 'UPPSC', designation: 'Sub-Divisional Magistrate (SDM)', testimonial: 'Discipline in the study hall kept me focused through the long preparation months.', currentStatus: 'Cleared Exam' },
  { id: 'ALM-005', name: 'Deepak Patel', phone: '9876543214', leftDate: '2025-03-12', duration: '6 Months', exam: 'GATE Computer Science', designation: 'AIR 89 (M.Tech IIT-B)', testimonial: 'Excellent night shift study culture for engineering aspirants.', currentStatus: 'Higher Studies' },
  { id: 'ALM-006', name: 'Shweta Singh', phone: '9876543215', leftDate: '2024-07-22', duration: '16 Months', exam: 'NEET PG', designation: 'Top 500 (MD Medicine)', testimonial: 'Comfortable ergonomic chairs and sound isolation prevented physical fatigue.', currentStatus: 'Higher Studies' },
  { id: 'ALM-007', name: 'Vikram Mehta', phone: '9876543216', leftDate: '2025-01-18', duration: '10 Months', exam: 'RBI Grade B Officer', designation: 'Assistant Manager', testimonial: 'Best environment for focused analytical reading and economic daily reviews.', currentStatus: 'Employed' },
  { id: 'ALM-008', name: 'Pooja Tiwari', phone: '9876543217', leftDate: '2024-12-05', duration: '9 Months', exam: 'SSC CGL', designation: 'Inspector (Income Tax)', testimonial: 'Always clean, well maintained, and peaceful for intense mock solving.', currentStatus: 'Employed' },
];

export function ManagerMembersAlumniClient() {
  const tManagerUi = useTranslations('manager.manager_alumni.ui');

  const [records, setRecords] = useState<MembersAlumniRow[]>(() => {
    if (typeof window === 'undefined') return ALUMNI_RECORDS;
    try {
      const stored = localStorage.getItem('manager_alumni_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // storage fallback
    }
    return ALUMNI_RECORDS;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [examFilter, setExamFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<AlumniSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: AlumniSortField) => {
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

  const filteredAlumni = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Boolean(record.designation && record.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        record.phone.includes(searchQuery);

      const matchesYear = yearFilter === 'All' || record.leftDate.startsWith(yearFilter);
      const matchesStatus = statusFilter === 'All' || record.currentStatus === statusFilter;
      const matchesExam =
        examFilter === 'All' ||
        (examFilter === 'UPSC' && record.exam.includes('UPSC')) ||
        (examFilter === 'Banking' && (record.exam.includes('SBI') || record.exam.includes('RBI'))) ||
        (examFilter === 'CA' && record.exam.includes('CA')) ||
        (examFilter === 'PSC' && (record.exam.includes('PSC') || record.exam.includes('SSC'))) ||
        (examFilter === 'Technical' && (record.exam.includes('GATE') || record.exam.includes('NEET')));

      return matchesSearch && matchesYear && matchesStatus && matchesExam;
    });
  }, [records, searchQuery, yearFilter, statusFilter, examFilter]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' ||
    yearFilter !== 'All' ||
    statusFilter !== 'All' ||
    examFilter !== 'All'
  );

  const sortedAlumni = useMemo(() => {
    if (!sortField) return filteredAlumni;
    return [...filteredAlumni].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredAlumni, sortField, sortDirection]);

  const totalRows = sortedAlumni.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedAlumni = sortedAlumni.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const escapeCsvCell = (val: unknown) => {
    let str = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Phone', 'Exit Date', 'Duration', 'Target Exam / Achievement', 'Designation', 'Current Status', 'Testimonial'].map(escapeCsvCell).join(',');
    const rows = filteredAlumni
      .map((r) =>
        [r.id, r.name, r.phone, r.leftDate, r.duration, r.exam, r.designation ?? '', r.currentStatus, r.testimonial ?? ''].map(escapeCsvCell).join(',')
      )
      .join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `alumni_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const kpis = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return { successRate: '0%', officersPercent: '0%', avgTenure: '0 Mos' };
    }
    const cleared = records.filter((r) => r.currentStatus === 'Cleared Exam').length;
    const successRate = `${Math.round((cleared / total) * 100)}%`;

    const officers = records.filter((r) =>
      /ias|ips|irs|ssc|bank|officer|rbi|inspector|govt|psu/i.test(r.designation || '') ||
      /upsc|ssc|banking|state psc/i.test(r.exam || '')
    ).length;
    const officersPercent = `${Math.round((officers / total) * 100)}%`;

    let totalMonths = 0;
    records.forEach((r) => {
      const match = /(\d+)\s*(month|yr|year)/i.exec(r.duration);
      if (match && match[1] && match[2]) {
        const val = parseInt(match[1], 10);
        totalMonths += match[2].toLowerCase().startsWith('y') ? val * 12 : val;
      } else {
        totalMonths += 12;
      }
    });
    const avgTenure = `${(totalMonths / total).toFixed(1)} Mos`;

    return { successRate, officersPercent, avgTenure };
  }, [records]);

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <div className="mgr-breadcrumb">{tManagerUi('students_alumni')}</div>
          <h1 className="mgr-page-title">{tManagerUi('alumni_directory')}</h1>
          <p className="mgr-page-subtitle">Track and celebrate library alumni who have successfully qualified competitive examinations or transitioned to professional careers.</p>
        </div>
        <div className="mgr-page-actions flex items-center gap-2">
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="mgr-btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={15} />
            <span>Add Alumni Record</span>
          </button>
          <button type="button" onClick={handleExportCsv} className="mgr-btn-ghost flex items-center gap-2 text-xs">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="mb-4 p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Total Alumni Network</span>
          <p className="text-2xl font-bold text-primary mt-1">{records.length}</p>
        </div>
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Exam Success Rate</span>
          <p className="text-2xl font-bold text-success mt-1">{kpis.successRate}</p>
        </div>
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Govt / PSU Officers</span>
          <p className="text-2xl font-bold text-info mt-1">{kpis.officersPercent}</p>
        </div>
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Average Tenure</span>
          <p className="text-2xl font-bold text-warning mt-1">{kpis.avgTenure}</p>
        </div>
      </div>

      {/* Alumni Table Section */}
      <ManagerMembersAlumniTable
        filteredAlumni={filteredAlumni}
        paginatedAlumni={paginatedAlumni}
        totalRows={totalRows}
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setPage(0);
        }}
        yearFilter={yearFilter}
        setYearFilter={(val) => {
          setYearFilter(val);
          setPage(0);
        }}
        examFilter={examFilter}
        setExamFilter={(val) => {
          setExamFilter(val);
          setPage(0);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(0);
        }}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => {
          setSearchQuery('');
          setYearFilter('All');
          setExamFilter('All');
          setStatusFilter('All');
          setPage(0);
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        page={page}
        pageSize={pageSize}
        pageCount={pageCount}
        startItem={startItem}
        endItem={endItem}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(0);
        }}
      />

      <ManagerMembersAlumniAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newAlumni) => {
          setRecords((prev) => {
            const updated = [newAlumni, ...prev];
            try {
              localStorage.setItem('manager_alumni_records', JSON.stringify(updated));
              window.dispatchEvent(new CustomEvent('manager_alumni_created', { detail: newAlumni }));
            } catch {
              // storage fallback
            }
            return updated;
          });
          setToastMsg(`Alumni record for "${newAlumni.name}" added successfully!`);
          setTimeout(() => setToastMsg(null), 4000);
        }}
      />
    </div>
  );
}
