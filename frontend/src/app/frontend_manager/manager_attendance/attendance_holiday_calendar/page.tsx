import { ManagerAttendanceHolidayCalendarMain } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/components/ManagerAttendanceHolidayCalendarMain';
import type { ManagerAttendanceHolidayCalendarMainProps } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarMainTypes';
import type { ManagerAttendanceHolidayCalendarPageProps } from '@/app/frontend_manager/manager_attendance/attendance_holiday_calendar/types/ManagerAttendanceHolidayCalendarComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAttendanceHolidayCalendarPage({ searchParams }: ManagerAttendanceHolidayCalendarPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAttendanceHolidayCalendarMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerAttendanceHolidayCalendarMain {...mainProps} />;
}
