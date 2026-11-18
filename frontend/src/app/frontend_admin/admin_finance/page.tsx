// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

export default function AdminFinancePage() {
  redirect(ADMIN_ROUTES.FINANCE_PAYMENTS);
}
