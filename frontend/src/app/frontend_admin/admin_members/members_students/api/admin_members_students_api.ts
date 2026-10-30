import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_STUDENTS_API_ENDPOINTS } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';
import { AdminStudentsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_students/schemas/AdminMembersStudentsApiSchema';
import type { AdminStudentsApiRecord } from '@/app/frontend_admin/admin_members/members_students/schemas/AdminMembersStudentsApiSchema';

/** Stable, fail-closed signal for the missing live Students endpoint contract. */
export class AdminStudentsApiContractMissingError extends Error {
  readonly code = 'STUDENTS_API_CONTRACT_MISSING' as const;

  constructor() {
    super('The Students API endpoint is not present in the supplied frontend contract.');
    this.name = 'AdminStudentsApiContractMissingError';
  }
}

export async function fetchAdminStudents(): Promise<AdminStudentsApiRecord[]> {
  const endpoint = ADMIN_STUDENTS_API_ENDPOINTS.LIST;
  if (!endpoint) {
    // Never send an API request to the matching UI route or invent an endpoint.
    throw new AdminStudentsApiContractMissingError();
  }

  return parseApiResponseData(await apiFetch<unknown>(endpoint), AdminStudentsApiResponseSchema);
}

// Feature-scoped TanStack Query cache keys belong to this entity-family API contract.
/** Feature-scoped TanStack Query keys for the canonical admin_members_students submodule. */

