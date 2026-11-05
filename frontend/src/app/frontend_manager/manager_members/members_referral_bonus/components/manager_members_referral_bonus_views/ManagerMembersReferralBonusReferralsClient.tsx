'use client';
// RESPONSIBILITY: Orchestrate client-side view and local interactions for referral bonus management.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, DollarSign, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import {
  ManagerMembersReferralBonusTable,
  type ReferralSortField,
} from './ManagerMembersReferralBonusTable';
import { ManagerMembersReferralBonusAddModal } from '../manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal';

const INITIAL_REFERRALS: ReferralRow[] = [
  { id: 'REF-101', referrer: 'Amit Sharma (LIB-1042)', referred: 'Rohan Verma', date: '2026-10-24', status: 'Credited', bonus: '₹500', method: 'Fee Discount' },
  { id: 'REF-102', referrer: 'Priya Patel (LIB-1088)', referred: 'Sneha Rao', date: '2026-10-25', status: 'Credited', bonus: '₹500', method: 'UPI Cash' },
  { id: 'REF-103', referrer: 'Vikram Singh (LIB-1120)', referred: 'Karan Malhotra', date: '2026-10-28', status: 'Pending', bonus: '₹500', method: 'Fee Discount' },
  { id: 'REF-104', referrer: 'Ananya Roy (LIB-1155)', referred: 'Pooja Iyer', date: '2026-10-29', status: 'Credited', bonus: '₹500', method: 'Fee Discount' },
  { id: 'REF-105', referrer: 'Rahul Gupta (LIB-1190)', referred: 'Aditya Mehra', date: '2026-11-01', status: 'Pending', bonus: '₹500', method: 'UPI Cash' },
  { id: 'REF-106', referrer: 'Neha Verma (LIB-1204)', referred: 'Siddharth Jain', date: '2026-11-02', status: 'Credited', bonus: '₹500', method: 'Fee Discount' },
];

export function ManagerMembersReferralBonusReferralsClient() {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');
  const [records, setRecords] = useState<ReferralRow[]>(INITIAL_REFERRALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Credited' | 'Pending'>('All');
  const [methodFilter, setMethodFilter] = useState<'All' | 'Fee Discount' | 'UPI Cash'>('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<ReferralSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleSort = (field: ReferralSortField) => {
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

  const filteredRows = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || r.referrer.toLowerCase().includes(q) || r.referred.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || r.status === statusFilter;
      const matchM = methodFilter === 'All' || r.method.toLowerCase() === methodFilter.toLowerCase();
      return matchQ && matchS && matchM;
    });
  }, [records, searchQuery, statusFilter, methodFilter]);

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || statusFilter !== 'All' || methodFilter !== 'All');

  const sortedRows = useMemo(() => {
    if (!sortField) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedRows = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const totalBonusAmount = useMemo(() => {
    return records.filter((r) => r.status === 'Credited').reduce((sum, r) => sum + (parseInt(r.bonus.replace(/[^0-9]/g, ''), 10) || 0), 0);
  }, [records]);

  const pendingCount = useMemo(() => records.filter((r) => r.status === 'Pending').length, [records]);

  const handleApprove = (id: string) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Credited' } : r)));
    setToastMsg(`Referral ${id} approved and bonus credited!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportCsv = () => {
    const headers = 'Referral ID,Referrer,Referred Member,Date,Bonus Amount,Reward Method,Status\n';
    const rows = sortedRows
      .map((r) => `"${r.id}","${r.referrer}","${r.referred}","${r.date}","${r.bonus}","${r.method}","${r.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `referrals_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Referrals exported to CSV successfully');
  };

  const handleAddReferral = (newRecord: ReferralRow) => {
    setRecords([newRecord, ...records]);
    setToastMsg(`New referral for "${newRecord.referred}" recorded successfully!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="mgr-page">
      <div className="mgr-page-header">
        <div>
          <div className="mgr-breadcrumb">{tManagerUi('students_referrals')}</div>
          <h1 className="mgr-page-title">{tManagerUi('referral_program')}</h1>
          <p className="mgr-page-subtitle">Track student referrals, approve rewards, and disburse peer invite bonuses.</p>
        </div>
        <div className="mgr-page-actions">
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="mgr-btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={15} /> <span>Add Referral</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="mb-4 p-3 rounded-xl bg-success-bg border border-border text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span> <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            setStatusFilter('All');
            setPage(0);
          }}
          className={`mgr-card p-4 text-left cursor-pointer transition-all ${
            statusFilter === 'All' ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">{tManagerUi('total_referrals')}</span>
            <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{records.length}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('Pending');
            setPage(0);
          }}
          className={`mgr-card p-4 text-left cursor-pointer transition-all ${
            statusFilter === 'Pending' ? 'ring-2 ring-warning border-warning' : 'hover:border-warning/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">{tManagerUi('pending_approvals')}</span>
            <div className="w-8 h-8 rounded-lg bg-warning-bg text-warning border border-border flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-warning mt-2">{pendingCount}</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('Credited');
            setPage(0);
          }}
          className={`mgr-card p-4 text-left cursor-pointer transition-all ${
            statusFilter === 'Credited' ? 'ring-2 ring-success border-success' : 'hover:border-success/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">{tManagerUi('total_bonus_distributed')}</span>
            <div className="w-8 h-8 rounded-lg bg-success-bg text-success border border-border flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold text-success mt-2">₹{totalBonusAmount.toLocaleString('en-IN')}</p>
        </button>
      </div>

      {/* Referrals Table Section */}
      <ManagerMembersReferralBonusTable
        filteredRows={filteredRows}
        paginatedRows={paginatedRows}
        totalRows={totalRows}
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          setPage(0);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(0);
        }}
        methodFilter={methodFilter}
        setMethodFilter={(val) => {
          setMethodFilter(val);
          setPage(0);
        }}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => {
          setSearchQuery('');
          setStatusFilter('All');
          setMethodFilter('All');
          setPage(0);
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onApprove={handleApprove}
        onExportCsv={handleExportCsv}
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

      {/* Add Referral Modal */}
      <ManagerMembersReferralBonusAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReferral={handleAddReferral}
        nextId={`REF-${100 + records.length + 1}`}
      />
    </div>
  );
}
