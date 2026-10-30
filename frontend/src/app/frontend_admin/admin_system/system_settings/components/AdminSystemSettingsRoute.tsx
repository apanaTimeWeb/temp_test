// RESPONSIBILITY: Feature-local visibility guard for the admin system settings route.
'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCurrentUser } from '@/app/frontend_admin/lib/auth';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SYSTEM_SETTINGS_ROUTES } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';

const ADMIN_SYSTEM_ALLOWED_ROLES = ['admin', 'superadmin'] as const;

/** Visibility guard only; backend endpoints remain responsible for authorization. */
export function AdminSystemRoute({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [authorizedPath, setAuthorizedPath] = useState<string | null>(isDemoMode ? pathname : null);

  useEffect(() => {
    if (isDemoMode) { setAuthorizedPath(pathname); return; }
    let active = true;
    setAuthorizedPath(null);
    void getCurrentUser().then((user) => {
      if (!active) return;
      if (!user) { router.replace(`${ADMIN_SYSTEM_SETTINGS_ROUTES.AUTH_LOGIN}?returnTo=${encodeURIComponent(pathname)}&reason=unauthenticated`); return; }
      if (!ADMIN_SYSTEM_ALLOWED_ROLES.includes(user.role as (typeof ADMIN_SYSTEM_ALLOWED_ROLES)[number])) { router.replace(ADMIN_SYSTEM_SETTINGS_ROUTES.ACCESS_DENIED); return; }
      setAuthorizedPath(pathname);
    }).catch(() => {
      if (active) router.replace(`${ADMIN_SYSTEM_SETTINGS_ROUTES.AUTH_LOGIN}?returnTo=${encodeURIComponent(pathname)}&reason=session-unavailable`);
    });
    return () => { active = false; };
  }, [pathname, router, isDemoMode]);

  if (isDemoMode || authorizedPath === pathname) return <>{children}</>;
  return <main className="min-h-screen bg-page p-6 text-text-secondary" role="status" aria-live="polite" aria-busy="true"><span>{t('ACCESS_CHECKING')}</span></main>;
}
