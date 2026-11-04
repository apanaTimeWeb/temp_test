import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { describe, expect, it, vi } from 'vitest';
import AdminCommunicationComplaintAddModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/components/AdminCommunicationWhatsappLogsComplaintAddModal';
import { AdminCommunicationComplaintSchema, type AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/schemas/AdminCommunicationWhatsappLogsSchema';

import adminNavigationEn from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_en.json';
import adminNavigationHi from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/locales/admin_navigation_sidebar_hi.json';
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key === 'COMPLAINT_HIDE_IDENTITY' ? 'Hide student identity from staff view' : key,
}));

function DialogHarness({ onSubmit }: { onSubmit: (values: AdminCommunicationComplaintFormValues) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<AdminCommunicationComplaintFormValues>({
    resolver: zodResolver(AdminCommunicationComplaintSchema),
    defaultValues: { student: '', anonymous: false, title: '', description: '' },
  });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open Complaint Form</button>
      {open && <AdminCommunicationComplaintAddModal form={form} onClose={() => setOpen(false)} onSubmit={onSubmit} isDemoMode={true} />}
    </>
  );
}

describe('AdminCommunication complaint dialog focus contract', () => {
  it('opens an accessible dialog and restores focus to the trigger after Escape', () => {
    const onSubmit = vi.fn();
    render(<DialogHarness onSubmit={onSubmit} />);
    const trigger = screen.getByRole('button', { name: 'Open Complaint Form' });
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the localized identity-privacy label associated with the anonymous checkbox', () => {
    const onSubmit = vi.fn();
    render(<DialogHarness onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Complaint Form' }));

    const privacyCheckbox = screen.getByRole('checkbox', { name: 'Hide student identity from staff view' });
    expect(privacyCheckbox).toHaveProperty('id', 'admin-communication-complaint-anonymous');
    expect((privacyCheckbox as HTMLInputElement).checked).toBe(false);
  });
});

describe('route loading/error boundary localization contract', () => {
  it('uses only keys present in the shared English and Hindi ADMIN_NAVIGATION catalogs', () => {
    for (const messages of [adminNavigationEn.ADMIN_NAVIGATION, adminNavigationHi.ADMIN_NAVIGATION]) {
      expect(messages).toHaveProperty('ROUTE_ERROR_TITLE');
      expect(messages).toHaveProperty('ROUTE_ERROR_DESCRIPTION');
      expect(messages).toHaveProperty('ROUTE_ERROR_RETRY');
      expect(messages).toHaveProperty('LOADING_PAGE');
    }
  });
});
