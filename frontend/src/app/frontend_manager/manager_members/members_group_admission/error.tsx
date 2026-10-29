"use client";
import { useTranslations } from 'next-intl';

export default function ManagerMembersGroupAdmissionError({ reset }: { reset: () => void }) {
  const tManagerUi = useTranslations('manager.manager_group_admission.errors');
  return (
    <main className="min-h-screen bg-page p-6 flex items-center justify-center">
      <section className="max-w-md rounded-xl border border-border bg-card p-6 shadow-card text-center" role="alert">
        <h2 className="text-lg font-semibold text-primary">{tManagerUi('MODULE_ERROR')}</h2>
        <p className="mt-2 text-sm text-secondary">{tManagerUi('GENERIC_BODY')}</p>
        <button type="button" onClick={reset} className="mt-5 rounded-md bg-primary px-4 py-2 text-on-primary">{tManagerUi('RETRY')}</button>
      </section>
    </main>
  );
}
