import { useTranslations } from 'next-intl';

// RESPONSIBILITY: Renders the Next.js native loading skeleton for the manager_assets module.
// DATA FLOW: Next.js Router -> loading.tsx
export default function Loading() {
  const tManagerUi = useTranslations('manager.manager_assets.ui');

  return (
    <div className="flex h-full w-full items-center justify-center p-8" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{tManagerUi('loading_this_section')}</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse motion-reduce:animate-none space-y-4 w-full max-w-3xl">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded w-full" />
      </div>
    </div>
  );
}
