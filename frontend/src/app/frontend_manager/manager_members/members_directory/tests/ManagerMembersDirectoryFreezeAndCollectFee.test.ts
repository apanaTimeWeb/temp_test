import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  MANAGER_MEMBERS_LEAVE_REASONS,
} from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryFreezeModal';
import { MANAGER_MEMBERS_STATUS_BADGES } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';

const readSource = (relativePath: string) =>
  readFileSync(join(__dirname, '..', relativePath), 'utf8');

describe('Manager Members Directory - Freeze / Leave & Collect Fee Enhancements', () => {
  it('defines comprehensive leave/freeze reasons covering exams, home visits, and medical leave', () => {
    const reasons = MANAGER_MEMBERS_LEAVE_REASONS.map((r) => r.label);
    expect(reasons).toContain('Home Visit / Family Function');
    expect(reasons).toContain('Outstation Competitive Exam');
    expect(reasons).toContain('Medical Leave / Illness');
    expect(reasons).toContain('Semester College Exams');
    expect(reasons).toContain('Personal Travel / Break');
    expect(reasons).toContain('Other Reason');
  });

  it('provides accessible modal structure in ManagerMembersDirectoryFreezeModal', () => {
    const modalSource = readSource(
      'components/manager_members_directory_sections/ManagerMembersDirectoryFreezeModal.tsx'
    );
    expect(modalSource).toContain('role="dialog"');
    expect(modalSource).toContain('aria-labelledby="freeze-modal-title"');
    expect(modalSource).toContain('Apply Leave / Freeze Membership');
    expect(modalSource).toContain('Auto-Extend Plan Expiry');
    expect(modalSource).toContain('Confirm & Pause Membership');
    expect(modalSource).toContain('createPortal(modalContent, document.body)');
  });

  it('exposes direct Collect Fee and Freeze actions in Member Profile Section', () => {
    const profileSource = readSource(
      'components/manager_members_directory_sections/ManagerMembersDirectoryProfileSection.tsx'
    );
    expect(profileSource).toContain('handleCollectFee');
    expect(profileSource).toContain('manager_pending_fee_collection');
    expect(profileSource).toContain('/frontend_manager/manager_finance/finance_collect_fee');
    expect(profileSource).toContain('Collect Fee');
    expect(profileSource).toContain('Freeze / Apply Leave');
    expect(profileSource).toContain('Resume Membership');
    expect(profileSource).toContain('Membership Currently Paused / Frozen');
    expect(profileSource).toContain('ManagerMembersDirectoryFreezeModal');
  });

  it('exposes quick Collect Fee action in Directory Table rows', () => {
    const tableSource = readSource(
      'components/manager_members_directory_sections/ManagerMembersDirectoryTable.tsx'
    );
    expect(tableSource).toContain('handleQuickCollectFee');
    expect(tableSource).toContain('Collect Fee / Renew Plan');
    expect(tableSource).toContain('/frontend_manager/manager_finance/finance_collect_fee');
  });

  it('verifies ManagerMembersDirectorySupportingSections is non-empty and renders operational SOPs & audit trail', () => {
    const supportingSource = readSource(
      'components/manager_members_directory_sections/ManagerMembersDirectorySupportingSections.tsx'
    );
    expect(supportingSource).not.toBe('export function ManagerMembersDirectorySupportingSections(_props: ManagerMembersDirectorySupportingSectionsProps) {\n  return null;\n}');
    expect(supportingSource).toContain('Membership Operations & Counter SOP Guidelines');
    expect(supportingSource).toContain('Membership Freeze & Leave Rules');
    expect(supportingSource).toContain('Counter Fee Collection & Renewals');
    expect(supportingSource).toContain('KYC & Document Verification');
    expect(supportingSource).toContain('Security Deposit & Exit Clearance');
    expect(supportingSource).toContain('Recent Member Lifecycle Activity & Audit Log');
  });

  it('includes On Leave in status badges dictionary', () => {
    expect(MANAGER_MEMBERS_STATUS_BADGES).toHaveProperty('On Leave');
    expect(MANAGER_MEMBERS_STATUS_BADGES['On Leave'].className).toContain('mgr-badge--info');
  });
});
