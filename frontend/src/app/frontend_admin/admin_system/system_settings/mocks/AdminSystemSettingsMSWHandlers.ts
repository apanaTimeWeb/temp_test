import { http, HttpResponse } from 'msw';
import { ADMIN_SYSTEM_SETTINGS_API } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';
import type { AdminSystemApiRecord } from '@/app/frontend_admin/admin_system/system_settings/api/admin_system_settings_api';

export const ADMIN_SYSTEM_API_LIST_FIXTURE: readonly AdminSystemApiRecord[] = [];

/** Test-only handler for the existing list URL and response envelope; empty data avoids fabricating undocumented System records. */
export const ADMIN_SYSTEM_MSW_HANDLERS = [
  http.get(ADMIN_SYSTEM_SETTINGS_API.LIST, () => HttpResponse.json({
    success: true,
    message: 'System list fixture returned no records.',
    data: ADMIN_SYSTEM_API_LIST_FIXTURE,
    requestId: 'mock-system-settings-list',
  })),
];
