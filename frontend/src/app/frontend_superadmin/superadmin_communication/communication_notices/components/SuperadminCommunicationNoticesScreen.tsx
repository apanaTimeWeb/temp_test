/** Responsibility: Route adapter for the communication_notices screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminCommunicationNoticesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `notices` inside the communication_notices autonomous module. */
import SuperadminCommunicationNoticesPageClient from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesPageClient';

/**
 * Composes the communication notices screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminCommunicationNoticesScreen({ id }: { id?: string }) {
  return <SuperadminCommunicationNoticesPageClient id={id} />;
}
