'use client';
// Responsibility: AdminCollectFeePage component owned by admin_collect_fee; responsibility folder: components.
import useCollectFee from '@/app/frontend_admin/admin_finance/finance_collect_fee/hooks/useAdminFinanceCollectFeePage';
import AdminCollectFeePageView from '@/app/frontend_admin/admin_finance/finance_collect_fee/components/AdminFinanceCollectFeePageView';

// RESPONSIBILITY: Owns orchestration only; the interactive state model is in the module hook and presentation is in the module view.
export function AdminCollectFeePage() {
  const model = useCollectFee();
  return <AdminCollectFeePageView model={model} />;
}
