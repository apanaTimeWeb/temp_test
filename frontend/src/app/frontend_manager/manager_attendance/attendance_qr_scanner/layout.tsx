import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Scanner | Library OS',
  description: 'High-speed contactless QR code check-in kiosk for library entry and exit',
};

import '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/components/manager_attendance_qr_scanner_styles/ManagerAttendanceQrScannerManager_qr_scanner.css';
export default function EngagementModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="engagement-theme">{children}</div>;
}
