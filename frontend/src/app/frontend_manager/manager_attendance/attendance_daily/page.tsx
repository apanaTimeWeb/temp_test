import { ManagerAttendanceDailyMain } from '@/app/frontend_manager/manager_attendance/attendance_daily/components/ManagerAttendanceDailyMain';
import type { ManagerAttendanceDailyMainProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyMainTypes';
import type { ManagerAttendanceDailyPageProps } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAttendanceDailyPage({ searchParams }: ManagerAttendanceDailyPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAttendanceDailyMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerAttendanceDailyMain {...mainProps} />;
}
