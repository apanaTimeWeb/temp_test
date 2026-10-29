'use client';
/** DATA FLOW: Caller value and locale -> module-owned formatter -> display-ready value; no network I/O is implied. */

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { formatManagerNewAdmissionCurrency as formatCurrencyValue, fromManagerNewAdmissionMinorUnits as fromMinorUnitsValue, toManagerNewAdmissionMinorUnits as toMinorUnitsValue, formatManagerNewAdmissionDate as formatDateValue, formatManagerNewAdmissionDateTime as formatDateTimeValue } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionCurrencyFormatting';

export function useManagerNewAdmissionFormatting() {
  const locale = useLocale();
  const formatCurrency = useCallback((amountMinor: number, currency = 'INR') => formatCurrencyValue(amountMinor, currency, locale), [locale]);
  const fromMinorUnits = useCallback((amountMinor: number, currency = 'INR') => fromMinorUnitsValue(amountMinor, currency, locale), [locale]);
  const toMinorUnits = useCallback((amountMajor: number, currency = 'INR') => toMinorUnitsValue(amountMajor, currency, locale), [locale]);
  const formatDate = useCallback((value: string) => formatDateValue(value, locale), [locale]);
  const formatDateTime = useCallback((value: string | Date) => formatDateTimeValue(value, locale), [locale]);
  return { locale, formatCurrency, fromMinorUnits, toMinorUnits, formatDate, formatDateTime };
}
