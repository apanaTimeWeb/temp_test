import type { ReactNode } from 'react';

export const AdminSettingsBranchesScenarios = [
  'ACTIVE_RECORDS',
  'EMPTY_DATA',
  'SERVER_500_ERROR',
  'NETWORK_TIMEOUT',
  'UNAUTHORIZED_401',
  'FORBIDDEN_403',
  'NETWORK_ERROR',
  'INVALID_RESPONSE',
] as const;

export type AdminSettingsBranchesScenario = (typeof AdminSettingsBranchesScenarios)[number];
export type AdminBranchSortField = 'name' | 'manager' | 'code' | 'status';

export interface AdminSettingsBranchRecord {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: 'Active' | 'Inactive';
  timing?: string;
  totalCapacity?: number;
}

export interface AdminSettingsBranchesHarnessProps {
  children: ReactNode;
  scenario?: AdminSettingsBranchesScenario;
}
