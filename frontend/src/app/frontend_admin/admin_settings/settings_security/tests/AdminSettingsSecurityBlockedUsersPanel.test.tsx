import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdminSecurityBlockedUsersPanel } from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityPage';
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
describe('AdminSecurityBlockedUsersPanel', () => {
  it('keeps unverified lock/unlock actions disabled and exposes accessible visible reasons', () => {
    render(<AdminSecurityBlockedUsersPanel />);
    expect(screen.getAllByRole('button', { name: 'UNLOCK_ACCOUNT' }).every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getAllByRole('button', { name: 'LOCK_ACCOUNT' }).every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getAllByText('ACCOUNT_UNLOCK_BLOCKED').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ACCOUNT_LOCK_BLOCKED').length).toBeGreaterThan(0);
  });
});
