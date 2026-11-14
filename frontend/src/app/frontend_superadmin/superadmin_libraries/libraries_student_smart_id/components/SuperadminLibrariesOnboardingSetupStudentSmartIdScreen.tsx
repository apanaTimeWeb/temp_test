/** Responsibility: Route adapter for the student_smart_id screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOnboardingSetupStudentSmartIdScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `smart_id` inside the student_smart_id autonomous module. */
import SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient';

/**
 * Composes the libraries onboarding setup screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOnboardingSetupStudentSmartIdScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient />;
}
