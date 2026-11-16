'use client';
// RESPONSIBILITY: Orchestrate client-side view and local interactions for referral bonus management.
import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Download, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { ManagerMembersReferralBonusTable, type ReferralSortField } from './ManagerMembersReferralBonusTable';
import { ManagerMembersReferralBonusAddModal } from '../manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal';
import { ManagerMembersReferralBonusApplyRenewalModal } from '../manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusApplyRenewalModal';
import ManagerMembersReferralBonusTimeHorizonBar, { type ManagerReferralTimeHorizon } from './ManagerMembersReferralBonusTimeHorizonBar';
import ManagerMembersReferralBonusKpis from './ManagerMembersReferralBonusKpis';
import { getInitialReferrals } from '@/app/frontend_manager/manager_members/members_referral_bonus/mocks/manager_members_referral_bonus_fixtures/ManagerMembersReferralBonusFixtures';

export function ManagerMembersReferralBonusReferralsClient() {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');

  // Hydration-safe initial state: Server & Client start with identical fixtures
  const [records, setRecords] = useState<ReferralRow[]>(getInitialReferrals);
  const [deleteTarget, setDeleteTarget] = useState<ReferralRow | null>(null);

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

  useEffect(() => {
    // Sync with localStorage on client mount after hydration is complete
    try {
      const stored = localStorage.getItem('manager_members_referral_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
        }
      }
    } catch {
      // Safe storage fallback
    }

    const handleSync = () => {
      try {
        const stored = localStorage.getItem('manager_members_referral_records');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setRecords(parsed);
        }
      } catch {
        // Safe storage fallback
      }
    };
    window.addEventListener('manager_referral_created', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('manager_referral_created', handleSync);
      window.removeEventListener('storage', handleSync);
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
      const q = searchQuery.toLowerCase().trim();
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

  const handleApplyToRenewal = (referral: ReferralRow) => {
    setApplyRenewalTarget(referral);
  };

  const handleRenewalApplied = (updatedRow: ReferralRow) => {
    updateRecords((prev) => prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)));
    setToastMsg(`Referral ${updatedRow.id} bonus applied to ${updatedRow.referrer}'s next renewal!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDeleteReferral = (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    setDeleteTarget(target);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, referred } = deleteTarget;
    setDeleteTarget(null);
    updateRecords((prev) => prev.filter((r) => r.id !== id));
    setToastMsg(`Referral record ${id} (${referred}) removed successfully.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const escapeCsvCell = (val: unknown) => {
    let str = String(val ?? '');
    if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    const headers = ['Ref ID', 'Referrer (Existing Student)', 'Referred Student (New)', 'Date', 'Bonus Amount', 'Payout Method', 'Status'].map(escapeCsvCell).join(',');
    const rows = filteredRows
      .map((r) => [r.id, r.referrer, r.referred, r.date, r.bonus, r.method, r.status].map(escapeCsvCell).join(','))
      .join('\r\n');
    const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
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
    toast.success(`Referral added for ${newRow.referred}`);
    setToastMsg(`Referral ${newRow.id} created successfully.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="mgr-page">
      {/* Header section with uniform buttons and colorful icons */}
      <div className="mgr-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mgr-page-title text-xl sm:text-2xl font-bold text-primary">{tManagerUi('referral_program')}</h1>
          <p className="mgr-page-subtitle text-xs sm:text-sm text-secondary mt-1">
            Track student referrals, approve rewards, and disburse peer invite bonuses.
          </p>
        </div>
        <div className="mgr-page-actions flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold w-full sm:w-auto transition-colors"
          >
            <Plus size={16} className="shrink-0 text-on-primary" />
            <span>Add Referral</span>
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
        onApplyToRenewal={handleApplyToRenewal}
        onDeleteReferral={handleDeleteReferral}
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

      {/* Apply to Next Renewal Modal */}
      <ManagerMembersReferralBonusApplyRenewalModal
        isOpen={Boolean(applyRenewalTarget)}
        onClose={() => setApplyRenewalTarget(null)}
        referral={applyRenewalTarget}
        onApplied={handleRenewalApplied}
      />

      {/* Centered Professional Mini Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-referral-dialog-title"
        >
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-danger-bg text-danger border border-border flex items-center justify-center mb-3.5 shrink-0">
              <Trash2 size={22} className="text-danger shrink-0" />
            </div>
            <h3 id="delete-referral-dialog-title" className="text-base font-bold text-primary">
              Remove Referral Record?
            </h3>
            <p className="text-xs text-secondary mt-1.5 leading-relaxed">
              Are you sure you want to remove referral <strong className="text-primary font-semibold">{deleteTarget.id}</strong> for <strong className="text-primary font-semibold">{deleteTarget.referred}</strong>? This action cannot be undone.
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

export default ManagerMembersReferralBonusReferralsClient;
