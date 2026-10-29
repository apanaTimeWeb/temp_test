/** Illustrative maintenance records only; not live data or a persistence contract. */
import type { ManagerAssetsMaintenanceLog } from '../types/ManagerAssetsMaintenanceTypes';

export const MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS: readonly ManagerAssetsMaintenanceLog[] = [
  { id: 1, assetName: 'AC Unit — Hall A', issue: 'Gas refill & filter cleaning', reportedDate: '2026-04-02', scheduledDate: '2026-04-08', vendor: 'CoolTech Services', cost: 180000, status: 'completed' },
  { id: 2, assetName: 'Water Purifier', issue: 'Filter replacement', reportedDate: '2026-04-05', scheduledDate: '2026-04-10', vendor: 'AquaPure', cost: 90000, status: 'in-progress' },
  { id: 3, assetName: 'CCTV Camera — B2', issue: 'Camera not recording', reportedDate: '2026-04-08', scheduledDate: '2026-04-12', vendor: 'SecureVision', cost: 120000, status: 'pending' },
  { id: 4, assetName: 'Biometric Scanner', issue: 'Fingerprint sensor malfunction', reportedDate: '2026-04-09', scheduledDate: '2026-04-14', vendor: 'TechFix', cost: 250000, status: 'pending' },
  { id: 5, assetName: 'Inverter Battery', issue: 'Battery backup reduced', reportedDate: '2026-03-28', scheduledDate: '2026-04-03', vendor: 'PowerCare', cost: 350000, status: 'completed' },
];
