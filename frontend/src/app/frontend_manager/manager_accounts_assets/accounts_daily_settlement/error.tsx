'use client';
import { useTranslations } from 'next-intl';

// RESPONSIBILITY: Renders the Next.js native error boundary for the manager_daily_settlement module.
// DATA FLOW: Next.js Router -> error.tsx


export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const tManagerUi = useTranslations('manager.manager_daily_settlement.errors');
  // DEFERRED_TO_HOST_RUNTIME: the host observability adapter is not supplied.
  // The boundary intentionally renders a generic localized fallback without leaking exception details.
  void error;
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
      <h2 className="text-xl font-semibold text-danger">{tManagerUi('MODULE_ERROR')}</h2>
      <button type="button" onClick={() => reset()} className="px-4 py-2 bg-primary text-on-primary rounded-md">
        {tManagerUi('RETRY')}
      </button>
    </div>
  );
}
