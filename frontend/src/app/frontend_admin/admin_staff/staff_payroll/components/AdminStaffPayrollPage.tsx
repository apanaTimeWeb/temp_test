'use client';

import { AdminStaffPayrollDisburseConfirmModal } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollDisburseConfirmModal';
import { AdminStaffPayrollKpiOverview } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollKpiOverview';
import { AdminStaffPayrollSalarySlipModal } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollSalarySlipModal';
import { AdminStaffPayrollTable } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollTable';
import { useAdminStaffPayroll } from '@/app/frontend_admin/admin_staff/staff_payroll/hooks/useAdminStaffPayroll';
import { CheckCheck,DollarSign,Download,FileSpreadsheet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Toaster,toast } from 'sonner';

export function AdminStaffPayrollPage() {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const model = useAdminStaffPayroll();

  const handleExportCsv = () => {
    if (model.records.length === 0) {
      toast.info('No payroll records to export');
      return;
    }
    const headers = [
      'Staff ID',
      'Staff Name',
      'Role',
      'Branch',
      'Month',
      'Base Salary (₹)',
      'Allowances (₹)',
      'Deductions (₹)',
      'Advance Settled (₹)',
      'Net Payable (₹)',
      'Status',
      'Bank Name',
      'Account Number',
      'IFSC Code',
      'Payment Method',
      'Transaction Ref / UTR',
      'Disbursed At',
    ];
    const rows = model.records.map((r) => [
      `"${r.staffId}"`,
      `"${r.staffName.replace(/"/g, '""')}"`,
      `"${r.role}"`,
      `"${r.branchName}"`,
      `"${r.month}"`,
      r.baseSalary,
      r.allowances,
      r.deductions,
      r.advanceSalaryDeduction || 0,
      r.netPayable,
      `"${r.status}"`,
      `"${r.bankDetails.bankName}"`,
      `"${r.bankDetails.accountNoMasked}"`,
      `"${r.bankDetails.ifsc}"`,
      `"${r.paymentMethod || '—'}"`,
      `"${r.transactionRef || '—'}"`,
      `"${r.disbursedAt || '—'}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-staff-payroll-register-${model.filters.selectedMonth || 'all'}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${model.records.length} payroll records to CSV`);
  };

  const handleExportExcel = () => {
    if (model.records.length === 0) {
      toast.info('No payroll records to export');
      return;
    }
    const tableRows = model.records
      .map(
        (r) => `
      <tr>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.staffId}</td>
        <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${r.staffName}</td>
        <td style="padding:6px;border:1px solid #ccc;">${r.role}</td>
        <td style="padding:6px;border:1px solid #ccc;">${r.branchName}</td>
        <td style="padding:6px;border:1px solid #ccc;">${r.month}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right;">₹${r.baseSalary.toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right;color:#059669;">+₹${r.allowances.toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right;color:#dc2626;">-₹${r.deductions.toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right;color:#d97706;">-₹${(r.advanceSalaryDeduction || 0).toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #ccc;text-align:right;font-weight:bold;color:#047857;">₹${r.netPayable.toLocaleString('en-IN')}</td>
        <td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${r.status}</td>
        <td style="padding:6px;border:1px solid #ccc;">${r.bankDetails.bankName}</td>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.bankDetails.accountNoMasked}</td>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.bankDetails.ifsc}</td>
        <td style="padding:6px;border:1px solid #ccc;">${r.paymentMethod || '—'}</td>
        <td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${r.transactionRef || '—'}</td>
        <td style="padding:6px;border:1px solid #ccc;">${r.disbursedAt || '—'}</td>
      </tr>`
      )
      .join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
          <title>Staff Payroll & Bank Disbursement Register</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 11px; }
            th { background-color: #0f172a; color: #ffffff; padding: 8px; border: 1px solid #334155; text-align: left; }
            td { padding: 6px; border: 1px solid #cbd5e1; }
          </style>
        </head>
        <body>
          <h2>Smart Library Network · Staff Payroll Register</h2>
          <p>Disbursement Period: ${model.filters.selectedMonth} | Total Records: ${model.records.length} | Generated: ${new Date().toLocaleString('en-IN')}</p>
          <table>
            <thead>
              <tr>
                <th>Staff ID</th><th>Name</th><th>Role</th><th>Branch</th><th>Month</th>
                <th>Base Salary</th><th>Allowances</th><th>Deductions</th><th>Advance Settled</th>
                <th>Net Payable</th><th>Status</th><th>Bank Name</th><th>Account No</th><th>IFSC</th>
                <th>Payment Method</th><th>UTR / Ref</th><th>Disbursed At</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-staff-payroll-register-${model.filters.selectedMonth || 'all'}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${model.records.length} payroll records to Excel (.xls)`);
  };

  const pendingCount = model.records.filter((r) => r.status !== 'DISBURSED').length;

  return (
    <div className="space-y-6">
      <Toaster position="bottom-right" richColors closeButton />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Compensation & Disbursement
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t('PAGE_TITLE')}
          </h1>
          <p className="text-sm text-text-secondary">
            {t('PAGE_SUBTITLE')}
          </p>
        </div>

        {/* Action Controls: Bulk Disburse & Register Exports */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="admin-staff-payroll-bulk-disburse-btn"
            onClick={model.handleBulkDisburse}
            disabled={pendingCount === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Mark all pending salaries as paid"
          >
            <CheckCheck size={14} />
            <span>Bulk Disburse ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover transition-colors shadow-xs"
            title="Export Payroll Register (CSV)"
          >
            <Download size={13} className="text-text-secondary" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-xs"
            title="Export Payroll Register for Bank Transfer (.xls)"
          >
            <FileSpreadsheet size={13} />
            <span>Excel Sheet</span>
          </button>
        </div>
      </div>

      {/* KPI Cards & Filter Bar */}
      <AdminStaffPayrollKpiOverview model={model} />

      {/* Payroll Records Table */}
      <AdminStaffPayrollTable
        records={model.records}
        onOpenSlip={model.setSelectedRecordForSlip}
        onOpenDisburse={model.setSelectedRecordForDisbursal}
      />

      {/* Double-Verification Disbursal Dialog */}
      <AdminStaffPayrollDisburseConfirmModal
        record={model.selectedRecordForDisbursal}
        isOpen={model.selectedRecordForDisbursal !== null}
        onClose={() => model.setSelectedRecordForDisbursal(null)}
        onConfirm={model.handleDisburseConfirm}
      />

      {/* Monthly Pay Slip Dialog */}
      <AdminStaffPayrollSalarySlipModal
        record={model.selectedRecordForSlip}
        isOpen={model.selectedRecordForSlip !== null}
        onClose={() => model.setSelectedRecordForSlip(null)}
      />
    </div>
  );
}

export default AdminStaffPayrollPage;

