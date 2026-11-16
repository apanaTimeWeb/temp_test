import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ManagerSettingsBranchInfoWifiModal } from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_modals/ManagerSettingsBranchInfoWifiModal';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerSettingsBranchInfoWifiModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    branchName: 'Library OS - Connaught Place',
    branchCode: 'SL360-CP-01',
    managerName: 'Rahul Verma',
    managerPhone: '+91 9876543210',
    initialSsid: 'SmartLibrary_Student_5G',
    initialPassword: 'StudyHub@2026',
    initialSecurity: 'WPA' as const,
    initialFrequency: 'Dual-Band 5 GHz / 2.4 GHz High-Speed',
    onUpdateWifi: vi.fn(),
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ManagerSettingsBranchInfoWifiModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders standee preview, QR SVG, and branch details when open', () => {
    render(<ManagerSettingsBranchInfoWifiModal {...defaultProps} />);

    expect(screen.getByText('Student Wi-Fi Connect QR Code')).toBeInTheDocument();
    expect(screen.getByText('Library OS - Connaught Place')).toBeInTheDocument();
    expect(screen.getAllByText('SmartLibrary_Student_5G').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('SL360-CP-01')).toBeInTheDocument();
    expect(screen.getByText('Scan with Phone Camera to Auto-Connect')).toBeInTheDocument();
  });

  it('supports copying credentials and toggling password visibility', () => {
    render(<ManagerSettingsBranchInfoWifiModal {...defaultProps} />);

    const copyBtn = screen.getByTitle('Copy SSID');
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('SmartLibrary_Student_5G');

    // Toggle password reveal
    const revealBtn = screen.getByTitle('Show password');
    fireEvent.click(revealBtn);
    expect(screen.getByTitle('Hide password')).toBeInTheDocument();
  });

  it('triggers window.print when Print Standee is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<ManagerSettingsBranchInfoWifiModal {...defaultProps} />);

    const printBtn = screen.getByText('Print Standee');
    fireEvent.click(printBtn);

    setTimeout(() => {
      expect(printSpy).toHaveBeenCalled();
      printSpy.mockRestore();
    }, 200);
  });
});
