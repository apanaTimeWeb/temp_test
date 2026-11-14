/** Responsibility: Route adapter for the libraries_onboarding_setup screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOnboardingSetupScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the libraries_onboarding_setup autonomous module. */
import SuperadminLibrariesOnboardingSetupPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupPageClient';

/**
 * Composes the libraries onboarding setup screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOnboardingSetupScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOnboardingSetupPageClient />;
}
