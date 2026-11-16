import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import ManagerSettingsBranchInfoPage from '@/app/frontend_manager/manager_settings/settings_branch_info/components/manager_settings_branch_info_views/ManagerSettingsBranchInfoPage';
import messagesEn from '@/app/frontend_manager/manager_settings/settings_branch_info/locales/manager_settings_branch_info_domain_en.json';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerSettingsBranchInfoPage Integration', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  const renderComponent = () => {
    return render(
      <NextIntlClientProvider locale="en" messages={messagesEn}>
        <ManagerSettingsBranchInfoPage />
      </NextIntlClientProvider>
    );
  };

  it('renders branch information header and student wifi connect card', () => {
    renderComponent();

    expect(screen.getByText('Branch Information')).toBeInTheDocument();
    expect(screen.getByText('Student Wi-Fi Connect')).toBeInTheDocument();
    expect(screen.getByText('SmartLibrary_Student_5G')).toBeInTheDocument();
    expect(screen.getByText('Print Desk Standee')).toBeInTheDocument();
  });

  it('toggles password visibility between masked and plain text', () => {
    renderComponent();

    // Initially masked
    expect(screen.getByText('••••••••••••')).toBeInTheDocument();

    // Toggle reveal
    const toggleBtn = screen.getByTitle('Show password');
    fireEvent.click(toggleBtn);
    expect(screen.getByText('StudyHub@2026')).toBeInTheDocument();

    // Toggle hide
    const hideBtn = screen.getByTitle('Hide password');
    fireEvent.click(hideBtn);
    expect(screen.getByText('••••••••••••')).toBeInTheDocument();
  });

  it('copies Wi-Fi credentials to clipboard when clicked', () => {
    renderComponent();

    const copySsidBtn = screen.getByTitle('Copy SSID');
    fireEvent.click(copySsidBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('SmartLibrary_Student_5G');

    const copyPwdBtn = screen.getByTitle('Copy Password');
    fireEvent.click(copyPwdBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('StudyHub@2026');
  });

  it('opens and closes the student wifi standee modal via action buttons', () => {
    renderComponent();

    // Initially modal is closed
    expect(screen.queryByText('Front Desk Acrylic Standee Preview')).not.toBeInTheDocument();

    // Click Print Desk Standee button
    const openModalBtn = screen.getByText('Print Desk Standee');
    fireEvent.click(openModalBtn);

    // Modal is now open
    expect(screen.getByText('Front Desk Acrylic Standee Preview')).toBeInTheDocument();
    expect(screen.getByText('Scan with Phone Camera to Auto-Connect')).toBeInTheDocument();

    // Close the modal
    const closeBtn = screen.getByTitle('Close modal');
    fireEvent.click(closeBtn);

    // Modal is closed
    expect(screen.queryByText('Front Desk Acrylic Standee Preview')).not.toBeInTheDocument();
  });

  it('includes student wifi credentials in the complete branch summary copy', () => {
    renderComponent();

    const shareBtn = screen.getByTitle('Copy complete branch profile to clipboard');
    fireEvent.click(shareBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('SmartLibrary_Student_5G')
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('StudyHub@2026')
    );
  });
});
