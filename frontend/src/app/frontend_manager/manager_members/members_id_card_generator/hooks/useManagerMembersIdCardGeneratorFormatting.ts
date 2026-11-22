'use client';
/** DATA FLOW: Caller value and locale -> module-owned formatter -> display-ready value; no network I/O is implied. */

import { formatManagerIdCardGeneratorCurrency as formatCurrencyValue,formatManagerIdCardGeneratorDateTime as formatDateTimeValue,formatManagerIdCardGeneratorDate as formatDateValue,fromManagerIdCardGeneratorMinorUnits as fromMinorUnitsValue,toManagerIdCardGeneratorMinorUnits as toMinorUnitsValue } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorCurrencyFormatting';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';

export function useManagerIdCardGeneratorFormatting() {
  const locale = useLocale();
  const formatCurrency = useCallback((amountMinor: number, currency = 'INR') => formatCurrencyValue(amountMinor, currency, locale), [locale]);
  const fromMinorUnits = useCallback((amountMinor: number, currency = 'INR') => fromMinorUnitsValue(amountMinor, currency, locale), [locale]);
  const toMinorUnits = useCallback((amountMajor: number, currency = 'INR') => toMinorUnitsValue(amountMajor, currency, locale), [locale]);
  const formatDate = useCallback((value: string) => formatDateValue(value, locale), [locale]);
  const formatDateTime = useCallback((value: string | Date) => formatDateTimeValue(value, locale), [locale]);
  return { locale, formatCurrency, fromMinorUnits, toMinorUnits, formatDate, formatDateTime };
}
