// RESPONSIBILITY: Define compile-time types for libraries student bulk import; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_student_bulk_import/types/SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyStateTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Props for the module-owned empty-state presentation. */
export interface SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyStateProps {
  /** True when the current filters hide all otherwise available rows. */
  filtered?: boolean;
}
