import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_MEMBERS_PLANS_API } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import { AdminPlansApiResponseSchema } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';

export class AdminPlansApiContractMissingError extends Error {
  constructor() {
    super('Membership plans API endpoint/response contract is not supplied; no request was sent.');
    this.name = 'AdminPlansApiContractMissingError';
  }
}

export async function fetchAdminPlans(): Promise<AdminPlansPlan[]> {
  const endpoint = ADMIN_MEMBERS_PLANS_API.LIST;
  if (!endpoint) throw new AdminPlansApiContractMissingError();

  const payload = parseApiResponseData(await apiFetch<unknown>(endpoint), AdminPlansApiResponseSchema);
  return payload.map((plan) => ({
    id: String(plan.id),
    name: plan.name,
    price: plan.price,
    currencyCode: plan.currencyCode,
    amountUnit: plan.amountUnit,
    duration: String(plan.durationInDays),
    durationDays: plan.durationInDays,
    features: plan.features ?? [],
    status: plan.status ?? (plan.isActive === true ? ADMIN_PLANS_STATUS_VALUES[0] : plan.isActive === false ? ADMIN_PLANS_STATUS_VALUES[1] : ADMIN_PLANS_STATUS_VALUES[2]),
    subscribers: plan.subscribers ?? 0,
  }));
}

/** Feature-scoped TanStack Query keys for admin_plans. Keep server-state cache ownership inside this feature. */

