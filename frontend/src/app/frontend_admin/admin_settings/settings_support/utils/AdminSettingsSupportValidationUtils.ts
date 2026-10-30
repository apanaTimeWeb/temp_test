export type AdminSupportTicketField = 'category' | 'priority' | 'subject' | 'description';
export type AdminSupportValidationMessageKey =
  | 'ERROR_CATEGORY_REQUIRED'
  | 'ERROR_PRIORITY_REQUIRED'
  | 'ERROR_SUBJECT_REQUIRED'
  | 'ERROR_SUBJECT_TOO_LONG'
  | 'ERROR_DESCRIPTION_REQUIRED'
  | 'ERROR_DESCRIPTION_TOO_LONG';

/** Maps Zod's stable issue types to localized keys; user-facing schema strings never leak directly into the UI. */
export function getAdminSupportValidationMessageKey(
  field: AdminSupportTicketField,
  errorType: string | undefined,
): AdminSupportValidationMessageKey {
  if (field === 'category') return 'ERROR_CATEGORY_REQUIRED';
  if (field === 'priority') return 'ERROR_PRIORITY_REQUIRED';
  if (field === 'subject') return errorType === 'too_big' ? 'ERROR_SUBJECT_TOO_LONG' : 'ERROR_SUBJECT_REQUIRED';
  return errorType === 'too_big' ? 'ERROR_DESCRIPTION_TOO_LONG' : 'ERROR_DESCRIPTION_REQUIRED';
}
