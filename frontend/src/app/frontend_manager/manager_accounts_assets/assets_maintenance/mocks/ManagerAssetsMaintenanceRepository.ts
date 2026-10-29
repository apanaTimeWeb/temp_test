import { MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS } from './ManagerAssetsMaintenanceFixtures';
import type { ManagerAssetsMaintenanceLog } from '../types/ManagerAssetsMaintenanceTypes';

/** Returns a defensive copy of local illustrative records; no writes or network calls occur. */
export function getManagerAssetsMaintenanceSampleLogs(): ManagerAssetsMaintenanceLog[] {
  return MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS.map((record) => ({ ...record }));
}
