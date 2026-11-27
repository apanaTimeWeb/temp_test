'use client';

import ManagerAssetsMaintenancePage from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenancePage';
import type { ManagerAssetsMaintenanceMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';

/** This canonical domain owns maintenance only; legacy view query values never dispatch sibling workflows. */
export function ManagerAssetsMaintenanceMain(props: ManagerAssetsMaintenanceMainProps) {
  return <ManagerAssetsMaintenancePage view={props.view} id={props.id} />;
}
