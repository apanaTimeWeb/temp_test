'use client';
/** Responsibility: renders the superadmin_setup_wizard overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminLibrariesOnboardingSetupPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { formatSuperadminSetupWizardMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/utils/SuperadminLibrariesOnboardingSetupFormatters';
import { SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES as __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/config/superadmin_libraries_onboarding_setup.url_config";
import { useCallback, useState } from 'react';
import {
  BookOpen, Check, ChevronRight, ChevronLeft,
  Rocket, SkipForward, Building2, Clock, Armchair,
  CreditCard, CheckCircle, Lightbulb,
} from 'lucide-react';
import type { BranchDetailsData, ShiftsData, SeatsData, PlansData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupTypes';
import { SUPERADMIN_SETUP_WIZARD_STEPS as STEPS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupConstants';
import { SUPERADMIN_SETUP_WIZARD_PREVIEW_DATA as d } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/mocks/fixtures/SuperadminLibrariesOnboardingSetupPreviewMockFixtures';
import SuperadminLibrariesOnboardingSetupStep1Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep1Form';
import SuperadminLibrariesOnboardingSetupStep2Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep2Form';
import SuperadminLibrariesOnboardingSetupStep3Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep3Form';
import SuperadminLibrariesOnboardingSetupStep4Form from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupStep4Form';
import SuperadminSetupWizardOverviewSkipModal from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/components/SuperadminLibrariesOnboardingSetupSkipModal';
import SuperadminLibrariesOnboardingSetupStepper from './SuperadminLibrariesOnboardingSetupStepper';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminLibrariesOnboardingSetupUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupUnsavedChangesGuard';

const STEP_ICONS = [Building2, Clock, Armchair, CreditCard, Rocket] as const;

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
  const [shifts, setShifts] = useState<ShiftsData>({ shifts: [...d.shifts] });
  const [seats,  setSeats]  = useState<SeatsData>({ count: d.seatCount, prefix: d.seatPrefix });
  const [plans,  setPlans]  = useState<PlansData>({ plans: [...d.plans] });

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const nextStep = () => setStep(s => Math.min(STEPS.length, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleLaunch = () => {
    setLaunchNotice(tCopy('COPY.SETUP_LAUNCH_UNAVAILABLE'));
  };

  const handleSkipToDashboard = () => {
    allowNavigationOnce();
    window.location.href = __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.MODULE_URLS.DASHBOARD;
  };

  return (
    <div className="sa-wizard-shell w-full max-w-full min-w-0 space-y-6 pb-12">
      <p className="sr-only" role="status">{tCopy("COPY.SETUP_WIZARD_IS_PREVIEW_ONLY_UNTIL_A_VERIFIED_SETUP_PERSISTENCE_API_IS_SUPPLIED")}</p>

      {/* Skip confirmation modal */}
      {showSkipModal && (
        <SuperadminSetupWizardOverviewSkipModal
          onClose={closeSkipModal}
          onConfirm={handleSkipToDashboard}
        />
      )}

      {/* ── HORIZONTAL STEPPER CARD (Directly Above Form) ── */}
      <SuperadminLibrariesOnboardingSetupStepper
        step={step}
        setStep={setStep}
        openSkipModal={openSkipModal}
        tCopy={tCopy}
        progress={progress}
      />

      {/* ── FORM CARD (Directly below Horizontal Stepper) ── */}
      <section className="rounded-2xl border border-indigo-500/20 bg-card/70 backdrop-blur-md p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/30">
        <div className="sa-wizard-step-header pb-4 mb-6 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="sa-wizard-step-label inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mb-2">
              {tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}
            </span>
            <h2 className="sa-wizard-step-title text-xl sm:text-2xl font-bold text-slate-100">
              {tCopy(STEPS[step - 1].titleKey)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {tCopy(STEPS[step - 1].descKey)}
            </p>
          </div>
        </div>

        {/* Step Forms */}
        {step === 1 && <SuperadminLibrariesOnboardingSetupStep1Form initialValues={branch} onDirtyChange={handleWizardDirtyChange} onNext={d => { setBranch(d); setHasUnsavedChanges(true); nextStep(); }} />}
        {step === 2 && <SuperadminLibrariesOnboardingSetupStep2Form initialValues={shifts} onDirtyChange={handleWizardDirtyChange} onNext={d => { setShifts(d); setHasUnsavedChanges(true); nextStep(); }} />}
        {step === 3 && <SuperadminLibrariesOnboardingSetupStep3Form initialValues={seats} onDirtyChange={handleWizardDirtyChange} onNext={d => { setSeats(d); setHasUnsavedChanges(true); nextStep(); }} />}
        {step === 4 && <SuperadminLibrariesOnboardingSetupStep4Form initialValues={plans} onDirtyChange={handleWizardDirtyChange} onNext={d => { setPlans(d); setHasUnsavedChanges(true); nextStep(); }} />}

        {/* ── Step 5: Launch ── */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="sa-wizard-summary-card rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-card to-card p-6 shadow-xl shadow-black/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-md">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="sa-wizard-summary-title text-xl font-bold text-slate-100">{branch.name}</h3>
                  <p className="sa-wizard-summary-address text-xs sm:text-sm text-slate-400">
                    {branch.address}, {branch.city}
                  </p>
                </div>
              </div>

              {/* Tenant & Single Admin Identity Banner */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-300">Tenant / Single Admin Identity:</span>
                  <p className="text-white font-bold">{branch.name} Owner Account</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Admin Panel: Enabled
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Manager Desk: 8 Modules Active
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-border/60">
                <span className="sa-wizard-summary-badge sa-wizard-summary-badge--shifts inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Clock size={13} className="text-emerald-400" /> {shifts.shifts.length} {tCopy("COPY.SHIFTS_ADDED")}
                </span>
                <span className="sa-wizard-summary-badge sa-wizard-summary-badge--seats inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-300">
                  <Armchair size={13} className="text-sky-400" /> {seats.count} {tCopy("COPY.SEATS_CREATED")}
                </span>
                <span className="sa-wizard-summary-badge sa-wizard-summary-badge--plans inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  <CreditCard size={13} className="text-purple-400" /> {plans.plans.length} {tCopy("COPY.PLANS_READY")}
                </span>
                {branch.gst && (
                  <span className="sa-wizard-summary-badge sa-wizard-summary-badge--gst inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <CheckCircle size={13} className="text-amber-400" /> {tCopy("COPY.GST_ENABLED")}
                  </span>
                )}
              </div>
            </div>

            <div className="sa-wizard-shifts-preview rounded-xl border border-border/70 bg-card/60 p-4 space-y-2">
              <p className="sa-wizard-preview-section-label text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.SHIFTS")}</p>
              <div className="flex flex-wrap gap-2">
                {shifts.shifts.map((s) => (
                  <span key={s.name} className="sa-wizard-preview-chip inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border text-xs font-medium text-slate-200">
                    <Clock size={12} className="text-emerald-400" /> {s.name}: {s.start} – {s.end}
                  </span>
                ))}
              </div>
            </div>

            <div className="sa-wizard-plans-preview rounded-xl border border-border/70 bg-card/60 p-4 space-y-2">
              <p className="sa-wizard-preview-section-label text-xs font-semibold uppercase tracking-wider text-slate-400">{tCopy("COPY.FEE_PLANS")}</p>
              <div className="flex flex-wrap gap-2">
                {plans.plans.map((pl) => (
                  <span key={pl.name} className="sa-wizard-preview-chip inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border text-xs font-medium text-slate-200">
                    <CreditCard size={12} className="text-purple-400" /> {pl.name} · {pl.days}{tCopy("COPY.D")} {formatSuperadminSetupWizardMajorPreviewCurrency(pl.price, 'INR', locale)}
                  </span>
                ))}
              </div>
            </div>

            {launchNotice && <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-200" role="alert">{launchNotice}</p>}
            <button
              id="launch-dashboard-btn"
              type="button"
              onClick={handleLaunch}
              disabled
              title={tCopy("COPY.SETUP_LAUNCH_UNAVAILABLE")}
              className="sa-wizard-launch-btn w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="setup-launch-note"
              data-testid="superadmin-setup-wizard-setup-wizard-overview-launch-dashboard-btn-3"
            >
              <Rocket size={20} className="text-indigo-200" /> {tCopy("COPY.SHOW_LAUNCH_AVAILABILITY")}
            </button>
            <p id="setup-launch-note" className="text-xs text-amber-300 text-center">{tCopy("COPY.SETUP_LAUNCH_IS_UNAVAILABLE_WITHOUT_THE_HOST_SETUP_WRITE_CONTRACT_THIS_PREVIEW_WILL_NOT_CHANGE_PLATFORM_DATA")}</p>
          </div>
        )}

        {/* ── FOOTER NAV ── */}
        {step !== 5 ? (
          <div className="sa-wizard-footer pt-6 mt-6 border-t border-indigo-500/20 flex items-center justify-between gap-4">
            <button
              type="button"
              id="wizard-back-btn"
              onClick={prevStep}
              disabled={step === 1}
              className="sa-btn-ghost sa-btn-ghost--sm inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              data-testid="superadmin-setup-wizard-setup-wizard-overview-wizard-back-btn-4"
            >
              <ChevronLeft size={16} /> {tCopy("COPY.BACK")}
            </button>
            <span className="sa-wizard-footer-step-count text-xs font-semibold text-slate-400">
              {tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}
            </span>
            <button
              type="submit"
              id="wizard-next-btn"
              form={`step${step}-form`}
              className="sa-wizard-next-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
              data-testid="superadmin-setup-wizard-setup-wizard-overview-wizard-next-btn-5"
            >
              {tCopy("COPY.NEXT_STEP")} <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={prevStep}
              className="sa-wizard-back-link text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              data-testid="superadmin-setup-wizard-setup-wizard-overview-back-to-fee-plans-6"
            >
              <ChevronLeft size={15} />
              {tCopy("COPY.BACK_TO_FEE_PLANS")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
