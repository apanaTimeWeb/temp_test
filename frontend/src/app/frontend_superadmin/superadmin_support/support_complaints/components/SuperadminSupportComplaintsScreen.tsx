/** Responsibility: Route adapter for the support_complaints screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSupportComplaintsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `complaints` inside the support_complaints autonomous module. */
import SuperadminSupportComplaintsPageClient from '@/app/frontend_superadmin/superadmin_support/support_complaints/components/SuperadminSupportComplaintsPageClient';

/**
 * Composes the support complaints screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSupportComplaintsScreen({ id }: { id?: string }) {
  return <SuperadminSupportComplaintsPageClient id={id} />;
}
