'use client';
/** Responsibility: Superadmin System Offline Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient -> typed leaf-owned child components; sibling business modules are not required. */

import { useTranslations } from 'next-intl';
import { useSuperadminLibrariesOfflineOperationsState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_offline_operations/hooks/useSuperadminLibrariesOfflineOperationsState';
import { useEffect, useRef } from 'react';
import { WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_ROUTES as __SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_library_offline_operations/config/libraries_library_offline_operations.url_config";
import { SUPERADMIN_SYSTEM_OFFLINE_FEATURES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_offline_operations/constants/SuperadminLibrariesOverviewLibraryOfflineOperationsFeatures';


/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient`.
 * Owns local UI state for `dots`, `online`, `checking`.
 * Effect lifecycle boundaries are `[online]`; listeners/timers/focus are cleaned up by their owning effects.
 */
export default function SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { dots, setDots, online, setOnline, checking, setChecking } = useSuperadminLibrariesOfflineOperationsState();
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effect contract: animate the offline status punctuation; the empty dependency list intentionally starts one interval for this mounted route and cleanup clears it.
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(t);
  }, []);

  // Effect contract: mirror browser online/offline events into local status; the empty dependency list registers one pair of listeners and cleanup removes both.
  useEffect(() => {
    // Synchronize current browser connectivity in addition to future events.
    setOnline(navigator.onLine);
    const onOnline  = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
      if (retryTimeoutRef.current !== null) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  // Effect contract: navigate after connectivity returns; dependency set [online] starts the delay only on the restored-online transition and cleanup cancels stale delays.
  useEffect(() => {
    if (!online) return;
    const t = setTimeout(() => { window.location.href = __SUPERADMIN_LIBRARIES_LIBRARY_OFFLINE_OPERATIONS_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_OFFLINE_OPERATIONS_SYSTEM_URLS.DASHBOARD; }, 1500);
    return () => clearTimeout(t);
  }, [online]);

  const handleRetry = () => {
    if (retryTimeoutRef.current !== null) clearTimeout(retryTimeoutRef.current);
    setChecking(true);
    retryTimeoutRef.current = setTimeout(() => {
      retryTimeoutRef.current = null;
      if (navigator.onLine) setOnline(true);
      else setChecking(false);
    }, 1200);
  };

  return (
    /* This page intentionally skips the app shell (no sidebar/header) — PWA offline fallback */
    <div className="sys-offline-page">
      {/* Ambient glow */}
      <div className="sys-offline-glow" />

      <div className="w-full max-w-105 flex flex-col items-center gap-0">

        {/* Icon */}
        <div className="sys-offline-icon-box">
          {online
            ? <CheckCircle size={52} className="text-success" />
            : <WifiOff     size={52} className="text-primary" />}
        </div>

        {/* Announce only stable connectivity text; the animated waiting punctuation below stays outside this live region. */}
        <div aria-live="polite" aria-atomic="true" data-testid="offline-connectivity-announcement">
          {/* Heading */}
          <h1 className={`sys-offline-title ${online ? 'sys-offline-title--online' : ''}`}>
            {online ? tCopy('COPY.BACK_ONLINE') : tCopy('COPY.YOU_ARE_OFFLINE')}
          </h1>

          {/* Subtitle */}
          <p className="sys-offline-subtitle">
            {online
              ? tCopy('COPY.RECONNECTED_REDIRECTING')
              : tCopy('COPY.NO_INTERNET_FEATURES_STILL_WORK')}
          </p>
        </div>

        {/* Feature list */}
        {!online && (
          <div className="sys-offline-feature-list">
            {SUPERADMIN_SYSTEM_OFFLINE_FEATURES.map((f) => (
              <div
                key={f.id}
                className={`sys-offline-feature-item ${
                  f.available ? 'sys-offline-feature-item--available' : 'sys-offline-feature-item--unavailable'
                }`}
              >
                {f.available
                  ? <CheckCircle size={16} className="text-success shrink-0" />
                  : <XCircle    size={16} className="text-danger shrink-0" />}
                {tCopy(f.labelKey)}
              </div>
            ))}
          </div>
        )}

        {/* Waiting / Retry section */}
        {!online && (
          <div className="flex flex-col items-center gap-4 mt-6 w-full">
            {/* Pulsing status badge */}
            <div className="sys-offline-status-badge">
              <span className={`sys-offline-dot ${checking ? 'sys-offline-dot--checking' : ''}`} />
              {checking ? tCopy('COPY.CHECKING_CONNECTION') : tCopy('COPY.WAITING_FOR_CONNECTION', { dots })}
            </div>

            {/* Retry button */}
            <button type="button"
              id="retry-connection-btn"
              onClick={handleRetry}
              disabled={checking}
              className="sys-offline-retry-btn"
             data-testid="superadmin-system-system-offline-retry-connection-btn-1">
              <RefreshCw
                size={16}
                className={checking ? 'motion-safe:animate-spin' : ''}
              />
              {checking ? tCopy('COPY.CHECKING') : tCopy('COPY.RETRY_CONNECTION')}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="sys-offline-footer">
          {tCopy("COPY.LIBRARY_OS_WORKS_OFFLINE_WITH_LIMITED_FUNCTIONALITY")}</p>
      </div>
    </div>
  );
}
