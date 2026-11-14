'use client';
import { toast } from 'sonner';
/** Responsibility: Superadmin Communication Whatsapp Templates Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminCommunicationWhatsappTemplatesPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useState, useRef, useMemo } from 'react';
import { useSuperadminCommunicationWhatsappTemplatesDialog } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/hooks/useSuperadminCommunicationWhatsappTemplatesDialog';
import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/mocks/fixtures/SuperadminCommunicationWhatsappTemplatesWhatsappTemplateMockFixtures';
import { ChevronRight, X, Send, Save, Hand, Wallet, Repeat, Receipt, Megaphone, CalendarDays, Handshake, type LucideIcon } from 'lucide-react';
import type { SuperadminCommunicationWhatsappTemplateIcon, SuperadminCommunicationWhatsappTemplatesPageClientProps } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/types/superadmin_communication_whatsapp_templates.types';
import { useTranslations } from 'next-intl';
import { SuperadminCommunicationWhatsappTemplatesEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesEmptyState';
import { SUPERADMIN_COMMUNICATION_TEMPLATE_VARIABLES } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/constants/SuperadminCommunicationWhatsappTemplatesTemplateConstants';


import { SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/constants/SuperadminCommunicationWhatsappTemplatesStaticConstants';







const TEMPLATE_ICON_COMPONENTS: Record<SuperadminCommunicationWhatsappTemplateIcon, LucideIcon> = {
  hand: Hand, wallet: Wallet, repeat: Repeat, receipt: Receipt, megaphone: Megaphone, 'calendar-days': CalendarDays, handshake: Handshake,
};

/**
 * Renders the `superadmin_communication` view owned by `SuperadminCommunicationWhatsappTemplatesPageClient`.
 * Owns local UI state for `editedBodies`, `activeId`, `saved`, and `showTest`; preview feedback uses deduplicated Sonner messages.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminCommunicationWhatsappTemplatesPageClient({ id }: SuperadminCommunicationWhatsappTemplatesPageClientProps = {}) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const [editedBodies, setEditedBodies] = useState<Record<string, string>>({});
  const templates = useMemo(() => SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS.map((template) => ({
    ...template,
    label: tCopy(`COPY.${template.labelKey}`),
    body: editedBodies[template.id] ?? tCopy(`COPY.${template.bodyKey}`, {
      name: '{name}', amount: '{amount}', duedate: '{duedate}', planname: '{planname}',
      libraryname: '{libraryname}', phone: '{phone}', seat: '{seat}',
    }),
  })), [editedBodies, tCopy]);
  const [activeId, setActiveId] = useState(SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS[0]?.id ?? '');
  const [showTest, setShowTest]   = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const testDialogRef = useSuperadminCommunicationWhatsappTemplatesDialog(showTest, () => setShowTest(false));

  const active = templates.find((template) => template.id === activeId) ?? templates[0];

  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_communication:SuperadminCommunicationWhatsappTemplatesPageClient:feedback' }); };

  const updateBody = (body: string) => {
    if (!active || body.length > SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS) return;
    setEditedBodies((current) => ({ ...current, [active.id]: body }));
  };

  if (!active) {
    return <div className="eng-page" data-testid="superadmin-communication-communication-whatsapp-templates-page"><SuperadminCommunicationWhatsappTemplatesEmptyState /></div>;
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
    if (textarea) setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCaretPosition, nextCaretPosition);
    }, 0);
  };

  const handleTest = () => {
    showToast(tCopy('COPY.TOAST_TEST_MESSAGE_API_UNAVAILABLE'));
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

  return (
    <div className="eng-page" data-resource-id={id || undefined}>
      <p className="eng-info-box mb-4" role="status">{tCopy("COPY.SAMPLE_TEMPLATE_CONTENT_ONLY_CHANGES_REMAIN_IN_THIS_PAGE_STATE_NO_SERVER_SIDE_TEMPLATE_OR_MESSAGING_INTEGRATION_WAS_SUPPLIED")}</p>

      {/* Test Message Modal */}
      {showTest && (
        <div className="eng-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowTest(false); }}>
          <div ref={testDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="whatsapp-test-dialog-title" className="eng-modal eng-modal--sm">
            <button type="button" onClick={() => setShowTest(false)} className="eng-modal-close" aria-label={tCopy("COPY.CLOSE_TEST_MESSAGE_AVAILABILITY_DIALOG")} data-testid="superadmin-communication-communication-whatsapp-templates-close-test-message-availability-dialog-1"><X size={16} /></button>
            <p id="whatsapp-test-dialog-title" className="eng-modal-title">{tCopy("COPY.TEST_MESSAGE_UNAVAILABLE")}</p>
            <p className="eng-modal-desc">{tCopy("COPY.THE_SUPPLIED_SOURCE_HAS_NO_VERIFIED_TEST_MESSAGE_API_NO_PHONE_NUMBER_IS_REQUIRED_AND_NO_MESSAGE_CAN_BE_SENT_FROM_THIS_PREVIEW")}</p>
            <div className="eng-modal-footer">
              <button type="button" onClick={() => setShowTest(false)} className="eng-btn-ghost" data-testid="superadmin-communication-communication-whatsapp-templates-cancel-2">{tCopy("COPY.CANCEL")}</button>
              <button type="button" onClick={handleTest} className="eng-btn-primary" disabled title={tCopy("COPY.UNAVAILABLE_TEST_MESSAGE_API_CONTRACT_NOT_SUPPLIED")} data-testid="superadmin-communication-communication-whatsapp-templates-unavailable-test-message-api-contract-not-supplied-3">
                <Send size={14} /> {tCopy("COPY.SEND_TEST_UNAVAILABLE")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="eng-breadcrumb">
          <span>{tCopy("COPY.COMMUNICATION")}</span><ChevronRight size={12} /><span>{tCopy("COPY.WHATSAPP_TEMPLATES")}</span>
        </div>
        <h1 className="eng-page-title">{tCopy("COPY.WHATSAPP_TEMPLATES_2")}</h1>
        <p className="eng-page-subtitle">{tCopy("COPY.EDIT_SYNTHETIC_TEMPLATE_TEXT_FOR_LOCAL_PREVIEW_ONLY_SAVING_DOES_NOT_PUBLISH_TEMPLATES_OR_SEND_MESSAGES")}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="eng-tpl-topbar flex flex-wrap gap-3">
          {templates.map((t) => {
            const TemplateIcon = TEMPLATE_ICON_COMPONENTS[t.icon];
            return <button type="button" key={t.id} onClick={() => setActiveId(t.id)} aria-pressed={activeId === t.id}
              className={`eng-tpl-item w-auto px-4 py-2 rounded-full${activeId === t.id ? ' eng-tpl-item--active' : ''}`} data-testid={`superadmin-communication-communication-whatsapp-templates-set-active-id-4-${String(t.id)}`}>
              <TemplateIcon size={18} aria-hidden="true" /> {t.label}
            </button>;
          })}
        </div>

        {/* Right Editor */}
        <div className="eng-card eng-flex-1">
          <div className="eng-card-header">
            <h2 className="eng-card-title inline-flex items-center gap-2"><ActiveTemplateIcon size={18} aria-hidden="true" /> {active.label}</h2>
            <p className="eng-card-desc">{tCopy("COPY.EDIT_THE_MESSAGE_BODY_USE_VARIABLE_CHIPS_TO_PERSONALIZE")}</p>
          </div>

          <div>
            <label className="eng-label" htmlFor="superadmin-superadmincommunicationwhatsapptemplatespageclient-123-textarea">{tCopy("COPY.MESSAGE_BODY")}</label>
            <textarea id="superadmin-superadmincommunicationwhatsapptemplatespageclient-123-textarea"
              ref={textareaRef}
              className="eng-textarea"
              rows={8}
              value={active.body}
              onChange={e => updateBody(e.target.value)}
              maxLength={SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS}
             data-testid="superadmin-communication-communication-whatsapp-templates-superadmin-superadmincommunicationwhatsapptemplatespageclient-123-textarea-5"/>
            <p className={`eng-char-count${active.body.length > SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS * 0.9 ? ' eng-char-count--warn' : ''}`}>
              {active.body.length} / {SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATES_PAGE_CLIENT_MAX_CHARS} {tCopy("COPY.CHARACTERS")}
            </p>
          </div>

          <div className="eng-tpl-section">
            <p className="eng-label" id="whatsapp-template-insert-variable-label">{tCopy("COPY.INSERT_VARIABLE")}</p>
            <div className="eng-tpl-var-row">
              {SUPERADMIN_COMMUNICATION_TEMPLATE_VARIABLES.map((v) => (
                <button type="button" key={v} onClick={() => insertVar(v)} className="eng-var-chip" data-testid={`superadmin-communication-communication-whatsapp-templates-insert-var-6-${String(v)}`}>{v}</button>
              ))}
            </div>
          </div>

          <div className="eng-info-box eng-tpl-section">
            {tCopy("COPY.USE_VARIABLES_TO_PERSONALIZE_MESSAGES_E_G")} <em>{tCopy("COPY.QUOT_HI")} {'{name}'}{tCopy("COPY.YOUR_FEE_OF")}{'{amount}'} {tCopy("COPY.IS_DUE_ON")} {'{duedate}'}{tCopy("COPY.QUOT")}</em>
          </div>

          <div className="eng-tpl-section">
            <p className="eng-label">{tCopy("COPY.PREVIEW_SAMPLE_VALUES")}</p>
            <div className="eng-tpl-preview">{preview}</div>
          </div>

          <div className="eng-card-footer eng-card-footer--end">
            <button type="button" onClick={() => setShowTest(true)} className="eng-btn-ghost" data-testid="superadmin-communication-communication-whatsapp-templates-send-test-message-7">
              <Send size={14} /> {tCopy("COPY.SEND_TEST_MESSAGE")}
            </button>
            <button type="button" disabled title={tCopy("COPY.SAMPLE_TEMPLATE_CONTENT_ONLY_CHANGES_REMAIN_IN_THIS_PAGE_STATE_NO_SERVER_SIDE_TEMPLATE_OR_MESSAGING_INTEGRATION_WAS_SUPPLIED")} className="eng-btn-primary disabled:opacity-50 disabled:cursor-not-allowed" data-testid="superadmin-communication-communication-whatsapp-templates-preview-updated-8">
              <Save size={14} /> {tCopy("COPY.SAVE_TEMPLATE")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
