'use client';

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
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
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

