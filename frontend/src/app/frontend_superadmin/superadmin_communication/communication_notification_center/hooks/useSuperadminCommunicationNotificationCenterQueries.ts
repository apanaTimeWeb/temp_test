// RESPONSIBILITY: TanStack Query v5 query hooks for Notification Center (notifications, templates, usage, accounts).
// FLOW: Components -> hooks/useSuperadminCommunicationNotificationCenterQueries.ts -> TanStack Query cache -> API.

import { useQuery } from '@tanstack/react-query';
import {
  fetchSuperadminNotifications,
  fetchSuperadminNotificationTemplates,
  fetchSuperadminNotificationUsage,
  fetchSuperadminTargetAccounts,
  type NotificationFilterParams,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/api/superadmin_communication_notification_center.api';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/api/superadmin_communication_notification_center.query_keys';

// Re-export mutations for backward compatibility and clean consumer imports
export {
  useDispatchNotificationMutation,
  useRetryNotificationMutation,
  useUpdateTemplateMutation,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterMutations';

/** Hook to fetch notifications list */
export function useSuperadminNotificationsQuery(params: NotificationFilterParams = {}) {
  return useQuery({
    queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.list(params as Record<string, string | number | boolean | null | undefined>),
    queryFn: async () => {
      const res = await fetchSuperadminNotifications(params);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
    gcTime: 300000,
  });
}

/** Hook to fetch mandated notification templates */
export function useSuperadminTemplatesQuery() {
  return useQuery({
    queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.templates(),
    queryFn: async () => {
      const res = await fetchSuperadminNotificationTemplates();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 60000,
    gcTime: 300000,
  });
}

/** Hook to fetch overall notification usage and channel statistics */
export function useSuperadminUsageAnalyticsQuery() {
  return useQuery({
    queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.usage(),
    queryFn: async () => {
      const res = await fetchSuperadminNotificationUsage();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
    gcTime: 300000,
  });
}

/** Hook to fetch selectable target library/gym accounts for account-specific notifications */
export function useSuperadminTargetAccountsQuery() {
  return useQuery({
    queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.accounts(),
    queryFn: async () => {
      const res = await fetchSuperadminTargetAccounts();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 60000,
    gcTime: 300000,
  });
}
