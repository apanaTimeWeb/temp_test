'use client';

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useRef } from 'react';
import {
  ChevronRight,
  X,
  Send,
  FileText,
  Sparkles,
  Layers,
  CheckCheck,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  Check,
  Paperclip,
  Smile,
  Mic,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import {
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES,
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import useAdminCommunicationWhatsappTemplateState from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/hooks/useAdminCommunicationWhatsappTemplatesWhatsappTemplateState';
import { isAdminCommunicationPhoneNumberValid } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/utils/AdminCommunicationWhatsappTemplatesWhatsappPhoneUtils';

export function AdminCommunicationWhatsappTemplatesPage() {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const {
    templates,
    setTemplates,
    activeId,
    setActiveId,
    showTest,
    setShowTest,
    testPhone,
    setTestPhone,
    toast,
    setToast,
    toastTimeoutRef,
  } = useAdminCommunicationWhatsappTemplateState();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const active = templates.find((t) => t.id === activeId) ?? templates[0];
  const charCount = active.body.length;

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast('');
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const updateBody = (body: string) =>
    setTemplates((prev) => prev.map((item) => (item.id === activeId ? { ...item, body } : item)));

  const insertVar = (v: string) => {
    const el = textareaRef.current;
    if (!el) {
      updateBody(active.body + v);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    updateBody(active.body.slice(0, start) + v + active.body.slice(end));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + v.length, start + v.length);
    }, 0);
  };

  const handleTest = () => {
    if (!isAdminCommunicationPhoneNumberValid(testPhone)) {
      showToast(t('WHATSAPP_TEST_PHONE_INVALID'));
      return;
    }
    showToast(t('WHATSAPP_TEST_NOT_SENT'));
    setShowTest(false);
  };

  const preview = active.body
    .replace(/{name}/g, 'Rahul Sharma')
    .replace(/{amount}/g, '1,000')
    .replace(/{duedate}/g, '25-Apr-2026')
    .replace(/{planname}/g, 'Full Day Dedicated')
    .replace(/{libraryname}/g, ADMIN_BRAND_CONFIG.displayName || 'Smart Library')
    .replace(/{phone}/g, '+91 98765 43210')
    .replace(/{seat}/g, 'S-08');

  return (
    <div className="min-w-0 space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-indigo-500/40 bg-slate-900/95 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
      <p className="sr-only" role="status">{t('WHATSAPP_TEMPLATES_PREVIEW_BANNER')}</p>

      {/* Test Message Modal */}
      {showTest && (
        <Dialog open onOpenChange={setShowTest}>
          <DialogContent className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <Send size={16} className="text-emerald-400" />
                {t('WHATSAPP_TEST_DIALOG_TITLE')}
              </DialogTitle>
              <button
                type="button"
                data-testid="admin_communication-page-control-001"
                onClick={() => setShowTest(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label={t('WHATSAPP_TEMPLATE_CLOSE_DIALOG')}
              >
                <X size={16} />
              </button>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              {t('WHATSAPP_TEST_DIALOG_DESCRIPTION')}
            </DialogDescription>
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                htmlFor="admin-communication-test-phone"
              >
                {t('WHATSAPP_PHONE_LABEL')}
              </label>
              <input
                id="admin-communication-test-phone"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
                type="tel"
                autoComplete="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                data-testid="admin_communication-page-control-002"
                type="button"
                onClick={() => setShowTest(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                {t('WHATSAPP_BUTTON_CANCEL')}
              </button>
              <button
                data-testid="admin_communication-page-control-003"
                type="button"
                onClick={handleTest}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-40"
                disabled={!testPhone.trim()}
              >
                <Send size={13} />
                {t('WHATSAPP_TEST_VALIDATE_ONLY')}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>{t('BREADCRUMB_COMMUNICATION')}</span>
          <ChevronRight size={14} />
          <span className="text-slate-200">{t('WHATSAPP_TEMPLATES_TITLE')}</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <MessageSquare size={22} className="text-emerald-400" />
          {t('WHATSAPP_TEMPLATES_TITLE')}
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">{t('WHATSAPP_TEMPLATES_SUBTITLE')}</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Templates - Indigo */}
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
              Verified Automated Flows
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
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Character Length</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <Sparkles size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">
            {charCount} <span className="text-xs text-slate-400 font-normal">/ {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS}</span>
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              WhatsApp Broadcast Limit
            </span>
          </div>
        </div>

        {/* Dynamic Variables - Purple */}
        <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 p-5 shadow-lg shadow-purple-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-500/20" />
          <svg className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
            <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dynamic Tokens</span>
            <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-purple-500/15 border-purple-500/30 text-purple-400">
              <Layers size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-purple-400">{ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-purple-300 bg-purple-500/10 border-purple-500/25">
              Auto-Populating Fields
            </span>
          </div>
        </div>
      </div>

      {/* Template Selector Chips */}
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            type="button"
            data-testid={`admin_communication-template-${template.id}`}
            key={template.id}
            onClick={() => setActiveId(template.id)}
            aria-pressed={activeId === template.id}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              activeId === template.id
                ? 'border border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span>{template.icon}</span>
            <span>{t(template.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Main Split Layout: Left Editor (60%) | Right Phone Mockup (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Editor */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{active.icon}</span>
                <span>{t(active.labelKey)}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Customize message body and insert automated student tags</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
              {charCount} / {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS}
            </span>
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              htmlFor="admin-communication-template-body"
            >
              {t('WHATSAPP_MESSAGE_BODY')}
            </label>
            <textarea
              id="admin-communication-template-body"
              ref={textareaRef}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed"
              rows={8}
              value={active.body}
              onChange={(e) => updateBody(e.target.value)}
              maxLength={ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS}
            />
          </div>

          {/* Dynamic Variable Chips */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers size={13} className="text-indigo-400" />
              {t('WHATSAPP_INSERT_VARIABLE')} (Click to insert)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.map((v) => (
                <button
                  data-testid={`admin_communication-template-variable-${v.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
                  key={v}
                  type="button"
                  onClick={() => insertVar(v)}
                  className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all"
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Tokens are automatically resolved from student member profiles at dispatch time.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 pt-4">
            <button
              type="button"
              data-testid="admin_communication-page-control-006"
              onClick={() => setShowTest(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
            >
              <Send size={13} />
              {t('WHATSAPP_TEMPLATE_TEST_BUTTON')}
            </button>
            <button
              type="button"
              data-testid="admin_communication-page-control-007"
              disabled
              title={t('WHATSAPP_SAVE_UNAVAILABLE_TITLE')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white opacity-90 shadow-md shadow-emerald-600/20"
            >
              <Check size={14} />
              Save Template Changes
            </button>
          </div>
        </div>

        {/* Right Column: Realistic Smartphone WhatsApp Mockup Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[340px] rounded-[36px] border-[5px] border-slate-700 bg-[#0b141a] shadow-2xl overflow-hidden text-white">
            {/* Phone Speaker Notch */}
            <div className="h-4 bg-[#1f2c34] flex items-center justify-center">
              <div className="h-1 w-12 rounded-full bg-slate-700" />
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-[#1f2c34] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  SL
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-100">Smart Library</span>
                    <ShieldCheck size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-[9px] text-emerald-400 block font-normal leading-none">Official Business Account</span>
                </div>
              </div>
            </div>

            {/* Chat Bubble Area with WhatsApp Dark Wallpaper */}
            <div className="p-3 min-h-[320px] max-h-[380px] overflow-y-auto flex flex-col justify-end bg-gradient-to-b from-[#0b141a] to-[#080d11]">
              <div className="relative self-end max-w-[92%] rounded-2xl rounded-tr-xs bg-[#005c4b] p-3 text-[11px] leading-relaxed text-slate-100 shadow-md">
                <p className="whitespace-pre-wrap font-sans">{preview}</p>
                <div className="mt-1.5 flex items-center justify-end gap-1 text-[9px] text-emerald-200">
                  <span>10:42 AM</span>
                  <CheckCheck size={12} className="text-cyan-300" />
                </div>
              </div>
            </div>

            {/* Fake WhatsApp Message Input */}
            <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2 border-t border-slate-800">
              <Smile size={16} className="text-slate-400 shrink-0" />
              <div className="flex-1 rounded-full bg-[#2a3942] px-3 py-1 text-[11px] text-slate-400">
                Message
              </div>
              <Paperclip size={15} className="text-slate-400 shrink-0" />
              <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <Mic size={13} />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Live WhatsApp student recipient render</p>
        </div>
      </div>
    </div>
  );
}

export default AdminCommunicationWhatsappTemplatesPage;
