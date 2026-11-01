// types/AdminAssetsRegisterTypes.ts
import type {
  ADMIN_ASSET_CATEGORIES,
  ADMIN_ASSET_STATUSES,
  ADMIN_ASSET_AMC_STATUSES,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';

export type AdminAssetCategory = (typeof ADMIN_ASSET_CATEGORIES)[number];
export type AdminAssetStatus = (typeof ADMIN_ASSET_STATUSES)[number];
export type AdminAssetAmcStatus = (typeof ADMIN_ASSET_AMC_STATUSES)[number];

export interface AdminAssetRecord {
  id: string;
  assetCode: string;
  name: string;
  category: AdminAssetCategory;
  branchId: string;
  branchName: string;
  locationWithinBranch: string;
  purchaseDate: string;
  purchaseCost: number; // in paise
  currentBookValue: number; // in paise
  vendorName: string;
  vendorContact: string;
  warrantyExpiryDate: string;
  amcStatus: AdminAssetAmcStatus;
  amcVendorName?: string | null;
  amcVendorContact?: string | null;
  amcExpiryDate?: string | null;
  lastServiceDate?: string | null;
  nextScheduledServiceDate?: string | null;
  status: AdminAssetStatus;
  serialNumber?: string | null;
  notes?: string | null;
}

export interface AdminAssetsRegisterKpiSummary {
  totalAssetsCount: number;
  totalCapExValue: number; // in paise
  activeAmcCount: number;
  warrantyExpiringSoonCount: number;
  underRepairCount: number;
}

export interface AdminAssetsRegisterFilterParams {
  branchId?: string;
  category?: AdminAssetCategory | 'ALL';
  amcStatus?: AdminAssetAmcStatus | 'ALL';
  search?: string;
}

export interface CreateAssetPayload {
  assetCode: string;
  name: string;
  category: AdminAssetCategory;
  branchId: string;
  branchName: string;
  locationWithinBranch: string;
  purchaseDate: string;
  purchaseCost: number;
  vendorName: string;
  vendorContact: string;
  warrantyExpiryDate: string;
  amcStatus: AdminAssetAmcStatus;
  amcVendorName?: string;
  amcVendorContact?: string;
  amcExpiryDate?: string;
  serialNumber?: string;
  notes?: string;
}

export interface UpdateAmcPayload {
  assetId: string;
  amcStatus: AdminAssetAmcStatus;
  amcVendorName: string;
  amcVendorContact: string;
  amcExpiryDate: string;
  nextScheduledServiceDate?: string;
  notes?: string;
}

