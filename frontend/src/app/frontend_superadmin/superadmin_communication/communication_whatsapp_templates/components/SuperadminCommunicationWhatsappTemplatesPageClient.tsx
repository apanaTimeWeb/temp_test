'use client';
import { toast } from 'sonner';
/** Responsibility: Superadmin Communication Whatsapp Templates Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationWhatsappTemplatesPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useState, useRef, useMemo } from 'react';
import { useSuperadminCommunicationWhatsappTemplatesDialog } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/hooks/useSuperadminCommunicationWhatsappTemplatesDialog';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/mocks/fixtures/SuperadminCommunicationWhatsappTemplatesWhatsappTemplateMockFixtures';
import {
  X,
  Send,
  Save,
  Hand,
  Wallet,
  Repeat,
  Receipt,
  Megaphone,
  CalendarDays,
  Handshake,
  Smartphone,
  CheckCheck,
  Sparkles,
  Info,
  Copy,
  Check,
  type LucideIcon,
  ShieldCheck,
  Phone,
  Video,
  MoreVertical,
} from 'lucide-react';
import type { SuperadminCommunicationWhatsappTemplateIcon, SuperadminCommunicationWhatsappTemplatesPageClientProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/types/superadmin_communication_whatsapp_templates.types';
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationWhatsappTemplatesEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesEmptyState';
import { SUPERADMIN_COMMUNICATION_TEMPLATE_VARIABLES } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/constants/SuperadminCommunicationWhatsappTemplatesTemplateConstants';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/constants/SuperadminCommunicationWhatsappTemplatesStaticConstants';

const TEMPLATE_ICON_COMPONENTS: Record<SuperadminCommunicationWhatsappTemplateIcon, LucideIcon> = {
  hand: Hand,
  wallet: Wallet,
  repeat: Repeat,
  receipt: Receipt,
  megaphone: Megaphone,
  'calendar-days': CalendarDays,
  handshake: Handshake,
};

/**
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationWhatsappTemplatesPageClient`.
 * Owns local UI state for `editedBodies`, `activeId`, `saved`, and `showTest`; preview feedback uses deduplicated Sonner messages.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminCommunicationWhatsappTemplatesPageClient({ id }: SuperadminCommunicationWhatsappTemplatesPageClientProps = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const [editedBodies, setEditedBodies] = useState<Record<string, string>>({});
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const templates = useMemo(
    () =>
      SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS.map((template) => ({
        ...template,
        label: tCopy(`COPY.${template.labelKey}`),
        body:
          editedBodies[template.id] ??
          tCopy(`COPY.${template.bodyKey}`, {
            name: '{name}',
            amount: '{amount}',
            duedate: '{duedate}',
            planname: '{planname}',
            libraryname: '{libraryname}',
            phone: '{phone}',
            seat: '{seat}',
          }),
      })),
    [editedBodies, tCopy]
  );

  const [activeId, setActiveId] = useState(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS[0]?.id ?? '');
  const [showTest, setShowTest] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const testDialogRef = useSuperadminCommunicationWhatsappTemplatesDialog(showTest, () => setShowTest(false));

  const active = templates.find((template) => template.id === activeId) ?? templates[0];

  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_communication:SuperadminCommunicationWhatsappTemplatesPageClient:feedback' });
  };

  const updateBody = (body: string) => {
    if (!active || body.length > SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS) return;
    setEditedBodies((current) => ({ ...current, [active.id]: body }));
  };

  if (!active) {
    return (
      <div className="eng-page" data-testid="superadmin-communication-communication-whatsapp-templates-page">
        <SuperadminCommunicationWhatsappTemplatesEmptyState />
      </div>
    );
  }

  const insertVar = (v: string) => {
    const textarea = textareaRef.current;
    const selectionStart = textarea?.selectionStart ?? active.body.length;
    const selectionEnd = textarea?.selectionEnd ?? active.body.length;
    const nextBody = active.body.slice(0, selectionStart) + v + active.body.slice(selectionEnd);
    if (nextBody.length > SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS) {
      showToast(tCopy('COPY.TOAST_VARIABLE_INSERTION_EXCEEDS_LIMIT'));
      return;
    }
    const nextCaretPosition = selectionStart + v.length;
    updateBody(nextBody);
    if (textarea) {
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(nextCaretPosition, nextCaretPosition);
      }, 0);
    }
  };

  const handleTest = () => {
    showToast(tCopy('COPY.TOAST_TEST_MESSAGE_API_UNAVAILABLE'));
  };

  const handleCopyCurrentTemplate = () => {
    navigator.clipboard.writeText(active.body);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const ActiveTemplateIcon = TEMPLATE_ICON_COMPONENTS[active.icon];
  const preview = active.body
    .replace(/{name}/g, 'Sample Student A')
    .replace(/{amount}/g, '1000')
    .replace(/{duedate}/g, '15-Apr-2027')
    .replace(/{planname}/g, 'Monthly')
    .replace(/{libraryname}/g, 'Library OS')
    .replace(/{phone}/g, '+91 98****0001')
    .replace(/{seat}/g, 'SAMPLE-SEAT-03');

  const charUsagePercent = Math.min(100, Math.round((active.body.length / SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS) * 100));

  return (
    <div className="eng-page min-h-screen space-y-6" data-resource-id={id || undefined}>
      {/* Test Message Modal */}
      {showTest && (
        <div
          className="eng-overlay fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowTest(false);
          }}
        >
          <div
            ref={testDialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-test-dialog-title"
            className="eng-modal eng-modal--sm bg-card/95 border border-border/80 shadow-2xl rounded-2xl w-full max-w-md p-6 relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Send className="w-4 h-4" />
                </div>
                <p id="whatsapp-test-dialog-title" className="eng-modal-title text-base font-bold text-foreground">
                  {tCopy('COPY.TEST_MESSAGE_UNAVAILABLE')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTest(false)}
                className="p-1 rounded-lg border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={tCopy('COPY.CLOSE_TEST_MESSAGE_AVAILABILITY_DIALOG')}
                data-testid="superadmin-communication-communication-whatsapp-templates-close-test-message-availability-dialog-1"
              >
                <X size={16} />
              </button>
            </div>

            <p className="eng-modal-desc text-xs text-muted-foreground my-4 leading-relaxed">
              {tCopy('COPY.THE_SUPPLIED_SOURCE_HAS_NO_VERIFIED_TEST_MESSAGE_API_NO_PHONE_NUMBER_IS_REQUIRED_AND_NO_MESSAGE_CAN_BE_SENT_FROM_THIS_PREVIEW')}
            </p>

            <div className="eng-modal-footer flex items-center justify-end gap-2 pt-3 border-t border-border/40">
              <button
                type="button"
                onClick={() => setShowTest(false)}
                className="eng-btn-ghost px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                data-testid="superadmin-communication-communication-whatsapp-templates-cancel-2"
              >
                {tCopy('COPY.CANCEL')}
              </button>
              <button
                type="button"
                onClick={handleTest}
                className="eng-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 cursor-not-allowed opacity-60"
                disabled
                title={tCopy('COPY.UNAVAILABLE_TEST_MESSAGE_API_CONTRACT_NOT_SUPPLIED')}
                data-testid="superadmin-communication-communication-whatsapp-templates-unavailable-test-message-api-contract-not-supplied-3"
              >
                <Send size={14} /> {tCopy('COPY.SEND_TEST_UNAVAILABLE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Status Banner */}
      <p className="eng-info-box p-3 rounded-xl bg-card/60 border border-border/80 text-xs text-muted-foreground flex items-center gap-2" role="status">
        <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{tCopy('COPY.SAMPLE_TEMPLATE_CONTENT_ONLY_CHANGES_REMAIN_IN_THIS_PAGE_STATE_NO_SERVER_SIDE_TEMPLATE_OR_MESSAGING_INTEGRATION_WAS_SUPPLIED')}</span>
      </p>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-card/90 to-card/60 border border-emerald-500/20 p-6 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WhatsApp Cloud API Standard</span>
            </div>
            <h1 className="eng-page-title text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-emerald-400" />
              {tCopy('COPY.WHATSAPP_TEMPLATES_2')}
            </h1>
            <p className="eng-page-subtitle text-xs text-muted-foreground mt-1 max-w-2xl">
              {tCopy('COPY.EDIT_SYNTHETIC_TEMPLATE_TEXT_FOR_LOCAL_PREVIEW_ONLY_SAVING_DOES_NOT_PUBLISH_TEMPLATES_OR_SEND_MESSAGES')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCurrentTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-foreground text-xs font-medium transition-all shadow-sm"
              title="Copy template source"
            >
              {copiedTemplate ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              <span>{copiedTemplate ? 'Copied!' : 'Copy Template'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Filter Bar / Template Selector */}
      <div className="eng-tpl-topbar flex flex-wrap gap-2.5 p-2 rounded-2xl bg-card/70 border border-border/80 backdrop-blur-md shadow-sm">
        {templates.map((t) => {
          const TemplateIcon = TEMPLATE_ICON_COMPONENTS[t.icon];
          const isSelected = activeId === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => setActiveId(t.id)}
              aria-pressed={isSelected}
              className={`eng-tpl-item inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'eng-tpl-item--active bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-muted/30 border border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
              data-testid={`superadmin-communication-communication-whatsapp-templates-set-active-id-4-${String(t.id)}`}
            >
              <TemplateIcon size={18} aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Grid: Editor + Smartphone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Template Editor (7 cols) */}
        <div className="eng-card lg:col-span-7 rounded-2xl bg-card/90 border border-border/80 p-6 shadow-xl space-y-5">
          <div className="eng-card-header pb-4 border-b border-border/60">
            <div className="flex items-center justify-between">
              <h2 className="eng-card-title inline-flex items-center gap-2 text-base font-bold text-foreground">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ActiveTemplateIcon size={18} aria-hidden="true" />
                </div>
                <span>{active.label}</span>
              </h2>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-muted/40 border border-border/60 text-muted-foreground">
                ID: {active.id}
              </span>
            </div>
            <p className="eng-card-desc text-xs text-muted-foreground mt-1">
              {tCopy('COPY.EDIT_THE_MESSAGE_BODY_USE_VARIABLE_CHIPS_TO_PERSONALIZE')}
            </p>
          </div>

          {/* Textarea & Character Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="eng-label text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="superadmin-superadmincommunicationwhatsapptemplatespageclient-123-textarea">
                {tCopy('COPY.MESSAGE_BODY')}
              </label>
              <p
                className={`eng-char-count text-xs font-mono font-medium ${
                  active.body.length > SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS * 0.9
                    ? 'eng-char-count--warn text-rose-400'
                    : 'text-muted-foreground'
                }`}
              >
                {active.body.length} / {SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS} {tCopy('COPY.CHARACTERS')}
              </p>
            </div>
            <textarea
              id="superadmin-superadmincommunicationwhatsapptemplatespageclient-123-textarea"
              ref={textareaRef}
              className="eng-textarea w-full p-4 rounded-xl bg-muted/20 border border-border/80 text-foreground text-sm font-sans leading-relaxed focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all shadow-inner"
              rows={8}
              value={active.body}
              onChange={(e) => updateBody(e.target.value)}
              maxLength={SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS}
              data-testid="superadmin-communication-communication-whatsapp-templates-superadmin-superadmincommunicationwhatsapptemplatespageclient-123-textarea-5"
            />
            {/* Progress bar */}
            <div className="w-full bg-muted/40 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  charUsagePercent > 90 ? 'bg-rose-500' : charUsagePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${charUsagePercent}%` }}
              />
            </div>
          </div>

          {/* Variables insertion section */}
          <div className="eng-tpl-section space-y-2 pt-2">
            <p className="eng-label text-xs font-semibold uppercase tracking-wider text-muted-foreground" id="whatsapp-template-insert-variable-label">
              {tCopy('COPY.INSERT_VARIABLE')}
            </p>
            <div className="eng-tpl-var-row flex flex-wrap gap-2">
              {SUPERADMIN_COMMUNICATION_TEMPLATE_VARIABLES.map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => insertVar(v)}
                  className="eng-var-chip px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-medium transition-colors"
                  data-testid={`superadmin-communication-communication-whatsapp-templates-insert-var-6-${String(v)}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="eng-info-box eng-tpl-section p-3 rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground">
            {tCopy('COPY.USE_VARIABLES_TO_PERSONALIZE_MESSAGES_E_G')}{' '}
            <em>
              {tCopy('COPY.QUOT_HI')} {'{name}'}
              {tCopy('COPY.YOUR_FEE_OF')}
              {'{amount}'} {tCopy('COPY.IS_DUE_ON')} {'{duedate}'}
              {tCopy('COPY.QUOT')}
            </em>
          </div>

          {/* Editor Action Footer */}
          <div className="eng-card-footer eng-card-footer--end flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => setShowTest(true)}
              className="eng-btn-ghost inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-foreground bg-muted/30 border border-border/80 hover:bg-muted/60 transition-colors"
              data-testid="superadmin-communication-communication-whatsapp-templates-send-test-message-7"
            >
              <Send size={14} className="text-emerald-400" />
              <span>{tCopy('COPY.SEND_TEST_MESSAGE')}</span>
            </button>
            <button
              type="button"
              disabled
              title={tCopy('COPY.SAMPLE_TEMPLATE_CONTENT_ONLY_CHANGES_REMAIN_IN_THIS_PAGE_STATE_NO_SERVER_SIDE_TEMPLATE_OR_MESSAGING_INTEGRATION_WAS_SUPPLIED')}
              className="eng-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 opacity-60 cursor-not-allowed"
              data-testid="superadmin-communication-communication-whatsapp-templates-preview-updated-8"
            >
              <Save size={14} />
              <span>{tCopy('COPY.SAVE_TEMPLATE')}</span>
            </button>
          </div>
        </div>

        {/* Right: Realistic WhatsApp Mobile Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-[2.5rem] bg-[#111b21] border-4 border-[#2a3942] shadow-2xl p-3 relative overflow-hidden">
            {/* Phone Notch / Speaker */}
            <div className="flex justify-center mb-2">
              <div className="w-24 h-4 bg-[#2a3942] rounded-full" />
            </div>

            {/* WhatsApp App Bar */}
            <div className="bg-[#202c33] -mx-3 -mt-1 px-4 py-3 flex items-center justify-between text-white border-b border-[#2a3942]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                  LOS
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold leading-tight">
                    <span>Library OS</span>
                    <span className="text-emerald-400 text-[10px]">●</span>
                  </div>
                  <div className="text-[10px] text-gray-300">Official Business Account</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-3.5 h-3.5 cursor-not-allowed opacity-70" />
                <Video className="w-3.5 h-3.5 cursor-not-allowed opacity-70" />
                <MoreVertical className="w-3.5 h-3.5 cursor-not-allowed opacity-70" />
              </div>
            </div>

            {/* Chat Body Wallpaper */}
            <div className="min-h-96 bg-[#0b141a] p-3 flex flex-col justify-between rounded-b-2xl relative">
              {/* Date pill */}
              <div className="flex justify-center mb-4">
                <span className="px-2.5 py-0.5 rounded-md bg-[#182229] text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Today
                </span>
              </div>

              {/* Speech Bubble / Preview */}
              <div className="eng-tpl-preview self-end max-w-[90%] bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none p-3.5 shadow-md text-xs leading-relaxed whitespace-pre-wrap relative font-sans">
                {preview}
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-emerald-200/70 font-mono">
                  <span>10:30 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-400 inline" />
                </div>
              </div>

              {/* Chat Input Bar Mock */}
              <div className="mt-6 flex items-center gap-2 bg-[#202c33] rounded-full px-3 py-2 text-gray-400 text-xs">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] text-gray-400 select-none">Message preview mode...</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            {tCopy('COPY.PREVIEW_SAMPLE_VALUES')}
          </p>
        </div>
      </div>
    </div>
  );
}
