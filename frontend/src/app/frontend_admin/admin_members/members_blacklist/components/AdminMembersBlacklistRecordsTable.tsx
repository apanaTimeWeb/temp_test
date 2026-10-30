// Responsibility: AdminBlacklistRecordsTable component owned by admin_blacklist; responsibility folder: admin_blacklist_components_tables.
'use client';

// RESPONSIBILITY: Renders the paginated blacklist record grid; query and mutation ownership stays in AdminMembersBlacklistMain.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useTranslations } from 'next-intl';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import type { AdminBlacklistRecordsTableProps } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';


export default function AdminBlacklistRecordsTable({ records, columns, onRowClicked }: AdminBlacklistRecordsTableProps) {
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-blacklist-admin-blacklist-records-table-1-page', 0);

  const t = useTranslations('ADMIN_BLACKLIST');
  return (
    <DataGrid
      rowData={[...records]}
      columnDefs={columns}
      pagination
      pageSize={25}
      rowHeight={56}
      onRowClicked={onRowClicked}
      tableLabel={t('TABLE_LABEL')}
      mobileOpenLabel={t('OPEN_RECORD')}
     page={urlTablePage0} onPageChange={setUrlTablePage0}/>
  );
}


export type { AdminBlacklistRecordsTableProps };
