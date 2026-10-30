import { AdminFinanceReceiptsPage } from '@/app/frontend_admin/admin_finance/finance_receipts/components/AdminFinanceReceiptsPage';
import { AdminFinanceReceiptsIdPage } from '@/app/frontend_admin/admin_finance/finance_receipts/components/AdminFinanceReceiptsIdPage';
import type { RouteSearchParams } from '@/app/frontend_admin/admin_finance/finance_receipts/types/AdminFinanceReceiptsTypes';


const first = (value: string | string[] | undefined): string | undefined => Array.isArray(value) ? value[0] : value;
export default async function AdminFinanceReceiptsRoute({ searchParams }: { searchParams?: Promise<RouteSearchParams> }) {
  const query = searchParams ? await searchParams : {};
  const view = first(query.view);
  const id = first(query.id) ?? '';
  if (view === 'detail' || view === 'invoice/detail' || view === 'receipt/detail') return <AdminFinanceReceiptsIdPage routeId={id} />;
  return <AdminFinanceReceiptsPage />;
}
