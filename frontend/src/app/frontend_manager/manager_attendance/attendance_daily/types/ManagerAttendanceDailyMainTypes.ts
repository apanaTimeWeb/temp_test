export type ManagerAttendanceDailyQueryValue = string | string[] | undefined;

export interface ManagerAttendanceDailySearchParams {
  view?: ManagerAttendanceDailyQueryValue;
  id?: ManagerAttendanceDailyQueryValue;
  name?: ManagerAttendanceDailyQueryValue;
  phone?: ManagerAttendanceDailyQueryValue;
  smartId?: ManagerAttendanceDailyQueryValue;
}

export interface ManagerAttendanceDailyMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
