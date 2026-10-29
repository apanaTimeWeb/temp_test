'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerReports, ManagerDashboardReportsContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.api';
import { getManagerReportsQueryKey } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/api/manager_dashboard_reports.query_keys';
import type { ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Reports server-state reads; selected range remains UI state in the page. */
export function useManagerReports(dateRange:ManagerDashboardReportsDateRange){return useQuery({queryKey:getManagerReportsQueryKey(dateRange),queryFn:()=>fetchManagerReports(dateRange),staleTime:30000,retry:(failureCount,error)=>!(error instanceof ManagerDashboardReportsContractBlockedError)&&failureCount<3});}
