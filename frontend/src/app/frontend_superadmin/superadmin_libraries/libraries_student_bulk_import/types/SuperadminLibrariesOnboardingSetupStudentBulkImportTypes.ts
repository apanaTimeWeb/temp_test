// FLOW: Feature source -> superadmin_libraries/libraries_student_bulk_import/types/SuperadminLibrariesOnboardingSetupStudentBulkImportTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin System Bulk Import Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminSystemBulkImportRowStatus = 'ok' | 'warning' | 'error';

/**
 * Defines the public SuperadminSystemBulkImportRow contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property row Value defined by the existing feature-local contract. Declared type: number.
 * @property name Display label for the owning feature. Declared type: string.
 * @property phone Value defined by the existing feature-local contract. Declared type: string.
 * @property email Value defined by the existing feature-local contract. Declared type: string.
 * @property shift Value defined by the existing feature-local contract. Declared type: string.
 * @property seat Value defined by the existing feature-local contract. Declared type: string.
 * @property plan Value defined by the existing feature-local contract. Declared type: string.
 * @property feePaid Stable identifier for the associated record. Declared type: string.
 * @property joinDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminSystemBulkImportRowStatus.
 * @property issue Boolean state used by the owning feature. Declared type: 'REQUIRED_FIELDS_MISSING' | 'EMAIL_BLANK_OPTIONAL'.
 * @property issueFields Boolean state used by the owning feature. Declared type: Array<'name' | 'phone' | 'shift'>.
 */
export interface SuperadminSystemBulkImportRow {
  row: number;
  name: string;
  phone: string;
  email: string;
  shift: string;
  seat: string;
  plan: string;
  feePaid: string;
  joinDate: string;
  status: SuperadminSystemBulkImportRowStatus;
  issue?: 'REQUIRED_FIELDS_MISSING' | 'EMAIL_BLANK_OPTIONAL';
  issueFields?: Array<'name' | 'phone' | 'shift'>;
}
