'use client';
/** Responsibility: Own the empty-state/table presentation boundary for daily settlement entries. */
import { useTranslations } from 'next-intl';
import SuperadminAccountingDailySettlementSemanticTable from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/components/SuperadminAccountingDailySettlementSemanticTable';
import type { SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/types/superadmin_accounting_daily_settlement.types';
import type { SuperadminAccountingSettlementEntry } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/types/superadmin_accounting_daily_settlement.types';
type Props = { rows: readonly SuperadminAccountingSettlementEntry[]; columnDefs: readonly SemanticColumnDef<SuperadminAccountingSettlementEntry>[] };
export default function SuperadminAccountingDailySettlementTableSection({ rows, columnDefs }: Props) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return <div className="acct-card p-4">
    {rows.length === 0 ? <div className="acct-empty-state py-12"><div className="acct-empty-state__icon" aria-hidden="true">📋</div><p className="acct-empty-state__title" role="status">{tCopy('COPY.NO_SETTLEMENT_ENTRIES_FOR_THIS_DATE')}</p></div> : <div className="mgr-table-wrapper h-88"><SuperadminAccountingDailySettlementSemanticTable rowData={rows} columnDefs={columnDefs} rowHeight={56} headerHeight={48} pagination={false} defaultColDef={{ sortable: true, filter: false }} /></div>}
  </div>;
}
