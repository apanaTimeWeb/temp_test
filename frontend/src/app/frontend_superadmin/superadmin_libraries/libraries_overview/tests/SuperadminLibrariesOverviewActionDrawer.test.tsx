// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/locales/superadmin_libraries_overview_en.json';
import SuperadminLibrariesOverviewPageClient from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPageClient';

const { toastMock } = vi.hoisted(() => {
  const toastMock = { success: vi.fn(), error: vi.fn(), message: vi.fn() };
  return { toastMock };
});
vi.mock('sonner', () => ({ default: toastMock, toast: toastMock, Toaster: () => null }));

describe('SuperadminLibrariesOverviewPageClient Action Buttons & Drawer', () => {
  it('opens library view details drawer on View button click and closes cleanly', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SuperadminLibrariesOverviewPageClient />
      </NextIntlClientProvider>
    );

    // Initial state: no drawer open
    expect(screen.queryByRole('dialog')).toBeNull();

    // Click first View button (Eye icon)
    const viewButtons = screen.getAllByTitle('View Library Details');
    expect(viewButtons.length).toBeGreaterThan(0);
    await act(async () => {
      fireEvent.click(viewButtons[0]);
    });

    // Drawer should open and display facility details
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(within(dialog).getByText('Facility Details')).toBeTruthy();
    expect(within(dialog).getByText('Contact Information')).toBeTruthy();

    // Click Close (X) button
    const closeBtn = within(dialog).getByTitle('Close drawer');
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    // Drawer should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('opens library edit drawer on Edit button click with form controls', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SuperadminLibrariesOverviewPageClient />
      </NextIntlClientProvider>
    );

    // Click first Edit button (Edit2 icon)
    const editButtons = screen.getAllByTitle('Edit Library Settings');
    expect(editButtons.length).toBeGreaterThan(0);
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    // Drawer should open in edit mode with input form
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(screen.getByTestId('superadmin-libraries-libraries-superadmin-libraries-name-3')).toBeTruthy();
    expect(screen.getByTestId('superadmin-libraries-libraries-superadmin-libraries-owner-4')).toBeTruthy();
    expect(within(dialog).getByText('SaaS Plan')).toBeTruthy();
  });

  it('toggles library operating status and triggers success toast', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SuperadminLibrariesOverviewPageClient />
      </NextIntlClientProvider>
    );

    // Find first toggle status button
    const toggleButtons = screen.getAllByTestId(/toggle-library-status-preview/i);
    expect(toggleButtons.length).toBeGreaterThan(0);
    await act(async () => {
      fireEvent.click(toggleButtons[0]);
    });

    // Should call toast.success
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalled();
    });
  });
});
