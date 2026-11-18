import { redirect } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

export default function AdminFinanceDashboardRoute() {
  redirect(ADMIN_ROUTES.FINANCE_PAYMENTS);
}
