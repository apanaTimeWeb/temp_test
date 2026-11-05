'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Award, Briefcase, Download, Filter, GraduationCap, Plus, Search, Users, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { ManagerMembersAlumniAddModal } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_dialogs/ManagerMembersAlumniAddModal';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';

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

  const [records, setRecords] = useState<MembersAlumniRow[]>(ALUMNI_RECORDS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [examFilter, setExamFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  type AlumniSortField = 'id' | 'name' | 'phone' | 'leftDate' | 'duration' | 'exam' | 'currentStatus';
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

  const renderSortableHeader = (field: AlumniSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="py-3 px-4"
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-secondary/40 group-hover:text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const handleExportCsv = () => {
    const headers = 'ID,Name,Phone,Exit Date,Duration,Target Exam / Achievement,Designation,Current Status,Testimonial\n';
    const rows = filteredAlumni
      .map((r) => `"${r.id}","${r.name}","${r.phone}","${r.leftDate}","${r.duration}","${r.exam}","${r.designation ?? ''}","${r.currentStatus}","${(r.testimonial ?? '').replace(/"/g, '""')}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `alumni_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
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
          <p className="text-2xl font-bold text-success mt-1">87.5%</p>
        </div>
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Govt / PSU Officers</span>
          <p className="text-2xl font-bold text-info mt-1">62%</p>
        </div>
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Average Tenure</span>
          <p className="text-2xl font-bold text-warning mt-1">11.8 Mos</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mgr-card p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="mgr-input-icon-wrap flex-1">
            <Search size={16} className="mgr-input-icon text-secondary" />
            <input
              type="search"
              placeholder="Search by student name, qualified exam, or phone..."
              className="mgr-input mgr-input-with-icon"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>

          {/* Year Filter */}
          <div className="w-full md:w-44">
            <select
              aria-label="Filter by Year"
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(0);
              }}
              className="mgr-select text-xs"
            >
              <option value="All">All Years</option>
              <option value="2026">2026 Alumni</option>
              <option value="2025">2025 Alumni</option>
              <option value="2024">2024 Alumni</option>
            </select>
          </div>

          {/* Exam Domain Filter */}
          <div className="w-full md:w-48">
            <select
              aria-label="Filter by Exam Category"
              value={examFilter}
              onChange={(e) => {
                setExamFilter(e.target.value);
                setPage(0);
              }}
              className="mgr-select text-xs"
            >
              <option value="All">All Exam Domains</option>
              <option value="UPSC">UPSC Civil Services</option>
              <option value="Banking">Banking & Finance (SBI/RBI)</option>
              <option value="PSC">State PSC & SSC</option>
              <option value="CA">Chartered Accountancy</option>
              <option value="Technical">GATE & NEET PG</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="mgr-select text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Cleared Exam">Cleared Exam</option>
              <option value="Employed">Employed</option>
              <option value="Higher Studies">Higher Studies</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setYearFilter('All');
                setExamFilter('All');
                setStatusFilter('All');
                setPage(0);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer shrink-0 self-center"
              title="Reset all filters"
            >
              <X size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Alumni Records Table */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                {renderSortableHeader('id', 'Alumni ID')}
                {renderSortableHeader('name', 'Student Name')}
                {renderSortableHeader('phone', 'Contact Phone')}
                {renderSortableHeader('leftDate', 'Completion Date')}
                {renderSortableHeader('duration', 'Tenure')}
                {renderSortableHeader('exam', 'Exam & Rank / Post')}
                <th scope="col" className="py-3 px-4">Junior Advice / Review</th>
                {renderSortableHeader('currentStatus', 'Status')}
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary">
                    No alumni records matching the selected search query and filters.
                  </td>
                </tr>
              ) : (
                paginatedAlumni.map((alumnus) => (
                  <tr key={alumnus.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{alumnus.id}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{alumnus.name}</td>
                    <td className="py-3 px-4 font-mono text-secondary text-xs">{alumnus.phone}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{alumnus.leftDate}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{alumnus.duration}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-success flex items-center gap-1.5">
                          <Award size={14} className="shrink-0" /> {alumnus.exam}
                        </span>
                        {alumnus.designation ? (
                          <span className="text-xs text-secondary flex items-center gap-1">
                            <Briefcase size={12} className="shrink-0" /> {alumnus.designation}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      {alumnus.testimonial ? (
                        <p className="text-xs text-secondary italic line-clamp-2" title={alumnus.testimonial}>
                          “{alumnus.testimonial}”
                        </p>
                      ) : (
                        <span className="text-xs text-secondary/40">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        alumnus.currentStatus === 'Cleared Exam'
                          ? 'bg-success-bg text-success'
                          : alumnus.currentStatus === 'Employed'
                          ? 'bg-info-bg text-info'
                          : 'bg-warning-bg text-warning'
                      }`}>
                        {alumnus.currentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRows > 0 && (
          <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} alumni records
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="alumni-rows-per-page" className="text-xs text-secondary whitespace-nowrap">Rows per page:</label>
                <select
                  id="alumni-rows-per-page"
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

      <ManagerMembersAlumniAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newAlumni) => {
          setRecords([newAlumni, ...records]);
          setToastMsg(`Alumni record for "${newAlumni.name}" added successfully!`);
          setTimeout(() => setToastMsg(null), 4000);
        }}
      />
    </div>
  );
}
