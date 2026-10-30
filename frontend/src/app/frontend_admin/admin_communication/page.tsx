// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_COMMUNICATION_NOTICES_CANONICAL_ROUTE } from './communication_notices/config/admin_communication_notices.url_config';

export default function AdminCommunicationPage() {
  redirect(ADMIN_COMMUNICATION_NOTICES_CANONICAL_ROUTE);
}
