import { http, HttpResponse } from 'msw';
import { ADMIN_STAFF_DIRECTORY_API_FIXTURE } from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import { ADMIN_STAFF_DIRECTORY_URLS } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import type { AdminStaffDirectoryHarnessProps } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';

/** Isolated test-scenario vocabulary owned by admin_staff_directory. No sibling imports or live API assumptions. */
export const AdminStaffDirectoryScenarios = ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED'] as const;
export type AdminStaffDirectoryScenario = (typeof AdminStaffDirectoryScenarios)[number];

/** Describes a scenario for local tests without asserting an undocumented backend DTO. */
export function AdminStaffDirectoryScenarioLabel(scenario: AdminStaffDirectoryScenario): string {
  switch (scenario) {
    case 'ACTIVE': return 'active';
    case 'EMPTY': return 'empty';
    case 'SERVER_500': return 'server-error';
    case 'TIMEOUT': return 'timeout';
    case 'UNAUTHORIZED': return 'unauthorized';
  }
}




/** Test-only read handler. It never creates staff accounts and stays outside runtime/demo imports. */
export const ADMIN_STAFF_DIRECTORY_MSW_HANDLERS = [http.get(ADMIN_STAFF_DIRECTORY_URLS.LIST, () => HttpResponse.json({ success: true, message: 'Synthetic staff fixture loaded.', data: ADMIN_STAFF_DIRECTORY_API_FIXTURE, requestId: 'mock-staff-directory-list' }))];
