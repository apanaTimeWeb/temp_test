'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerFinesPaymentsPayments } from '@/app/frontend_manager/manager_finance/finance_fines_payments/api/manager_finance_fines_payments.api';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_fines_payments/api/manager_finance_fines_payments.query_keys';
/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerFinesPaymentsPayments() { return useQuery({ queryKey: MANAGER_FINANCE_QUERY_KEYS.payments(), queryFn: fetchManagerFinesPaymentsPayments, staleTime: 30_000 }); }
