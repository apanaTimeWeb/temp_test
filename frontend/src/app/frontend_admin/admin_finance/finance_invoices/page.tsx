import { AdminFinanceInvoicesPage } from '@/app/frontend_admin/admin_finance/finance_invoices/components/AdminFinanceInvoicesPage';
import { AdminFinanceInvoicesIdPage } from '@/app/frontend_admin/admin_finance/finance_invoices/components/AdminFinanceInvoicesIdPage';
import type { RouteSearchParams } from '@/app/frontend_admin/admin_finance/finance_invoices/types/AdminFinanceInvoicesTypes';


const first = (value: string | string[] | undefined): string | undefined => Array.isArray(value) ? value[0] : value;
export default async function AdminFinanceInvoicesRoute({ searchParams }: { searchParams?: Promise<RouteSearchParams> }) {
  const query = searchParams ? await searchParams : {};
  const view = first(query.view);
  const id = first(query.id) ?? '';
  if (view === 'detail' || view === 'invoice/detail' || view === 'receipt/detail') return <AdminFinanceInvoicesIdPage routeId={id} />;
  return <AdminFinanceInvoicesPage />;
}
