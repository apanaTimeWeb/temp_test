// Canonical domain shell: direct submodule routes own all business screens.
import { ADMIN_COMMUNICATION_NOTICES_CANONICAL_ROUTE } from '@/app/frontend_admin/admin_communication/communication_notices/config/admin_communication_notices.url_config';
import { redirect } from 'next/navigation';

export default function AdminCommunicationPage() {
  redirect(ADMIN_COMMUNICATION_NOTICES_CANONICAL_ROUTE);
}
