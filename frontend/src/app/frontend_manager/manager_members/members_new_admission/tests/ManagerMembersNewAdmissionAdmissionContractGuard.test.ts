import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/lib/api';
import { fetchManagerNewAdmission, fetchManagerStudentById } from '@/app/frontend_manager/manager_members/members_new_admission/api/manager_members_new_admission.api';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));
const apiFetchMock: any = vi.mocked(apiFetch);
const studentEnvelopeData = {"id": "student-1", "smartId": "SMART-001", "name": "Test Student", "phone": "9876543210", "shift": "Morning", "seat": "S-01", "status": "Active", "plan": "Monthly", "dueMinor": 0, "currency": "INR", "joined": "2026-10-01"} as const;

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_new_admission'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_new_admission'),
  join(process.cwd(), 'frontend_manager/manager_members/members_new_admission'),
].find(existsSync);
if (!moduleRoot) throw new Error('Could not locate manager_members/members_new_admission from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('student admission contract guard', () => {
  it('does not seed invented plan prices or selected inventory defaults', () => {
    const hook = readSource('hooks/useManagerMembersNewAdmissionAdmission.ts');
    expect(hook).toContain("plan: ''");
    expect(hook).toContain("seat: ''");
    expect(hook).toContain("shift: ''");
    expect(hook).toContain("amountPaid: ''");
    expect(hook).not.toContain('amountMinor');
  });

  it('keeps pricing, payment, seat and locker controls unavailable without a host contract', () => {
    const payment = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection.tsx');
    const enrollment = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionEnrollmentSection.tsx');
    const summary = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionSummary.tsx');
    expect(payment).toContain('disabled className="mgr-select mgr-input-with-icon"');
    expect(payment).toContain('admission_unavailable_host_contract_not_supplied');
    expect(enrollment).toContain('disabled className={`mgr-select');
    expect(summary).toContain('pricingAvailable = false');
    expect(summary).toContain('window.confirm');
    expect(readSource('components/manager_members_new_admission_forms/ManagerMembersNewAdmissionAdmissionForm.tsx')).toContain('useManagerMembersNewAdmissionUnsavedChangesGuard');
    expect(readSource('hooks/useManagerMembersNewAdmissionUnsavedChangesGuard.ts')).toContain('beforeunload');
    expect(readSource('hooks/useManagerMembersNewAdmissionUnsavedChangesGuard.ts')).toContain('pendingAnchor.click()');
  });
});

describe('API response envelope contract', () => {
  beforeEach(() => vi.resetAllMocks());

  it('validates list data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: [studentEnvelopeData], requestId: 'test-list' });
    await expect(fetchManagerNewAdmission()).resolves.toEqual([studentEnvelopeData]);
  });

  it('validates detail data from a successful API envelope', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: true, message: 'ok', data: studentEnvelopeData, requestId: 'test-detail' });
    await expect(fetchManagerStudentById('student-1')).resolves.toEqual(studentEnvelopeData);
  });

  it('propagates a failed API envelope instead of parsing its null data', async () => {
    apiFetchMock.mockResolvedValueOnce({ success: false, message: 'upstream unavailable', data: null, errorCode: 'UPSTREAM_UNAVAILABLE', statusCode: 503, requestId: 'test-failure' });
    await expect(fetchManagerNewAdmission()).rejects.toThrow('upstream unavailable');
  });
});
