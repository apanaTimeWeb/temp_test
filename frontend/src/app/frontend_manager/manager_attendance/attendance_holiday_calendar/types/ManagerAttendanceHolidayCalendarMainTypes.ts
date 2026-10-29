export type ManagerAttendanceHolidayCalendarQueryValue = string | string[] | undefined;

export interface ManagerAttendanceHolidayCalendarSearchParams {
  view?: ManagerAttendanceHolidayCalendarQueryValue;
  id?: ManagerAttendanceHolidayCalendarQueryValue;
  name?: ManagerAttendanceHolidayCalendarQueryValue;
  phone?: ManagerAttendanceHolidayCalendarQueryValue;
  smartId?: ManagerAttendanceHolidayCalendarQueryValue;
}

export interface ManagerAttendanceHolidayCalendarMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
