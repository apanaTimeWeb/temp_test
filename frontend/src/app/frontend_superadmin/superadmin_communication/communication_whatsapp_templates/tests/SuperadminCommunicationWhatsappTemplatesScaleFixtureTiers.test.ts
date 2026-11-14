// RESPONSIBILITY: Define source-level test coverage for communication whatsapp templates using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_whatsapp_templates/tests/SuperadminCommunicationWhatsappTemplatesScaleFixtureTiers.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { MOCK_SCALE_TIER_1_SMALL, MOCK_SCALE_TIER_2_STANDARD, MOCK_SCALE_TIER_3_STRESS, createSuperadminCommunicationWhatsappTemplatesScaleTier } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/mocks/fixtures/superadmin_communication_whatsapp_templates.scale-stress-fixtures';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/mocks/fixtures/SuperadminCommunicationWhatsappTemplatesWhatsappTemplateMockFixtures';

describe('communication_whatsapp_templates deterministic scale fixture tiers', () => {
  it('provides the required 10, 100, and 500 record tiers from local synthetic fixtures', () => {
    expect(MOCK_SCALE_TIER_1_SMALL).toHaveLength(10);
    expect(MOCK_SCALE_TIER_2_STANDARD).toHaveLength(100);
    expect(MOCK_SCALE_TIER_3_STRESS).toHaveLength(500);
  });
  it('does not mutate source fixture content while generating new scale tiers', () => {
    const sourceBefore = JSON.parse(JSON.stringify(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS));
    const generated = createSuperadminCommunicationWhatsappTemplatesScaleTier(73);
    expect(generated).toHaveLength(73);
    expect(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS).toEqual(sourceBefore);
    expect(MOCK_SCALE_TIER_1_SMALL[0]).not.toBe(MOCK_SCALE_TIER_1_SMALL[1]);
  });
});
