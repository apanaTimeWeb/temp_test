'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerFinanceRefunds } from '@/app/frontend_manager/manager_finance/finance_refunds/api/manager_finance_refunds.api';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_refunds/api/manager_finance_refunds.query_keys';
/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerFinanceRefunds() { return useQuery({ queryKey: MANAGER_FINANCE_QUERY_KEYS.refunds(), queryFn: fetchManagerFinanceRefunds, staleTime: 30_000 }); }
