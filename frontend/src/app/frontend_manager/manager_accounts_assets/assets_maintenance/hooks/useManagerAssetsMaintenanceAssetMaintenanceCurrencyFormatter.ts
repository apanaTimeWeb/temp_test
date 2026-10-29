'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { formatManagerAssetsMaintenanceCurrency } from '../utils/ManagerAssetsMaintenanceFormatting';

/** DATA FLOW: Component locale/formatting inputs -> module-owned formatting utility -> formatted display value; no network I/O. */

export function useManagerAssetsMaintenanceCurrencyFormatter() {
  const locale = useLocale();
  return useCallback((amountMinor: number, currencyCode = 'INR') => formatManagerAssetsMaintenanceCurrency(amountMinor, currencyCode, locale), [locale]);
}
