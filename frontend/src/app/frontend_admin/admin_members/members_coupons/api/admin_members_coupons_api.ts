import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_MEMBERS_COUPONS_API } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import { ADMIN_COUPONS_STATUS_VALUES, ADMIN_COUPONS_UNKNOWN_STATUS } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import { AdminCouponsApiRecordSchema, AdminCouponsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type { z } from 'zod';
import type { AdminCouponsCoupon, AdminCouponsStatus } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

export class AdminCouponsApiContractMissingError extends Error {
  constructor() {
    super('Coupons API endpoint/response contract is not supplied; no request was sent.');
    this.name = 'AdminCouponsApiContractMissingError';
  }
}

type AdminCouponsApiRecord = z.infer<typeof AdminCouponsApiRecordSchema>;

/** Maps only known coupon lifecycle states; unknown states remain Unknown. */
export function resolveAdminCouponsStatus(status: string | undefined, _isActive: boolean | undefined): AdminCouponsStatus {
  const normalizedStatus = status?.trim().toLowerCase();
  if (normalizedStatus === 'exhausted') return 'Exhausted';
  if (normalizedStatus === 'expired') return 'Expired';
  if (normalizedStatus === 'active') return 'Active';
  return ADMIN_COUPONS_STATUS_VALUES.find((candidate) => candidate.toLowerCase() === normalizedStatus) ?? ADMIN_COUPONS_UNKNOWN_STATUS;
}

/** Pure mapper, shared by contract-validated API responses and explicitly demo-only fixtures. */
export function mapAdminCouponsApiRecords(records: readonly AdminCouponsApiRecord[]): AdminCouponsCoupon[] {
  return records.map((record) => {
    const normalizedDiscountType = record.discountType.trim().toLowerCase();
    const type = normalizedDiscountType === 'percentage' || normalizedDiscountType === 'percent'
      ? 'Percent'
      : normalizedDiscountType === 'flat'
        ? 'Flat'
        : 'Unknown';

    return {
      id: String(record.id),
      code: record.code,
      discount: record.discountValue,
      type,
      ...(record.currencyCode ? { currencyCode: record.currencyCode } : {}),
      ...(record.amountUnit ? { amountUnit: record.amountUnit } : {}),
      ...(typeof record.usedCount === 'number' ? { usedCount: record.usedCount } : {}),
      ...(typeof record.maxUses === 'number' ? { maxUses: record.maxUses } : {}),
      ...(typeof record.validUntil === 'string' && record.validUntil.length > 0 ? { expiry: record.validUntil } : {}),
      status: resolveAdminCouponsStatus(record.status, record.isActive),
    };
  });
}

export async function fetchAdminCoupons(): Promise<AdminCouponsCoupon[]> {
  const endpoint = ADMIN_MEMBERS_COUPONS_API.LIST;
  if (!endpoint) throw new AdminCouponsApiContractMissingError();
  const payload = parseApiResponseData(await apiFetch<unknown>(endpoint), AdminCouponsApiResponseSchema);
  return mapAdminCouponsApiRecords(payload);
}

/** Feature-scoped TanStack Query keys for admin_coupons. Keep server-state cache ownership inside this feature. */

