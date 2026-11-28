import { fetchManagerGroupAdmission, fetchManagerStudentById } from '@/app/frontend_manager/manager_members/members_group_admission/api/manager_members_group_admission.api';
import { apiFetch } from '@/lib/api';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));
const apiFetchMock: any = vi.mocked(apiFetch);
const studentEnvelopeData = {
  id: 'student-1',
  smartId: 'SMART-001',
  name: 'Test Student',
  phone: '9876543210',
  shift: 'Morning',
  seat: 'S-01',
  status: 'Active',
  plan: 'Monthly',
  dueMinor: 0,
  currency: 'INR',
  joined: '2026-10-01',
} as const;

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_group_admission'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_group_admission'),
  join(process.cwd(), 'frontend_manager/manager_members/members_group_admission'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
].find(
  (candidate) =>
    existsSync(join(candidate, 'config/manager_members_group_admission.url_config.ts')) &&
    existsSync(join(candidate, 'components/manager_members_group_admission_views/ManagerMembersGroupAdmissionGroupPage.tsx')),
);
if (!moduleRoot) throw new Error('Could not locate the canonical members_group_admission module from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('group admission workflow ownership contract', () => {
  it('keeps group admission routed to GroupPage without dead single-student AdmissionForm copies', () => {
    expect(readSource('components/ManagerMembersGroupAdmissionMain.tsx')).toContain('ManagerMembersGroupAdmissionGroupPage');
    expect(existsSync(join(moduleRoot, 'components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionAdmissionForm.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, 'hooks/useManagerMembersGroupAdmissionAdmission.ts'))).toBe(false);
  });

  it('persists group admission state through dedicated storage helpers', () => {
    const groupPage = readSource('components/manager_members_group_admission_views/ManagerMembersGroupAdmissionGroupPage.tsx');
    expect(groupPage).toContain('loadStoredGroupAdmissions');
    expect(groupPage).toContain('persistGroupAdmissions');
  });
});

describe('API response envelope contract', () => {
  beforeEach(() => vi.resetAllMocks());

  it('validates list data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: [studentEnvelopeData], requestId: 'test-list' });
    await expect(fetchManagerGroupAdmission()).resolves.toEqual([studentEnvelopeData]);
  });

  it('validates detail data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: studentEnvelopeData, requestId: 'test-detail' });
    await expect(fetchManagerStudentById('student-1')).resolves.toEqual(studentEnvelopeData);
  });

  it('propagates a failed API envelope instead of parsing its null data', async () => {
    apiFetchMock.mockResolvedValueOnce({
      success: false,
      message: 'upstream unavailable',
      data: null,
      errorCode: 'UPSTREAM_UNAVAILABLE',
      statusCode: 503,
      requestId: 'test-failure',
    });
    await expect(fetchManagerGroupAdmission()).rejects.toThrow('upstream unavailable');
  });
});
