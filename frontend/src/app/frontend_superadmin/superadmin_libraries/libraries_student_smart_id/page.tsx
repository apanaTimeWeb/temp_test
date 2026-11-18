import { redirect } from 'next/navigation';

/** Student Smart ID is a library-admin feature, not a superadmin concern. Redirect to libraries overview. */
export default function StudentSmartIdRoutePage() {
  redirect('/superadmin/superadmin_libraries/libraries_overview');
}
