import { ManagerAttendanceMonthlyHistoryMain } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/components/ManagerAttendanceMonthlyHistoryMain';
import type { ManagerAttendanceMonthlyHistoryMainProps } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryMainTypes';
import type { ManagerAttendanceMonthlyHistoryPageProps } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/types/ManagerAttendanceMonthlyHistoryTypes';

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAttendanceMonthlyHistoryRoutePage({
  searchParams,
}: ManagerAttendanceMonthlyHistoryPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAttendanceMonthlyHistoryMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    smartId: firstValue(params.smartId),
    month: firstValue(params.month),
  };
  return (
    <ManagerAttendanceMonthlyHistoryMain
      view={mainProps.view}
      id={mainProps.id}
      smartId={mainProps.smartId}
      month={mainProps.month}
    />
  );
}
