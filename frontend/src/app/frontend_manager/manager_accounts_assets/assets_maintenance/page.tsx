import { ManagerAssetsMaintenanceMain } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceMain';
import type { ManagerAssetsMaintenanceMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';
import type { ManagerAssetsMaintenancePageProps, QueryValue } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceComponentTypes';



function firstValue(value: QueryValue): string | undefined { return Array.isArray(value) ? value[0] : value; }

export default async function ManagerAssetsMaintenancePage({ searchParams }: ManagerAssetsMaintenancePageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAssetsMaintenanceMainProps = { view: firstValue(params.view), id: firstValue(params.id) };
  return <ManagerAssetsMaintenanceMain {...mainProps} />;
}
