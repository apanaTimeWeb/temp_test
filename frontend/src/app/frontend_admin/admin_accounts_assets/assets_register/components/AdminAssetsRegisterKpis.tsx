// components/AdminAssetsRegisterKpis.tsx
'use client';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, IndianRupee, ShieldCheck, AlertCircle } from 'lucide-react';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatPaiseToRupees,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import AdminPrimitiveKpiCard from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveKpiCard';

interface Props {
  records: AdminAssetRecord[];
}

export function AdminAssetsRegisterKpis({ records }: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER.KPIS');

  const { totalCount, totalCapEx, amcCount, expiringCount } = useMemo(() => {
    let capex = 0;
    let amc = 0;
    let expiring = 0;

    for (const r of records) {
      capex += r.purchaseCost;
      if (r.amcStatus === 'ACTIVE_AMC') {
        amc++;
      }
      if (isExpiringSoon(r.warrantyExpiryDate)) {
        expiring++;
      }
    }

    return {
      totalCount: records.length,
      totalCapEx: capex,
      amcCount: amc,
      expiringCount: expiring,
    };
  }, [records]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminPrimitiveKpiCard
        title={t('TOTAL_ASSETS')}
        value={String(totalCount)}
        subtitle={t('SUB_ASSETS')}
        icon={<Building2 className="h-5 w-5" />}
      />
      <AdminPrimitiveKpiCard
        title={t('TOTAL_CAPEX')}
        value={formatPaiseToRupees(totalCapEx)}
        subtitle={t('SUB_CAPEX')}
        icon={<IndianRupee className="h-5 w-5" />}
      />
      <AdminPrimitiveKpiCard
        title={t('ACTIVE_AMC')}
        value={String(amcCount)}
        subtitle={t('SUB_AMC')}
        icon={<ShieldCheck className="h-5 w-5" />}
      />
      <AdminPrimitiveKpiCard
        title={t('WARRANTY_ALERTS')}
        value={String(expiringCount)}
        subtitle={t('SUB_WARRANTY')}
        icon={<AlertCircle className="h-5 w-5" />}
      />
    </div>
  );
}

export default AdminAssetsRegisterKpis;

