'use client';
import { fetchManagerCollectFeePayments } from '@/app/frontend_manager/manager_finance/finance_collect_fee/api/manager_finance_collect_fee.api';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/api/manager_finance_collect_fee.query_keys';
import { useQuery } from '@tanstack/react-query';
/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerCollectFeePayments() { return useQuery({ queryKey: MANAGER_FINANCE_QUERY_KEYS.payments(), queryFn: fetchManagerCollectFeePayments, staleTime: 30_000 }); }
