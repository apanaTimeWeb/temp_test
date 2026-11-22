// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE } from './members_directory/config/admin_members_directory.url_config';

export default function AdminMembersPage() {
  redirect(ADMIN_MEMBERS_DIRECTORY_CANONICAL_ROUTE);
}
