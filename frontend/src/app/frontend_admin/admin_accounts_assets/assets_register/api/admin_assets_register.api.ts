// api/admin_assets_register.api.ts
import { apiFetch } from '@/lib/api';
import { parseApiResponseData } from '@/lib/apiSchema';
import { z } from 'zod';
import { ADMIN_ASSETS_REGISTER_API } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import {
  AdminAssetRecordSchema,
  AdminAssetsRegisterKpiSummarySchema,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterSchemas';
import type {
  AdminAssetRecord,
  AdminAssetsRegisterKpiSummary,
  AdminAssetsRegisterFilterParams,
  CreateAssetPayload,
  UpdateAmcPayload,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

const AdminAssetListResponseSchema = z.array(AdminAssetRecordSchema);

function buildQueryString(params?: AdminAssetsRegisterFilterParams): string {
  if (!params) return '';
  const query = new URLSearchParams();
  if (params.branchId && params.branchId !== 'ALL') query.set('branchId', params.branchId);
  if (params.category && params.category !== 'ALL') query.set('category', params.category);
  if (params.amcStatus && params.amcStatus !== 'ALL') query.set('amcStatus', params.amcStatus);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

/** Fetches full asset register inventory filtered by branch, category, AMC status or keyword */
export async function fetchAdminAssets(params?: AdminAssetsRegisterFilterParams): Promise<AdminAssetRecord[]> {
  const url = `${ADMIN_ASSETS_REGISTER_API.list}${buildQueryString(params)}`;
  const payload = await apiFetch<unknown>(url);
  return parseApiResponseData(payload, AdminAssetListResponseSchema);
}

/** Fetches single asset by ID */
export async function fetchAdminAssetDetail(id: string): Promise<AdminAssetRecord> {
  const payload = await apiFetch<unknown>(ADMIN_ASSETS_REGISTER_API.detail(id));
  return parseApiResponseData(payload, AdminAssetRecordSchema);
}

/** Fetches aggregated CapEx and AMC warranty statistics across all branches */
export async function fetchAdminAssetsKpis(): Promise<AdminAssetsRegisterKpiSummary> {
  const payload = await apiFetch<unknown>(ADMIN_ASSETS_REGISTER_API.kpis);
  return parseApiResponseData(payload, AdminAssetsRegisterKpiSummarySchema);
}

/** Adds a new asset to central register */
export async function createAdminAsset(payload: CreateAssetPayload): Promise<AdminAssetRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `asset-add-${Date.now()}`;
  const response = await apiFetch<unknown>(ADMIN_ASSETS_REGISTER_API.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponseData(response, AdminAssetRecordSchema);
}

/** Updates AMC warranty contract and scheduled maintenance lifecycle */
export async function updateAdminAssetAmc(payload: UpdateAmcPayload): Promise<AdminAssetRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `asset-amc-${Date.now()}`;
  const response = await apiFetch<unknown>(ADMIN_ASSETS_REGISTER_API.updateAmc(payload.assetId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  return parseApiResponseData(response, AdminAssetRecordSchema);
}

