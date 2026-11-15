'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Users,
  X,
} from 'lucide-react';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import {
  ManagerMembersAlumniTable,
  type AlumniSortField,
} from './ManagerMembersAlumniTable';
import { ManagerMembersAlumniAddModal } from '../manager_members_alumni_dialogs/ManagerMembersAlumniAddModal';
import { sanitizeManagerAlumniCsvCell } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniCsv';

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

  useEffect(() => {
    const handleAlumniSync = () => {
      try {
        const stored = localStorage.getItem('manager_alumni_records');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setRecords(parsed);
        }
      } catch {
        // storage fallback
      }
    };
    window.addEventListener('manager_alumni_created', handleAlumniSync);
    window.addEventListener('storage', handleAlumniSync);
    return () => {
      window.removeEventListener('manager_alumni_created', handleAlumniSync);
      window.removeEventListener('storage', handleAlumniSync);
    };
  }, []);

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
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        record.name.toLowerCase().includes(q) ||
        record.exam.toLowerCase().includes(q) ||
        Boolean(record.designation && record.designation.toLowerCase().includes(q)) ||
        record.phone.includes(q);

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

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Phone', 'Exit Date', 'Duration', 'Target Exam / Achievement', 'Designation', 'Current Status', 'Testimonial'].map(sanitizeManagerAlumniCsvCell).join(',');
    const rows = filteredAlumni
      .map((r) =>
        [r.id, r.name, r.phone, r.leftDate, r.duration, r.exam, r.designation ?? '', r.currentStatus, r.testimonial ?? ''].map(sanitizeManagerAlumniCsvCell).join(',')
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

  const handleAddAlumni = (newRecord: MembersAlumniRow) => {
    const updated = [newRecord, ...records];
    setRecords(updated);
    try {
      localStorage.setItem('manager_alumni_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('manager_alumni_created'));
    } catch {
      // storage fallback
    }
    setToastMsg(`Alumni record created for ${newRecord.name} (${newRecord.exam})`);
  };

  const handleDeleteAlumni = (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const ok = window.confirm(`Are you sure you want to remove ${target.name} from the alumni directory?`);
    if (!ok) return;

    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem('manager_alumni_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('manager_alumni_created'));
    } catch {
      // storage fallback
    }
    setToastMsg(`Removed ${target.name} from alumni directory.`);
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
      {/* Page Header with colored action icons */}
      <div className="mgr-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mgr-page-title text-xl sm:text-2xl font-bold text-primary">{tManagerUi('alumni_directory')}</h1>
          <p className="mgr-page-subtitle text-xs sm:text-sm text-secondary mt-1">
            Track and celebrate library alumni who have successfully qualified competitive examinations or transitioned to professional careers.
          </p>
        </div>
        <div className="mgr-page-actions flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold w-full sm:w-auto transition-colors"
          >
            <Plus size={16} className="shrink-0 text-on-primary" />
            <span>Add Alumni</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn mgr-btn-secondary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold w-full sm:w-auto transition-colors"
          >
            <Download size={16} className="shrink-0 text-primary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="mb-4 p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center justify-between gap-2" role="status">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success shrink-0" />
            <span>{toastMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 text-danger hover:opacity-80 rounded-lg transition-colors"
            aria-label="Dismiss message"
          >
            <X size={14} className="shrink-0 text-danger" />
          </button>
        </div>
      )}

      {/* KPI Cards - Vibrant themed icon colors by default */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="mgr-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-secondary font-medium">Total Alumni Network</span>
            <p className="text-2xl font-bold text-primary tracking-tight">{records.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
            <Users size={20} className="text-primary" />
          </div>
        </div>
        <div className="mgr-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-secondary font-medium">Exam Success Rate</span>
            <p className="text-2xl font-bold text-success tracking-tight">{kpis.successRate}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success-bg text-success flex items-center justify-center shrink-0">
            <Award size={20} className="text-success" />
          </div>
        </div>
        <div className="mgr-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-secondary font-medium">Govt / PSU Officers</span>
            <p className="text-2xl font-bold text-info tracking-tight">{kpis.officersPercent}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-info-bg text-info flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-info" />
          </div>
        </div>
        <div className="mgr-card p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-secondary font-medium">Average Tenure</span>
            <p className="text-2xl font-bold text-warning tracking-tight">{kpis.avgTenure}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-warning-bg text-warning flex items-center justify-center shrink-0">
            <Clock size={20} className="text-warning" />
          </div>
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
        onDeleteAlumni={handleDeleteAlumni}
      />

      {/* Add Alumni Modal */}
      <ManagerMembersAlumniAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAlumni}
      />
    </div>
  );
}
