// RESPONSIBILITY: Adapt the canonical route for support complaints to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_support/support_complaints/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route owned by support_complaints. Legacy query-view URLs are redirected by the domain entry page. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminSupportComplaintsScreen from '@/app/frontend_superadmin/superadmin_support/support_complaints/components/SuperadminSupportComplaintsScreen';

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Resolves the canonical route for support complaints and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSupportComplaintsRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_COMMUNICATION");
  return (
    <div className="min-w-0" data-feature-module="superadmin_support" data-feature-route="support_complaints">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
        <SuperadminSupportComplaintsScreen id={id} />
      </Suspense>
    </div>
  );
}
