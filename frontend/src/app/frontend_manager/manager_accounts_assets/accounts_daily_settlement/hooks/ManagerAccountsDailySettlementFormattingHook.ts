'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { formatManagerDailySettlementCurrency as formatValue } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementFormatting';

/** DATA FLOW: Component locale/formatting inputs -> module-owned formatting utility -> formatted display value; no network I/O. */

export function useManagerDailySettlementCurrencyFormatter() {
  const locale = useLocale();
  return useCallback((amountMinor: number, currencyCode = 'INR') => formatValue(amountMinor, currencyCode, locale), [locale]);
}
