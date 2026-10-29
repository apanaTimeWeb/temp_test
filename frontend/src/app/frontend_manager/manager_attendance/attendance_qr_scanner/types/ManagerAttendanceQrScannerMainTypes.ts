export type ManagerAttendanceQrScannerQueryValue = string | string[] | undefined;

export interface ManagerAttendanceQrScannerSearchParams {
  view?: ManagerAttendanceQrScannerQueryValue;
  id?: ManagerAttendanceQrScannerQueryValue;
  name?: ManagerAttendanceQrScannerQueryValue;
  phone?: ManagerAttendanceQrScannerQueryValue;
  smartId?: ManagerAttendanceQrScannerQueryValue;
}

export interface ManagerAttendanceQrScannerMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
