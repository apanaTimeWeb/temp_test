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
  Trash2,
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
  { id: 'ALM-001', name: 'Rahul Sharma', phone: '9876543210', leftDate: '2025-08-15', duration: '14 Months', exam: 'UPSC Civil Services', designation: 'AIR 142 (IAS)', testimonial: 'The silent 14-hr air-conditioned library environment was key to my consistency.', currentStatus: 'Cleared Exam', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-002', name: 'Neha Gupta', phone: '9876543211', leftDate: '2024-11-20', duration: '8 Months', exam: 'SBI Probationary Officer', designation: 'Probationary Officer (Scale I)', testimonial: 'Regular test series practice at designated silent desk helped me clear prelims & mains.', currentStatus: 'Employed', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-003', name: 'Aman Verma', phone: '9876543212', leftDate: '2025-05-10', duration: '18 Months', exam: 'CA Final Both Groups', designation: 'Chartered Accountant', testimonial: 'Uninterrupted power & high-speed wifi made virtual classes completely seamless.', currentStatus: 'Cleared Exam', depositSettlementStatus: 'Settled', depositAmount: 500 },
  { id: 'ALM-004', name: 'Ritu Saxena', phone: '9876543213', leftDate: '2024-09-30', duration: '12 Months', exam: 'UPPSC', designation: 'Sub-Divisional Magistrate (SDM)', testimonial: 'Discipline in the study hall kept me focused through the long preparation months.', currentStatus: 'Cleared Exam', depositSettlementStatus: 'Refunded', depositAmount: 1000 },
  { id: 'ALM-005', name: 'Deepak Patel', phone: '9876543214', leftDate: '2025-03-12', duration: '6 Months', exam: 'GATE Computer Science', designation: 'AIR 89 (M.Tech IIT-B)', testimonial: 'Excellent night shift study culture for engineering aspirants.', currentStatus: 'Higher Studies', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-006', name: 'Shweta Singh', phone: '9876543215', leftDate: '2024-07-22', duration: '16 Months', exam: 'NEET PG', designation: 'Top 500 (MD Medicine)', testimonial: 'Comfortable ergonomic chairs and sound isolation prevented physical fatigue.', currentStatus: 'Higher Studies', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-007', name: 'Vikram Mehta', phone: '9876543216', leftDate: '2025-01-18', duration: '10 Months', exam: 'RBI Grade B Officer', designation: 'Assistant Manager', testimonial: 'Best environment for focused analytical reading and economic daily reviews.', currentStatus: 'Employed', depositSettlementStatus: 'Refunded', depositAmount: 1000 },
  { id: 'ALM-008', name: 'Pooja Tiwari', phone: '9876543217', leftDate: '2024-12-05', duration: '9 Months', exam: 'SSC CGL', designation: 'Inspector (Income Tax)', testimonial: 'Always clean, well maintained, and peaceful for intense mock solving.', currentStatus: 'Employed', depositSettlementStatus: 'Held', depositAmount: 500 },
];

export function ManagerMembersAlumniClient() {
  const tManagerUi = useTranslations('manager.manager_alumni.ui');

  // Hydration-safe initial state: Server & Client start with identical fixtures
  const [records, setRecords] = useState<MembersAlumniRow[]>(ALUMNI_RECORDS);
  const [deleteTarget, setDeleteTarget] = useState<MembersAlumniRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    // Sync with localStorage on client mount after hydration is complete
    try {
      const stored = localStorage.getItem('manager_alumni_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) setRecords(parsed);
      }
    } catch {
      // storage fallback
    }

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

    const handleDepositRefunded = (e: Event) => {
      const customDetail = (e as CustomEvent).detail;
      const targetName = customDetail?.studentName?.toLowerCase();
      if (!targetName) return;

      setRecords((prev) => {
        const next = prev.map((item) => {
          if (item.name.toLowerCase() === targetName && item.depositSettlementStatus === 'Held') {
            return {
              ...item,
              depositSettlementStatus: 'Refunded' as const,
              depositAmount: customDetail.amount || item.depositAmount,
            };
          }
          return item;
        });
        try {
          localStorage.setItem('manager_alumni_records', JSON.stringify(next));
        } catch {
          // storage fallback
        }
        return next;
      });
    };

    window.addEventListener('manager_alumni_created', handleAlumniSync);
    window.addEventListener('manager_security_deposit_refunded', handleDepositRefunded);
    window.addEventListener('storage', handleAlumniSync);
    return () => {
      window.removeEventListener('manager_alumni_created', handleAlumniSync);
      window.removeEventListener('manager_security_deposit_refunded', handleDepositRefunded);
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
    const headers = [
      'ID',
      'Name',
      'Phone',
      'Exit Date',
      'Duration',
      'Target Exam / Achievement',
      'Designation',
      'Deposit Clearance',
      'Current Status',
      'Testimonial',
    ]
      .map(sanitizeManagerAlumniCsvCell)
      .join(',');
    const rows = filteredAlumni
      .map((r) =>
        [
          r.id,
          r.name,
          r.phone,
          r.leftDate,
          r.duration,
          r.exam,
          r.designation ?? '',
          r.depositSettlementStatus
            ? `${r.depositSettlementStatus}${r.depositAmount ? ` (Rs ${r.depositAmount})` : ''}`
            : 'Cleared',
          r.currentStatus,
          r.testimonial ?? '',
        ]
          .map(sanitizeManagerAlumniCsvCell)
          .join(',')
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
    setDeleteTarget(target);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleteTarget(null);
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem('manager_alumni_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('manager_alumni_created'));
    } catch {
      // storage fallback
    }
    setToastMsg(`Removed ${name} from alumni directory.`);
    setTimeout(() => setToastMsg(null), 3500);
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
            className="p-1 text-danger hover:opacity-80 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss message"
          >
            <X size={14} className="shrink-0 text-danger" />
          </button>
        </div>
      )}

      {/* KPI Cards - Rich gradient themed cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 p-4 sm:p-5 shadow-lg shadow-indigo-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-400/60 hover:shadow-xl flex items-center justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="space-y-1 relative z-10">
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Total Alumni Network</span>
            <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">{records.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-110 relative z-10">
            <Users size={20} className="text-indigo-400" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 p-4 sm:p-5 shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400/60 hover:shadow-xl flex items-center justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,34 Q25,18 55,20 T105,8 T150,14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="space-y-1 relative z-10">
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Exam Success Rate</span>
            <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-sans">{kpis.successRate}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-110 relative z-10">
            <Award size={20} className="text-emerald-400" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 p-4 sm:p-5 shadow-lg shadow-sky-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-sky-400/60 hover:shadow-xl flex items-center justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,30 Q20,10 45,22 T90,12 T130,18 T150,8" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="space-y-1 relative z-10">
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Govt / PSU Officers</span>
            <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-tight font-sans">{kpis.officersPercent}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-110 relative z-10">
            <Building2 size={20} className="text-sky-400" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261c0c] to-amber-900/60 p-4 sm:p-5 shadow-lg shadow-amber-950/40 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/60 hover:shadow-xl flex items-center justify-between">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="space-y-1 relative z-10">
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Average Tenure</span>
            <p suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-sans">{kpis.avgTenure}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-110 relative z-10">
            <Clock size={20} className="text-amber-400" />
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

      {/* Centered Professional Mini Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-alumni-dialog-title"
        >
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-danger-bg text-danger border border-border flex items-center justify-center mb-3.5 shrink-0">
              <Trash2 size={22} className="text-danger shrink-0" />
            </div>
            <h3 id="delete-alumni-dialog-title" className="text-base font-bold text-primary">
              Remove Alumni Member?
            </h3>
            <p className="text-xs text-secondary mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong className="text-primary font-semibold">{deleteTarget.name}</strong> ({deleteTarget.id}) from the alumni directory? This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="mgr-btn mgr-btn-secondary text-xs h-9 px-3 rounded-lg font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X size={14} className="text-secondary shrink-0" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center gap-1.5 text-xs h-9 px-3 rounded-lg font-semibold bg-danger text-white hover:bg-danger/90 transition-colors shadow-sm cursor-pointer"
              >
                <Trash2 size={14} className="text-white shrink-0" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerMembersAlumniClient;
