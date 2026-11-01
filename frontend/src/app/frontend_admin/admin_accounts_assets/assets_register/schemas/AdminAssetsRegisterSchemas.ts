// schemas/AdminAssetsRegisterSchemas.ts
import { z } from 'zod';
import {
  ADMIN_ASSET_CATEGORIES,
  ADMIN_ASSET_STATUSES,
  ADMIN_ASSET_AMC_STATUSES,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';

export const AdminAssetCategorySchema = z.enum(ADMIN_ASSET_CATEGORIES);
export const AdminAssetStatusSchema = z.enum(ADMIN_ASSET_STATUSES);
export const AdminAssetAmcStatusSchema = z.enum(ADMIN_ASSET_AMC_STATUSES);

export const AdminAssetRecordSchema = z.object({
  id: z.string().min(1),
  assetCode: z.string().min(1),
  name: z.string().min(1),
  category: AdminAssetCategorySchema,
  branchId: z.string().min(1),
  branchName: z.string().min(1),
  locationWithinBranch: z.string().min(1),
  purchaseDate: z.string(),
  purchaseCost: z.number().int().nonnegative(),
  currentBookValue: z.number().int().nonnegative(),
  vendorName: z.string().min(1),
  vendorContact: z.string(),
  warrantyExpiryDate: z.string(),
  amcStatus: AdminAssetAmcStatusSchema,
  amcVendorName: z.string().nullable().optional(),
  amcVendorContact: z.string().nullable().optional(),
  amcExpiryDate: z.string().nullable().optional(),
  lastServiceDate: z.string().nullable().optional(),
  nextScheduledServiceDate: z.string().nullable().optional(),
  status: AdminAssetStatusSchema,
  serialNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const AdminAssetsRegisterKpiSummarySchema = z.object({
  totalAssetsCount: z.number().int().nonnegative(),
  totalCapExValue: z.number().int().nonnegative(),
  activeAmcCount: z.number().int().nonnegative(),
  warrantyExpiringSoonCount: z.number().int().nonnegative(),
  underRepairCount: z.number().int().nonnegative(),
});

export const CreateAssetFormSchema = z.object({
  assetCode: z.string().min(2, 'Asset code is required (e.g. KB-AC-01)'),
  name: z.string().min(3, 'Asset name is required'),
  category: AdminAssetCategorySchema,
  branchId: z.string().min(1, 'Please select branch'),
  branchName: z.string().min(1),
  locationWithinBranch: z.string().min(2, 'Location is required (e.g. Ground Floor Hall A)'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  purchaseCostPaise: z.number().int().positive('Purchase cost must be positive'),
  vendorName: z.string().min(2, 'Vendor name is required'),
  vendorContact: z.string().min(5, 'Vendor phone/contact is required'),
  warrantyExpiryDate: z.string().min(1, 'Warranty expiry date is required'),
  amcStatus: AdminAssetAmcStatusSchema,
  amcVendorName: z.string().optional(),
  amcVendorContact: z.string().optional(),
  amcExpiryDate: z.string().optional(),
  serialNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateAmcFormSchema = z.object({
  amcStatus: AdminAssetAmcStatusSchema,
  amcVendorName: z.string().min(2, 'AMC Vendor name is required'),
  amcVendorContact: z.string().min(5, 'AMC Vendor contact is required'),
  amcExpiryDate: z.string().min(1, 'Contract expiry date is required'),
  nextScheduledServiceDate: z.string().optional(),
  notes: z.string().optional(),
});

