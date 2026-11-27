'use client';

import { useLocale } from 'next-intl';
import { useCallback } from 'react';
import { formatManagerAssetsMaintenanceCurrency } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/utils/ManagerAssetsMaintenanceFormatting';

/** DATA FLOW: Component locale/formatting inputs -> module-owned formatting utility -> formatted display value; no network I/O. */

export function useManagerAssetsMaintenanceCurrencyFormatter() {
  const locale = useLocale();
  return useCallback((amountMinor: number, currencyCode = 'INR') => formatManagerAssetsMaintenanceCurrency(amountMinor, currencyCode, locale), [locale]);
}
