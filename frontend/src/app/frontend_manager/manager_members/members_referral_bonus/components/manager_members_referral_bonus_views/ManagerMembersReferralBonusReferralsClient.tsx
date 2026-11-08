'use client';
// RESPONSIBILITY: Orchestrate client-side view and local interactions for referral bonus management.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { ManagerMembersReferralBonusTable, type ReferralSortField } from './ManagerMembersReferralBonusTable';
import { ManagerMembersReferralBonusAddModal } from '../manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal';
import ManagerMembersReferralBonusTimeHorizonBar, { type ManagerReferralTimeHorizon } from './ManagerMembersReferralBonusTimeHorizonBar';
import ManagerMembersReferralBonusKpis from './ManagerMembersReferralBonusKpis';
import { getInitialReferrals } from '@/app/frontend_manager/manager_members/members_referral_bonus/mocks/manager_members_referral_bonus_fixtures/ManagerMembersReferralBonusFixtures';

export function ManagerMembersReferralBonusReferralsClient() {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');
  const [records, setRecords] = useState<ReferralRow[]>(() => {
    if (typeof window === 'undefined') return getInitialReferrals();
    try {
      const stored = localStorage.getItem('manager_members_referral_records');
      return stored ? JSON.parse(stored) : getInitialReferrals();
    } catch {
      return getInitialReferrals();
    }
  });

  const updateRecords = (updater: (prev: ReferralRow[]) => ReferralRow[]) => {
    setRecords((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('manager_members_referral_records', JSON.stringify(next));
      } catch {
        // Safe storage fallback
      }
      return next;
    });
  };
  const [timeHorizon, setTimeHorizon] = useState<ManagerReferralTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
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

  const timeFilteredRecords = useMemo(() => {
    if (timeHorizon === 'all') return records;
    const now = new Date();
    return records.filter((r) => {
      const recDate = new Date(r.date);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [records, timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
      default: return 'All Time';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const filteredRows = useMemo(() => {
    return timeFilteredRecords.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || r.referrer.toLowerCase().includes(q) || r.referred.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || r.status === statusFilter;
      const matchM = methodFilter === 'All' || r.method.toLowerCase() === methodFilter.toLowerCase();
      return matchQ && matchS && matchM;
    });
  }, [timeFilteredRecords, searchQuery, statusFilter, methodFilter]);

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || statusFilter !== 'All' || methodFilter !== 'All' || timeHorizon !== 'all');

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

  const handleApprove = (id: string) => {
    updateRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Credited' } : r)));
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
    updateRecords((prev) => [newRecord, ...prev]);
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

      {/* Global Time Horizon Filter Bar */}
      <ManagerMembersReferralBonusTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={filteredRows.length}
      />

      {/* KPI Summary Cards */}
      <ManagerMembersReferralBonusKpis
        records={timeFilteredRecords}
        timeHorizonLabel={timeHorizonLabel}
        statusFilter={statusFilter}
        onSelectStatusFilter={(status) => {
          setStatusFilter(status);
          setPage(0);
        }}
      />

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
          setTimeHorizon('all');
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
export default ManagerMembersReferralBonusReferralsClient;
