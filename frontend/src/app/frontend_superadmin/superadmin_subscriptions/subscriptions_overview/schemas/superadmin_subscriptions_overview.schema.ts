// RESPONSIBILITY: Zod validation schemas for Superadmin Subscriptions Overview module.
import { z } from 'zod';

export const SUPERADMIN_SUBSCRIPTION_ACTION_SCHEMA = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  plan: z.string().min(1, 'Plan selection is required'),
  cycle: z.enum(['Monthly', 'Yearly']),
  mrr: z.number().nonnegative('MRR must be non-negative'),
  status: z.enum(['Active', 'Trial', 'Past Due', 'Grace Period', 'Suspended', 'Cancelled', 'Expired']),
  gracePeriodDays: z.number().int().min(0).max(60),
  autoRenewal: z.boolean(),
  discountPercent: z.number().min(0).max(100).optional(),
});

export const SUPERADMIN_NEW_SUBSCRIPTION_SCHEMA = z.object({
  tenant: z.string().trim().min(2, 'Tenant/Library name is required').max(100),
  email: z.string().email('Valid billing email required'),
  plan: z.string().min(1, 'Plan is required'),
  cycle: z.enum(['Monthly', 'Yearly']),
  customPrice: z.number().nonnegative(),
  branchesCount: z.number().int().min(1).max(100),
  isTrial: z.boolean().default(false),
  couponCode: z.string().trim().max(20).optional(),
});

export type SuperadminSubscriptionActionValues = z.infer<typeof SUPERADMIN_SUBSCRIPTION_ACTION_SCHEMA>;
export type SuperadminNewSubscriptionValues = z.infer<typeof SUPERADMIN_NEW_SUBSCRIPTION_SCHEMA>;
