import type { ADMIN_BLACKLIST_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import type { AdminBlacklistFormSchemaType } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { ReactNode } from 'react';

export type AdminMembersBlacklistScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

export type AdminBlacklistStatus = typeof ADMIN_BLACKLIST_STATUS_VALUES[number] | 'Pardoned';

export type DisciplinaryCategory =
  | 'THEFT_STOLEN_PROPERTY'
  | 'INDISCIPLINE_MISCONDUCT'
  | 'PHYSICAL_ALTERCATION'
  | 'PROPERTY_VANDALISM'
  | 'UNAUTHORIZED_OCCUPANCY'
  | 'FEE_DEFAULT_FRAUD'
  | 'OTHER';

export type BanScope = 'NETWORK_WIDE' | 'BRANCH_SPECIFIC';
export type BanDuration = 'PERMANENT' | 'TEMPORARY_30_DAYS' | 'TEMPORARY_90_DAYS' | 'TEMPORARY_180_DAYS' | 'TEMPORARY_1_YEAR';

export interface AdminBlacklistRecord {
  id: string;
  name: string;
  phone: string;
  reason: string;
  blacklistedBy: string;
  blacklistedOn: string;
  previousSeat: string;
  status: AdminBlacklistStatus;
  branch?: string;
  category?: DisciplinaryCategory;
  banScope?: BanScope;
  banDuration?: BanDuration;
  banValidUntil?: string;
  incidentDate?: string;
  incidentLocation?: string;
  firRefNo?: string;
  revokedSeat?: boolean;
  revokedLocker?: boolean;
  blockedBiometric?: boolean;
  confiscatedDeposit?: boolean;
  incidentNotes?: string;
  pardonReason?: string;
  pardonDate?: string;
  pardonedBy?: string;
}

export interface AdminBlacklistFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AdminBlacklistFormSchemaType) => void;
  isDemoMode: boolean;
}

export interface AdminBlacklistRecordsSectionProps {
  records: readonly AdminBlacklistRecord[];
  columns: readonly DataGridColumn<AdminBlacklistRecord>[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onRowClicked: (record: AdminBlacklistRecord) => void;
}

export interface AdminBlacklistRecordsTableProps {
  records: readonly AdminBlacklistRecord[];
  columns: readonly DataGridColumn<AdminBlacklistRecord>[];
  onRowClicked: (record: AdminBlacklistRecord) => void;
}

export interface AdminMembersBlacklistHarnessProps {
  children: ReactNode;
  scenario?: AdminMembersBlacklistScenario;
}
