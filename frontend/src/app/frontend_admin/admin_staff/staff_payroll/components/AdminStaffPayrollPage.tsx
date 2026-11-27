'use client';

import { AdminStaffPayrollDisburseConfirmModal } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollDisburseConfirmModal';
import { AdminStaffPayrollKpiOverview } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollKpiOverview';
import { AdminStaffPayrollSalarySlipModal } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollSalarySlipModal';
import { AdminStaffPayrollTable } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollTable';
import { useAdminStaffPayroll } from '@/app/frontend_admin/admin_staff/staff_payroll/hooks/useAdminStaffPayroll';
import {
  exportStaffPayrollCsv,
  exportStaffPayrollExcel,
} from '@/app/frontend_admin/admin_staff/staff_payroll/utils/adminStaffPayrollExports';
import { CheckCheck, DollarSign, Download, FileSpreadsheet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Toaster } from 'sonner';

export function AdminStaffPayrollPage() {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const model = useAdminStaffPayroll();
  const pendingCount = model.records.filter((r) => r.status !== 'DISBURSED').length;

  return (
    <div className="space-y-6">
      <Toaster position="bottom-right" richColors closeButton />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Compensation & Disbursement
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAGE_TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="admin-staff-payroll-bulk-disburse-btn"
            onClick={model.handleBulkDisburse}
            disabled={pendingCount === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-success px-3.5 py-2 text-xs font-semibold text-on-primary shadow-md hover:opacity-90 motion-safe:transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Mark all pending salaries as paid"
          >
            <CheckCheck size={14} />
            <span>Bulk Disburse ({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => exportStaffPayrollCsv(model.records, model.filters.selectedMonth)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-xs"
            title="Export Payroll Register (CSV)"
          >
            <Download size={13} className="text-text-secondary" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={() => exportStaffPayrollExcel(model.records, model.filters.selectedMonth)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-colors shadow-xs"
            title="Export Payroll Register for Bank Transfer (.xls)"
          >
            <FileSpreadsheet size={13} />
            <span>Excel Sheet</span>
          </button>
        </div>
      </div>

      <AdminStaffPayrollKpiOverview model={model} />

      <AdminStaffPayrollTable
        records={model.records}
        onOpenSlip={model.setSelectedRecordForSlip}
        onOpenDisburse={model.setSelectedRecordForDisbursal}
      />

      <AdminStaffPayrollDisburseConfirmModal
        record={model.selectedRecordForDisbursal}
        isOpen={model.selectedRecordForDisbursal !== null}
        onClose={() => model.setSelectedRecordForDisbursal(null)}
        onConfirm={model.handleDisburseConfirm}
      />

      <AdminStaffPayrollSalarySlipModal
        record={model.selectedRecordForSlip}
        isOpen={model.selectedRecordForSlip !== null}
        onClose={() => model.setSelectedRecordForSlip(null)}
      />
    </div>
  );
}
export default AdminStaffPayrollPage;
