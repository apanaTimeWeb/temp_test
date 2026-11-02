// components/AdminAccountsDailySettlementKpis.tsx
'use client';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Wallet, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { formatPaiseToRupees } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import AdminPrimitiveKpiCard from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveKpiCard';

interface Props {
  records: DailySettlementRecord[];
}

export function AdminAccountsDailySettlementKpis({ records }: Props) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT.KPIS');

  const { expectedCash, clearedCash, pendingCash, discrepancyCash, pendingCount, flaggedCount } = useMemo(() => {
    let expected = 0;
    let cleared = 0;
    let pending = 0;
    let discrepancy = 0;
    let pCount = 0;
    let fCount = 0;

    for (const r of records) {
      expected += r.expectedClosingCash;
      if (r.status === 'APPROVED') {
        cleared += r.actualHandoverCash;
      } else if (r.status === 'PENDING_APPROVAL') {
        pending += r.actualHandoverCash;
        pCount++;
      } else if (r.status === 'DISCREPANCY_FLAGGED') {
        fCount++;
      }
      if (r.difference < 0) {
        discrepancy += Math.abs(r.difference);
      }
    }

    return {
      expectedCash: expected,
      clearedCash: cleared,
      pendingCash: pending,
      discrepancyCash: discrepancy,
      pendingCount: pCount,
      flaggedCount: fCount,
    };
  }, [records]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminPrimitiveKpiCard
        title={t('EXPECTED_CASH')}
        value={formatPaiseToRupees(expectedCash)}
        subtitle={t('SUB_EXPECTED')}
        icon={<Wallet className="h-5 w-5" />}
      />
      <AdminPrimitiveKpiCard
        title={t('CLEARED_CASH')}
        value={formatPaiseToRupees(clearedCash)}
        subtitle={t('SUB_CLEARED')}
        icon={<CheckCircle2 className="h-5 w-5" />}
      />
      <AdminPrimitiveKpiCard
        title={t('PENDING_HANDOVER')}
        value={formatPaiseToRupees(pendingCash)}
        subtitle={`${pendingCount} shifts · ${t('SUB_PENDING')}`}
        icon={<Clock className="h-5 w-5" />}
      />
      <AdminPrimitiveKpiCard
        title={t('DISCREPANCY_SHORTAGE')}
        value={formatPaiseToRupees(discrepancyCash)}
        subtitle={`${flaggedCount} shifts · ${t('SUB_DISCREPANCY')}`}
        icon={<AlertTriangle className="h-5 w-5" />}
      />
    </div>
  );
}

export default AdminAccountsDailySettlementKpis;

