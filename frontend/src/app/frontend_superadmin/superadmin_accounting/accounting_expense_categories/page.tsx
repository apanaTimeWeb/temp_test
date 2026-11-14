// RESPONSIBILITY: Adapt the canonical route for accounting expense categories to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_accounting/accounting_expense_categories/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route owned by accounting_expense_categories. Legacy query-view URLs are redirected by the domain entry page. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminAccountingExpenseCategoriesScreen from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/components/SuperadminAccountingExpenseCategoriesScreen';

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Resolves the canonical route for accounting expense categories and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminAccountingExpenseCategoriesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_ACCOUNTING");
  return (
    <div className="min-w-0" data-feature-module="superadmin_accounting" data-feature-route="accounting_expense_categories">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
        <SuperadminAccountingExpenseCategoriesScreen id={id} />
      </Suspense>
    </div>
  );
}
