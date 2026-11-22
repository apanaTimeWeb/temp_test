// RESPONSIBILITY: Adapt the canonical route for communication notices to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_communication/communication_notices/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route owned by communication_notices. Legacy query-view URLs are redirected by the domain entry page. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminCommunicationNoticesScreen from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesScreen';

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Resolves the canonical route for communication notices and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminCommunicationNoticesRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_COMMUNICATION");
  return (
    <div className="min-w-0" data-feature-module="superadmin_communication" data-feature-route="communication_notices">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
        <SuperadminCommunicationNoticesScreen id={id} />
      </Suspense>
    </div>
  );
}
