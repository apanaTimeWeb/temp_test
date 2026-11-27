import {
  ADMIN_MEMBERS_CATEGORY_FIXTURES,
  ADMIN_MEMBERS_DEPARTMENT_FIXTURES,
  ADMIN_MEMBERS_FIXTURES,
  ADMIN_MEMBERS_RENEWAL_FIXTURES,
} from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.demo_data';
import { ADMIN_MEMBERS_URLS } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import { http, HttpResponse } from 'msw';

export {
  ADMIN_MEMBERS_CATEGORY_FIXTURES,
  ADMIN_MEMBERS_DEPARTMENT_FIXTURES,
  ADMIN_MEMBERS_FIXTURES,
  ADMIN_MEMBERS_RENEWAL_FIXTURES,
};

/**
 * Contract sentinel only: the supplied source has no authoritative members API response DTO.
 * Never fabricate a successful response. Tests receive an explicit 501 until the host contract is supplied.
 */
export const ADMIN_MEMBERS_MSW_HANDLERS = [
  http.get(`*${ADMIN_MEMBERS_URLS.LIST}`, () => HttpResponse.json({
    code: 'API_CONTRACT_UNAVAILABLE',
    message: 'Members API contract is unavailable in the supplied source scope.',
  }, { status: 501 })),
];
