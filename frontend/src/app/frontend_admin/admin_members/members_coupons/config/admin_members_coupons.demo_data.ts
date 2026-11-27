import { AdminCouponsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type { z } from 'zod';

/** Seed fixture for explicit demo mode; UI edits live only in the current in-memory query cache and never imply backend persistence. */
export const ADMIN_COUPONS_API_FIXTURE: z.infer<typeof AdminCouponsApiResponseSchema> = [
  {
    id: 'COUPON-DEMO-001',
    code: 'DEMO10',
    discountValue: 10,
    discountType: 'percentage',
    usedCount: 0,
    maxUses: 10,
    validUntil: '2027-10-13',
    isActive: true,
    status: 'active',
  },
];
