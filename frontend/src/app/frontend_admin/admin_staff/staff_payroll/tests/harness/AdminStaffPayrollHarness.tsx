import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import messagesEn from '@/app/frontend_admin/admin_staff/staff_payroll/locales/admin_staff_payroll_en.json';

interface Props {
  children: ReactNode;
  locale?: string;
}

export function AdminStaffPayrollHarness({ children, locale = 'en' }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={{ ADMIN_STAFF_PAYROLL: messagesEn }}>
      <div data-testid="admin-staff-payroll-harness">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}

export default AdminStaffPayrollHarness;

