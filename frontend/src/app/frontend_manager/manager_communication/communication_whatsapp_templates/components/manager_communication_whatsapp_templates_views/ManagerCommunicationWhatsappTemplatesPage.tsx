'use client';

import { CheckCircle2, Coins, Handshake, Megaphone, Receipt, RotateCcw, Save, Send, Sparkles, UserX, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

import { MANAGER_COMMUNICATION_TEMPLATE_VARIABLES } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/constants/ManagerCommunicationWhatsappTemplatesConstants';
import {
  MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES,
  type Template,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDemoRepository';
import type { ManagerCommunicationWhatsappTemplatesRouteQueryProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesComponentTypes';
import { ManagerCommunicationWhatsappTemplatesVariablePreview } from './ManagerCommunicationWhatsappTemplatesVariablePreview';
import { ManagerCommunicationWhatsappTemplatesSidebar } from './ManagerCommunicationWhatsappTemplatesSidebar';
import { VARIABLE_CHIP_CONFIGS, TEMPLATE_CONFIGS } from './ManagerCommunicationWhatsappTemplatesConfig';
import { ManagerCommunicationWhatsappTemplatesTestModal } from './ManagerCommunicationWhatsappTemplatesTestModal';

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
  const [activeId, setActiveId] = useState('welcome');
  const [showTest, setShowTest] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const active = templates.find((t) => t.id === activeId) || templates[0];
  const charCount = active.body.length;
  const activeConfig = TEMPLATE_CONFIGS[active.id] || TEMPLATE_CONFIGS.welcome;

  const updateBody = (body: string) =>
    setTemplates((prev) => prev.map((t) => (t.id === activeId ? { ...t, body } : t)));

  const insertVar = (v: string) => {
    const el = textareaRef.current;
    if (!el) {
      if (active.body.length + v.length <= MAX_CHARS) updateBody(active.body + v);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nextBody = active.body.slice(0, start) + v + active.body.slice(end);
    if (nextBody.length > MAX_CHARS) return;
    updateBody(nextBody);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + v.length, start + v.length);
    }, 0);
  };

  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const handleSave = () => {
    toast.success(`Template "${templateLabel(active)}" saved successfully!`);
    setToastFeedback(`Template "${templateLabel(active)}" saved successfully!`);
    setTimeout(() => setToastFeedback(null), 4000);
  };

  const handleTest = () => {
    const clean = testPhone.replace(/\D/g, '');
    if (clean.length !== 10 || !/^[6-9]\d{9}$/.test(clean)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    toast.success(`Test WhatsApp template message dispatched to +91 ${clean}!`);
    setShowTest(false);
    setTestPhone('');
  };

  const preview = active.body
    .replace(/{(?:name|student_name|student)}/g, 'Rahul Sharma')
    .replace(/{(?:amount|fee|fees)}/g, '₹1,000')
    .replace(/{(?:duedate|due_date|date)}/g, '15-Apr-2026')
    .replace(/{(?:planname|plan)}/g, 'Monthly Plan')
    .replace(/{(?:libraryname|branch)}/g, 'Library OS')
    .replace(/{(?:phone|mobile)}/g, '+91 98765 43210')
    .replace(/{(?:seat|seat_no)}/g, 'S-03');

  return (
    <div
      className="mgr-page-animate relative pb-12 space-y-6 max-w-7xl mx-auto"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {tManagerUi('whatsapp_templates')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <ShieldCheck size={13} /> Cost Protection Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            System API triggers auto-dispatch 1x on critical events. Reminders & follow-ups use Free WhatsApp Web.
          </p>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowTest(true)}
            className="mgr-btn-outline inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex-1 sm:flex-initial"
          >
            <Send size={14} className="text-emerald-400" />
            <span>{tManagerUi('send_test')}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="mgr-btn-primary inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-5 rounded-xl shadow-sm cursor-pointer transition-all flex-1 sm:flex-initial"
          >
            <Save size={14} />
            <span>Save Template</span>
          </button>
        </div>
      </div>

      {toastFeedback && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold motion-safe:animate-fade-in"
          role="status"
        >
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{toastFeedback}</span>
        </div>
      )}

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ManagerCommunicationWhatsappTemplatesSidebar
          templates={templates}
          activeId={activeId}
          setActiveId={setActiveId}
          templateConfigs={TEMPLATE_CONFIGS}
          templateLabel={templateLabel}
        />

        {/* Right Column: Template Editor & Live Preview */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          <div className="mgr-card p-6 border border-border space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${activeConfig.iconBox}`}>
                  {activeConfig.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      {templateLabel(active)}
                    </h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeConfig.badge}`}>
                      {activeConfig.conditionTag}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5">{activeConfig.conditionDesc}</p>
                </div>
              </div>
            </div>

            {/* Message Body Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="whatsapp-template-body-input" className="text-xs font-semibold text-primary">
                  {tManagerUi('message_body')}
                </label>
                <span className={`text-xs font-mono font-medium ${charCount > MAX_CHARS * 0.9 ? 'text-amber-400 font-bold' : 'text-secondary'}`}>
                  {charCount} / {MAX_CHARS} {tManagerUi('characters')}
                </span>
              </div>
              <textarea
                id="whatsapp-template-body-input"
                ref={textareaRef}
                className="mgr-input h-36 text-sm leading-relaxed rounded-xl font-sans resize-none py-3 px-3.5 w-full bg-surface/50 border border-border focus:border-primary"
                rows={5}
                value={active.body}
                onChange={(e) => updateBody(e.target.value)}
                maxLength={MAX_CHARS}
                placeholder="Type WhatsApp message template body..."
              />
            </div>

            {/* Variable Chips Inserter */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary" id="manager-whatsapp-template-variables-label">
                  {tManagerUi('insert_variable')}
                </p>
                <span className="text-[11px] text-secondary">Click any chip to insert at cursor</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VARS.map((v) => {
                  const style = VARIABLE_CHIP_CONFIGS[v] || {
                    bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/25', hover: 'hover:bg-primary/20 hover:border-primary/40', title: v,
                  };
                  return (
                    <button
                      type="button"
                      key={v}
                      onClick={() => insertVar(v)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-150 cursor-pointer shadow-xs border ${style.bg} ${style.text} ${style.border} ${style.hover} active:scale-95`}
                      title={`Click to insert ${v} (${style.title})`}
                    >
                      <span className="font-bold opacity-80">+</span>
                      <span>{v}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTest(true)}
                className="mgr-btn-outline inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all w-full sm:w-auto"
              >
                <Send size={13} className="text-emerald-400" />
                <span>{tManagerUi('send_test')}</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="mgr-btn-primary inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold py-2.5 px-6 rounded-xl shadow-sm cursor-pointer transition-all w-full sm:w-auto"
              >
                <Save size={13} />
                <span>Save Template</span>
              </button>
            </div>
          </div>

          <ManagerCommunicationWhatsappTemplatesVariablePreview
            body={active.body}
            onUpdateBody={updateBody}
          />
        </div>
      </div>

      <ManagerCommunicationWhatsappTemplatesTestModal
        isOpen={showTest}
        onClose={() => setShowTest(false)}
        activeTemplate={active}
        templateLabel={templateLabel(active)}
        testPhone={testPhone}
        setTestPhone={setTestPhone}
        onSendTest={handleTest}
        previewText={preview}
        tManagerUi={tManagerUi}
      />
    </div>
  );
}
