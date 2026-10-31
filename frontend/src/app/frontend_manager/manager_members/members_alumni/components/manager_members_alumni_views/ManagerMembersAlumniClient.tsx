'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Award, Briefcase, Download, Filter, GraduationCap, Search, Users } from 'lucide-react';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';

const ALUMNI_RECORDS: MembersAlumniRow[] = [
  { id: 'ALM-001', name: 'Rahul Sharma', phone: '9876543210', leftDate: '2025-08-15', duration: '14 Months', exam: 'UPSC Civil Services (AIR 142)', currentStatus: 'Cleared Exam' },
  { id: 'ALM-002', name: 'Neha Gupta', phone: '9876543211', leftDate: '2024-11-20', duration: '8 Months', exam: 'SBI Probationary Officer', currentStatus: 'Employed' },
  { id: 'ALM-003', name: 'Aman Verma', phone: '9876543212', leftDate: '2025-05-10', duration: '18 Months', exam: 'CA Final Both Groups', currentStatus: 'Cleared Exam' },
  { id: 'ALM-004', name: 'Ritu Saxena', phone: '9876543213', leftDate: '2024-09-30', duration: '12 Months', exam: 'UPPSC (Sub-Divisional Magistrate)', currentStatus: 'Cleared Exam' },
  { id: 'ALM-005', name: 'Deepak Patel', phone: '9876543214', leftDate: '2025-03-12', duration: '6 Months', exam: 'GATE Computer Science (AIR 89)', currentStatus: 'Higher Studies' },
  { id: 'ALM-006', name: 'Shweta Singh', phone: '9876543215', leftDate: '2024-07-22', duration: '16 Months', exam: 'NEET PG (Top 500)', currentStatus: 'Higher Studies' },
  { id: 'ALM-007', name: 'Vikram Mehta', phone: '9876543216', leftDate: '2025-01-18', duration: '10 Months', exam: 'RBI Grade B Officer', currentStatus: 'Employed' },
  { id: 'ALM-008', name: 'Pooja Tiwari', phone: '9876543217', leftDate: '2024-12-05', duration: '9 Months', exam: 'SSC CGL (Inspector Income Tax)', currentStatus: 'Employed' },
];

export function ManagerMembersAlumniClient() {
  const tManagerUi = useTranslations('manager.manager_alumni.ui');

  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [examFilter, setExamFilter] = useState('All');

  const filteredAlumni = useMemo(() => {
    return ALUMNI_RECORDS.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
  }, [searchQuery, yearFilter, statusFilter, examFilter]);

  const handleExportCsv = () => {
    const headers = 'ID,Name,Phone,Exit Date,Duration,Target Exam / Achievement,Current Status\n';
    const rows = filteredAlumni
      .map((r) => `"${r.id}","${r.name}","${r.phone}","${r.leftDate}","${r.duration}","${r.exam}","${r.currentStatus}"`)
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
        <div className="mgr-page-actions">
          <button type="button" onClick={handleExportCsv} className="mgr-btn-ghost flex items-center gap-2">
            <Download size={16} />
            <span>Export Alumni CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="mgr-card p-4">
          <span className="text-xs text-secondary font-medium">Total Alumni Network</span>
          <p className="text-2xl font-bold text-primary mt-1">{ALUMNI_RECORDS.length}</p>
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Year Filter */}
          <div className="w-full md:w-44">
            <select
              aria-label="Filter by Year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
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
              onChange={(e) => setExamFilter(e.target.value)}
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mgr-select text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Cleared Exam">Cleared Exam</option>
              <option value="Employed">Employed</option>
              <option value="Higher Studies">Higher Studies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alumni Records Table */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                <th className="py-3 px-4">Alumni ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Completion Date</th>
                <th className="py-3 px-4">Membership Tenure</th>
                <th className="py-3 px-4">Exam Qualified / Outcome</th>
                <th className="py-3 px-4">Current Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary">
                    No alumni records matching the selected search query and filters.
                  </td>
                </tr>
              ) : (
                filteredAlumni.map((alumnus) => (
                  <tr key={alumnus.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{alumnus.id}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{alumnus.name}</td>
                    <td className="py-3 px-4 font-mono text-secondary text-xs">{alumnus.phone}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{alumnus.leftDate}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{alumnus.duration}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-success flex items-center gap-1.5">
                        <Award size={14} /> {alumnus.exam}
                      </span>
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
        <div className="border-t border-border px-4 py-3 flex justify-between items-center text-xs text-secondary">
          <span>Showing {filteredAlumni.length} of {ALUMNI_RECORDS.length} alumni records</span>
        </div>
      </div>
    </div>
  );
}
