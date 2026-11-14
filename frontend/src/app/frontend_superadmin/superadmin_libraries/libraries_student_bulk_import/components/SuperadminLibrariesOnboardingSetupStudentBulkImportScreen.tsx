/** Responsibility: Route adapter for the student_bulk_import screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminLibrariesOnboardingSetupStudentBulkImportScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `bulk_import` inside the student_bulk_import autonomous module. */
import SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient';

/**
 * Composes the libraries onboarding setup screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminLibrariesOnboardingSetupStudentBulkImportScreen({ id }: { id?: string }) {
  return <SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient />;
}
