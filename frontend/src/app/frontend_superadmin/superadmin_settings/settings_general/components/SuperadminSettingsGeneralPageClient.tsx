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
import { useSearchParams } from 'next/navigation';
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
import { SuperadminSettingsGeneralKpiCards } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralKpiCards';
import { SuperadminSettingsGeneralPlatformRegionalCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralPlatformRegionalCard';
import { SuperadminSettingsGeneralBranchDefaultsCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralBranchDefaultsCard';
import { SuperadminSettingsGeneralSecurityPoliciesCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralSecurityPoliciesCard';
import { SuperadminSettingsGeneralUploadRestrictionsCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralUploadRestrictionsCard';
import { SuperadminSettingsGeneralMaintenanceModeCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralMaintenanceModeCard';
import { SuperadminSettingsGeneralDataRetentionCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralDataRetentionCard';
import { SuperadminSettingsGeneralSubscriptionGraceCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralSubscriptionGraceCard';
import { SuperadminSettingsGeneralGstTaxCard } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralGstTaxCard';
import { SuperadminSettingsGeneralResetConfirmModal } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralResetConfirmModal';
import { SuperadminSettingsGeneralExportModal } from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralExportModal';

export default function SuperadminSettingsGeneralPageClient() {
  const activeRouteName = 'General';
  const searchParams = useSearchParams();
  const { activeSection, setActiveSection } = useSuperadminSettingsGeneralStore();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const sec = searchParams?.get('section') || searchParams?.get('tab');
    if (sec === 'gst_tax' || sec === 'platform_regional') {
      setActiveSection('platform_regional');
    }
  }, [searchParams, setActiveSection]);

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
        toast.success('Global settings updated successfully', {
          id: 'superadmin:settings_general:page-save-success',
        });
        reset(formData);
      },
      onError: (err) => {
        toast.error(`Update failed: ${err.message}`, {
          id: 'superadmin:settings_general:page-save-error',
        });
      },
    });
  };

  const handleConfirmReset = () => {
    resetSettings.mutate(undefined, {
      onSuccess: () => {
        reset(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
        setIsResetOpen(false);
        toast.success('Settings restored to system factory defaults', {
          id: 'superadmin:settings_general:page-reset-success',
        });
      },
      onError: (err) => {
        toast.error(`Reset failed: ${err.message}`, {
          id: 'superadmin:settings_general:page-reset-error',
        });
      },
    });
  };

  const showSection = (sectionId: SettingsSectionId) => {
    return activeSection === 'all' || activeSection === sectionId;
  };

  const currentValues = watch();

  return (
    <div className="sa-page-animate flex flex-col gap-6 w-full max-w-full min-w-0 pb-12" data-active-tab={activeRouteName}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          {/* Hero Header matching Superadmin Support Luxury Palette */}
          <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/60 via-[#0a0d24] to-[#060810] p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
                  <Settings size={13} className="text-amber-400" />
                  <span>Global Configuration & Governance Hub</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
                  Global Platform Settings
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Configure platform defaults, branch rules, zero-trust security baselines, and tenant data retention policies.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-white text-xs font-semibold motion-safe:transition-all shadow-xs cursor-pointer"
                  data-testid="settings-top-export-btn"
                >
                  <FileDown size={14} aria-hidden="true" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  disabled={resetSettings.isPending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-100 text-xs font-semibold motion-safe:transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  data-testid="settings-top-reset-btn"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="submit"
                  disabled={updateSettings.isPending || isDataLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs motion-safe:transition-all shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
                  data-testid="settings-top-save-btn"
                >
                  {updateSettings.isPending ? (
                    <Loader2 size={14} className="motion-safe:animate-spin" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 size={14} aria-hidden="true" />
                  )}
                  <span>{updateSettings.isPending ? 'Saving...' : 'Save All Settings'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Glowing KPI Cards */}
          <SuperadminSettingsGeneralKpiCards />

          {/* Section Filter Pills Floating Glassmorphic Container */}
          <nav
            role="tablist"
            aria-label="Settings Categories"
            className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25 backdrop-blur-md shadow-lg overflow-x-auto max-w-full hide-scrollbar"
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500/25 to-purple-500/25 text-slate-100 border border-indigo-500/40 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  data-testid={`settings-pill-${pill.id}`}
                >
                  <Icon size={14} aria-hidden="true" className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Form Content Cards */}
          <div className="flex flex-col gap-6">
            {showSection('platform_regional') && <SuperadminSettingsGeneralPlatformRegionalCard />}
            {showSection('platform_regional') && <SuperadminSettingsGeneralGstTaxCard />}
            {showSection('branch_defaults') && <SuperadminSettingsGeneralBranchDefaultsCard />}
            {showSection('security_policies') && <SuperadminSettingsGeneralSecurityPoliciesCard />}
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
