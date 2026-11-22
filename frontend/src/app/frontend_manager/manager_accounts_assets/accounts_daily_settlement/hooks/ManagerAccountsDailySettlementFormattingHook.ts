'use client';

import { formatManagerDailySettlementCurrency as formatValue } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementFormatting';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';

/** DATA FLOW: Component locale/formatting inputs -> module-owned formatting utility -> formatted display value; no network I/O. */

export function useManagerDailySettlementCurrencyFormatter() {
  const locale = useLocale();
  return useCallback((amountMinor: number, currencyCode = 'INR') => formatValue(amountMinor, currencyCode, locale), [locale]);
}
