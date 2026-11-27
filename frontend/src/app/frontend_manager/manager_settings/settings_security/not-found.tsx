import { MANAGER_SETTINGS_SECURITY_ROUTES } from '@/app/frontend_manager/manager_settings/settings_security/config/manager_settings_security.url_config';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">Security &amp; Authentication</h2>
      <p className="text-sm text-muted-foreground">
        The requested security settings view could not be found.
      </p>
      <Link
        href={MANAGER_SETTINGS_SECURITY_ROUTES.root}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Return to Security Settings
      </Link>
    </div>
  );
}
