import type { ADMIN_BLACKLIST_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_blacklist/config/admin_members_blacklist.url_config';
import type { AdminBlacklistFormSchemaType } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';
import type { AdminMembersBlacklistScenario } from '@/app/frontend_admin/admin_members/members_blacklist/tests/harness/bootstrap';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { ReactNode } from 'react';

export type AdminBlacklistStatus = typeof ADMIN_BLACKLIST_STATUS_VALUES[number];
export interface AdminBlacklistRecord { id: string; name: string; phone: string; reason: string; blacklistedBy: string; blacklistedOn: string; previousSeat: string; status: AdminBlacklistStatus; }
export interface AdminBlacklistFormValues { name: string; phone: string; reason: string; previousSeat: string; }

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
