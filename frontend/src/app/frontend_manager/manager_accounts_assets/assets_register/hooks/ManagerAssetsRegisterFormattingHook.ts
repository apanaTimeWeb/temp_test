'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { formatManagerAssetsCurrency as formatValue } from '@/app/frontend_manager/manager_accounts_assets/assets_register/utils/ManagerAssetsRegisterFormatting';

/** DATA FLOW: Component locale/formatting inputs -> module-owned formatting utility -> formatted display value; no network I/O. */

export function useManagerAssetsCurrencyFormatter() {
  const locale = useLocale();
  return useCallback((amountMinor: number, currencyCode = 'INR') => formatValue(amountMinor, currencyCode, locale), [locale]);
}
