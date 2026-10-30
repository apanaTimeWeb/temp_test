import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AdminSecurityFailedLoginsPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityFailedLoginsPanel';
import AdminSecurityDeviceSessionsPanel from '@/app/frontend_admin/admin_settings/settings_security/components/AdminSettingsSecurityDeviceSessionsPanel';
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
describe('security responsive panels', () => {
  it('renders failed-login records in responsive cards and desktop table', () => {
    const { rerender } = render(<AdminSecurityFailedLoginsPanel />);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('table').length).toBe(1);
    expect(screen.getAllByText('COLUMN_IP').length).toBeGreaterThan(0);
    rerender(<AdminSecurityDeviceSessionsPanel />);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('table').length).toBe(1);
    expect(screen.getAllByRole('button', { name: 'REVOKE' }).every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getAllByText('SESSION_REVOKE_BLOCKED').length).toBeGreaterThan(0);
  });
});
