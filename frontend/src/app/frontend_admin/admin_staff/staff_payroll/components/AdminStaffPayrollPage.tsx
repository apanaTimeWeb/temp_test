'use client';

import { DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Toaster } from 'sonner';
import { useAdminStaffPayroll } from '@/app/frontend_admin/admin_staff/staff_payroll/hooks/useAdminStaffPayroll';
import { AdminStaffPayrollKpiOverview } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollKpiOverview';
import { AdminStaffPayrollTable } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollTable';
import { AdminStaffPayrollDisburseConfirmModal } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollDisburseConfirmModal';
import { AdminStaffPayrollSalarySlipModal } from '@/app/frontend_admin/admin_staff/staff_payroll/components/AdminStaffPayrollSalarySlipModal';

export function AdminStaffPayrollPage() {
  const t = useTranslations('ADMIN_STAFF_PAYROLL');
  const model = useAdminStaffPayroll();

  return (
    <div className="space-y-6">
      <Toaster position="bottom-right" richColors closeButton />

      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-4">
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

