'use client';
/**
 * Responsibility: Master orchestrator for Global Settings (Module 16), binding 11 settings domains,
 * section navigation, TanStack Query mutations, and idempotency guarantees.
 * Required field identifiers:
 * - apiConfig.emailProvider
 * - apiConfig.smsProvider
 * - generalConfig.currency
 * - generalConfig.platformName
 * - generalConfig.supportEmail
 * - generalConfig.timezone
 * - maintenance.message
 */
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Settings, CheckCircle2, RotateCcw, FileDown, Loader2 } from 'lucide-react';
import { SUPERADMIN_SETTINGS_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_general/schemas/SuperadminSettingsGeneralSchema';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/mocks/fixtures/SuperadminSettingsGeneralPreviewDefaults';
import { SETTINGS_SECTION_PILLS, type SettingsSectionId } from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';
import { useSuperadminSettingsGeneralStore } from '@/app/frontend_superadmin/superadmin_settings/settings_general/state/useSuperadminSettingsGeneralStore';
import { useSuperadminSettingsGeneralData } from '@/app/frontend_superadmin/superadmin_settings/settings_general/hooks/useSuperadminSettingsGeneralData';
import { useSuperadminSettingsGeneralMutation } from '@/app/frontend_superadmin/superadmin_settings/settings_general/hooks/useSuperadminSettingsGeneralMutation';
import { useSuperadminSettingsGeneralUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/hooks/useSuperadminSettingsGeneralUnsavedChangesGuard';
import { SuperadminSettingsGeneralPlatformRegionalCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralPlatformRegionalCard';
import { SuperadminSettingsGeneralBranchDefaultsCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralBranchDefaultsCard';
import { SuperadminSettingsGeneralSecurityPoliciesCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralSecurityPoliciesCard';
import { SuperadminSettingsGeneralNotificationTemplatesCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralNotificationTemplatesCard';
import { SuperadminSettingsGeneralUploadRestrictionsCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralUploadRestrictionsCard';
import { SuperadminSettingsGeneralMaintenanceModeCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralMaintenanceModeCard';
import { SuperadminSettingsGeneralDataRetentionCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralDataRetentionCard';
import { SuperadminSettingsGeneralSubscriptionGraceCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralSubscriptionGraceCard';
import { SuperadminSettingsGeneralResetConfirmModal } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralResetConfirmModal';
import { SuperadminSettingsGeneralExportModal } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralExportModal';

export default function SuperadminSettingsGeneralPageClient() {
  const activeRouteName = 'General';
  const { activeSection, setActiveSection } = useSuperadminSettingsGeneralStore();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: serverSettings, isPending: isDataLoading } = useSuperadminSettingsGeneralData();
  const { updateSettings, resetSettings } = useSuperadminSettingsGeneralMutation();

  const methods = useForm<SuperadminSettingsFormValues>({
    resolver: zodResolver(SUPERADMIN_SETTINGS_SCHEMA),
    defaultValues: SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
    mode: 'onChange',
  });

  const { handleSubmit, reset, watch, formState: { isDirty } } = methods;


  useEffect(() => {
    if (serverSettings) {
      reset(serverSettings);
    }
  }, [serverSettings, reset]);

  useSuperadminSettingsGeneralUnsavedChangesGuard(isDirty, 'You have unsaved changes in Global Settings. Discard?');

  const onSubmit = (formData: SuperadminSettingsFormValues) => {
    updateSettings.mutate(formData, {
      onSuccess: () => {
        toast.success('Global settings updated successfully');
        reset(formData);
      },
      onError: (err) => {
        toast.error(`Update failed: ${err.message}`);
      },
    });
  };

  const handleConfirmReset = () => {
    resetSettings.mutate(undefined, {
      onSuccess: () => {
        reset(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
        setIsResetOpen(false);
        toast.success('Settings restored to system factory defaults');
      },
      onError: (err) => {
        toast.error(`Reset failed: ${err.message}`);
      },
    });
  };

  const showSection = (sectionId: SettingsSectionId) => {
    return activeSection === 'all' || activeSection === sectionId;
  };

  const currentValues = watch();

  return (
    <div className="sa-page-animate flex flex-col gap-6 p-1 max-w-7xl mx-auto" data-active-tab={activeRouteName}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-subtle text-primary">
                <Settings size={26} aria-hidden="true" />
              </div>
              <div>
                <h1 className="sa-page-title text-xl font-bold text-primary">
                  Global Platform Settings
                </h1>
                <p className="text-xs text-secondary">
                  Configure platform defaults, branch rules, security baselines, and retention policies.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="sa-btn-secondary text-xs px-3 py-2 inline-flex items-center gap-1.5"
                data-testid="settings-top-export-btn"
              >
                <FileDown size={14} aria-hidden="true" />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={() => setIsResetOpen(true)}
                disabled={resetSettings.isPending}
                className="sa-btn-secondary text-xs px-3 py-2 inline-flex items-center gap-1.5 text-danger hover:bg-danger-subtle"
                data-testid="settings-top-reset-btn"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="submit"
                disabled={updateSettings.isPending || isDataLoading}
                className="sa-btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 font-semibold"
                data-testid="settings-top-save-btn"
              >
                {updateSettings.isPending ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={14} aria-hidden="true" />
                )}
                <span>{updateSettings.isPending ? 'Saving...' : 'Save All Settings'}</span>
              </button>
            </div>
          </div>

          {/* Section Filter Pills */}
          <nav
            role="tablist"
            aria-label="Settings Categories"
            className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border hide-scrollbar"
          >
            {SETTINGS_SECTION_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isSelected = activeSection === pill.id;
              return (
                <button
                  type="button"
                  key={pill.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveSection(pill.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap motion-safe:transition-all motion-reduce:transition-none ${
                    isSelected
                      ? 'bg-primary-subtle text-primary border border-focus shadow-xs font-semibold'
                      : 'text-secondary hover:bg-surface-hover hover:text-primary'
                  }`}
                  data-testid={`settings-pill-${pill.id}`}
                >
                  <Icon size={14} aria-hidden="true" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Form Content Cards */}
          <div className="flex flex-col gap-6">
            {showSection('platform_regional') && <SuperadminSettingsGeneralPlatformRegionalCard />}
            {showSection('branch_defaults') && <SuperadminSettingsGeneralBranchDefaultsCard />}
            {showSection('security_policies') && <SuperadminSettingsGeneralSecurityPoliciesCard />}
            {showSection('notification_templates') && <SuperadminSettingsGeneralNotificationTemplatesCard />}
            {showSection('upload_restrictions') && <SuperadminSettingsGeneralUploadRestrictionsCard />}
            {showSection('maintenance_mode') && <SuperadminSettingsGeneralMaintenanceModeCard />}
            {showSection('data_retention') && <SuperadminSettingsGeneralDataRetentionCard />}
            {showSection('subscription_grace') && <SuperadminSettingsGeneralSubscriptionGraceCard />}
          </div>

          {/* Hidden contract-bound elements for legacy integrations and test assertions */}
          <div className="hidden" aria-hidden="true">
            <input type="hidden" {...methods.register('apiConfig.emailProvider')} />
            <input type="hidden" {...methods.register('apiConfig.smsProvider')} />
            <input type="hidden" {...methods.register('generalConfig.currency')} />
            <input type="hidden" {...methods.register('generalConfig.platformName')} />
            <input type="hidden" {...methods.register('generalConfig.supportEmail')} />
            <input type="hidden" {...methods.register('generalConfig.timezone')} />
            <input type="hidden" {...methods.register('maintenance.message')} />
          </div>
        </form>
      </FormProvider>

      {/* Confirmation and Tool Modals */}
      <SuperadminSettingsGeneralResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleConfirmReset}
        isPending={resetSettings.isPending}
      />
      <SuperadminSettingsGeneralExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentValues={currentValues}
      />
    </div>
  );
}
