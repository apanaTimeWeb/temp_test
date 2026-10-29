export type ManagerAssetsMaintenanceStatus = 'pending' | 'in-progress' | 'completed';

export interface ManagerAssetsMaintenanceLog {
  id: number;
  assetName: string;
  issue: string;
  reportedDate: string;
  scheduledDate: string;
  vendor: string;
  cost: number;
  status: ManagerAssetsMaintenanceStatus;
}

export interface ManagerAssetsMaintenanceMainProps {
  view?: string;
  id?: string;
}
