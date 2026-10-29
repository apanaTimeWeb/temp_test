'use client';
import { MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES, type Template } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDemoRepository';
import { MANAGER_COMMUNICATION_TEMPLATE_VARIABLES } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/constants/ManagerCommunicationWhatsappTemplatesConstants';
import { useTranslations } from 'next-intl';

import { useState, useRef } from 'react';
import { useManagerWhatsappTemplatesDialogFocus } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDialogFocus';
import { ChevronRight, X, Send } from 'lucide-react';
import type { ManagerCommunicationWhatsappTemplatesRouteQueryProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesComponentTypes';




const VARS = MANAGER_COMMUNICATION_TEMPLATE_VARIABLES;

const INIT = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES;

const MAX_CHARS = 1024;


export default function ManagerCommunicationWhatsappTemplatesPage(_routeQuery: ManagerCommunicationWhatsappTemplatesRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_whatsapp_templates.ui');
  const templateLabel = (template: Template) => {
    switch (template.id) {
      case 'welcome': return tManagerUi('template_label_welcome_message');
      case 'fee_reminder': return tManagerUi('template_label_fee_reminder');
      case 'renewal': return tManagerUi('template_label_renewal_alert');
      case 'receipt': return tManagerUi('template_label_payment_receipt');
      case 'notice': return tManagerUi('template_label_notice_broadcast');
      case 'absentee': return tManagerUi('template_label_absentee_parent_alert');
      case 'ptp': return tManagerUi('template_label_ptp_payment_reminder');
      default: return template.label;
    }
  };
  const [templates, setTemplates] = useState<Template[]>(INIT);
  const [activeId, setActiveId]   = useState('welcome');
  const [showTest, setShowTest]   = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerWhatsappTemplatesDialogFocus(dialogRef, () => setShowTest(false), showTest);

  const active    = templates.find(t => t.id === activeId)!;
  const charCount = active.body.length;


  const updateBody = (body: string) =>
    setTemplates(prev => prev.map(t => t.id === activeId ? { ...t, body } : t));

  const insertVar = (v: string) => {
    const el = textareaRef.current;
    if (!el) { if (active.body.length + v.length <= MAX_CHARS) updateBody(active.body + v); return; }
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const nextBody = active.body.slice(0, start) + v + active.body.slice(end);
    if (nextBody.length > MAX_CHARS) return;
    updateBody(nextBody);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + v.length, start + v.length); }, 0);
  };

  const handleSave = () => {
    // Template persistence is unavailable until a verified host API contract is supplied.
  };

  const handleTest = () => {
    // Sending a test message is unavailable until a verified messaging contract is supplied.
  };

  const preview = active.body
    .replace(/{name}/g, 'Rahul Sharma')
    .replace(/{amount}/g, '1000')
    .replace(/{duedate}/g, '15-Apr-2026')
    .replace(/{planname}/g, 'Monthly')
    .replace(/{libraryname}/g, 'Library OS')
    .replace(/{phone}/g, '+91 9000000000')
    .replace(/{seat}/g, 'S-03');

  return (
    <div className="mc-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
<p role="status" className="mc-input-hint mc-text-warning mb-4" data-testid="manager-communication-template-contract-warning">{tManagerUi('template_edits_are_draft_only_saving_templates_and_sendi_b21f71')}</p>
<p role="status" className="mc-input-hint mb-4">{tManagerUi('template_bodies_are_sample_english_copy')}</p>

      {/* Test Message Modal */}
      {showTest && (
        <div className="mc-overlay">
          <div ref={dialogRef} tabIndex={-1} className="mc-modal mc-modal--sm" role="dialog" aria-modal="true" aria-labelledby="manager-wa-test-title">
            <button type="button" onClick={() => setShowTest(false)} className="mc-modal-close" aria-label={tManagerUi('close')}><X size={16} /></button>
            <h2 id="manager-wa-test-title" className="mc-modal-title">{tManagerUi('send_test_message')}</h2>
            <p className="mc-modal-desc">{tManagerUi('enter_a_phone_number_to_send_a_test_version_of_this_temp_49ebdb')}</p>
            <div>
              <label className="mc-label" htmlFor="rbg4-managercommunicationwhatsapptemplatespage-76">{tManagerUi('phone_number')}</label>
              <input id="rbg4-managercommunicationwhatsapptemplatespage-76" className="mc-input" placeholder="+91 9000000000"
                value={testPhone} onChange={e => setTestPhone(e.target.value)} />
            </div>
            <div className="mc-modal-footer">
              <button type="button" onClick={() => setShowTest(false)} className="mc-btn-ghost">{tManagerUi('cancel')}</button>
              <button type="button" onClick={handleTest} className="mc-btn-primary cursor-not-allowed" disabled title={tManagerUi('sending_unavailable_host_messaging_contract_not_supplied')}>
                <Send size={14} /> {tManagerUi('send_test')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="mc-breadcrumb">
          <span>{tManagerUi('communication')}</span><ChevronRight size={12} /><span>{tManagerUi('whatsapp_templates_e0bade')}</span>
        </div>
        <h1 className="mc-page-title">{tManagerUi('whatsapp_templates')}</h1>
        <p className="mc-page-subtitle">{tManagerUi('customize_automated_message_templates_sent_to_students')}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Top Filter Bar */}
        <div className="mc-tpl-topbar flex flex-wrap gap-3">
          {templates.map(t => (
            <button key={t.id} type="button" onClick={() => setActiveId(t.id)}
              aria-pressed={activeId === t.id}
              className={`mc-tpl-item w-auto px-4 py-2 rounded-full${activeId === t.id ? ' mc-tpl-item--active' : ''}`}>
              <span aria-hidden="true">{t.icon}</span> {templateLabel(t)}
            </button>
          ))}
        </div>

        {/* Right Editor */}
        <div className="mc-card mc-flex-1">
          <div className="mc-card-header">
            <h2 className="mc-card-title">{active.icon} {templateLabel(active)}</h2>
            <p className="mc-card-desc">{tManagerUi('edit_the_message_body_use_variable_chips_to_personalize')}</p>
          </div>

          <div>
            <label className="mc-label" htmlFor="rbg4-managercommunicationwhatsapptemplatespage-118">{tManagerUi('message_body')}</label>
            <textarea id="rbg4-managercommunicationwhatsapptemplatespage-118"
              ref={textareaRef}
              className="mc-textarea"
              rows={8}
              value={active.body}
              onChange={e => updateBody(e.target.value)}
              maxLength={MAX_CHARS}
            />
            <p className={`mc-char-count${charCount > MAX_CHARS * 0.9 ? ' mc-char-count--warn' : ''}`}>
              {charCount} / {MAX_CHARS} {tManagerUi('characters')}
            </p>
          </div>

          <div className="mc-tpl-section">
            <p className="mc-label" id="manager-whatsapp-template-variables-label">{tManagerUi('insert_variable')}</p>
            <div className="mc-tpl-var-row">
              {VARS.map(v => (
                <button type="button" key={v} onClick={() => insertVar(v)} className="mc-var-chip">{v}</button>
              ))}
            </div>
          </div>

          <div className="mc-info-box mc-tpl-section">
            {tManagerUi('use_variables_to_personalize_messages_e_g')} <em>{tManagerUi('hi')} {'{'}{tManagerUi('name')}{'}'} {tManagerUi('your_fee_of')} {'{'}{tManagerUi('amount')}{'}'} {tManagerUi('is_due_on')} {'{'}{tManagerUi('duedate')}{'}'} {tManagerUi('label')}</em>
          </div>

          <div className="mc-tpl-section">
            <p className="mc-label" id="manager-whatsapp-template-preview-label">{tManagerUi('preview_sample_values')}</p>
            <div className="mc-tpl-preview">{preview}</div>
          </div>

          <div className="mc-card-footer mc-card-footer--end">
            <button type="button" onClick={() => setShowTest(true)} title={tManagerUi('sending_unavailable_host_messaging_contract_not_supplied')} className="mc-btn-ghost">{tManagerUi('send_test')}</button>
            <button type="button" onClick={handleSave} disabled title={tManagerUi('save_unavailable_host_template_persistence_contract_not_59ac1d')} className="mc-btn-primary cursor-not-allowed">{tManagerUi('save_unavailable')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
