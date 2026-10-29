'use client';
/** DATA FLOW: Caller value and locale -> module-owned formatter -> display-ready value; no network I/O is implied. */

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { formatCurrency as formatCurrencyValue, formatDate as formatDateValue, formatDateTime as formatDateTimeValue, toMinorUnits as toMinorUnitsValue } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/utils/ManagerFinanceAutoSuspendFormatting';

export function useManagerAutoSuspendFormatting() {
  const locale = useLocale();
  const formatCurrency = useCallback((amountMinor: number, currencyCode = 'INR') => formatCurrencyValue(amountMinor, currencyCode, locale), [locale]);
  const toMinorUnits = useCallback((amountMajor: number, currencyCode = 'INR') => toMinorUnitsValue(amountMajor, currencyCode, locale), [locale]);
  const formatDate = useCallback((dateValue: string) => formatDateValue(dateValue, locale), [locale]);
  const formatDateTime = useCallback((dateValue: string) => formatDateTimeValue(dateValue, locale), [locale]);
  return { locale, formatCurrency, toMinorUnits, formatDate, formatDateTime };
}
