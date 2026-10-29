import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api';
import { fetchManagerIdCardGenerator, fetchManagerStudentById } from '@/app/frontend_manager/manager_members/members_id_card_generator/api/manager_members_id_card_generator.api';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));
const apiFetchMock: any = vi.mocked(apiFetch);
const studentEnvelopeData = {"id": "student-1", "smartId": "SMART-001", "name": "Test Student", "phone": "9876543210", "shift": "Morning", "seat": "S-01", "status": "Active", "plan": "Monthly", "dueMinor": 0, "currency": "INR", "joined": "2026-10-01"} as const;

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'frontend_manager/manager_members/members_id_card_generator'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_id_card_generator from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('ID-card route ownership contract', () => {
  it('redirects legacy admission links to the canonical New Admission route', () => {
    const page = readSource('page.tsx');
    const urls = readSource('config/manager_members_id_card_generator.url_config.ts');
    expect(page).toContain("requestedView === 'admission'");
    expect(page).toContain('redirect(MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ADMISSION_PREVIEW)');
    expect(urls).toContain("ADMISSION_PREVIEW: '/frontend_manager/manager_members/members_new_admission'");
  });

  it('does not retain a second admission form, schema or admission-state hook', () => {
    for (const relativePath of [
      'components/manager_members_id_card_generator_forms/ManagerMembersIdCardGeneratorAdmissionForm.tsx',
      'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorAdmissionEnrollmentSection.tsx',
      'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorAdmissionPaymentSection.tsx',
      'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorAdmissionPersonalSection.tsx',
      'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorAdmissionSummary.tsx',
      'hooks/useManagerMembersIdCardGeneratorAdmission.ts',
      'schemas/ManagerMembersIdCardGeneratorAdmissionSchema.ts',
    ]) expect(existsSync(join(moduleRoot, relativePath))).toBe(false);
    expect(readSource('components/ManagerMembersIdCardGeneratorMain.tsx')).not.toContain('AdmissionForm');
  });
});

describe('API response envelope contract', () => {
  beforeEach(() => vi.resetAllMocks());

  it('validates list data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: [studentEnvelopeData], requestId: 'test-list' });
    await expect(fetchManagerIdCardGenerator()).resolves.toEqual([studentEnvelopeData]);
  });

  it('validates detail data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: studentEnvelopeData, requestId: 'test-detail' });
    await expect(fetchManagerStudentById('student-1')).resolves.toEqual(studentEnvelopeData);
  });

  it('propagates a failed API envelope instead of parsing its null data', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: false, message: 'upstream unavailable', data: null, errorCode: 'UPSTREAM_UNAVAILABLE', statusCode: 503, requestId: 'test-failure' });
    await expect(fetchManagerIdCardGenerator()).rejects.toThrow('upstream unavailable');
  });
});
