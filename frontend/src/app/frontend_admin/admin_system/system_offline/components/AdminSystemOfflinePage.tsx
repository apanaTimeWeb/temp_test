// Responsibility: AdminSystemOfflinePage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
// RESPONSIBILITY: Entry page for the admin_system module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { ADMIN_SYSTEM_OFFLINE_FEATURES as FEATURES } from '@/app/frontend_admin/admin_system/system_offline/config/admin_system_offline_constants';

export function AdminSystemOfflinePage() {
  const t = useTranslations('ADMIN_SYSTEM_OFFLINE');

  const [dots, setDots]         = useState('');
  const [online, setOnline]     = useState(false);
  const [checking, setChecking] = useState(false);

  /* Animated dots */
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(t);
  }, []);

  /* Watch real connectivity */
  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline  = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleRetry = () => {
    setChecking(true);
    // Browser online status is not proof that this application is reachable.
    // Retry the current route only on explicit user action; never auto-redirect.
    window.location.reload();
  };

  return (
    /* This page intentionally skips the app shell (no sidebar/header) — PWA offline fallback */
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-page px-4 py-12 text-text-primary">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-primary-subtle opacity-30 blur-3xl" />

      <div className="w-full max-w-md flex flex-col items-center gap-0">

        {/* Icon */}
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-card shadow-card" aria-hidden="true">
          {online
            ? <CheckCircle size={18} strokeWidth={2} className="text-success-text" />
            : <WifiOff     size={18} strokeWidth={2} className="text-primary" />}
        </div>

        {/* Heading */}
        <h1 className={`mt-4 text-center text-2xl font-bold text-text-primary ${online ? 'text-success-text' : ''}`} role="status" aria-live="polite">
          {online ? t('NETWORK_AVAILABLE') : t('YOU_ARE_OFFLINE')}
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-center text-sm text-text-secondary">
          {online
            ? t('NETWORK_AVAILABLE_APP_UNVERIFIED')
            : t('NO_CONNECTION')}
        </p>

        {/* Feature list */}
        {!online && (
          <div className="mt-6 w-full space-y-2 rounded-xl border border-border bg-card p-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.textKey}
                className={`flex items-center gap-3 text-sm ${
                  f.available ? 'text-success-text' : 'text-text-secondary'
                }`}
              >
                {f.available
                  ? <CheckCircle size={18} strokeWidth={2} className="text-success-text shrink-0" />
                  : <XCircle size={18} strokeWidth={2}    className="text-danger-text shrink-0" />}
                {t(f.textKey)}
              </div>
            ))}
          </div>
        )}

        {/* Waiting / Retry section */}
        <div className="flex flex-col items-center gap-4 mt-6 w-full">
            {/* Pulsing status badge */}
            <div data-testid="admin_system-page-state-001" className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-text-secondary" role="status" aria-live="polite">
              <span className={`size-2 shrink-0 rounded-full bg-warning ${checking ? 'bg-info' : ''}`} />
              {checking ? t('CHECKING_CONNECTION') : online ? t('NETWORK_AVAILABLE_APP_UNVERIFIED') : `${t('WAITING_FOR_CONNECTION')}${dots}`}
            </div>

            {/* Retry button */}
            <button data-testid="admin_system-page-control-002"
              id="retry-connection-btn"
              onClick={handleRetry}
              disabled={checking}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={18} strokeWidth={2}
               
                className={checking ? 'motion-safe:animate-spin' : ''}
              />
              {checking ? t('CHECKING') : t('RETRY_CONNECTION')}
            </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-text-secondary">
          {t('FOOTER')}
        </p>
      </div>
    </div>
  );
}
