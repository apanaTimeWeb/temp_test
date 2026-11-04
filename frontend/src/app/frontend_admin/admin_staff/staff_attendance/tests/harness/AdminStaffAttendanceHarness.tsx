import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import messagesEn from '@/app/frontend_admin/admin_staff/staff_attendance/locales/admin_staff_attendance_en.json';

interface Props {
  children: ReactNode;
  locale?: string;
}

export function AdminStaffAttendanceHarness({ children, locale = 'en' }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={{ ADMIN_STAFF_ATTENDANCE: messagesEn }}>
      <div data-testid="admin-staff-attendance-harness">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}

export default AdminStaffAttendanceHarness;

