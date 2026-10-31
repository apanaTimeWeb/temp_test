import { redirect } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

export default function AdminAssetsRegisterPageEntry() {
  redirect(ADMIN_ROUTES.ACCOUNTS_FINANCIAL_REPORTS);
}
