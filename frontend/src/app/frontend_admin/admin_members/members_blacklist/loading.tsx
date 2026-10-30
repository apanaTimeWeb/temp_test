// RESPONSIBILITY: Renders the native localized route skeleton for Admin Members.
// DATA FLOW: Next.js App Router -> loading.tsx while the route segment is loading.

import { useTranslations } from 'next-intl';

export default function AdminMembersLoading() {
  const t = useTranslations('ADMIN_BLACKLIST');

  return (
    <div className="space-y-6 p-4 md:p-6" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{t('LOADING_ARIA')}</span>
      <div className="motion-safe:animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-surface-highlight" />
        <div className="h-24 rounded-xl bg-surface-highlight" />
        <div className="h-12 rounded-lg bg-surface-highlight" />
        <div className="h-64 rounded-xl bg-surface-highlight" />
      </div>
    </div>
  );
}
