// components/AdminAccountsDailySettlementPage.tsx
'use client';
import AdminAccountsDailySettlementApprovalModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementApprovalModal';
import AdminAccountsDailySettlementDiscrepancyModal from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementDiscrepancyModal';
import { AdminAccountsDailySettlementHeader } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementHeader';
import AdminAccountsDailySettlementKpis from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementKpis';
import AdminAccountsDailySettlementTable from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTable';
import { useAdminAccountsDailySettlementMutations } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementMutations';
import { useAdminAccountsDailySettlementState } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/hooks/useAdminAccountsDailySettlementState';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { format } from 'date-fns';
import { Download,FileSpreadsheet,Printer,RotateCcw,Search,ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';

export function AdminAccountsDailySettlementPage() {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');
  const isDemo = isFrontendDemoModeEnabled();

  const {
    filteredRecords,
    tabFilter,
    setTabFilter,
    branchFilter,
    setBranchFilter,
    searchQuery,
    setSearchQuery,
    availableBranches,
    approvingRecord,
    setApprovingRecord,
    flaggingRecord,
    setFlaggingRecord,
    updateRecordStatus,
  } = useAdminAccountsDailySettlementState();

  const { isSubmitting, handleApprove, handleFlagDiscrepancy } =
    useAdminAccountsDailySettlementMutations(updateRecordStatus);

  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();

  // Specific Date Navigator state
  const demoTodayStr = '2026-11-01';
  const demoYesterdayStr = '2026-10-31';
  const [selectedDate, setSelectedDate] = useState<string>(demoTodayStr);
  const [dateMode, setDateMode] = useState<'all' | 'today' | 'yesterday' | 'custom'>('all');

  useEffect(() => {
    if (isAllBranches || !selectedBranch) {
      setBranchFilter('ALL');
    } else {
      const matched = availableBranches.find(
        (b) =>
          b.id.toLowerCase() === selectedBranchId.toLowerCase() ||
          b.name.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
          selectedBranch.name.toLowerCase().includes(b.name.toLowerCase())
      );
      if (matched) {
        setBranchFilter(matched.id);
      } else {
        setBranchFilter(selectedBranchId);
      }
    }
  }, [isAllBranches, selectedBranchId, selectedBranch, availableBranches, setBranchFilter]);

  const handleResetFilters = () => {
    setTabFilter('ALL');
    setBranchFilter('ALL');
    setSearchQuery('');
    setDateMode('all');
  };

  // Filter records by selected date
  const dateFilteredRecords = filteredRecords.filter((r) => {
    if (dateMode === 'all') return true;
    if (!r.date) return true;
    const target = dateMode === 'today' ? demoTodayStr : dateMode === 'yesterday' ? demoYesterdayStr : selectedDate;
    return r.date === target;
  });

  const pendingCount = dateFilteredRecords.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const flaggedCount = dateFilteredRecords.filter((r) => r.status === 'DISCREPANCY_FLAGGED').length;
  const dateModeLabel = dateMode === 'all' ? 'All Dates' : dateMode === 'today' ? 'Today (01 Nov)' : dateMode === 'yesterday' ? 'Yesterday (31 Oct)' : format(new Date(selectedDate), 'dd MMM yyyy');

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Shift',
      'Branch',
      'Manager',
      'Opening Cash (INR)',
      'Cash Collected (INR)',
      'UPI Collected (INR)',
      'Expenses Paid (INR)',
      'Expected Closing (INR)',
      'Actual Handover (INR)',
      'Variance (INR)',
      'Status',
      'Approved By',
    ];
    const rows = dateFilteredRecords.map((r) => [
      r.date,
      `"${r.shiftName}"`,
      `"${r.branchName}"`,
      `"${r.managerName}"`,
      (r.openingCash / 100).toFixed(2),
      (r.cashCollected / 100).toFixed(2),
      (r.upiCollected / 100).toFixed(2),
      (r.expensesPaid / 100).toFixed(2),
      (r.expectedClosingCash / 100).toFixed(2),
      (r.actualHandoverCash / 100).toFixed(2),
      (r.difference / 100).toFixed(2),
      r.status,
      `"${r.approvedBy ?? ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-daily-settlement-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${dateFilteredRecords.length} settlement records to CSV`);
  };

  const handleExportExcel = () => {
    const headers = [
      'Date',
      'Shift',
      'Branch',
      'Manager',
      'Opening Cash (INR)',
      'Cash Collected (INR)',
      'UPI Collected (INR)',
      'Expenses Paid (INR)',
      'Expected Closing (INR)',
      'Actual Handover (INR)',
      'Variance (INR)',
      'Status',
      'Approved By',
    ];
    const rows = dateFilteredRecords.map((r) => [
      r.date,
      r.shiftName,
      r.branchName,
      r.managerName,
      (r.openingCash / 100).toFixed(2),
      (r.cashCollected / 100).toFixed(2),
      (r.upiCollected / 100).toFixed(2),
      (r.expensesPaid / 100).toFixed(2),
      (r.expectedClosingCash / 100).toFixed(2),
      (r.actualHandoverCash / 100).toFixed(2),
      (r.difference / 100).toFixed(2),
      r.status.replace(/_/g, ' '),
      r.approvedBy ?? 'Pending Audit',
    ]);
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Settlements</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #047857; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #065f46; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #ecfdf5; }
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
    link.download = `admin-daily-settlement-history-${new Date().toISOString().slice(0, 10)}.xls`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${dateFilteredRecords.length} settlement records to Excel (.xls)`);
  };

  const handlePrintDailySettlementSummary = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=850,height=750');
    if (!printWindow) { window.print(); return; }
    const totalHandover = dateFilteredRecords.reduce((sum, r) => sum + r.actualHandoverCash, 0);
    const totalVariance = dateFilteredRecords.reduce((sum, r) => sum + r.difference, 0);
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Daily Cash Handover Closing Summary</title>
          <style>
            @page { size: landscape; margin: 12mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 11px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 15px; }
            .title { font-size: 18px; font-weight: 800; color: #047857; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background: #047857; color: #fff; padding: 8px 6px; text-align: left; }
            td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { border-top: 1px solid #e2e8f0; margin-top: 25px; padding-top: 10px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">SMART LIBRARY NETWORK · DAILY SETTLEMENT REPORT</div>
              <div style="font-size: 11px; color: #64748b;">Scope: ${selectedBranch ? selectedBranch.name : 'All Branches'} · Filter: ${dateModeLabel}</div>
            </div>
            <div style="text-align: right;">
              <div><strong>Records:</strong> ${dateFilteredRecords.length}</div>
              <div><strong>Total Handover Cash:</strong> ₹${(totalHandover / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div><strong>Net Variance:</strong> ₹${(totalVariance / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Branch</th>
                <th>Manager</th>
                <th style="text-align: right;">Opening</th>
                <th style="text-align: right;">Cash In</th>
                <th style="text-align: right;">UPI In</th>
                <th style="text-align: right;">Expenses</th>
                <th style="text-align: right;">Handover</th>
                <th style="text-align: right;">Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${dateFilteredRecords.map((r) => `
                <tr>
                  <td>${r.date}</td>
                  <td>${r.shiftName}</td>
                  <td>${r.branchName}</td>
                  <td>${r.managerName}</td>
                  <td style="text-align: right; font-family: monospace;">₹${(r.openingCash / 100).toFixed(2)}</td>
                  <td style="text-align: right; font-family: monospace;">₹${(r.cashCollected / 100).toFixed(2)}</td>
                  <td style="text-align: right; font-family: monospace;">₹${(r.upiCollected / 100).toFixed(2)}</td>
                  <td style="text-align: right; font-family: monospace; color:#b91c1c;">₹${(r.expensesPaid / 100).toFixed(2)}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: bold; color:#047857;">₹${(r.actualHandoverCash / 100).toFixed(2)}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: bold; color:${r.difference < 0 ? '#b91c1c' : '#047857'};">
                    ₹${(r.difference / 100).toFixed(2)}
                  </td>
                  <td>${r.status.replace(/_/g, ' ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <span>Treasury & Accounts Audit Division · Smart Library Systems</span>
            <span>Generated on: ${new Date().toLocaleDateString('en-IN')}</span>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Demo status alert */}
      {isDemo && (
        <div
          role="status"
          className="sr-only"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          <span>{t('LIVE_UNAVAILABLE')}</span>
        </div>
      )}

      {/* Executive Header & Specific Date Navigator */}
      <AdminAccountsDailySettlementHeader
        dateMode={dateMode}
        setDateMode={setDateMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        demoTodayStr={demoTodayStr}
        demoYesterdayStr={demoYesterdayStr}
        dateModeLabel={dateModeLabel}
        filteredCount={dateFilteredRecords.length}
      />

      {/* KPI Cards */}
      <AdminAccountsDailySettlementKpis records={dateFilteredRecords} />

      {/* Filter and Tab Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex border-b border-border overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setTabFilter('ALL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'ALL'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.ALL')} ({dateFilteredRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('PENDING_APPROVAL')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'PENDING_APPROVAL'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.PENDING')}
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-warning-bg px-2 py-0.5 text-xs font-bold text-warning-text">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('APPROVED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'APPROVED'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.APPROVED')}
          </button>
          <button
            type="button"
            onClick={() => setTabFilter('DISCREPANCY_FLAGGED')}
            className={`whitespace-nowrap pb-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 motion-safe:transition-colors ${
              tabFilter === 'DISCREPANCY_FLAGGED'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('TABS.FLAGGED')}
            {flaggedCount > 0 && (
              <span className="ml-1.5 rounded-full bg-destructive-bg px-2 py-0.5 text-xs font-bold text-destructive">
                {flaggedCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input maxLength={100}
                type="text"
                placeholder={t('FILTERS.SEARCH_PLACEHOLDER')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-border bg-card pl-9 pr-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Reset Filters button */}
            {(branchFilter !== 'ALL' || tabFilter !== 'ALL' || searchQuery.trim() || dateMode !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t('FILTERS.CLEAR_FILTERS')}</span>
              </button>
            )}

            {/* Export & Print Toolbar */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-border">
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
                title="Export daily settlement history to CSV"
              >
                <Download size={13} className="text-emerald-500" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
                title="Export daily settlement history to Excel (.xls)"
              >
                <FileSpreadsheet size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={handlePrintDailySettlementSummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
                title="Print daily settlement summary report"
              >
                <Printer size={13} className="text-cyan-400" />
                <span>Print Summary</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Settlements Table */}
      <AdminAccountsDailySettlementTable
        records={dateFilteredRecords}
        onApprove={(record) => setApprovingRecord(record)}
        onFlag={(record) => setFlaggingRecord(record)}
        onResetFilters={handleResetFilters}
      />

      {/* Approval Modal */}
      <AdminAccountsDailySettlementApprovalModal
        record={approvingRecord}
        isOpen={approvingRecord !== null}
        isSubmitting={isSubmitting}
        onClose={() => setApprovingRecord(null)}
        onConfirm={handleApprove}
      />

      {/* Discrepancy Flagging Modal */}
      <AdminAccountsDailySettlementDiscrepancyModal
        record={flaggingRecord}
        isOpen={flaggingRecord !== null}
        isSubmitting={isSubmitting}
        onClose={() => setFlaggingRecord(null)}
        onConfirm={handleFlagDiscrepancy}
      />
    </div>
  );
}

export default AdminAccountsDailySettlementPage;
