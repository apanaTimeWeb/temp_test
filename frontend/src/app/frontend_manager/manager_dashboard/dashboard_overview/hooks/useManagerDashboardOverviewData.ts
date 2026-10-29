'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchManagerDashboardData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.api';
import { MANAGER_DASHBOARD_QUERY_KEYS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/**
 * Owns dashboard server state. TanStack Query is the source of truth; this hook does not duplicate API data in Zustand.
 */
export function useManagerDashboardData() {
  return useQuery({ queryKey: MANAGER_DASHBOARD_QUERY_KEYS.overview(), queryFn: fetchManagerDashboardData, staleTime: 30_000 });
}
