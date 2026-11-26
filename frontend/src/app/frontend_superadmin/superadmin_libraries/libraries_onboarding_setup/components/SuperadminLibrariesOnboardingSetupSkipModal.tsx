'use client';
/** Responsibility: Superadmin Setup Wizard Skip Modal; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning feature event -> local dialog/confirmation state -> typed callback to the owning component; API writes remain contract-gated. */
import { useEffect, useRef } from 'react';
import { AlertTriangle, LayoutDashboard, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SETUP_WIZARD_SKIP_MODAL_SELECTOR } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupStaticConstants';
import type { SuperadminSetupWizardSkipModalProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupSkipModalComponentTypes';


/**
 * Performs the superadmin libraries onboarding setup skip modal operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSetupWizardSkipModalProps.
 */
export default function SuperadminLibrariesOnboardingSetupSkipModal({ onClose, onConfirm }: SuperadminSetupWizardSkipModalProps) {
  const tCopy = useTranslations('SUPERADMIN_SETUP_WIZARD');
  const modalRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [onClose] is the deliberate re-run boundary.
  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    
    const getFocusable = () => Array.from<HTMLElement>(modalRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_SETUP_WIZARD_SKIP_MODAL_SELECTOR) ?? []).filter((element) => element.offsetParent !== null);
    getFocusable()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) { event.preventDefault(); modalRef.current?.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      openerRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="sa-wizard-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={modalRef} className="sa-wizard-modal relative w-full max-w-lg rounded-2xl border border-indigo-500/25 bg-card/95 backdrop-blur-xl p-6 shadow-2xl shadow-black/50 space-y-5 animate-in fade-in-0 zoom-in-95 text-center sm:text-left" role="dialog" aria-modal="true" aria-labelledby="setup-skip-modal-title" tabIndex={-1}>
        <div className="flex items-center justify-between">
          <div className="sa-wizard-modal-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <AlertTriangle size={24} className="text-amber-400" />
          </div>
          <button type="button" onClick={onClose} className="sa-wizard-modal-close p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer" aria-label={tCopy("COPY.CLOSE_SKIP_SETUP_DIALOG")} data-testid="superadmin-setup-wizard-setup-wizard-skip-close-skip-setup-dialog-3"><X size={16} /></button>
        </div>

        <div>
          <h3 id="setup-skip-modal-title" className="sa-wizard-modal-title text-xl font-bold text-slate-100">{tCopy("COPY.SKIP_LIBRARY_SETUP")}</h3>
          <p className="sa-wizard-modal-desc text-xs sm:text-sm text-slate-300 mt-1">{tCopy("COPY.YOUR_LIBRARY_WILL_HAVE")} <strong className="text-amber-300">{tCopy("COPY.NO_SHIFTS_NO_SEATS_AND_NO_FEE_PLANS")}</strong> {tCopy("COPY.CONFIGURED")}</p>
          <p className="sa-wizard-modal-desc text-xs text-slate-400 mt-1">{tCopy("COPY.YOU_CAN_COMPLETE_SETUP_ANYTIME_FROM")} <span className="sa-wizard-modal-desc-link text-indigo-400 font-medium">{tCopy("COPY.DASHBOARD_SETTINGS_SETUP_WIZARD")}</span>.</p>
        </div>

        <div className="sa-wizard-modal-consequences space-y-2 rounded-xl border border-border/80 bg-background/60 p-3.5">
          {[
            { icon: '⚠️', text: tCopy('COPY.SKIP_CONSEQUENCE_NO_SEATS_OR_SHIFTS') },
            { icon: '⚠️', text: tCopy('COPY.SKIP_CONSEQUENCE_FEE_PLAN_REQUIRED') },
            { icon: '✅', text: tCopy('COPY.SKIP_CONSEQUENCE_DASHBOARD_REMAINS_AVAILABLE') },
          ].map(({ icon, text }) => (
            <div key={text} className="sa-wizard-consequence-chip flex items-center gap-2.5 text-xs text-slate-300">
              <span className="sa-wizard-consequence-icon shrink-0">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            id="skip-cancel-btn"
            type="button"
            onClick={onClose}
            className="sa-btn-ghost flex-1 inline-flex items-center justify-center font-semibold rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 py-2.5 text-sm motion-safe:transition-all cursor-pointer"
            data-testid="superadmin-setup-wizard-setup-wizard-skip-skip-cancel-btn-1">
            {tCopy("COPY.CONTINUE_SETUP")}
          </button>
          <button
            id="skip-confirm-btn"
            type="button"
            onClick={onConfirm}
            className="sa-wizard-modal-go-btn flex-1 inline-flex items-center justify-center gap-2 font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/25 py-2.5 text-sm motion-safe:transition-all cursor-pointer"
            data-testid="superadmin-setup-wizard-setup-wizard-skip-skip-confirm-btn-2">
            <LayoutDashboard size={15} /> {tCopy("COPY.GO_TO_DASHBOARD")}
          </button>
        </div>
      </div>
    </div>
  );
}
