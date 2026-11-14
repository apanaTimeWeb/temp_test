// FLOW: Feature source -> superadmin_settings/settings_integrations/types/SuperadminSettingsIntegrationsTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Settings Types; defines module-owned type contracts for the named data boundary. */
import type { z } from 'zod';
import type { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/schemas/SuperadminSettingsIntegrationsSchema';

/**
 * Defines the public SuperadminSettingsFormValues contract for settings integrations. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSettingsFormValues = z.infer<typeof SUPERADMIN_SETTINGS_SCHEMA>;
