'use client';
/** Responsibility: renders the superadmin_setup_wizard overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminLibrariesOnboardingSetupPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { formatSuperadminSetupWizardMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/utils/SuperadminLibrariesOnboardingSetupFormatters';
import { SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES as __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/config/superadmin_libraries_onboarding_setup.url_config";
import { useCallback, useState } from 'react';
import {
  BookOpen, Check, ChevronRight, ChevronLeft,
  Rocket, SkipForward,
} from 'lucide-react';
import type { BranchDetailsData, ShiftsData, SeatsData, PlansData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';
import { SUPERADMIN_SETUP_WIZARD_STEPS as STEPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupConstants';
import { SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA as d } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/mocks/fixtures/SuperadminLibrariesOnboardingSetupPreviewMockFixtures';
import SuperadminLibrariesOnboardingSetupStep1Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep1Form';
import SuperadminLibrariesOnboardingSetupStep2Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep2Form';
import SuperadminLibrariesOnboardingSetupStep3Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep3Form';
import SuperadminLibrariesOnboardingSetupStep4Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep4Form';
import SuperadminSetupWizardOverviewSkipModal from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupSkipModal';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminLibrariesOnboardingSetupUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupUnsavedChangesGuard';

// ──── Main Wizard ─────────────────────────────────────────────────────────────
/**
 * Renders the `superadmin_setup_wizard` view owned by `SuperadminLibrariesOnboardingSetupPageClient`.
 * Owns local UI state for `step`, `launchNotice`, `showSkipModal`, `hasUnsavedChanges`, `branch`, `shifts` and related form/selection state.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminLibrariesOnboardingSetupPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const locale = useLocale();
  const [step,          setStep]          = useState(1);
  const [launchNotice, setLaunchNotice] = useState('');
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { allowNavigationOnce } = useSuperadminLibrariesOnboardingSetupUnsavedChangesGuard(hasUnsavedChanges, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const handleWizardDirtyChange = useCallback((dirty: boolean) => { if (dirty) setHasUnsavedChanges(true); }, []);
  const openSkipModal = () => setShowSkipModal(true);
  const closeSkipModal = useCallback(() => setShowSkipModal(false), []);

  const [branch, setBranch] = useState<BranchDetailsData>({
    name: d.libraryName, address: d.address, city: d.city, gst: d.gst,
  });
  const [shifts, setShifts] = useState<ShiftsData>({ shifts: d.shifts });
  const [seats,  setSeats]  = useState<SeatsData>({ count: d.seatCount, prefix: d.seatPrefix });
  const [plans,  setPlans]  = useState<PlansData>({ plans: d.plans });

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const nextStep = () => setStep(s => Math.min(STEPS.length, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleLaunch = () => {
    setLaunchNotice(tCopy('COPY.SETUP_LAUNCH_UNAVAILABLE'))
  };

  const handleSkipToDashboard = () => {
    allowNavigationOnce();
    window.location.href = __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.MODULE_URLS.DASHBOARD;
  };

  return (
    <div className="sa-wizard-shell">
      <p className="sr-only" role="status">{tCopy("COPY.SETUP_WIZARD_IS_PREVIEW_ONLY_UNTIL_A_VERIFIED_SETUP_PERSISTENCE_API_IS_SUPPLIED")}</p>
      <div className="sa-wizard-glow" />

      {/* Skip confirmation remains isolated from the wizard layout. */}
      {showSkipModal && (
        <SuperadminSetupWizardOverviewSkipModal
          onClose={closeSkipModal}
          onConfirm={handleSkipToDashboard}
        />
      )}

      {/* ── STEPPER SIDEBAR ── */}
      <aside className="sa-wizard-sidebar">
        <div className="sa-wizard-logo-area">
          <div className="sa-wizard-logo-box">
            <BookOpen size={18} className="text-primary" />
          </div>
          <span className="sa-wizard-logo-title">{tCopy("COPY.SETUP_WIZARD")}</span>
        </div>

        <div className="space-y-1">
          {STEPS.map((s, i) => {
            const isActive = s.num === step;
            const isDone   = s.num < step;
            return (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className={`sa-step-connector ${isDone ? 'sa-step-connector--done' : ''}`} />
                )}
                <div className={`sa-step-item ${isActive ? 'sa-step-item--active' : ''}`}>
                  <div className={`sa-step-dot ${isDone ? 'sa-step-dot--done' : isActive ? 'sa-step-dot--active' : ''}`}>
                    {isDone
                      ? <Check size={14} className="text-primary" />
                      : <span className={`sa-wizard-step-num-badge ${isActive ? 'sa-wizard-step-num-badge--active' : ''}`}>{s.num}</span>
                    }
                  </div>
                  <div>
                    <p className={`sa-step-label ${isActive ? 'sa-step-label--active' : isDone ? 'sa-step-label--done' : ''}`}>
                      {tCopy(s.titleKey)}
                    </p>
                    <p className="sa-wizard-field-label--sm-no-mb">{tCopy(s.descKey)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto space-y-3">
          <div className="sa-tip-card">
            {tCopy("COPY.YOU_CAN_UPDATE_THESE_SETTINGS_ANYTIME_FROM_YOUR_DASHBOARD")}
          </div>
          <button
            id="skip-setup-sidebar-btn"
            type="button"
            onClick={openSkipModal}
            className="sa-wizard-skip-btn"
           data-testid="superadmin-setup-wizard-setup-wizard-overview-skip-setup-sidebar-btn-1">
            <SkipForward size={12} /> {tCopy("COPY.SKIP_SETUP_FOR_NOW")}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col">
        <div className="sa-wizard-topbar">
          <div className="sa-wizard-progress-track">
            {/* ✅ RULE 3 — dynamic computed width */}
            <progress className="sa-wizard-progress" max={100} value={progress} aria-label={tCopy("COPY.SETUP_WIZARD_COMPLETION")} />
          </div>
          <button
            id="skip-setup-btn"
            type="button"
            onClick={openSkipModal}
            className="sa-wizard-topbar-skip"
           data-testid="superadmin-setup-wizard-setup-wizard-overview-skip-setup-btn-2">
            <SkipForward size={13} /> {tCopy("COPY.SKIP_SETUP")}
          </button>
        </div>

        <div className="sa-wizard-content-area">
          <div className="sa-wizard-content-inner">
            <div className="sa-wizard-step-header">
              <p className="sa-wizard-step-label">{tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}</p>
              <h2 className="sa-wizard-step-title">{tCopy(STEPS[step - 1].titleKey)}</h2>
            </div>

            {step === 1 && <SuperadminLibrariesOnboardingSetupStep1Form initialValues={branch} onDirtyChange={handleWizardDirtyChange} onNext={d => { setBranch(d); setHasUnsavedChanges(true); nextStep(); }} />}
            {step === 2 && <SuperadminLibrariesOnboardingSetupStep2Form initialValues={shifts} onDirtyChange={handleWizardDirtyChange} onNext={d => { setShifts(d); setHasUnsavedChanges(true); nextStep(); }} />}
            {step === 3 && <SuperadminLibrariesOnboardingSetupStep3Form initialValues={seats} onDirtyChange={handleWizardDirtyChange} onNext={d => { setSeats(d); setHasUnsavedChanges(true); nextStep(); }} />}
            {step === 4 && <SuperadminLibrariesOnboardingSetupStep4Form initialValues={plans} onDirtyChange={handleWizardDirtyChange} onNext={d => { setPlans(d); setHasUnsavedChanges(true); nextStep(); }} />}

            {/* ── Step 5: Launch ── */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="sa-wizard-summary-card">
                  <h3 className="sa-wizard-summary-title">{branch.name}</h3>
                  <p className="sa-wizard-summary-address">
                    {branch.address}, {branch.city}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="sa-wizard-summary-badge sa-wizard-summary-badge--shifts">
                      ⏰ {shifts.shifts.length} {tCopy("COPY.SHIFTS_ADDED")}
                    </span>
                    <span className="sa-wizard-summary-badge sa-wizard-summary-badge--seats">
                      🪑 {seats.count} {tCopy("COPY.SEATS_CREATED")}
                    </span>
                    <span className="sa-wizard-summary-badge sa-wizard-summary-badge--plans">
                      💳 {plans.plans.length} {tCopy("COPY.PLANS_READY")}
                    </span>
                    {branch.gst && (
                      <span className="sa-wizard-summary-badge sa-wizard-summary-badge--gst">
                        {tCopy("COPY.GST_ENABLED")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sa-wizard-shifts-preview">
                  <p className="sa-wizard-preview-section-label">{tCopy("COPY.SHIFTS")}</p>
                  <div className="flex flex-wrap gap-2">
                    {shifts.shifts.map((s) => (
                      <span key={s.name} className="sa-wizard-preview-chip">
                        {s.name}: {s.start} – {s.end}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sa-wizard-plans-preview">
                  <p className="sa-wizard-preview-section-label">{tCopy("COPY.FEE_PLANS")}</p>
                  <div className="flex flex-wrap gap-2">
                    {plans.plans.map((pl) => (
                      <span key={pl.name} className="sa-wizard-preview-chip">
                        {pl.name} · {pl.days}{tCopy("COPY.D")} {formatSuperadminSetupWizardMajorPreviewCurrency(pl.price, 'INR', locale)}
                      </span>
                    ))}
                  </div>
                </div>

                {launchNotice && <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="alert">{launchNotice}</p>}
                <button
                  id="launch-dashboard-btn"
                  type="button"
                  onClick={handleLaunch}
                  disabled title={tCopy("COPY.SETUP_LAUNCH_UNAVAILABLE")}
                  className="sa-wizard-launch-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-describedby="setup-launch-note"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-launch-dashboard-btn-3">
                  <Rocket size={20} /> {tCopy("COPY.SHOW_LAUNCH_AVAILABILITY")}
                </button>
                <p id="setup-launch-note" className="text-sm text-warning">{tCopy("COPY.SETUP_LAUNCH_IS_UNAVAILABLE_WITHOUT_THE_HOST_SETUP_WRITE_CONTRACT_THIS_PREVIEW_WILL_NOT_CHANGE_PLATFORM_DATA")}</p>
              </div>
            )}

            {/* ── FOOTER NAV ── */}
            {step !== 5 ? (
              <div className="sa-wizard-footer">
                <button
                  type="button"
                  id="wizard-back-btn"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="sa-btn-ghost sa-btn-ghost--sm disabled:opacity-30 disabled:cursor-not-allowed"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-wizard-back-btn-4">
                  <ChevronLeft size={16} /> {tCopy("COPY.BACK")}
                </button>
                <span className="sa-wizard-footer-step-count">{tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}</span>
                <button
                  type="submit"
                  id="wizard-next-btn"
                  form={`step${step}-form`}
                  className="sa-wizard-next-btn"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-wizard-next-btn-5">
                  {tCopy("COPY.NEXT_STEP")} <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={prevStep}
                  className="sa-wizard-back-link"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-back-to-fee-plans-6">
                  {tCopy("COPY.BACK_TO_FEE_PLANS")}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
