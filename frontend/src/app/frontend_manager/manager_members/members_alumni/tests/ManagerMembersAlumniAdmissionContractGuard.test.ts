import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api';
import { fetchManagerAlumni, fetchManagerStudentById } from '@/app/frontend_manager/manager_members/members_alumni/api/manager_members_alumni.api';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));
const apiFetchMock: any = vi.mocked(apiFetch);
const studentEnvelopeData = {"id": "student-1", "smartId": "SMART-001", "name": "Test Student", "phone": "9876543210", "shift": "Morning", "seat": "S-01", "status": "Active", "plan": "Monthly", "dueMinor": 0, "currency": "INR", "joined": "2026-10-01"} as const;

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_alumni'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_alumni'),
  join(process.cwd(), 'frontend_manager/manager_members/members_alumni'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_alumni from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('alumni workflow ownership contract', () => {
  it('keeps alumni directory separate from student admission lifecycle', () => {
    expect(readSource('components/ManagerMembersAlumniMain.tsx')).toContain('ManagerMembersAlumniClient');
    expect(existsSync(join(moduleRoot, 'components/manager_members_alumni_forms/ManagerMembersAlumniAdmissionForm.tsx'))).toBe(false);
    expect(existsSync(join(moduleRoot, 'hooks/useManagerMembersAlumniAdmission.ts'))).toBe(false);
    expect(existsSync(join(moduleRoot, 'schemas/ManagerMembersAlumniAdmissionSchema.ts'))).toBe(false);
  });
});

describe('API response envelope contract', () => {
  beforeEach(() => vi.resetAllMocks());

  it('validates list data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: [studentEnvelopeData], requestId: 'test-list' });
    await expect(fetchManagerAlumni()).resolves.toEqual([studentEnvelopeData]);
  });

  it('validates detail data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: studentEnvelopeData, requestId: 'test-detail' });
    await expect(fetchManagerStudentById('student-1')).resolves.toEqual(studentEnvelopeData);
  });

  it('propagates a failed API envelope instead of parsing its null data', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: false, message: 'upstream unavailable', data: null, errorCode: 'UPSTREAM_UNAVAILABLE', statusCode: 503, requestId: 'test-failure' });
    await expect(fetchManagerAlumni()).rejects.toThrow('upstream unavailable');
  });
});
