'use client';
// Responsibility: AdminCommunicationWhatsappTemplatesPage component owned by admin_communication; responsibility folder: admin_communication_components_views.
// RESPONSIBILITY: Entry page for the admin_communication module.
// DATA FLOW: Next.js Router -> Page -> Components

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useRef } from 'react';
import { ChevronRight, X, Send, FileText, Sparkles, Layers } from 'lucide-react';
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
      <p className="sr-only" role="status">{t('WHATSAPP_TEMPLATES_PREVIEW_BANNER')}</p>

      {/* Test Message Modal */}
      {showTest && (
        <Dialog open onOpenChange={setShowTest}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[400px] space-y-4">
            <button type="button" data-testid="admin_communication-page-control-001" onClick={() => setShowTest(false)} className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('WHATSAPP_TEMPLATE_CLOSE_DIALOG')}><X size={18} strokeWidth={2}/></button>
            <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{t('WHATSAPP_TEST_DIALOG_TITLE')}</DialogTitle>
            <DialogDescription className="mb-5 text-ui text-text-secondary">{t('WHATSAPP_TEST_DIALOG_DESCRIPTION')}</DialogDescription>
            <div>
              <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary" htmlFor="admin-communication-test-phone">{t('WHATSAPP_PHONE_LABEL')}</label>
              <input
                id="admin-communication-test-phone"
                className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                type="tel"
                autoComplete="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={testPhone}
                onChange={e => setTestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
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

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* System Templates - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Templates</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <FileText size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{templates.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              Approved Layouts
            </span>
          </div>
        </div>

        {/* Characters Used - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Characters Used</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <Sparkles size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">
            {charCount} <span className="text-xs text-slate-400 font-normal">/ {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS}</span>
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              Optimal Size
            </span>
          </div>
        </div>

        {/* Available Variables - Purple */}
        <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 p-5 shadow-lg shadow-purple-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Variables</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-purple-500/15 border-purple-500/30 text-purple-400">
              <Layers size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-purple-400">{ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-purple-300 bg-purple-500/10 border-purple-500/25">
              Dynamic Tokens
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="flex flex-wrap gap-2.5">
          {templates.map((template) => (
            <button type="button" data-testid={`admin_communication-template-${template.id}`} key={template.id} onClick={() => setActiveId(template.id)}
              aria-pressed={activeId === template.id}
              className={`flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2 text-left text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeId === template.id ? 'border-primary bg-primary text-on-primary shadow-xs scale-[1.02]' : 'border-border bg-card text-text-secondary hover:text-text-primary hover:border-border/80'} admin-communication-style-1e854c543a`}
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
                <button
                  data-testid={`admin_communication-template-variable-${v.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
                  key={v}
                  type="button"
                  onClick={() => insertVar(v)}
                  className="inline-flex min-h-[32px] items-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary hover:bg-primary/20 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-all"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-info-bg bg-info-bg p-3 text-ui text-info-text mt-4">
            💡 {t('WHATSAPP_VARIABLE_HELP')}
          </div>

          <div className="mt-4">
            <p id="admin-communication-template-preview-label" className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary">{t('WHATSAPP_PREVIEW_SAMPLE_VALUES')}</p>
            <div className="relative mt-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm font-sans leading-relaxed text-emerald-100 whitespace-pre-wrap shadow-inner" aria-labelledby="admin-communication-template-preview-label">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-2">
                <span>💬 WhatsApp Live Preview:</span>
              </div>
              {preview}
            </div>
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
