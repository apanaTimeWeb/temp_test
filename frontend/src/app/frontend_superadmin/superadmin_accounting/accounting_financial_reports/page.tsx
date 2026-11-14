// RESPONSIBILITY: Adapt the canonical route for accounting financial reports to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_accounting/accounting_financial_reports/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route owned by accounting_financial_reports. Legacy query-view URLs are redirected by the domain entry page. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminAccountingFinancialReportsScreen from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/components/SuperadminAccountingFinancialReportsScreen';

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Resolves the canonical route for accounting financial reports and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminAccountingFinancialReportsRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_ACCOUNTING");
  return (
    <div className="min-w-0" data-feature-module="superadmin_accounting" data-feature-route="accounting_financial_reports">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
        <SuperadminAccountingFinancialReportsScreen id={id} />
      </Suspense>
    </div>
  );
}
