import type { ManagerAssetsMaintenanceLog } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceTypes';

export interface ManagerAssetsMaintenanceDemoAsset {
  id: number;
  name: string;
  category: string;
  location: string;
  status: 'active' | 'maintenance' | 'disposed';
}

export const MANAGER_ASSETS_MAINTENANCE_DEMO_ASSETS: readonly ManagerAssetsMaintenanceDemoAsset[] = [
  { id: 1, name: 'AC Unit — Hall A', category: 'Appliance', location: 'Ground Floor', status: 'active' },
  { id: 2, name: 'CCTV Camera Set (8)', category: 'Security', location: 'All Floors', status: 'active' },
  { id: 3, name: 'Water Purifier', category: 'Appliance', location: 'Ground Floor', status: 'maintenance' },
  { id: 4, name: 'Study Tables (20)', category: 'Furniture', location: 'First Floor', status: 'active' },
  { id: 5, name: 'Biometric Scanner', category: 'Security', location: 'Entrance', status: 'active' },
  { id: 6, name: 'Old Printer', category: 'Electronics', location: 'Store Room', status: 'disposed' },
];

export const MANAGER_ASSETS_MAINTENANCE_SAMPLE_LOGS: readonly ManagerAssetsMaintenanceLog[] = [
  { id: 1, assetName: 'AC Unit — Hall A', issue: 'Gas refill & filter cleaning', reportedDate: '2026-04-02', scheduledDate: '2026-04-08', vendor: 'CoolTech Services', cost: 180000, status: 'completed' },
  { id: 2, assetName: 'Water Purifier', issue: 'Filter replacement', reportedDate: '2026-04-05', scheduledDate: '2026-04-10', vendor: 'AquaPure', cost: 90000, status: 'in-progress' },
  { id: 3, assetName: 'CCTV Camera — B2', issue: 'Camera not recording', reportedDate: '2026-04-08', scheduledDate: '2026-04-12', vendor: 'SecureVision', cost: 120000, status: 'pending' },
  { id: 4, assetName: 'Biometric Scanner', issue: 'Fingerprint sensor malfunction', reportedDate: '2026-04-09', scheduledDate: '2026-04-14', vendor: 'TechFix', cost: 250000, status: 'pending' },
  { id: 5, assetName: 'Inverter Battery', issue: 'Battery backup reduced', reportedDate: '2026-03-28', scheduledDate: '2026-04-03', vendor: 'PowerCare', cost: 350000, status: 'completed' },
];
