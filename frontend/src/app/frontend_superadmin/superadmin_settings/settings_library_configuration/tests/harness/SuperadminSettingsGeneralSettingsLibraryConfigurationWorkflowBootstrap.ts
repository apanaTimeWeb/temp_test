// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_SETTINGS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/mocks/handlers/SuperadminSettingsGeneralSettingsLibraryConfigurationMockHandlers';

/** Isolated MSW lifecycle for settings_library_configuration; tests opt in by calling setupSystemSettingsMockServer(). */
export const SYSTEM_SETTINGS_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_SETTINGS_MSW_HANDLERS);
/**
 * Performs the setup system settings mock server operation within settings general; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemSettingsMockServer(): void {
  beforeAll(() => SYSTEM_SETTINGS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_SETTINGS_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_SETTINGS_MOCK_SERVER.close());
}
