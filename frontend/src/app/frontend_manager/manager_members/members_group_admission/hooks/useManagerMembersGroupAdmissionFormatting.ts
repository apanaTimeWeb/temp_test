'use client';
/** DATA FLOW: Caller value and locale -> module-owned formatter -> display-ready value; no network I/O is implied. */

import { formatManagerGroupAdmissionCurrency as formatCurrencyValue,formatManagerGroupAdmissionDateTime as formatDateTimeValue,formatManagerGroupAdmissionDate as formatDateValue,fromManagerGroupAdmissionMinorUnits as fromMinorUnitsValue,toManagerGroupAdmissionMinorUnits as toMinorUnitsValue } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionCurrencyFormatting';
import { useLocale } from 'next-intl';
import { useCallback } from 'react';

export function useManagerGroupAdmissionFormatting() {
  const locale = useLocale();
  const formatCurrency = useCallback((amountMinor: number, currency = 'INR') => formatCurrencyValue(amountMinor, currency, locale), [locale]);
  const fromMinorUnits = useCallback((amountMinor: number, currency = 'INR') => fromMinorUnitsValue(amountMinor, currency, locale), [locale]);
  const toMinorUnits = useCallback((amountMajor: number, currency = 'INR') => toMinorUnitsValue(amountMajor, currency, locale), [locale]);
  const formatDate = useCallback((value: string) => formatDateValue(value, locale), [locale]);
  const formatDateTime = useCallback((value: string | Date) => formatDateTimeValue(value, locale), [locale]);
  return { locale, formatCurrency, fromMinorUnits, toMinorUnits, formatDate, formatDateTime };
}
