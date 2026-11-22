'use client';
/** Responsibility: Superadmin System Notifications Settings Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */


import { useTranslations } from 'next-intl';
import { Save } from 'lucide-react';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCard as Card } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCard';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardHeader';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardTitle';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardDescription';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardContent';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationCardFooter';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationButton as Button } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationButton';
import { SuperadminSettingsGeneralSettingsLibraryConfigurationInput as Input } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationInput';
import type { SuperadminSystemNotificationsSettingsPanelProps } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanelComponentTypes';


/** Feature-owned notifications settings panel; external messaging remains disabled without a service contract. */
export default function SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanel({ saved, onSavePreview }: SuperadminSystemNotificationsSettingsPanelProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCopy("COPY.NOTIFICATIONS")}</CardTitle>
        <CardDescription>{tCopy("COPY.CONFIGURE_SMS_WHATSAPP_API_SETTINGS_IN_PREVIEW_MODE_ONLY")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="api-key" className="text-sm font-medium text-secondary">{tCopy("COPY.SMS_WHATSAPP_API_KEY")}</label>
          <Input
            id="api-key"
            type="password"
            value=""
            placeholder={tCopy("COPY.UNAVAILABLE_SECURE_SERVER_SIDE_INTEGRATION_REQUIRED")}
            autoComplete="off"
            disabled
            aria-describedby="api-key-preview-note"
           data-testid="superadmin_settings_library_configuration-api-key"/>
          <p id="api-key-preview-note" className="text-xs text-warning">{tCopy("COPY.CREDENTIAL_ENTRY_IS_DISABLED_THIS_PREVIEW_CANNOT_SECURELY_CONFIGUR_CA264AB4")}</p>
        </div>
        <Button id="test-connection-btn" variant="ghost" disabled title={tCopy("COPY.UNAVAILABLE_NO_CONFIGURED_SERVICE_ENDPOINT_OR_TEST_CONNECTION_API_IS_SUPPLIED")} data-testid="superadmin_settings_library_configuration-test-connection-btn">{tCopy("COPY.TEST_CONNECTION_UNAVAILABLE")}</Button>
      </CardContent>
      <CardFooter>
        <Button id="save-notifications-btn" onClick={onSavePreview} variant="primary" data-testid="superadmin_settings_library_configuration-save-notifications-btn">
          <Save size={16} aria-hidden="true" /> {saved ? tCopy('COPY.PREVIEW_UPDATED') : tCopy('COPY.SAVE_PREVIEW')}
        </Button>
      </CardFooter>
    </Card>
  );
}
