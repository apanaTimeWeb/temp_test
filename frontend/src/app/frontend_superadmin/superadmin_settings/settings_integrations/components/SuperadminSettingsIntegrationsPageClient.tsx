'use client';
/** Responsibility: renders the superadmin_settings overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSettingsIntegrationsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/config/superadmin_settings_integrations.url_config.ts';
import { useSuperadminSettingsIntegrationsValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/hooks/useSuperadminSettingsIntegrationsValidationMessage';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/schemas/SuperadminSettingsIntegrationsSchema';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/types/SuperadminSettingsIntegrationsTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/mocks/fixtures/SuperadminSettingsIntegrationsPreviewDefaults';
import { Settings, Palette, Mail, MessageSquare, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSettingsIntegrationsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/hooks/useSuperadminSettingsIntegrationsUnsavedChangesGuard';
import { SUPERADMIN_SETTINGS_TABS } from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/constants/SuperadminSettingsIntegrationsConstants';
/**
 * Renders the `superadmin_settings` view owned by `SuperadminSettingsIntegrationsPageClient`.
 * Owns local UI state for `activeTab`, `saved`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSettingsIntegrationsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SETTINGS');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "General": SUPERADMIN_NAVIGATION_ROUTES.settings_general,
    "Appearance": SUPERADMIN_NAVIGATION_ROUTES.settings_appearance,
    "APIs & Integrations": SUPERADMIN_NAVIGATION_ROUTES.settings_integrations,
    "Storage": SUPERADMIN_NAVIGATION_ROUTES.settings_storage,
    "Maintenance Mode": SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const translateValidationMessage = useSuperadminSettingsIntegrationsValidationMessage();
  const [activeTab] = useState("APIs & Integrations");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting , isDirty},
  } = useForm<SuperadminSettingsFormValues>({
    resolver: zodResolver(SUPERADMIN_SETTINGS_SCHEMA),
    defaultValues: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
    mode: 'onChange',
    shouldUnregister: false,
  });
  useSuperadminSettingsIntegrationsUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const maintenanceEnabled = Boolean(watch('maintenance.enabled'));

  

  const handleSave = (_values: SuperadminSettingsFormValues) => {
    toast.message(tCopy('COPY.PREVIEW_ONLY_THESE_SETTINGS_REMAIN_IN_THIS_PAGE_S_LOCAL_STATE_NO_GLOBAL_CONFIGURATION_WAS_SAVED_BECAUSE_NO_SETTINGS_API_CONTRACT_IS_SUPPLIED'), { id: 'superadmin:settings:preview-save' });
  };

  return (
    <div className="sa-page-animate">
      <form onSubmit={handleSubmit(handleSave)} noValidate data-testid="superadmin-superadmin-settings-overview-page-client-form-line-50">
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.SYSTEM_SETTINGS")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <Settings className="text-primary" size={28} /> {tCopy("COPY.SYSTEM_SETTINGS")}
          </h1>
          <button type="submit" disabled={isSubmitting} className="sa-btn-primary" data-testid="superadmin-settings-settings-overview-save-changes-1">
            <CheckCircle size={16} /> {tCopy("COPY.SAVE_CHANGES")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={tCopy("COPY.SYSTEM_SETTINGS_SECTIONS")}>
        {SUPERADMIN_SETTINGS_TABS.map((tab) => (
          <button type="button"
            key={tab.name}
            id={`settings-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-controls={`settings-panel-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary-subtle text-primary border border-focus shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-settings-settings-overview-set-active-tab-2-${String(tab.name)}`}>
            <tab.icon size={16} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Keep every tab-to-panel relationship resolvable, including inactive preview panels. */}
      {SUPERADMIN_SETTINGS_TABS.filter((tab) => tab.name !== activeTab).map((tab) => {
        const tabId = tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <div key={tab.name} id={`settings-panel-${tabId}`}  aria-labelledby={`settings-tab-${tabId}`} hidden />;
      })}

      {/* Content */}
      <div id={`settings-panel-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="sa-card p-6 h-150 overflow-y-auto"  aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SETTINGS_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_GENERAL') })} tabIndex={0}>
        
        

        {activeTab === 'APIs & Integrations' && (
          <div className="max-w-2xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
            <div>
              <h2 className="text-lg font-bold text-primary mb-2">{tCopy("COPY.COMMUNICATION_APIS")}</h2>
              <p className="text-sm text-secondary mb-6">{tCopy("COPY.CONFIGURE_THE_GATEWAYS_USED_FOR_SENDING_TRANSACTIONAL_EMAILS_SMS_AND_WHATSAPP_MESSAGES")}</p>
              
              <div className="space-y-6">
                <div className="p-5 border border-border rounded-xl bg-surface-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-info" size={20} />
                    <h3 className="font-bold text-primary">{tCopy("COPY.EMAIL_PROVIDER")}</h3>
                  </div>
                  <label htmlFor="settings-email-provider" className="text-sm text-secondary">{tCopy("COPY.EMAIL_PROVIDER")}</label>
                  <select id="settings-email-provider" className="sa-input mb-4" aria-invalid={Boolean(errors.apiConfig?.emailProvider)} {...register('apiConfig.emailProvider')} data-testid="superadmin-settings-settings-overview-settings-email-provider-7">
                    <option>{tCopy("COPY.AWS_SES")}</option>
                    <option>{tCopy("COPY.SENDGRID")}</option>
                    <option>{tCopy("COPY.SMTP_CUSTOM")}</option>
                  </select>
                </div>
                
                <div className="p-5 border border-border rounded-xl bg-surface-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="text-info" size={20} />
                    <h3 className="font-bold text-primary">{tCopy("COPY.SMS_GATEWAY")}</h3>
                  </div>
                  <label htmlFor="settings-sms-provider" className="text-sm text-secondary">{tCopy("COPY.SMS_GATEWAY")}</label>
                  <select id="settings-sms-provider" className="sa-input mb-4" aria-invalid={Boolean(errors.apiConfig?.smsProvider)} {...register('apiConfig.smsProvider')} data-testid="superadmin-settings-settings-overview-settings-sms-provider-8">
                    <option>{tCopy("COPY.TWILIO")}</option>
                    <option>{tCopy("COPY.FAST2SMS")}</option>
                    <option>{tCopy("COPY.MSG91")}</option>
                  </select>
                </div>

                <div className="p-5 border border-border rounded-xl bg-success-bg">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="text-success" size={20} />
                    <h3 className="font-bold text-primary">{tCopy("COPY.WHATSAPP_BUSINESS_API")}</h3>
                  </div>
                  <label htmlFor="settings-whatsapp-key" className="text-xs text-secondary block mb-1">{tCopy("COPY.API_TOKEN_KEY")}</label>
                  <input id="settings-whatsapp-key" type="password" value="" placeholder={tCopy("COPY.UNAVAILABLE_NO_SECURE_SETTINGS_API_SUPPLIED")} className="sa-input" autoComplete="off" disabled aria-describedby="settings-secret-contract-note"  data-testid="superadmin-settings-settings-overview-settings-whatsapp-key-9"/>
                </div>

                <div className="p-5 border border-border rounded-xl bg-info-bg">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="text-info" size={20} />
                    <h3 className="font-bold text-primary">{tCopy("COPY.TELEGRAM_BOT_API_OTP_AND_ALERTS")}</h3>
                  </div>
                  <label htmlFor="settings-telegram-token" className="text-xs text-secondary block mb-1">{tCopy("COPY.TELEGRAM_BOT_TOKEN")}</label>
                  <input id="settings-telegram-token" type="password" value="" placeholder={tCopy("COPY.UNAVAILABLE_NO_SECURE_SETTINGS_API_SUPPLIED")} className="sa-input" autoComplete="off" disabled aria-describedby="settings-secret-contract-note"  data-testid="superadmin-settings-settings-overview-settings-telegram-token-10"/>
                  <p id="settings-secret-contract-note" className="text-xs text-warning mt-2">{tCopy("COPY.CREDENTIAL_ENTRY_IS_DISABLED_IN_THIS_SOURCE_ONLY_PREVIEW_DO_NOT_ENTER_SECRETS_UNTIL_A_SECURE_APPROVED_SERVER_SIDE_INTEGRATION_IS_CONNECTED")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        

        

      </div>
      </form>
    </div>
  );
}
