/** Responsibility: Route adapter for the library_waitlist_automation screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOverviewLibraryWaitlistAutomationScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `waitlist_automation` inside the library_waitlist_automation autonomous module. */
import SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient';

/**
 * Composes the libraries overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOverviewLibraryWaitlistAutomationScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient />;
}
