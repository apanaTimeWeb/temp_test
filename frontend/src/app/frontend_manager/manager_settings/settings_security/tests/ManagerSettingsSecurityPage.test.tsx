// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ManagerSettingsSecurityMain } from '../components/ManagerSettingsSecurityMain';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('ManagerSettingsSecurityMain Integration Suite', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders header, manager profile info, and security badges', () => {
    render(<ManagerSettingsSecurityMain />);

    // Header info
    expect(screen.getByText('Rajesh Kumar')).toBeInTheDocument();
    expect(screen.getByText('Library Branch Manager')).toBeInTheDocument();
    expect(screen.getByText(/Central Library · Main Branch/)).toBeInTheDocument();
    expect(screen.getByText('LIB-MAIN-01')).toBeInTheDocument();
    expect(screen.getByText('Security & Authentication')).toBeInTheDocument();
  });

  it('allows navigating between all 4 security tabs', async () => {
    render(<ManagerSettingsSecurityMain />);

    // Default tab is Password
    expect(screen.getByText('Change Password')).toBeInTheDocument();

    // Switch to 2FA Tab
    const twoFactorTab = screen.getByRole('button', { name: /Two-Factor \(2FA\)/ });
    fireEvent.click(twoFactorTab);
    expect(screen.getByText(/Two-Factor Authentication is/)).toBeInTheDocument();

    // Switch to Active Sessions Tab
    const sessionsTab = screen.getByRole('button', { name: /Active Sessions/ });
    fireEvent.click(sessionsTab);
    expect(screen.getByText(/Active Signed-In Devices/)).toBeInTheDocument();

    // Switch to Login History Tab
    const historyTab = screen.getByRole('button', { name: /Login Activity/ });
    fireEvent.click(historyTab);
    expect(screen.getByText('Recent Login Activity')).toBeInTheDocument();
  });

  it('validates password requirements and toggles visibility', async () => {
    render(<ManagerSettingsSecurityMain initialTab="password" />);

    const currentInput = screen.getByLabelText(/^Current Password/i);
    const newInput = screen.getByLabelText(/^New Password/i);
    const confirmInput = screen.getByLabelText(/^Confirm New Password/i);

    fireEvent.change(currentInput, { target: { value: 'OldPassword123!' } });
    fireEvent.change(newInput, { target: { value: 'Secret@2026' } });
    fireEvent.change(confirmInput, { target: { value: 'Secret@2026' } });

    // Checklist should recognize matches & requirements
    expect(screen.getByText('Passwords match')).toBeInTheDocument();
    expect(screen.getByText(/8\+ chars/)).toBeInTheDocument();

    // Toggle password visibility
    const showBtns = screen.getAllByRole('button', { name: /Show password/i });
    expect(showBtns.length).toBeGreaterThan(0);
    fireEvent.click(showBtns[0]);
    expect(currentInput).toHaveAttribute('type', 'text');
  });

  it('handles 2FA setup initiation, QR rendering, secret copy, and verification', async () => {
    render(<ManagerSettingsSecurityMain initialTab="2fa" />);

    // Initially 2FA is OFF
    expect(screen.getByText('Two-Factor Authentication is OFF')).toBeInTheDocument();

    // Click Enable 2FA Now
    const enableBtn = screen.getByRole('button', { name: /Enable 2FA Now/i });
    fireEvent.click(enableBtn);

    // Setup wizard shows QR and secret key
    expect(screen.getByText(/Scan with/i)).toBeInTheDocument();
    expect(screen.getByText(/Or enter Secret Key manually/i)).toBeInTheDocument();

    // Copy secret key
    const copyKeyBtn = screen.getByRole('button', { name: /Copy Secret Key/i });
    fireEvent.click(copyKeyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Enter valid 6-digit TOTP code
    const codeInput = screen.getByLabelText(/Enter 6-digit Code/i);
    fireEvent.change(codeInput, { target: { value: '654321' } });

    // Submit verification
    const verifyBtn = screen.getByRole('button', { name: /Verify and Enable 2FA/i });
    fireEvent.click(verifyBtn);

    // Should now be enabled!
    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication is ON')).toBeInTheDocument();
      expect(screen.getByText(/Emergency Backup Codes/i)).toBeInTheDocument();
    });
  });

  it('renders active sessions, allows revoking a single remote session, and bulk logout', async () => {
    render(<ManagerSettingsSecurityMain initialTab="sessions" />);

    // Should render the devices
    expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument();
    expect(screen.getByText(/Samsung Galaxy S23/)).toBeInTheDocument();
    expect(screen.getByText(/Apple MacBook Air M2/)).toBeInTheDocument();

    // Current device badge
    expect(screen.getByText(/Current Device/i)).toBeInTheDocument();

    // Revoke Samsung mobile session
    const revokeButtons = screen.getAllByRole('button', { name: /Revoke Session/i });
    expect(revokeButtons.length).toBe(2);

    fireEvent.click(revokeButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText(/Samsung Galaxy S23/)).not.toBeInTheDocument();
    });

    // Test Bulk "Log Out All Other Devices"
    const logoutAllBtn = screen.getByRole('button', { name: /Log Out All Other Devices/i });
    fireEvent.click(logoutAllBtn);

    // Modal appears
    expect(screen.getByText('Log out all other devices?')).toBeInTheDocument();
    const confirmLogoutAll = screen.getByRole('button', { name: /Yes, Terminate Other Sessions/i });
    fireEvent.click(confirmLogoutAll);

    // Only current Dell desktop session remains
    await waitFor(() => {
      expect(screen.getByText(/Dell OptiPlex 7090/)).toBeInTheDocument();
      expect(screen.queryByText(/Apple MacBook Air M2/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Log Out All Other Devices/i })).not.toBeInTheDocument();
    });
  });

  it('filters login history entries by status', async () => {
    render(<ManagerSettingsSecurityMain initialTab="history" />);

    // Initially all 5 logs shown
    expect(screen.getByText('Recent Login Activity')).toBeInTheDocument();
    expect(screen.getAllByText('Unknown Linux Box').length).toBeGreaterThan(0);

    // Filter to Failed attempts
    const failedFilterBtn = screen.getByRole('button', { name: /Blocked \/ Failed/i });
    fireEvent.click(failedFilterBtn);

    // Only 1 failed attempt is displayed
    expect(screen.getAllByText('Unknown Linux Box').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Invalid Password Attempt \(Blocked\)/).length).toBeGreaterThan(0);
    expect(screen.queryByText('MacBook Air M2')).not.toBeInTheDocument();

    // Filter to Successful attempts
    const successFilterBtn = screen.getByRole('button', { name: /^Success \(/i });
    fireEvent.click(successFilterBtn);
    expect(screen.getAllByText('MacBook Air M2').length).toBeGreaterThan(0);
    expect(screen.queryByText('Unknown Linux Box')).not.toBeInTheDocument();
  });
});
