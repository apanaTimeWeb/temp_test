'use client';
/** Feature-local loading skeleton for accounting_expense_categories; presentation only, no fetch or mutation behavior. */
/** Responsibility: mirror the resolved warning, page heading and responsive category-card grid. */
/** Data-Flow: route loading boundary -> stable layout-matched skeleton -> resolved category-card layout. */
import { useTranslations } from 'next-intl';
const CARD_SKELETON_IDS = ['one', 'two', 'three', 'four', 'five', 'six'] as const;
export default function SuperadminAccountingExpenseCategoriesListSkeleton() {
  const t = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <section className="min-w-0 space-y-6 p-4 md:p-6" role="status" aria-busy="true" aria-label={t('COPY.LOADING_MODULE')} data-testid="superadmin_accounting_expense_categories-accounting_expense_categories-list-skeleton">
      <span className="sr-only">{t('COPY.LOADING_MODULE')}</span>
      <div className="h-12 rounded-md bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-3" aria-hidden="true">
        <div className="space-y-2"><div className="h-8 w-56 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" /><div className="h-4 w-72 max-w-full rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" /></div>
        <div className="h-11 w-36 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {CARD_SKELETON_IDS.map((key) => <div key={key} className="acct-card space-y-4 p-5">
          <div className="h-5 w-2/3 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="flex justify-between gap-3"><div className="h-4 w-24 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" /><div className="h-4 w-24 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" /></div>
          <div className="h-3 w-full rounded-full bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
          <div className="h-6 w-20 rounded-full bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        </div>)}
      </div>
    </section>
  );
}
