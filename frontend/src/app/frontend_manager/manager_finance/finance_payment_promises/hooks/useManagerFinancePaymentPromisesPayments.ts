'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerPaymentPromisesPayments } from '@/app/frontend_manager/manager_finance/finance_payment_promises/api/manager_finance_payment_promises.api';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_payment_promises/api/manager_finance_payment_promises.query_keys';
/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerPaymentPromisesPayments() { return useQuery({ queryKey: MANAGER_FINANCE_QUERY_KEYS.payments(), queryFn: fetchManagerPaymentPromisesPayments, staleTime: 30_000 }); }
