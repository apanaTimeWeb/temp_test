// components/AdminAccountsDailySettlementTable.tsx
'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import AdminAccountsDailySettlementEmptyState from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementEmptyState';
import { AdminAccountsDailySettlementTableRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/components/AdminAccountsDailySettlementTableRow';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

interface Props {
  records: DailySettlementRecord[];
  onApprove: (record: DailySettlementRecord) => void;
  onFlag: (record: DailySettlementRecord) => void;
  onResetFilters: () => void;
}

export function AdminAccountsDailySettlementTable({
  records,
  onApprove,
  onFlag,
  onResetFilters,
}: Props) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');
  type DailySettlementSortField =
    | 'date'
    | 'branchName'
    | 'managerName'
    | 'openingCash'
    | 'collections'
    | 'expenses'
    | 'expectedCash'
    | 'handoverCash'
    | 'difference'
    | 'status';
  const [sortField, setSortField] = useState<DailySettlementSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: DailySettlementSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    if (!sortField) return records;
    return [...records].sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;
      switch (sortField) {
        case 'collections':
          aVal = a.cashCollected + a.upiCollected;
          bVal = b.cashCollected + b.upiCollected;
          break;
        case 'expenses':
          aVal = a.expensesPaid;
          bVal = b.expensesPaid;
          break;
        case 'expectedCash':
          aVal = a.expectedClosingCash;
          bVal = b.expectedClosingCash;
          break;
        case 'handoverCash':
          aVal = a.actualHandoverCash;
          bVal = b.actualHandoverCash;
          break;
        default:
          aVal = a[sortField];
          bVal = b[sortField];
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = aVal - bVal;
        return sortDirection === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [records, sortField, sortDirection]);

  const paginatedRecords = useMemo(
    () => sortedRecords.slice(page * pageSize, (page + 1) * pageSize),
    [sortedRecords, page, pageSize]
  );

  const renderSortableHeader = (
    field: DailySettlementSortField,
    label: string,
    align: 'left' | 'right' | 'center' = 'left'
  ) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`px-4 py-3.5 whitespace-nowrap ${
          align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${
            align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''
          }`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              className="text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity shrink-0"
              size={14}
              aria-hidden="true"
            />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) {
    return <AdminAccountsDailySettlementEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" aria-label={t('TITLE')}>
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {renderSortableHeader('date', t('TABLE.DATE_SHIFT'))}
              {renderSortableHeader('branchName', t('TABLE.BRANCH'))}
              {renderSortableHeader('managerName', t('TABLE.MANAGER'))}
              {renderSortableHeader('openingCash', t('TABLE.OPENING_CASH'), 'right')}
              {renderSortableHeader('collections', t('TABLE.COLLECTIONS'), 'right')}
              {renderSortableHeader('expenses', t('TABLE.EXPENSES'), 'right')}
              {renderSortableHeader('expectedCash', t('TABLE.EXPECTED_CASH'), 'right')}
              {renderSortableHeader('handoverCash', t('TABLE.HANDOVER_CASH'), 'right')}
              {renderSortableHeader('difference', t('TABLE.VARIANCE'), 'right')}
              {renderSortableHeader('status', t('TABLE.STATUS'), 'center')}
              <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">
                {t('TABLE.ACTIONS')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRecords.map((record) => (
              <AdminAccountsDailySettlementTableRow
                key={record.id}
                record={record}
                onApprove={onApprove}
                onFlag={onFlag}
              />
            ))}
          </tbody>
        </table>
      </div>
      {records.length > 0 && (
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalCount={sortedRecords.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          id="admin-daily-settlement-page-size"
        />
      )}
    </div>
  );
}

export default AdminAccountsDailySettlementTable;
