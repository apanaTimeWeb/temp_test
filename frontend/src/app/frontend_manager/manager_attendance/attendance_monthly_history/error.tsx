'use client';

import { useTranslations } from 'next-intl';

export default function ManagerAttendanceMonthlyHistoryError({ reset }: { reset: () => void }) {
  const tManagerErr = useTranslations('manager.manager_attendance_monthly_history.errors');
  return (
    <main className="min-h-screen bg-page p-6 flex items-center justify-center">
      <section className="max-w-md rounded-xl border border-border bg-card p-6 shadow-card text-center" role="alert">
        <h2 className="text-lg font-semibold text-primary">{tManagerErr('MODULE_ERROR')}</h2>
        <p className="mt-2 text-sm text-secondary">{tManagerErr('GENERIC_BODY')}</p>
        <button type="button" onClick={reset} className="mt-5 rounded-md bg-primary px-4 py-2 text-on-primary">
          {tManagerErr('RETRY')}
        </button>
      </section>
    </main>
  );
}
