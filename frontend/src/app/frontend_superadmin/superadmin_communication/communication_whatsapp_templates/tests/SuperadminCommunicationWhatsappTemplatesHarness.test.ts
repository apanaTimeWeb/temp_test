// RESPONSIBILITY: Define source-level test coverage for communication whatsapp templates using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_templates/tests/SuperadminCommunicationWhatsappTemplatesHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_ROUTES as __SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_ROUTES } from "@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/config/superadmin_communication_whatsapp_templates.url_config";
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/api/superadmin_communication_whatsapp_templates.query_keys';

describe('communication_whatsapp_templates standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_ROUTES.SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_URLS.PAGE).toContain('/superadmin/superadmin_communication');
    expect(__SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_ROUTES.SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_URLS.SCREEN).toBe("/superadmin/superadmin_communication/communication_whatsapp_templates");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_communication", "communication_whatsapp_templates"]);
  });
});
