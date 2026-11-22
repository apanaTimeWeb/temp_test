'use client';

import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/types/SuperadminSubscriptionsOverviewTypes';
import SuperadminSubscriptionsOverviewActionModal from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewActionModal';
import SuperadminSubscriptionsOverviewNewModal from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewNewModal';
import SuperadminSubscriptionsOverviewHistoryModal from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewHistoryModal';

export interface SuperadminSubscriptionsOverviewModalsProps {
  selectedSub: SuperadminSubscriptionRecord | null;
  isActionModalOpen: boolean;
  onCloseActionModal: () => void;
  onSaveAction: (updated: SuperadminSubscriptionRecord) => void;
  isNewModalOpen: boolean;
  onCloseNewModal: () => void;
  onCreateSubscription: (newSub: SuperadminSubscriptionRecord) => void;
  isHistoryModalOpen: boolean;
  onCloseHistoryModal: () => void;
}

export default function SuperadminSubscriptionsOverviewModals({
  selectedSub,
  isActionModalOpen,
  onCloseActionModal,
  onSaveAction,
  isNewModalOpen,
  onCloseNewModal,
  onCreateSubscription,
  isHistoryModalOpen,
  onCloseHistoryModal,
}: SuperadminSubscriptionsOverviewModalsProps) {
  return (
    <>
      <SuperadminSubscriptionsOverviewActionModal
        subscription={selectedSub}
        isOpen={isActionModalOpen}
        onClose={onCloseActionModal}
        onSave={onSaveAction}
      />
      <SuperadminSubscriptionsOverviewNewModal
        isOpen={isNewModalOpen}
        onClose={onCloseNewModal}
        onCreate={onCreateSubscription}
      />
      <SuperadminSubscriptionsOverviewHistoryModal
        subscription={selectedSub}
        isOpen={isHistoryModalOpen}
        onClose={onCloseHistoryModal}
      />
    </>
  );
}
