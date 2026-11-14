/** Responsibility: Route adapter for the support_tickets screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSupportTicketsOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the support_tickets autonomous module. */
import SuperadminSupportTicketsOverviewPageClient from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewPageClient';

/**
 * Composes the support tickets screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSupportTicketsOverviewScreen({ id }: { id?: string }) {
  return <SuperadminSupportTicketsOverviewPageClient />;
}
