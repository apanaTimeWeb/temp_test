export interface AdminBranchItem {
  id: string;
  name: string;
  code: string;
  city?: string;
  status: 'Active' | 'Suspended';
  isMain?: boolean;
}

export const ALL_BRANCHES_ID = 'all';

export const DEFAULT_ADMIN_BRANCHES: readonly AdminBranchItem[] = [
  { id: 'BR-001', name: 'Downtown Central', code: 'DT-CEN', city: 'City Center', status: 'Active', isMain: true },
  { id: 'BR-002', name: 'Westside Branch', code: 'WS-BR', city: 'Westside', status: 'Suspended' },
  { id: 'BR-003', name: 'North Hub', code: 'NH-01', city: 'North Campus', status: 'Active' },
] as const;

