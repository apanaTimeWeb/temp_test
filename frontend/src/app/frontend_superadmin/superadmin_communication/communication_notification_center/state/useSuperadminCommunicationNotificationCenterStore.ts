// RESPONSIBILITY: Module-scoped Zustand store for transient UI state in Notification Center.
// FLOW: UI interactions -> state/useSuperadminCommunicationNotificationCenterStore.ts -> synchronized UI state.

import { create } from 'zustand';
import type {
  NotificationCategory,
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationRecord,
  NotificationTargetScope,
  NotificationTemplate,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export type NotificationCenterTab = 'overview' | 'templates' | 'logs' | 'usage' | 'email' | 'sms' | 'payment-reminders';

interface SuperadminCommunicationNotificationCenterState {
  // Navigation / Tabs
  activeTab: NotificationCenterTab;
  setActiveTab: (tab: NotificationCenterTab) => void;

  // Filters
  categoryFilter: NotificationCategory | 'ALL';
  setCategoryFilter: (cat: NotificationCategory | 'ALL') => void;

  channelFilter: NotificationChannel | 'ALL';
  setChannelFilter: (channel: NotificationChannel | 'ALL') => void;

  statusFilter: NotificationDeliveryStatus | 'ALL';
  setStatusFilter: (status: NotificationDeliveryStatus | 'ALL') => void;

  targetScopeFilter: NotificationTargetScope | 'ALL';
  setTargetScopeFilter: (scope: NotificationTargetScope | 'ALL') => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected Notification for Detail Drawer / Inspection
  selectedNotification: NotificationRecord | null;
  setSelectedNotification: (notification: NotificationRecord | null) => void;

  // Modals
  isComposeOpen: boolean;
  setIsComposeOpen: (open: boolean) => void;

  selectedTemplate: NotificationTemplate | null;
  setSelectedTemplate: (template: NotificationTemplate | null) => void;

  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (open: boolean) => void;

  // Reset all filters
  resetFilters: () => void;
}

export const useSuperadminCommunicationNotificationCenterStore = create<SuperadminCommunicationNotificationCenterState>(
  (set) => ({
    activeTab: 'overview',
    setActiveTab: (tab) => set({ activeTab: tab }),

    categoryFilter: 'ALL',
    setCategoryFilter: (cat) => set({ categoryFilter: cat }),

    channelFilter: 'ALL',
    setChannelFilter: (channel) => set({ channelFilter: channel }),

    statusFilter: 'ALL',
    setStatusFilter: (status) => set({ statusFilter: status }),

    targetScopeFilter: 'ALL',
    setTargetScopeFilter: (scope) => set({ targetScopeFilter: scope }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    selectedNotification: null,
    setSelectedNotification: (notification) => set({ selectedNotification: notification }),

    isComposeOpen: false,
    setIsComposeOpen: (open) => set({ isComposeOpen: open }),

    selectedTemplate: null,
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),

    isTemplateModalOpen: false,
    setIsTemplateModalOpen: (open) => set({ isTemplateModalOpen: open }),

    resetFilters: () =>
      set({
        categoryFilter: 'ALL',
        channelFilter: 'ALL',
        statusFilter: 'ALL',
        targetScopeFilter: 'ALL',
        searchQuery: '',
      }),
  })
);
