/** Module-owned sample-only repository for WhatsApp templates. */
import type { Template as TemplateFixture } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/config/manager_communication_whatsapp_templates.demo_data';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES as TemplateSource } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/config/manager_communication_whatsapp_templates.demo_data';

export type Template = TemplateFixture;
export const MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES = TemplateSource.map((record) => ({ ...record }));
