// @vitest-environment jsdom
// RESPONSIBILITY: Comprehensive test validating the Create New Library Account wizard, Section A, B, C, D, and automated tenant provisioning.
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/locales/superadmin_libraries_overview_en.json';
import SuperadminLibrariesCreateAccountModal from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesCreateAccountModal';
import SuperadminLibrariesOverviewPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPageClient';

const { toastMock } = vi.hoisted(() => {
  const toastMock = { success: vi.fn(), error: vi.fn(), message: vi.fn() };
  return { toastMock };
});
vi.mock('sonner', () => ({ default: toastMock, toast: toastMock, Toaster: () => null }));

describe('SuperAdmin Library Account & Admin Panel Creation Workflow', () => {
  it('renders Create New Library Account CTA in overview page and opens modal', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SuperadminLibrariesOverviewPageClient />
      </NextIntlClientProvider>
    );

    const createBtn = screen.getByText('Create New Library Account');
    expect(createBtn).toBeTruthy();

    await act(async () => {
      fireEvent.click(createBtn);
    });

    // Modal opens showing Step A
    expect(screen.getByText('Section A: Library & Organization Details')).toBeTruthy();
  });

  it('navigates through Step A, B, C, and D, and executes automated tenant provisioning', async () => {
    const onLibraryCreated = vi.fn();
    const onClose = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SuperadminLibrariesCreateAccountModal
          isOpen={true}
          onClose={onClose}
          onLibraryCreated={onLibraryCreated}
        />
      </NextIntlClientProvider>
    );

    // Step A: Fill Organization Details
    expect(screen.getByText('Section A: Library & Organization Details')).toBeTruthy();
    const nameInput = screen.getByPlaceholderText('e.g. Apex Knowledge Hub');
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Imperial Reading Lounge' } });
    });

    // Click Continue to Step B
    const continueBtn = screen.getByText('Continue');
    await act(async () => {
      fireEvent.click(continueBtn);
    });

    // Step B: Fill Admin Details
    expect(screen.getByText('Section B: Main Admin Account Creation')).toBeTruthy();
    const adminNameInput = screen.getByPlaceholderText('e.g. Rajesh Sharma');
    const adminEmailInput = screen.getByPlaceholderText('admin@apexlibrary.in');
    await act(async () => {
      fireEvent.change(adminNameInput, { target: { value: 'Siddharth Verma' } });
      fireEvent.change(adminEmailInput, { target: { value: 'siddharth@imperial.in' } });
    });

    // Continue to Step C
    await act(async () => {
      fireEvent.click(screen.getByText('Continue'));
    });

    // Step C: Verify Branch Provisioning & Quota (max_branches = 3)
    expect(screen.getByText('Section C: Branch Provisioning')).toBeTruthy();
    expect(screen.getByText(/Plan Quota: 1 of 3 Branches/i)).toBeTruthy();

    // Add 2nd branch
    const addBranchBtn = screen.getByText('Add Branch');
    await act(async () => {
      fireEvent.click(addBranchBtn);
    });
    expect(screen.getByText(/Plan Quota: 2 of 3 Branches/i)).toBeTruthy();

    // Continue to Step D: Review & Provision
    await act(async () => {
      fireEvent.click(screen.getByText('Continue'));
    });

    // Step D: Verify Provisioning Screen
    expect(screen.getByText('Section D: Review & Account Provisioning')).toBeTruthy();
    expect(screen.getByText('Imperial Reading Lounge')).toBeTruthy();
    expect(screen.getByText('Siddharth Verma')).toBeTruthy();
    expect(screen.getByText(/2 Branch\(es\) Configured/i)).toBeTruthy();

    // Execute Provisioning
    const provisionBtn = screen.getByText('Confirm & Provision Library Account');
    await act(async () => {
      fireEvent.click(provisionBtn);
    });

    // Wait for provisioning execution simulation
    await waitFor(() => {
      expect(screen.getByText('Library Workspace Provisioned Successfully!')).toBeTruthy();
    }, { timeout: 2000 });

    // Success Screen should show Tenant ID and Invitation Link
    expect(screen.getByText(/Generated Tenant ID:/i)).toBeTruthy();
    expect(screen.getByText(/One-Time Admin Onboarding & MFA Invitation Link:/i)).toBeTruthy();
    expect(screen.getByText('Copy Link')).toBeTruthy();

    // Callback must have been called with new library record
    expect(onLibraryCreated).toHaveBeenCalledTimes(1);
    const createdLib = onLibraryCreated.mock.calls[0][0];
    expect(createdLib.name).toBe('Imperial Reading Lounge');
    expect(createdLib.branches).toBe(2);
    expect(createdLib.adminPanelEnabled).toBe(true);
  });
});
