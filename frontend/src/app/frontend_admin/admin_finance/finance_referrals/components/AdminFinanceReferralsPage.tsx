'use client';
// Responsibility: AdminFinanceReferralsPage component owned by admin_finance; responsibility folder: admin_finance_components_views.

import { AdminFinanceReferralPayoutVoucherModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralPayoutVoucherModal';
import { AdminFinanceReferralsKpiCards } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsKpiCards';
import { AdminFinanceReferralsRedeemModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsRedeemModal';
import {
AdminFinanceReferralsTable,
type ReferralsSortField,
} from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTable';
import {
AdminFinanceReferralsTimeHorizonBar,
type AdminFinanceReferralsTimeHorizon,
} from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTimeHorizonBar';
import { ADMIN_FINANCE_DEMO_REFERRERS } from '@/app/frontend_admin/admin_finance/finance_referrals/mocks/AdminFinanceReferralsDemoFixtures';
import type { AdminFinanceDemoReferrer,ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { Download,FileSpreadsheet,Printer,RotateCcw,Search,Users2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useMemo,useState } from 'react';
import { toast } from 'sonner';

export function AdminFinanceReferralsPage() {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');
  const [referrers, setReferrers] = useState<AdminFinanceDemoReferrer[]>(ADMIN_FINANCE_DEMO_REFERRERS);
  const [redeemTarget, setRedeemTarget] = useState<AdminFinanceDemoReferrer | null>(null);
  const [payoutVouchers, setPayoutVouchers] = useState<ReferralPayoutVoucher[]>([]);
  const [activeVoucher, setActiveVoucher] = useState<ReferralPayoutVoucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<ReferralsSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Time Horizon State
  const [timeRange, setTimeRange] = useState<AdminFinanceReferralsTimeHorizon>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case 'all':
        return 'All Time';
      case 'today':
        return 'Today';
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return 'Custom Range';
      default:
        return 'All Time';
    }
  }, [timeRange]);

  const toggleSort = (field: ReferralsSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleConfirmRedeem = (
    referrerId: number,
    amountMinor: number,
    mode: 'fee_adjustment' | 'cash_upi',
    notes: string,
    voucherMeta?: {
      subChannel?: string;
      utrReference?: string;
      invoiceCreditNote?: string;
    }
  ) => {
    const target = referrers.find((r) => r.id === referrerId);
    const newVoucher: ReferralPayoutVoucher = {
      voucherId: `PV-REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referrerId,
      studentName: target?.name ?? 'Student',
      smartId: target?.smartId ?? 'SL-000',
      branch: target?.branch ?? selectedBranch?.name ?? 'Downtown Central',
      amountMinor,
      mode,
      subChannel: voucherMeta?.subChannel,
      utrReference: voucherMeta?.utrReference,
      invoiceCreditNote: voucherMeta?.invoiceCreditNote,
      disbursedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      authorizedBy: 'Smart Library Treasury & Accounts',
      notes,
    };

    setPayoutVouchers((prev) => [newVoucher, ...prev]);
    setActiveVoucher(newVoucher);

    setReferrers((prev) =>
      prev.map((r) => {
        if (r.id === referrerId) {
          const newRedeemed = r.redeemed + amountMinor;
          const newBalance = Math.max(0, r.balance - amountMinor);
          return { ...r, redeemed: newRedeemed, balance: newBalance };
        }
        return r;
      })
    );
  };

  const handleViewVoucher = (referrer: AdminFinanceDemoReferrer) => {
    const existing = payoutVouchers.find((v) => v.referrerId === referrer.id);
    if (existing) {
      setActiveVoucher(existing);
    } else {
      const fallbackVoucher: ReferralPayoutVoucher = {
        voucherId: `PV-REF-${new Date().getFullYear()}-${1000 + referrer.id}`,
        referrerId: referrer.id,
        studentName: referrer.name,
        smartId: referrer.smartId,
        branch: referrer.branch ?? selectedBranch?.name ?? 'Downtown Central',
        amountMinor: referrer.redeemed > 0 ? referrer.redeemed : 50000,
        mode: 'fee_adjustment',
        subChannel: 'Fee Credit Note',
        invoiceCreditNote: `CR-REF-${new Date().getFullYear()}-${2000 + referrer.id}`,
        disbursedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        authorizedBy: 'Smart Library Accounts',
        notes: 'Historical referral reward bonus clearance adjusted against library subscription ledger',
      };
      setActiveVoucher(fallbackVoucher);
    }
  };

  const { selectedBranch, isAllBranches } = useAdminBranch();

  const filteredReferrers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return referrers.filter((r) => {
      const matchBranch = isAllBranches || !selectedBranch || !r.branch || r.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        (r as unknown as { smartId?: string }).smartId?.toLowerCase().includes(q) ||
        r.referredNames.some((rn) => rn.toLowerCase().includes(q));
      return matchBranch && matchSearch;
    });
  }, [search, isAllBranches, selectedBranch, referrers]);

  // Dynamically compute horizon-scaled KPIs
  const horizonMultiplier = useMemo(() => {
    switch (timeRange) {
      case 'today':
        return 0.12;
      case 'this_week':
        return 0.35;
      case 'this_month':
        return 0.85;
      case 'custom':
        return 0.6;
      case 'all':
      default:
        return 1.0;
    }
  }, [timeRange]);

  const totalReferrals = useMemo(() => {
    const raw = filteredReferrers.reduce((a, referrer) => a + referrer.referredNames.length, 0);
    return Math.max(1, Math.round(raw * horizonMultiplier));
  }, [filteredReferrers, horizonMultiplier]);

  const totalBonus = useMemo(() => {
    const raw = filteredReferrers.reduce((a, r) => a + r.bonusEarned, 0);
    return Math.round(raw * horizonMultiplier);
  }, [filteredReferrers, horizonMultiplier]);

  const topReferrer = useMemo(() => {
    return [...filteredReferrers].sort((left, right) => right.referredNames.length - left.referredNames.length)[0] ?? { name: '—', referredNames: [] as string[] };
  }, [filteredReferrers]);

  const sortedReferrers = useMemo(() => {
    if (!sortField) return filteredReferrers;
    return [...filteredReferrers].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'name') {
        aVal = a.name;
        bVal = b.name;
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' })
          : bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
      } else if (sortField === 'referredCount') {
        aVal = a.referredNames.length;
        bVal = b.referredNames.length;
      } else if (sortField === 'bonusEarned') {
        aVal = a.bonusEarned;
        bVal = b.bonusEarned;
      } else if (sortField === 'redeemed') {
        aVal = a.redeemed;
        bVal = b.redeemed;
      } else if (sortField === 'balance') {
        aVal = a.bonusEarned - a.redeemed;
        bVal = b.bonusEarned - b.redeemed;
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredReferrers, sortField, sortDirection]);

  const paginatedReferrers = useMemo(
    () => sortedReferrers.slice(page * pageSize, (page + 1) * pageSize),
    [sortedReferrers, page, pageSize]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleExportCsv = () => {
    const headers = ['Rank', 'Referrer Student', 'Smart ID', 'Branch', 'Referred Count', 'Referred Students', 'Total Bonus Earned (INR)', 'Redeemed (INR)', 'Outstanding Balance (INR)'];
    const rows = filteredReferrers.map((r, i) => [
      i + 1,
      `"${r.name.replace(/"/g, '""')}"`,
      r.smartId,
      `"${(r.branch ?? selectedBranch?.name ?? 'Downtown Central').replace(/"/g, '""')}"`,
      r.referredNames.length,
      `"${r.referredNames.join(', ').replace(/"/g, '""')}"`,
      r.bonusEarned / 100,
      r.redeemed / 100,
      r.balance / 100,
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-finance-referral-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredReferrers.length} referral records to CSV`);
  };

  const handleExportExcel = () => {
    const headers = ['Rank', 'Referrer Student', 'Smart ID', 'Branch', 'Referred Count', 'Referred Students', 'Total Bonus Earned (INR)', 'Redeemed (INR)', 'Outstanding Balance (INR)'];
    const rows = filteredReferrers.map((r, i) => [
      i + 1,
      r.name,
      r.smartId,
      r.branch ?? selectedBranch?.name ?? 'Downtown Central',
      r.referredNames.length,
      r.referredNames.join(', '),
      r.bonusEarned / 100,
      r.redeemed / 100,
      r.balance / 100,
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Referrals</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #4338ca; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #3730a3; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #eef2ff; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `.trim();
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-finance-referral-leaderboard-${new Date().toISOString().slice(0, 10)}.xls`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredReferrers.length} referral records to Excel (.xls)`);
  };

  const handlePrintLeaderboard = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=850,height=750');
    if (!printWindow) { window.print(); return; }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Referral Rewards Leaderboard</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 15px; }
            .title { font-size: 18px; font-weight: 800; color: #4338ca; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
            th { background: #4f46e5; color: #fff; padding: 8px; text-align: left; font-size: 11px; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">SMART LIBRARY NETWORK</div>
              <div style="font-size: 11px; color: #64748b;">Referral Rewards Program & Student Leaderboard · ${timeRangeLabel}</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b;">
              <div>Scope: ${selectedBranch ? selectedBranch.name : 'All Branches'}</div>
              <div>Generated: ${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Referrer Name</th>
                <th>Smart ID</th>
                <th>Referred Count</th>
                <th style="text-align: right;">Total Bonus</th>
                <th style="text-align: right;">Redeemed</th>
                <th style="text-align: right;">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReferrers.map((r, i) => `
                <tr>
                  <td>#${i + 1}</td>
                  <td><strong>${r.name}</strong></td>
                  <td>${r.smartId}</td>
                  <td>${r.referredNames.length} students</td>
                  <td style="text-align: right; font-weight: bold; color: #15803d;">₹${(r.bonusEarned / 100).toLocaleString('en-IN')}</td>
                  <td style="text-align: right;">₹${(r.redeemed / 100).toLocaleString('en-IN')}</td>
                  <td style="text-align: right; font-weight: bold;">₹${(r.balance / 100).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Smart Library Student Ambassador & Referral Program · Certified by Accounts</p>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (!isFrontendDemoModeEnabled()) {
    return (
      <div className="rounded-lg border border-border bg-card p-6" role="status">
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-2 text-text-secondary">{t('LIVE_UNAVAILABLE')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
            <Users2 size={13} className="text-indigo-400" />
            Student Referral Rewards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('TITLE')}</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">{t('SUBTITLE')}</p>
      </div>

      {/* Global Time Horizon Selector */}
      <AdminFinanceReferralsTimeHorizonBar
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        timeRangeLabel={timeRangeLabel}
        activeCount={filteredReferrers.length}
      />

      {/* KPI Cards with Dynamic Period Badges */}
      <AdminFinanceReferralsKpiCards
        totalReferrals={totalReferrals}
        totalBonus={totalBonus}
        topReferrer={topReferrer}
        timeRangeLabel={timeRangeLabel}
        activeCount={filteredReferrers.length}
      />

      {/* Search Bar & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input maxLength={100}
              type="text"
              placeholder="Search referrer or student name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="min-h-11 w-full rounded-md border border-border bg-input pl-9 pr-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          {(search.trim() !== '' || timeRange !== 'this_month' || sortField !== null) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTimeRange('this_month');
                setSortField(null);
                setPage(0);
              }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover self-start sm:self-auto"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Export & Print Toolbar */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
            title="Export leaderboard to CSV"
          >
            <Download size={14} className="text-indigo-400" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
            title="Export leaderboard to Excel (.xls)"
          >
            <FileSpreadsheet size={14} className="text-emerald-500" />
            <span>Excel (.xls)</span>
          </button>
          <button
            type="button"
            onClick={handlePrintLeaderboard}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
            title="Print referral leaderboard summary"
          >
            <Printer size={14} className="text-cyan-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Presentational Referrals Table */}
      <AdminFinanceReferralsTable
        paginatedReferrers={paginatedReferrers}
        filteredCount={filteredReferrers.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize: number) => {
          setPageSize(newSize);
          setPage(0);
        }}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        expandedId={expanded}
        onToggleExpand={setExpanded}
        onRedeem={(ref) => setRedeemTarget(ref)}
        onViewVoucher={handleViewVoucher}
      />

      {/* Interactive Referral Bonus Clearance / Disbursement Modal */}
      <AdminFinanceReferralsRedeemModal
        referrer={redeemTarget}
        isOpen={Boolean(redeemTarget)}
        onClose={() => setRedeemTarget(null)}
        onConfirmRedeem={handleConfirmRedeem}
      />

      {/* Official Referral Payout Voucher Modal */}
      <AdminFinanceReferralPayoutVoucherModal
        voucher={activeVoucher}
        isOpen={Boolean(activeVoucher)}
        onClose={() => setActiveVoucher(null)}
      />
    </div>
  );
}

export default AdminFinanceReferralsPage;
