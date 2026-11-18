import { redirect } from 'next/navigation';

/** Student Bulk Import is a library-admin feature, not a superadmin concern. Redirect to libraries overview. */
export default function StudentBulkImportRoutePage() {
  redirect('/superadmin/superadmin_libraries/libraries_overview');
}
