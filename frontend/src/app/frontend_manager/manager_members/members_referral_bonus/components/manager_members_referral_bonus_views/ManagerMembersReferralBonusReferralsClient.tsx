'use client';
// RESPONSIBILITY: Orchestrate client-side view and local interactions for referral bonus management.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Clock, DollarSign, Gift, Plus, Search, Users, X } from 'lucide-react';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';

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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [referrer, setReferrer] = useState('');
  const [referred, setReferred] = useState('');
  const [bonusAmount, setBonusAmount] = useState('500');
  const [method, setMethod] = useState('Fee Discount');

  const filteredRows = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchQ = r.referrer.toLowerCase().includes(q) || r.referred.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchS = statusFilter === 'All' || r.status === statusFilter;
      return matchQ && matchS;
    });
  }, [records, searchQuery, statusFilter]);

  const totalRows = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedRows = filteredRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
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

  const handleAddReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrer.trim() || !referred.trim()) return;
    const newRecord: ReferralRow = {
      id: `REF-${100 + records.length + 1}`,
      referrer: referrer.trim(),
      referred: referred.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      bonus: `₹${bonusAmount || '500'}`,
      method,
    };
    setRecords([newRecord, ...records]);
    setReferrer('');
    setReferred('');
    setIsAddModalOpen(false);
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
        <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/30 text-success text-xs font-semibold flex items-center gap-2" role="status">
          <span>✓</span> <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="mgr-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">{tManagerUi('total_referrals')}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Users size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{records.length}</p>
        </div>
        <div className="mgr-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">{tManagerUi('pending_approvals')}</span>
            <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center"><Clock size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-warning mt-2">{pendingCount}</p>
        </div>
        <div className="mgr-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary font-medium">{tManagerUi('total_bonus_distributed')}</span>
            <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center"><DollarSign size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-success mt-2">₹{totalBonusAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mgr-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="mgr-input-icon-wrap flex-1">
            <Search size={15} className="mgr-input-icon text-secondary" />
            <input
              type="search"
              placeholder="Search by referrer, referred student, or Ref ID..."
              className="mgr-input mgr-input-with-icon text-xs"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div className="w-full sm:w-44">
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'All' | 'Credited' | 'Pending');
                setPage(0);
              }}
              className="mgr-select text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Credited">Credited</option>
              <option value="Pending">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                <th className="py-3 px-4">{tManagerUi('ref_id')}</th>
                <th className="py-3 px-4">{tManagerUi('referrer_existing')}</th>
                <th className="py-3 px-4">{tManagerUi('referred_student')}</th>
                <th className="py-3 px-4">{tManagerUi('date')}</th>
                <th className="py-3 px-4">{tManagerUi('bonus')}</th>
                <th className="py-3 px-4">{tManagerUi('payout_method')}</th>
                <th className="py-3 px-4">{tManagerUi('status')}</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary text-xs">No referral records matching the search criteria.</td>
                </tr>
              ) : (
                paginatedRows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="py-3 px-4 font-mono font-bold text-primary text-xs">{r.id}</td>
                    <td className="py-3 px-4 font-semibold text-primary text-xs">{r.referrer}</td>
                    <td className="py-3 px-4 text-primary text-xs">{r.referred}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-success text-xs">{r.bonus}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{r.method}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === 'Credited' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {r.status === 'Pending' ? (
                        <button type="button" onClick={() => handleApprove(r.id)} className="mgr-btn-primary mgr-btn-sm text-xs py-1 px-2.5 inline-flex items-center gap-1">
                          <CheckCircle2 size={13} /> Approve
                        </button>
                      ) : (
                        <span className="text-xs text-secondary/50 font-medium">Done</span>
                      )}
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
              Showing {startItem}–{endItem} of {totalRows} referral records
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="referrals-rows-per-page" className="text-xs text-secondary whitespace-nowrap">Rows per page:</label>
                <select
                  id="referrals-rows-per-page"
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

      {/* Add Referral Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Gift size={20} className="text-primary" />
                <h3 className="text-base font-bold text-primary">Record New Student Referral</h3>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-secondary hover:text-primary"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddReferral} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-primary block mb-1">Referrer Student (Name & Smart ID) *</label>
                <input type="text" required placeholder="e.g. Ramesh Kumar (LIB-1210)" className="mgr-input" value={referrer} onChange={(e) => setReferrer(e.target.value)} />
              </div>
              <div>
                <label className="font-semibold text-primary block mb-1">Referred New Student Name *</label>
                <input type="text" required placeholder="e.g. Alok Verma" className="mgr-input" value={referred} onChange={(e) => setReferred(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-primary block mb-1">Bonus Amount (₹)</label>
                  <input type="number" min="50" step="50" className="mgr-input font-mono" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold text-primary block mb-1">Reward Method</label>
                  <select className="mgr-select" value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="Fee Discount">Fee Discount</option>
                    <option value="UPI Cash">UPI Cash</option>
                    <option value="Locker Credit">Locker Credit</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="mgr-btn-ghost text-xs">Cancel</button>
                <button type="submit" className="mgr-btn-primary text-xs flex items-center gap-1.5"><CheckCircle2 size={14} /> Save Referral</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
