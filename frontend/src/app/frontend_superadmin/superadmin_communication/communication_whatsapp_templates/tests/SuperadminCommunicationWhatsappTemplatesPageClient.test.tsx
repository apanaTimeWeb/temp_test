// RESPONSIBILITY: Exercise editor behavior and fail-closed actions for local WhatsApp template previews.
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import messages from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/locales/superadmin_communication_whatsapp_templates_en.json';
import SuperadminCommunicationWhatsappTemplatesPageClient from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesPageClient';

function renderPage() {
  return render(<NextIntlClientProvider locale="en" messages={messages}><SuperadminCommunicationWhatsappTemplatesPageClient /></NextIntlClientProvider>);
}

describe('WhatsApp template PageClient editor', () => {
  it('keeps edits per template and interpolates preview sample values', async () => {
    const user = userEvent.setup(); renderPage();
    const editor = screen.getByLabelText('Message Body') as HTMLTextAreaElement;
    await user.clear(editor); await user.type(editor, 'Hello {name} — {amount}');
    expect(screen.getByText('Hello Sample Student A — 1000')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Fee reminder/i }));
    await user.click(screen.getByRole('button', { name: /Welcome/i }));
    expect(screen.getByLabelText('Message Body')).toHaveValue('Hello {name} — {amount}');
  });
  it('enforces the 1,024 character limit for variable-chip insertion including the no-selection end position', async () => {
    const user = userEvent.setup(); renderPage();
    const editor = screen.getByLabelText('Message Body') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'x'.repeat(1018) } });
    await user.click(screen.getByRole('button', { name: '{name}' }));
    expect(editor.value.length).toBe(1024);
    fireEvent.change(editor, { target: { value: 'x'.repeat(1020) } });
    editor.setSelectionRange(1020, 1020);
    await user.click(screen.getByRole('button', { name: '{name}' }));
    expect(editor.value).toBe('x'.repeat(1020));
    expect(screen.getByText(/exceed the 1,024-character limit/i)).toBeTruthy();
  });
  it('keeps Save and the unavailable Send action disabled', async () => {
    const user = userEvent.setup(); renderPage();
    expect(screen.getByRole('button', { name: 'Save Template' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Send Test Message' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send Test unavailable' })).toBeDisabled();
  });
  it('replaces a selected substring with a variable without exceeding the limit', async () => {
    const user = userEvent.setup(); renderPage();
    const editor = screen.getByLabelText('Message Body') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'Hello selected text!' } });
    editor.setSelectionRange(6, 19);
    await user.click(screen.getByRole('button', { name: '{amount}' }));
    expect(editor.value).toBe('Hello {amount}!');
  });

  it('maps all seven semantic template icon keys to visible Lucide icon components', () => {
    renderPage();
    const templateButtons = ['Welcome', 'Fee reminder', 'Renewal', 'Receipt', 'Notice', 'Absentee', 'Payment promise'];
    for (const label of templateButtons) {
      const button = screen.getByRole('button', { name: new RegExp(label, 'i') });
      const icon = button.querySelector('svg');
      expect(icon).toBeTruthy();
      expect(icon?.getAttribute('width')).toBe('18');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    }
  });

});
