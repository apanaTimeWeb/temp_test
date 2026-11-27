import { MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/config/manager_assets_maintenance.demo_data';
import type { ManagerAssetsMaintenanceLog } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';

/** Returns a defensive copy of module-owned preview records; no persistence or API calls occur. */
export function getManagerAssetsMaintenanceSampleLogs(): ManagerAssetsMaintenanceLog[] {
  return MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS.map((record) => ({ ...record }));
}
