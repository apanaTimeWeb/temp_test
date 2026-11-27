import { MANAGER_ATTENDANCE_QR_SCANNER_ROUTES } from '@/app/frontend_manager/manager_attendance/attendance_qr_scanner/config/manager_attendance_qr_scanner.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_qr_scanner.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('qr_scanner')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('live_scanning_not_connected')}</p>
      <Link
        href={MANAGER_ATTENDANCE_QR_SCANNER_ROUTES.qrScanner}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('qr_scanner')}
      </Link>
    </div>
  );
}
