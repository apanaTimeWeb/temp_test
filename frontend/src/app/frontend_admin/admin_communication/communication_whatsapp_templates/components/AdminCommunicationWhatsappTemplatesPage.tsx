'use client';
// Responsibility: AdminCommunicationWhatsappTemplatesPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useRef } from 'react';
import { ChevronRight, X, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES, ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import useAdminCommunicationWhatsappTemplateState from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/hooks/useAdminCommunicationWhatsappTemplatesWhatsappTemplateState';
import { isAdminCommunicationPhoneNumberValid } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/utils/AdminCommunicationWhatsappTemplatesWhatsappPhoneUtils';

export function AdminCommunicationWhatsappTemplatesPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const { templates, setTemplates, activeId, setActiveId, showTest, setShowTest, testPhone, setTestPhone, toast, setToast, toastTimeoutRef } = useAdminCommunicationWhatsappTemplateState();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const active    = templates.find(t => t.id === activeId)!;
  const charCount = active.body.length;

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => { setToast(''); toastTimeoutRef.current = null; }, 3000);
  };

  const updateBody = (body: string) =>
    setTemplates(prev => prev.map(t => t.id === activeId ? { ...t, body } : t));

  const insertVar = (v: string) => {
    const el = textareaRef.current;
    if (!el) { updateBody(active.body + v); return; }
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    updateBody(active.body.slice(0, start) + v + active.body.slice(end));
    setTimeout(() => { el.focus(); el.setSelectionRange(start + v.length, start + v.length); }, 0);
  };

  const handleTest = () => {
    if (!isAdminCommunicationPhoneNumberValid(testPhone)) { showToast(t('WHATSAPP_TEST_PHONE_INVALID')); return; }
    showToast(t('WHATSAPP_TEST_NOT_SENT'));
  };

  const preview = active.body
    .replace(/{name}/g, 'Rahul Sharma')
    .replace(/{amount}/g, '1000')
    .replace(/{duedate}/g, '15-Apr-2026')
    .replace(/{planname}/g, 'Monthly')
    .replace(/{libraryname}/g, ADMIN_BRAND_CONFIG.displayName)
    .replace(/{phone}/g, '+91 9000000000')
    .replace(/{seat}/g, 'S-03');

  return (
    <div className="min-h-screen bg-page p-6 md:p-8">
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card px-4 py-3 text-ui font-semibold text-text-primary shadow-toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div>}
      <p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('WHATSAPP_TEMPLATES_PREVIEW_BANNER')}</p>

      {/* Test Message Modal */}
      {showTest && (
        <Dialog open onOpenChange={setShowTest}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[400px] space-y-4">
            <button type="button" data-testid="admin_communication-page-control-001" onClick={() => setShowTest(false)} className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('WHATSAPP_TEMPLATE_CLOSE_DIALOG')}><X size={18} strokeWidth={2}/></button>
            <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{t('WHATSAPP_TEST_DIALOG_TITLE')}</DialogTitle>
            <DialogDescription className="mb-5 text-ui text-text-secondary">{t('WHATSAPP_TEST_DIALOG_DESCRIPTION')}</DialogDescription>
            <div>
              <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary" htmlFor="admin-communication-test-phone">{t('WHATSAPP_PHONE_LABEL')}</label>
              <input id="admin-communication-test-phone" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" type="tel" autoComplete="tel" placeholder={t('WHATSAPP_PHONE_PLACEHOLDER')}
                value={testPhone} onChange={e => setTestPhone(e.target.value)} />
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2.5 border-border pt-3">
              <button data-testid="admin_communication-page-control-002" type="button" onClick={() => setShowTest(false)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">{t('WHATSAPP_BUTTON_CANCEL')}</button>
              <button data-testid="admin_communication-page-control-003" type="button" onClick={handleTest} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base" disabled={!testPhone.trim()}>
                <Send size={18}  strokeWidth={2}/> {t('WHATSAPP_TEST_VALIDATE_ONLY')}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-1.5 text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">
          <span>{t('BREADCRUMB_COMMUNICATION')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('WHATSAPP_TEMPLATES_TITLE')}</span>
        </div>
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-text-primary">📱 {t('WHATSAPP_TEMPLATES_TITLE')}</h1>
        <p className="mt-1 text-ui text-text-secondary">{t('WHATSAPP_TEMPLATES_SUBTITLE')}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="flex flex-wrap gap-3">
          {templates.map((template) => (
            <button type="button" data-testid={`admin_communication-template-${template.id}`} key={template.id} onClick={() => setActiveId(template.id)}
              aria-pressed={activeId === template.id}
              className={`flex min-h-11 items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 text-left text-body font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary${activeId === template.id ? ' border-primary bg-primary-subtle text-primary' : ''} admin-communication-style-1e854c543a`}
              >
              {template.icon} {t(template.labelKey)}
            </button>
          ))}
        </div>

        {/* Right Editor */}
        <div className="rounded-xl border border-border bg-card p-6 min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-1">
            <h2 className="text-section-title font-semibold text-text-primary">{active.icon} {t(active.labelKey)}</h2>
            <p className="text-ui text-text-secondary">{t('WHATSAPP_EDITOR_MESSAGE')}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary" htmlFor="admin-communication-template-body">{t('WHATSAPP_MESSAGE_BODY')}</label>
            <textarea
              id="admin-communication-template-body"
              ref={textareaRef}
              className="min-h-24 w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              rows={8}
              value={active.body}
              onChange={e => updateBody(e.target.value)}
              maxLength={ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS}
            />
            <p className={`mt-1 text-right text-caption text-text-secondary${charCount > ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS * 0.9 ? ' text-warning-text' : ''}`}>
              {t('WHATSAPP_CHARACTER_COUNT', { count: charCount, max: ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS })}
            </p>
          </div>

          <div className="mt-4">
            <p id="admin-communication-template-variables-label" className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">{t('WHATSAPP_INSERT_VARIABLE')}</p>
            <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-labelledby="admin-communication-template-variables-label">
              {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.map(v => (
                <button data-testid={`admin_communication-template-variable-${v.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`} key={v} type="button" onClick={() => insertVar(v)} className="inline-flex min-h-11 items-center rounded-md border border-border bg-primary-subtle px-3 py-1 text-ui font-semibold text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{v}</button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-info-bg bg-info-bg p-3 text-ui text-info-text mt-4">
            💡 {t('WHATSAPP_VARIABLE_HELP')}
          </div>

          <div className="mt-4">
            <p id="admin-communication-template-preview-label" className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">{t('WHATSAPP_PREVIEW_SAMPLE_VALUES')}</p>
            <div className="relative mt-2 rounded-lg border border-border bg-input p-4 text-body leading-normal text-text-primary whitespace-pre-wrap" aria-labelledby="admin-communication-template-preview-label">{preview}</div>
          </div>

          <div className="mt-5 flex items-center gap-3 justify-end">
            <button type="button" data-testid="admin_communication-page-control-006" onClick={() => setShowTest(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">
              <Send size={18}  strokeWidth={2}/> {t('WHATSAPP_TEMPLATE_TEST_BUTTON')}
            </button>
            <button type="button" data-testid="admin_communication-page-control-007" disabled title={t('WHATSAPP_SAVE_UNAVAILABLE_TITLE')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50">
              {t('WHATSAPP_SAVE_UNAVAILABLE')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
