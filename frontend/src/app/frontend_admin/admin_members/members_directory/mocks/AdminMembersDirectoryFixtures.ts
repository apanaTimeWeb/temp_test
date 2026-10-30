import { ADMIN_MEMBERS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { http, HttpResponse } from 'msw';
import { ADMIN_MEMBERS_URLS } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';

export const ADMIN_MEMBERS_FIXTURES: readonly AdminMembersMember[] = [
  { id: 'MEM-001', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', plan: 'Premium (Monthly)', status: ADMIN_MEMBERS_STATUS_VALUES[0], expiryDate: '2026-10-30' },
  { id: 'MEM-002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', plan: 'Standard (Quarterly)', status: ADMIN_MEMBERS_STATUS_VALUES[1], expiryDate: '2026-09-01' },
  { id: 'MEM-003', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543212', plan: 'Premium (Yearly)', status: ADMIN_MEMBERS_STATUS_VALUES[2], expiryDate: '2027-01-15' },
  { id: 'MEM-004', name: 'Sneha Verma', email: 'sneha@example.com', phone: '+91 9876543213', plan: 'Standard (Monthly)', status: ADMIN_MEMBERS_STATUS_VALUES[3], expiryDate: '2026-12-01' },
];

/** Demo-only fixtures for the Members module's secondary management views. */
export const ADMIN_MEMBERS_CATEGORY_FIXTURES = [
  { name: 'Student', members: 124, color: 'primary' },
  { name: 'Professional', members: 45, color: 'purple' },
  { name: 'VIP Member', members: 12, color: 'warning' },
] as const;

export const ADMIN_MEMBERS_DEPARTMENT_FIXTURES = [
  { name: 'Science (B.Sc / M.Sc)', head: 'Dr. Sharma', members: 85 },
  { name: 'Engineering (B.Tech)', head: 'Prof. Verma', members: 156 },
] as const;


export const ADMIN_MEMBERS_RENEWAL_FIXTURES = [
  { member: 'John Doe', plan: 'Premium Monthly', expiresIn: { value: 2, unit: 'day' } },
  { member: 'Anita Desai', plan: 'Standard Yearly', expiresIn: { value: 1, unit: 'week' } },
] as const;

/**
 * Contract sentinel only: the supplied source has no authoritative members API response DTO.
 * Never fabricate a successful response. Tests receive an explicit 501 until the host contract is supplied.
 */
export const ADMIN_MEMBERS_MSW_HANDLERS = [
  http.get(ADMIN_MEMBERS_URLS.LIST, () => HttpResponse.json({
    code: 'API_CONTRACT_UNAVAILABLE',
    message: 'Members API contract is unavailable in the supplied source scope.',
  }, { status: 501 })),
];
