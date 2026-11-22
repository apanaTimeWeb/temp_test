// RESPONSIBILITY: TanStack Query v5 mutation hooks for Notification Center (dispatch, retry, updateTemplate).
// FLOW: Components -> hooks/useSuperadminCommunicationNotificationCenterMutations.ts -> API -> TanStack cache invalidation.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  dispatchSuperadminNotification,
  retrySuperadminNotification,
  updateSuperadminNotificationTemplate,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/api/superadmin_communication_notification_center.api';
import { SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/api/superadmin_communication_notification_center.query_keys';
import type {
  DispatchNotificationDto,
  NotificationTemplate,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

/** Mutation hook to dispatch a new notification */
export function useDispatchNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dto, idempotencyKey }: { dto: DispatchNotificationDto; idempotencyKey: string }) => {
      const res = await dispatchSuperadminNotification(dto, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Notification queued successfully for dispatch (ID: ${data.id})`, {
        id: `dispatch-success-${data.id}`,
      });
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.usage(),
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to dispatch notification', {
        id: 'dispatch-error',
      });
    },
  });
}

/** Mutation hook to retry a failed transmission */
export function useRetryNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, idempotencyKey }: { id: string; idempotencyKey: string }) => {
      const res = await retrySuperadminNotification(id, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Transmission retried! New status: ${data.status}`, {
        id: `retry-success-${data.id}`,
      });
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.usage(),
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Retry failed. Check network provider connection.', {
        id: 'retry-error',
      });
    },
  });
}

/** Mutation hook to update a template */
export function useUpdateTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload, idempotencyKey }: { id: string; payload: Partial<NotificationTemplate>; idempotencyKey: string }) => {
      const res = await updateSuperadminNotificationTemplate(id, payload, idempotencyKey);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Template "${data.name}" updated successfully`, {
        id: `template-update-${data.id}`,
      });
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS.templates(),
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update template', {
        id: 'template-error',
      });
    },
  });
}
