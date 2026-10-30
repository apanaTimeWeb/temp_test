import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminCommunicationWhatsappTemplatesHarness } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/tests/harness/AdminCommunicationWhatsappTemplatesHarness';
import { AdminCommunicationWhatsappTemplatesScenarios } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/tests/harness/bootstrap';

describe('admin_communication_whatsapp_templates local scenario harness', () => {
  it.each(AdminCommunicationWhatsappTemplatesScenarios)('renders the %s state rather than only changing a scenario label', (scenario) => {
    render(<AdminCommunicationWhatsappTemplatesHarness scenario={scenario}>Feature content</AdminCommunicationWhatsappTemplatesHarness>);
    expect(screen.getByTestId('admin_communication_whatsapp_templates-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    if (scenario === 'ACTIVE') {
      expect(screen.getByText('Feature content')).toBeTruthy();
      expect(screen.queryByRole('alert')).toBeNull();
      return;
    }

    expect(screen.queryByText('Feature content')).toBeNull();
    if (scenario === 'EMPTY') {
      expect(screen.getByRole('status').textContent).toContain('No records available');
      return;
    }
    if (scenario === 'SERVER_500') {
      expect(screen.getByRole('alert').textContent).toContain('HTTP 500');
      return;
    }
    if (scenario === 'TIMEOUT') {
      expect(screen.getByRole('alert').textContent).toContain('timeout');
      return;
    }
    expect(screen.getByRole('alert').textContent).toContain('HTTP 401');
  });
});
