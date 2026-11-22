// state/useSuperadminUsageQuotaRequestsStore.ts
import { create } from 'zustand';
import type {
  QuotaRequestResourceType,
  QuotaRequestStatus,
  QuotaUpgradeRequestRecord,
} from '../types/SuperadminUsageQuotaRequestsTypes';

interface SuperadminUsageQuotaRequestsState {
  search: string;
  status: 'ALL' | QuotaRequestStatus;
  resourceType: 'ALL' | QuotaRequestResourceType;
  selectedRequest: QuotaUpgradeRequestRecord | null;
  isApproveModalOpen: boolean;
  isRejectModalOpen: boolean;

  setSearch: (search: string) => void;
  setStatus: (status: 'ALL' | QuotaRequestStatus) => void;
  setResourceType: (type: 'ALL' | QuotaRequestResourceType) => void;
  openApproveModal: (req: QuotaUpgradeRequestRecord) => void;
  closeApproveModal: () => void;
  openRejectModal: (req: QuotaUpgradeRequestRecord) => void;
  closeRejectModal: () => void;
  resetFilters: () => void;
}

export const useSuperadminUsageQuotaRequestsStore = create<SuperadminUsageQuotaRequestsState>((set) => ({
  search: '',
  status: 'ALL',
  resourceType: 'ALL',
  selectedRequest: null,
  isApproveModalOpen: false,
  isRejectModalOpen: false,

  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setResourceType: (resourceType) => set({ resourceType }),
  openApproveModal: (req) => set({ selectedRequest: req, isApproveModalOpen: true }),
  closeApproveModal: () => set({ selectedRequest: null, isApproveModalOpen: false }),
  openRejectModal: (req) => set({ selectedRequest: req, isRejectModalOpen: true }),
  closeRejectModal: () => set({ selectedRequest: null, isRejectModalOpen: false }),
  resetFilters: () => set({ search: '', status: 'ALL', resourceType: 'ALL' }),
}));
