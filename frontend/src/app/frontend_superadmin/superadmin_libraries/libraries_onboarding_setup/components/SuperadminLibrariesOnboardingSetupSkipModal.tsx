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
    <div className="sa-wizard-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={modalRef} className="sa-wizard-modal" role="dialog" aria-modal="true" aria-labelledby="setup-skip-modal-title" tabIndex={-1}>
        <div className="sa-wizard-modal-icon"><AlertTriangle size={22} className="sa-metric--warning" /></div>
        <h3 id="setup-skip-modal-title" className="sa-wizard-modal-title">{tCopy("COPY.SKIP_LIBRARY_SETUP")}</h3>
        <p className="sa-wizard-modal-desc">{tCopy("COPY.YOUR_LIBRARY_WILL_HAVE")} <strong>{tCopy("COPY.NO_SHIFTS_NO_SEATS_AND_NO_FEE_PLANS")}</strong> {tCopy("COPY.CONFIGURED")}</p>
        <p className="sa-wizard-modal-desc">{tCopy("COPY.YOU_CAN_COMPLETE_SETUP_ANYTIME_FROM")} <span className="sa-wizard-modal-desc-link">{tCopy("COPY.DASHBOARD_SETTINGS_SETUP_WIZARD")}</span>.</p>
        <div className="sa-wizard-modal-consequences">
          {[
            { icon: '⚠️', text: tCopy('COPY.SKIP_CONSEQUENCE_NO_SEATS_OR_SHIFTS') },
            { icon: '⚠️', text: tCopy('COPY.SKIP_CONSEQUENCE_FEE_PLAN_REQUIRED') },
            { icon: '✅', text: tCopy('COPY.SKIP_CONSEQUENCE_DASHBOARD_REMAINS_AVAILABLE') },
          ].map(({ icon, text }) => <div key={text} className="sa-wizard-consequence-chip"><span className="sa-wizard-consequence-icon">{icon}</span><span>{text}</span></div>)}
        </div>
        <div className="flex gap-3">
          <button id="skip-cancel-btn" type="button" onClick={onClose} className="sa-btn-ghost flex-1 py-2.5" data-testid="superadmin-setup-wizard-setup-wizard-skip-skip-cancel-btn-1">{tCopy("COPY.CONTINUE_SETUP")}</button>
          <button id="skip-confirm-btn" type="button" onClick={onConfirm} className="sa-wizard-modal-go-btn" data-testid="superadmin-setup-wizard-setup-wizard-skip-skip-confirm-btn-2"><LayoutDashboard size={15} /> {tCopy("COPY.GO_TO_DASHBOARD")}</button>
        </div>
        <button type="button" onClick={onClose} className="sa-wizard-modal-close" aria-label={tCopy("COPY.CLOSE_SKIP_SETUP_DIALOG")} data-testid="superadmin-setup-wizard-setup-wizard-skip-close-skip-setup-dialog-3"><X size={15} /></button>
      </div>
    </div>
  );
}
