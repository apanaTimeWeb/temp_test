'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { ManagerMembersAlumniAddModal } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_dialogs/ManagerMembersAlumniAddModal';
import {
  ManagerMembersAlumniDeleteModal,
  ManagerMembersAlumniKpiGrid,
} from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_views/ManagerMembersAlumniKpisAndDeleteModal';
import {
  ManagerMembersAlumniTable,
  type AlumniSortField,
} from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_views/ManagerMembersAlumniTable';
import { MANAGER_MEMBERS_ALUMNI_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_alumni/config/manager_members_alumni.demo_data';
import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import { sanitizeManagerAlumniCsvCell } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniCsv';
import {
  formatAlumniDecimal,
  readStoredJsonList,
  writeStoredJsonList,
} from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniDepositSettlement';
import { CheckCircle2, Download, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

const ALUMNI_STORAGE_KEY = 'manager_alumni_records';

export function ManagerMembersAlumniClient() {
  const tManagerUi = useTranslations('manager.manager_alumni.ui');
  const [records, setRecords] = useState<MembersAlumniRow[]>(MANAGER_MEMBERS_ALUMNI_DEMO_RECORDS);
  const [deleteTarget, setDeleteTarget] = useState<MembersAlumniRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const initialStored = readStoredJsonList<MembersAlumniRow>(ALUMNI_STORAGE_KEY);
    if (initialStored) setRecords(initialStored);

    const handleAlumniSync = () => {
      const nextStored = readStoredJsonList<MembersAlumniRow>(ALUMNI_STORAGE_KEY);
      if (nextStored) setRecords(nextStored);
    };

    const handleDepositRefunded = (e: Event) => {
      const customDetail = (e as CustomEvent).detail;
      const targetName = customDetail?.studentName?.toLowerCase();
      if (!targetName) return;
      setRecords((prev) => {
        const next = prev.map((item) =>
          item.name.toLowerCase() === targetName && item.depositSettlementStatus === 'Held'
            ? { ...item, depositSettlementStatus: 'Refunded' as const, depositAmount: customDetail.amount || item.depositAmount }
            : item,
        );
        writeStoredJsonList(ALUMNI_STORAGE_KEY, next);
        return next;
      });
    };

    window.addEventListener('manager_alumni_created', handleAlumniSync);
    window.addEventListener('manager_security_deposit_refunded', handleDepositRefunded);
    window.addEventListener('storage', handleAlumniSync);
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
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
      else { setSortField(null); setSortDirection('asc'); }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAlumni = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return records.filter((record) => {
      const matchesSearch = q === '' || record.name.toLowerCase().includes(q) || record.exam.toLowerCase().includes(q) || Boolean(record.designation?.toLowerCase().includes(q)) || record.phone.includes(q);
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

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || yearFilter !== 'All' || statusFilter !== 'All' || examFilter !== 'All');

  const sortedAlumni = useMemo(() => {
    if (!sortField) return filteredAlumni;
    return [...filteredAlumni].sort((a, b) => {
      const cmp = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''), undefined, { numeric: true, sensitivity: 'base' });
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
    const headers = ['ID', 'Name', 'Phone', 'Exit Date', 'Duration', 'Target Exam / Achievement', 'Designation', 'Deposit Clearance', 'Current Status', 'Testimonial'].map(sanitizeManagerAlumniCsvCell).join(',');
    const rows = filteredAlumni.map((r) => [
      r.id, r.name, r.phone, r.leftDate, r.duration, r.exam, r.designation ?? '',
      r.depositSettlementStatus ? `${r.depositSettlementStatus}${r.depositAmount ? ` (Rs ${r.depositAmount})` : ''}` : 'Cleared',
      r.currentStatus, r.testimonial ?? '',
    ].map(sanitizeManagerAlumniCsvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' }));
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
    writeStoredJsonList(ALUMNI_STORAGE_KEY, updated);
    try { window.dispatchEvent(new Event('manager_alumni_created')); } catch { /* fallback */ }
    setToastMsg(`Alumni record created for ${newRecord.name} (${newRecord.exam})`);
  };

  const handleDeleteAlumni = (id: string) => {
    const target = records.find((r) => r.id === id);
    if (target) setDeleteTarget(target);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleteTarget(null);
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    writeStoredJsonList(ALUMNI_STORAGE_KEY, updated);
    try { window.dispatchEvent(new Event('manager_alumni_created')); } catch { /* fallback */ }
    setToastMsg(`Removed ${name} from alumni directory.`);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => { setToastMsg(null); toastTimerRef.current = null; }, 3500);
  };

  const kpis = useMemo(() => {
    const total = records.length;
    if (total === 0) return { successRate: '0%', officersPercent: '0%', avgTenure: '0 Mos' };
    const cleared = records.filter((r) => r.currentStatus === 'Cleared Exam').length;
    const officers = records.filter((r) => /ias|ips|irs|ssc|bank|officer|rbi|inspector|govt|psu/i.test(r.designation || '') || /upsc|ssc|banking|state psc/i.test(r.exam || '')).length;
    let totalMonths = 0;
    records.forEach((r) => {
      const m = /(\d+)\s*(month|yr|year)/i.exec(r.duration);
      totalMonths += m && m[1] && m[2] ? (m[2].toLowerCase().startsWith('y') ? parseInt(m[1], 10) * 12 : parseInt(m[1], 10)) : 12;
    });
    return { successRate: `${Math.round((cleared / total) * 100)}%`, officersPercent: `${Math.round((officers / total) * 100)}%`, avgTenure: `${formatAlumniDecimal(totalMonths / total)} Mos` };
  }, [records]);

  return (
    <div className="mgr-page">
      <div className="mgr-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mgr-page-title text-xl sm:text-2xl font-bold text-primary">{tManagerUi('alumni_directory')}</h1>
          <p className="mgr-page-subtitle text-xs sm:text-sm text-secondary mt-1">Track and celebrate library alumni who have successfully qualified competitive examinations or transitioned to professional careers.</p>
        </div>
        <div className="mgr-page-actions flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold w-full sm:w-auto motion-safe:transition-colors">
            <Plus size={16} className="shrink-0 text-on-primary" /><span>Add Alumni</span>
          </button>
          <button type="button" onClick={handleExportCsv} className="mgr-btn mgr-btn-secondary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold w-full sm:w-auto motion-safe:transition-colors">
            <Download size={16} className="shrink-0 text-primary" /><span>Export CSV</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="mb-4 p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center justify-between gap-2" role="status">
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success shrink-0" /><span>{toastMsg}</span></span>
          <button type="button" onClick={() => setToastMsg(null)} className="p-1 text-danger hover:opacity-80 rounded-lg motion-safe:transition-colors cursor-pointer" aria-label="Dismiss message"><X size={14} className="shrink-0 text-danger" /></button>
        </div>
      )}

      <ManagerMembersAlumniKpiGrid totalCount={records.length} kpis={kpis} />

      <ManagerMembersAlumniTable
        filteredAlumni={filteredAlumni} paginatedAlumni={paginatedAlumni} totalRows={totalRows}
        searchQuery={searchQuery} setSearchQuery={(val) => { setSearchQuery(val); setPage(0); }}
        yearFilter={yearFilter} setYearFilter={(val) => { setYearFilter(val); setPage(0); }}
        examFilter={examFilter} setExamFilter={(val) => { setExamFilter(val); setPage(0); }}
        statusFilter={statusFilter} setStatusFilter={(val) => { setStatusFilter(val); setPage(0); }}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => { setSearchQuery(''); setYearFilter('All'); setExamFilter('All'); setStatusFilter('All'); setPage(0); }}
        sortField={sortField} sortDirection={sortDirection} onToggleSort={toggleSort}
        page={page} pageSize={pageSize} pageCount={pageCount} startItem={startItem} endItem={endItem}
        onPageChange={setPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }} onDeleteAlumni={handleDeleteAlumni}
      />

      <ManagerMembersAlumniAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddAlumni} />
      <ManagerMembersAlumniDeleteModal deleteTarget={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
    </div>
  );
}

export default ManagerMembersAlumniClient;
