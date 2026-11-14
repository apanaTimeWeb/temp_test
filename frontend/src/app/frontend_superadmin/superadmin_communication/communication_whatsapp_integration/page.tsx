// RESPONSIBILITY: Adapt the canonical route for communication whatsapp integration to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_communication/communication_whatsapp_integration/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route owned by communication_whatsapp_integration. Legacy query-view URLs are redirected by the domain entry page. */
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminCommunicationWhatsappIntegrationScreen from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationScreen';

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Resolves the canonical route for communication whatsapp integration and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminSystemWhatsappIntegrationRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const tCopy = await getTranslations("SUPERADMIN_SYSTEM");
  return (
    <div className="min-w-0" data-feature-module="superadmin_communication" data-feature-route="communication_whatsapp_integration">
      <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
        <SuperadminCommunicationWhatsappIntegrationScreen id={id} />
      </Suspense>
    </div>
  );
}
