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
  const [shifts, setShifts] = useState<ShiftsData>({ shifts: [...d.shifts] });
  const [seats,  setSeats]  = useState<SeatsData>({ count: d.seatCount, prefix: d.seatPrefix });
  const [plans,  setPlans]  = useState<PlansData>({ plans: [...d.plans] });

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
      <aside className="sa-wizard-sidebar bg-card/60 backdrop-blur-md border-r border-border/80">
        <div className="sa-wizard-logo-area">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
            <BookOpen size={18} className="text-indigo-400" />
          </div>
          <div>
            <span className="sa-wizard-logo-title font-bold text-slate-100">{tCopy("COPY.SETUP_WIZARD")}</span>
            <p className="text-[10px] text-slate-400 font-medium">Onboarding Pipeline</p>
          </div>
        </div>

        <div className="space-y-1">
          {STEPS.map((s, i) => {
            const isActive = s.num === step;
            const isDone   = s.num < step;
            return (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className={`sa-step-connector ${isDone ? 'sa-step-connector--done bg-emerald-500/60' : 'bg-slate-700/40'}`} />
                )}
                <div className={`sa-step-item ${isActive ? 'sa-step-item--active bg-indigo-500/10 rounded-xl p-2' : 'p-2'}`}>
                  <div className={`sa-step-dot ${isDone ? 'sa-step-dot--done border-emerald-500 bg-emerald-500/20 text-emerald-400' : isActive ? 'sa-step-dot--active border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
                    {isDone
                      ? <Check size={14} className="text-emerald-400" />
                      : <span className={`sa-wizard-step-num-badge font-bold ${isActive ? 'sa-wizard-step-num-badge--active text-white' : 'text-slate-400'}`}>{s.num}</span>
                    }
                  </div>
                  <div>
                    <p className={`sa-step-label text-xs sm:text-sm font-semibold ${isActive ? 'sa-step-label--active text-indigo-300' : isDone ? 'sa-step-label--done text-slate-300' : 'text-slate-400'}`}>
                      {tCopy(s.titleKey)}
                    </p>
                    <p className="sa-wizard-field-label--sm-no-mb text-[11px] text-slate-400">{tCopy(s.descKey)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto space-y-3 pt-4 border-t border-border/60">
          <div className="sa-tip-card flex items-start gap-2 p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-xs text-amber-200">
            <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <span>{tCopy("COPY.YOU_CAN_UPDATE_THESE_SETTINGS_ANYTIME_FROM_YOUR_DASHBOARD")}</span>
          </div>
          <button
            id="skip-setup-sidebar-btn"
            type="button"
            onClick={openSkipModal}
            className="sa-wizard-skip-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
           data-testid="superadmin-setup-wizard-setup-wizard-overview-skip-setup-sidebar-btn-1">
            <SkipForward size={13} className="text-slate-400" /> {tCopy("COPY.SKIP_SETUP_FOR_NOW")}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#080b1a] via-[#0a0d22] to-[#060810]">
        <div className="sa-wizard-topbar border-b border-indigo-500/20 px-4 py-3 flex items-center justify-between gap-4 bg-[#0a0d22]/80 backdrop-blur-sm">
          <div className="sa-wizard-progress-track flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
            {/* ✅ RULE 3 — dynamic computed width */}
            <progress className="sa-wizard-progress w-full h-full accent-indigo-500" max={100} value={progress} aria-label={tCopy("COPY.SETUP_WIZARD_COMPLETION")} />
          </div>
          <button
            id="skip-setup-btn"
            type="button"
            onClick={openSkipModal}
            className="sa-wizard-topbar-skip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
           data-testid="superadmin-setup-wizard-setup-wizard-overview-skip-setup-btn-2">
            <SkipForward size={13} className="text-slate-400" /> {tCopy("COPY.SKIP_SETUP")}
          </button>
        </div>

        <div className="sa-wizard-content-area flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="sa-wizard-content-inner max-w-2xl mx-auto space-y-6">
            <div className="sa-wizard-step-header pb-4 border-b border-indigo-500/20">
              <span className="sa-wizard-step-label inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mb-2">
                {tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}
              </span>
              <h2 className="sa-wizard-step-title text-xl sm:text-2xl font-bold text-slate-100">{tCopy(STEPS[step - 1].titleKey)}</h2>
            </div>

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
                  disabled title={tCopy("COPY.SETUP_LAUNCH_UNAVAILABLE")}
                  className="sa-wizard-launch-btn w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-describedby="setup-launch-note"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-launch-dashboard-btn-3">
                  <Rocket size={20} className="text-indigo-200" /> {tCopy("COPY.SHOW_LAUNCH_AVAILABILITY")}
                </button>
                <p id="setup-launch-note" className="text-xs text-amber-300 text-center">{tCopy("COPY.SETUP_LAUNCH_IS_UNAVAILABLE_WITHOUT_THE_HOST_SETUP_WRITE_CONTRACT_THIS_PREVIEW_WILL_NOT_CHANGE_PLATFORM_DATA")}</p>
              </div>
            )}

            {/* ── FOOTER NAV ── */}
            {step !== 5 ? (
              <div className="sa-wizard-footer pt-6 border-t border-indigo-500/20 flex items-center justify-between gap-4">
                <button
                  type="button"
                  id="wizard-back-btn"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="sa-btn-ghost sa-btn-ghost--sm inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-wizard-back-btn-4">
                  <ChevronLeft size={16} /> {tCopy("COPY.BACK")}
                </button>
                <span className="sa-wizard-footer-step-count text-xs font-semibold text-slate-400">{tCopy("COPY.STEP")} {step} {tCopy("COPY.OF")} {STEPS.length}</span>
                <button
                  type="submit"
                  id="wizard-next-btn"
                  form={`step${step}-form`}
                  className="sa-wizard-next-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-wizard-next-btn-5">
                  {tCopy("COPY.NEXT_STEP")} <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={prevStep}
                  className="sa-wizard-back-link text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                 data-testid="superadmin-setup-wizard-setup-wizard-overview-back-to-fee-plans-6">
                  <ChevronLeft size={15} />
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
