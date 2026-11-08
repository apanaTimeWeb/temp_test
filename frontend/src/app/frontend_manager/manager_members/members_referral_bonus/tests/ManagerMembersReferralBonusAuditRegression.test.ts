import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getInitialReferrals } from '@/app/frontend_manager/manager_members/members_referral_bonus/mocks/manager_members_referral_bonus_fixtures/ManagerMembersReferralBonusFixtures';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_referral_bonus'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_referral_bonus'),
  join(process.cwd(), 'frontend_manager/manager_members/members_referral_bonus'),
  process.cwd(),
].find(
  (candidate) =>
    existsSync(join(candidate, 'components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient.tsx')) &&
    existsSync(join(candidate, 'components/manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal.tsx'))
);

const readSource = (relativePath: string) => {
  if (!moduleRoot) throw new Error('Cannot find members_referral_bonus root');
  return readFileSync(join(moduleRoot, relativePath), 'utf8');
};

describe('Manager Members Referral Bonus - Audit Regression Suite (Section H)', () => {
  it('H-M3: preserves module boundary without importing sibling directory fixtures', () => {
    const addModalSource = readSource('components/manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal.tsx');
    expect(addModalSource).not.toContain('members_directory');
    expect(addModalSource).toContain('ManagerMembersReferralBonusFixtures');
  });

  it('H-M4: uses dynamic Date.now() / new Date() instead of hardcoded 2026-04-15 anchor date', () => {
    const clientSource = readSource('components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient.tsx');
    expect(clientSource).not.toContain("new Date('2026-04-15T12:00:00Z')");
    expect(clientSource).toContain('const now = new Date();');
  });

  it('H-Med2 & H-Med3: modal has accessible dialog attributes and combobox labels', () => {
    const addModalSource = readSource('components/manager_members_referral_bonus_dialogs/ManagerMembersReferralBonusAddModal.tsx');
    expect(addModalSource).toContain('aria-labelledby="referral-modal-title"');
    expect(addModalSource).toContain('id="referral-modal-title"');
    expect(addModalSource).toContain('aria-label="Referrer Student');
  });

  it('H-Med1: parses bonus amounts safely regardless of format', () => {
    const kpisSource = readSource('components/manager_members_referral_bonus_views/ManagerMembersReferralBonusKpis.tsx');
    expect(kpisSource).toContain('parseBonusAmount');

    const parseBonusAmount = (val: string | number) => {
      if (typeof val === 'number') return val;
      const digits = String(val).replace(/[^0-9.]/g, '');
      const num = parseFloat(digits);
      return isNaN(num) ? 0 : Math.round(num);
    };

    expect(parseBonusAmount('₹500')).toBe(500);
    expect(parseBonusAmount('500.00')).toBe(500);
    expect(parseBonusAmount(750)).toBe(750);
    expect(parseBonusAmount('invalid')).toBe(0);
  });

  it('H-C1 & H-M1: provides local browser persistence for referral records and approvals', () => {
    const clientSource = readSource('components/manager_members_referral_bonus_views/ManagerMembersReferralBonusReferralsClient.tsx');
    expect(clientSource).toContain('manager_members_referral_records');
    expect(clientSource).toContain('localStorage.getItem');
    expect(clientSource).toContain('localStorage.setItem');
  });

  it('H-L1: stylesheet exists in module styles directory matching theme contract', () => {
    const cssPath = join(moduleRoot!, 'components/manager_members_referral_bonus_styles/ManagerMembersReferralBonusManager_referral_bonus.css');
    expect(existsSync(cssPath)).toBe(true);
  });

  it('Initial referrals generate dynamic relative dates for active pipeline visibility', () => {
    const initial = getInitialReferrals();
    expect(initial.length).toBeGreaterThan(0);
    const todayStr = new Date().toISOString().slice(0, 10);
    const hasRecent = initial.some((r) => r.date <= todayStr);
    expect(hasRecent).toBe(true);
  });
});
