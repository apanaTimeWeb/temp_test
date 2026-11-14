// RESPONSIBILITY: Define source-level test coverage for communication whatsapp templates using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_templates/tests/SuperadminCommunicationWhatsappTemplatesEmptyState.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuperadminCommunicationWhatsappTemplatesEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesEmptyState';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

/** Component regression test for accessible, localized empty collection behavior. */
describe('SuperadminCommunicationWhatsappTemplatesEmptyState', () => {
  it('renders a named status region with the feature-local empty message', () => {
    render(<SuperadminCommunicationWhatsappTemplatesEmptyState />);
    expect(screen.getByRole('status').getAttribute('data-testid')).toBe( 'superadmin-communication-communication-whatsapp-templates-empty-state');
    expect(screen.getByText('COPY.NO_WHATSAPP_TEMPLATES_FOUND')).toBeTruthy();
  });
});
