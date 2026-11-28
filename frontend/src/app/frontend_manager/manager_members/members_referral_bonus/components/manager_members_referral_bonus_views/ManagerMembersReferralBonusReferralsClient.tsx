'use client';
// RESPONSIBILITY: Orchestrate client-side view and local interactions for referral bonus management.
import { ManagerMembersReferralBonusAddModal } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal';
import { ManagerMembersReferralBonusApplyRenewalModal } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusApplyRenewalModal';
import ManagerMembersReferralBonusKpis from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusKpis';
import { ManagerMembersReferralBonusTable, type ReferralSortField } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusTable';
import { ManagerMembersReferralBonusDeleteModal } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusTableRowAndDeleteModal';
import ManagerMembersReferralBonusTimeHorizonBar, { type ManagerReferralTimeHorizon } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusTimeHorizonBar';
import { getInitialDemoReferrals } from '@/app/frontend_manager/manager_members/members_referral_bonus/config/manager_members_referral_bonus.demo_data';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';
import { CheckCircle2, Download, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export function ManagerMembersReferralBonusReferralsClient() {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');
  const [records, setRecords] = useState<ReferralRow[]>(getInitialDemoReferrals);
  const [deleteTarget, setDeleteTarget] = useState<ReferralRow | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const updateRecords = (updater: (prev: ReferralRow[]) => ReferralRow[]) => {
    setRecords((prev) => {
      const next = updater(prev);
      try {
        writeBrowserStorageItem('manager_members_referral_records', JSON.stringify(next));
      } catch {
        // Safe storage fallback
      }
      return next;
    });
  };

  useEffect(() => {
    const syncStoredReferrals = () => {
      try {
        const stored = readBrowserStorageItem('manager_members_referral_records');
        if (stored.available && stored.value) {
          const parsed = JSON.parse(stored.value);
          if (Array.isArray(parsed) && parsed.length > 0) setRecords(parsed);
        }
      } catch {
        // Safe storage fallback
      }
    };
    syncStoredReferrals();
    window.addEventListener('manager_referral_created', syncStoredReferrals);
    window.addEventListener('storage', syncStoredReferrals);
    return () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
      window.removeEventListener('manager_referral_created', syncStoredReferrals);
      window.removeEventListener('storage', syncStoredReferrals);
    };
  }, []);

  const [timeHorizon, setTimeHorizon] = useState<ManagerReferralTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Credited' | 'Pending' | 'Adjusted in Renewal'>('All');
  const [methodFilter, setMethodFilter] = useState<'All' | 'Fee Discount' | 'UPI Cash'>('All');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<ReferralSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [applyRenewalTarget, setApplyRenewalTarget] = useState<ReferralRow | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleSort = (field: ReferralSortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else { setSortField(null); setSortDirection('asc'); }
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
    if (timeHorizon === 'today') return 'Today';
    if (timeHorizon === 'this_week') return 'This Week';
    if (timeHorizon === 'this_month') return 'This Month';
    if (timeHorizon === 'custom') return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
    return 'All Time';
  }, [timeHorizon, customStartDate, customEndDate]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return timeFilteredRecords.filter((r) => {
      const matchQ = !q || r.referrer.toLowerCase().includes(q) || r.referred.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      return matchQ && (statusFilter === 'All' || r.status === statusFilter) && (methodFilter === 'All' || r.method.toLowerCase() === methodFilter.toLowerCase());
    });
  }, [timeFilteredRecords, searchQuery, statusFilter, methodFilter]);

  const hasActiveFilters = Boolean(searchQuery.trim() !== '' || statusFilter !== 'All' || methodFilter !== 'All' || timeHorizon !== 'all');

  const sortedRows = useMemo(() => {
    if (!sortField) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const cmp = String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedRows = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const showTempToastMsg = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => { setToastMsg(null); toastTimerRef.current = null; }, 3500);
  };

  const handleApprove = (id: string) => {
    updateRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Credited' } : r)));
    showTempToastMsg(`Referral ${id} approved and bonus credited!`);
  };

  const handleRenewalApplied = (updatedRow: ReferralRow) => {
    updateRecords((prev) => prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)));
    showTempToastMsg(`Referral ${updatedRow.id} bonus applied to ${updatedRow.referrer}'s next renewal!`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, referred } = deleteTarget;
    setDeleteTarget(null);
    updateRecords((prev) => prev.filter((r) => r.id !== id));
    showTempToastMsg(`Referral record ${id} (${referred}) removed successfully.`);
  };

  const escapeCsvCell = (val: unknown) => {
    let str = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = ['Ref ID', 'Referrer (Existing Student)', 'Referred Student (New)', 'Date', 'Bonus Amount', 'Payout Method', 'Status'].map(escapeCsvCell).join(',');
    const rows = filteredRows.map((r) => [r.id, r.referrer, r.referred, r.date, r.bonus, r.method, r.status].map(escapeCsvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `referrals_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleAddReferral = (newRow: ReferralRow) => {
    updateRecords((prev) => [newRow, ...prev]);
    toast.success(`Referral added for ${newRow.referred}`, { id: 'referral-add-success' });
    showTempToastMsg(`Referral ${newRow.id} created successfully.`);
  };

  return (
    <div className="mgr-page">
      <div className="mgr-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mgr-page-title text-xl sm:text-2xl font-bold text-primary">{tManagerUi('referral_program')}</h1>
          <p className="mgr-page-subtitle text-xs sm:text-sm text-secondary mt-1">Track student referrals, approve rewards, and disburse peer invite bonuses.</p>
        </div>
        <div className="mgr-page-actions flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={() => setIsAddModalOpen(true)} className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold w-full sm:w-auto motion-safe:transition-colors">
            <Plus size={16} className="shrink-0 text-on-primary" /><span>Add Referral</span>
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

      <ManagerMembersReferralBonusTimeHorizonBar timeHorizon={timeHorizon} onChangeTimeHorizon={setTimeHorizon} customStartDate={customStartDate} onCustomStartDateChange={setCustomStartDate} customEndDate={customEndDate} onCustomEndDateChange={setCustomEndDate} activeCount={filteredRows.length} />
      <ManagerMembersReferralBonusKpis records={timeFilteredRecords} timeHorizonLabel={timeHorizonLabel} statusFilter={statusFilter} onSelectStatusFilter={(status) => { setStatusFilter(status); setPage(0); }} />
      <ManagerMembersReferralBonusTable
        filteredRows={filteredRows} paginatedRows={paginatedRows} totalRows={totalRows}
        searchQuery={searchQuery} setSearchQuery={(val) => { setSearchQuery(val); setPage(0); }}
        statusFilter={statusFilter} setStatusFilter={(val) => { setStatusFilter(val); setPage(0); }}
        methodFilter={methodFilter} setMethodFilter={(val) => { setMethodFilter(val); setPage(0); }}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => { setSearchQuery(''); setStatusFilter('All'); setMethodFilter('All'); setTimeHorizon('all'); setPage(0); }}
        sortField={sortField} sortDirection={sortDirection} onToggleSort={toggleSort}
        onApprove={handleApprove} onApplyToRenewal={setApplyRenewalTarget}
        onDeleteReferral={(id) => { const t = records.find((r) => r.id === id); if (t) setDeleteTarget(t); }}
        onExportCsv={handleExportCsv} page={page} pageSize={pageSize} pageCount={pageCount} startItem={startItem} endItem={endItem}
        onPageChange={setPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
      />
      <ManagerMembersReferralBonusAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddReferral={handleAddReferral} nextId={`REF-${100 + records.length + 1}`} />
      <ManagerMembersReferralBonusApplyRenewalModal isOpen={Boolean(applyRenewalTarget)} onClose={() => setApplyRenewalTarget(null)} referral={applyRenewalTarget} onApplied={handleRenewalApplied} />
      <ManagerMembersReferralBonusDeleteModal deleteTarget={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
    </div>
  );
}

export default ManagerMembersReferralBonusReferralsClient;
