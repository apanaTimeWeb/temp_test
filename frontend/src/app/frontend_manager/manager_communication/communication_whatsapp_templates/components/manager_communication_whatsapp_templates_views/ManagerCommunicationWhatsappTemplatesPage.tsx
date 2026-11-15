'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Sparkles,
  Coins,
  RotateCcw,
  Receipt,
  Megaphone,
  UserX,
  Handshake,
  Send,
  Save,
  CheckCircle2,
  X,
  ChevronRight,
  CheckCheck,
  Smartphone,
} from 'lucide-react';

import {
  MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES,
  type Template,
} from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDemoRepository';
import { MANAGER_COMMUNICATION_TEMPLATE_VARIABLES } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/constants/ManagerCommunicationWhatsappTemplatesConstants';
import { useManagerWhatsappTemplatesDialogFocus } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDialogFocus';
import type { ManagerCommunicationWhatsappTemplatesRouteQueryProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/types/ManagerCommunicationWhatsappTemplatesComponentTypes';

const VARS = MANAGER_COMMUNICATION_TEMPLATE_VARIABLES;
const INIT = MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES;
const MAX_CHARS = 1024;

interface TemplateMeta {
  icon: React.ReactNode;
  conditionTag: string;
  conditionDesc: string;
  badge: string;
  iconBox: string;
  accentBorder: string;
  ring: string;
}

const TEMPLATE_CONFIGS: Record<string, TemplateMeta> = {
  welcome: {
    icon: <Sparkles size={16} />,
    conditionTag: 'Onboarding',
    conditionDesc: 'Fires on new admission & seat allocation',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    accentBorder: 'border-l-4 border-l-emerald-500',
    ring: 'ring-emerald-500/20 border-emerald-500/40',
  },
  fee_reminder: {
    icon: <Coins size={16} />,
    conditionTag: 'Fee Due',
    conditionDesc: 'Fires 3 days before fee due date',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    accentBorder: 'border-l-4 border-l-amber-500',
    ring: 'ring-amber-500/20 border-amber-500/40',
  },
  renewal: {
    icon: <RotateCcw size={16} />,
    conditionTag: 'Plan Expiry',
    conditionDesc: 'Fires when membership tenure is expiring',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    iconBox: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    accentBorder: 'border-l-4 border-l-purple-500',
    ring: 'ring-purple-500/20 border-purple-500/40',
  },
  receipt: {
    icon: <Receipt size={16} />,
    conditionTag: 'Transaction',
    conditionDesc: 'Fires instantly upon fee or fine payment',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    iconBox: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    accentBorder: 'border-l-4 border-l-cyan-500',
    ring: 'ring-cyan-500/20 border-cyan-500/40',
  },
  notice: {
    icon: <Megaphone size={16} />,
    conditionTag: 'Broadcast',
    conditionDesc: 'Fires on general announcements or branch notices',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    iconBox: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    accentBorder: 'border-l-4 border-l-indigo-500',
    ring: 'ring-indigo-500/20 border-indigo-500/40',
  },
  absentee: {
    icon: <UserX size={16} />,
    conditionTag: 'Attendance',
    conditionDesc: 'Fires to parent when student is absent 3+ days',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    accentBorder: 'border-l-4 border-l-rose-500',
    ring: 'ring-rose-500/20 border-rose-500/40',
  },
  ptp: {
    icon: <Handshake size={16} />,
    conditionTag: 'Promise to Pay',
    conditionDesc: 'Fires on promised commitment date arrival',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
    iconBox: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
    accentBorder: 'border-l-4 border-l-orange-500',
    ring: 'ring-orange-500/20 border-orange-500/40',
  },
};

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
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerWhatsappTemplatesDialogFocus(dialogRef, () => setShowTest(false), showTest);

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
    .replace(/{name}/g, 'Rahul Sharma')
    .replace(/{amount}/g, '₹1,000')
    .replace(/{duedate}/g, '15-Apr-2026')
    .replace(/{planname}/g, 'Monthly Plan')
    .replace(/{libraryname}/g, 'Library OS')
    .replace(/{phone}/g, '+91 98765 43210')
    .replace(/{seat}/g, 'S-03');

  return (
    <div
      className="mgr-page-animate relative pb-12 space-y-6 max-w-7xl mx-auto"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {tManagerUi('whatsapp_templates')}
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Customize message templates sent to students.
          </p>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowTest(true)}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl cursor-pointer hover:bg-surface-hover transition-colors"
          >
            <Send size={14} className="text-secondary" />
            <span>{tManagerUi('send_test')}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="mgr-btn-primary inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-4 rounded-xl shadow-sm cursor-pointer"
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

      {/* Master-Detail Layout: Left Conditions Sidebar + Right Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Template Conditions Sidebar (4 of 12 columns) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Trigger Conditions ({templates.length})
            </span>
            <span className="text-[11px] text-secondary">Select to customize</span>
          </div>

          <div className="space-y-2">
            {templates.map((t) => {
              const config = TEMPLATE_CONFIGS[t.id] || TEMPLATE_CONFIGS.welcome;
              const isActive = activeId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  aria-pressed={isActive}
                  className={`w-full p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between border ${
                    isActive
                      ? `bg-card ${config.accentBorder} shadow-md ring-1 ${config.ring}`
                      : 'bg-card/70 border-border hover:bg-card hover:border-border-focus'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${config.iconBox}`}
                    >
                      {config.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-primary truncate">
                          {templateLabel(t)}
                        </span>
                      </div>
                      <p className="text-[11px] text-secondary truncate mt-0.5">
                        {config.conditionDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}
                    >
                      {config.conditionTag}
                    </span>
                    <ChevronRight
                      size={14}
                      className={isActive ? 'text-primary' : 'text-secondary/40'}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Template Editor & Live Preview (8 of 12 columns) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          {/* Editor Card */}
          <div className="mgr-card p-6 border border-border space-y-5 shadow-sm">
            {/* Active Template Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${activeConfig.iconBox}`}
                >
                  {activeConfig.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      {templateLabel(active)}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeConfig.badge}`}
                    >
                      {activeConfig.conditionTag}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5">
                    {activeConfig.conditionDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-secondary">
                  {tManagerUi('edit_the_message_body_use_variable_chips_to_personalize')}
                </span>
              </div>
            </div>

            {/* Message Body Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="whatsapp-template-body-input"
                  className="text-xs font-semibold text-primary"
                >
                  {tManagerUi('message_body')}
                </label>
                <span
                  className={`text-xs font-mono font-medium ${
                    charCount > MAX_CHARS * 0.9 ? 'text-amber-400 font-bold' : 'text-secondary'
                  }`}
                >
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
                <p
                  className="text-xs font-semibold text-primary"
                  id="manager-whatsapp-template-variables-label"
                >
                  {tManagerUi('insert_variable')}
                </p>
                <span className="text-[11px] text-secondary">Click any chip to insert at cursor</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VARS.map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => insertVar(v)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                    title={`Click to insert ${v}`}
                  >
                    <span>+</span>
                    <span>{v}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Tip */}
            <div className="p-3.5 rounded-xl bg-surface-highlight border border-border text-xs text-secondary leading-relaxed">
              <span>{tManagerUi('use_variables_to_personalize_messages_e_g')}</span>{' '}
              <span className="font-mono text-primary font-medium">
                "{tManagerUi('hi')} &#123;name&#125;, {tManagerUi('your_fee_of')} &#123;amount&#125;{' '}
                {tManagerUi('is_due_on')} &#123;duedate&#125;."
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTest(true)}
                className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer hover:bg-surface-hover transition-colors"
              >
                <Send size={13} className="text-secondary" />
                <span>{tManagerUi('send_test')}</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="mgr-btn-primary inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-5 rounded-xl shadow-sm cursor-pointer"
              >
                <Save size={13} />
                <span>Save Template</span>
              </button>
            </div>
          </div>

          {/* Live WhatsApp Chat Bubble Preview */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <p
                className="text-xs font-bold uppercase tracking-wider text-secondary"
                id="manager-whatsapp-template-preview-label"
              >
                {tManagerUi('preview_sample_values')}
              </p>
              <span className="text-xs text-secondary">
                WhatsApp Preview
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-[#0b141a] overflow-hidden shadow-md">
              {/* WhatsApp Business Header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    LO
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-slate-100">
                        Library OS Official
                      </span>
                      <span
                        className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold"
                        title="Verified Business"
                      >
                        ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Official Business Account</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Canvas */}
              <div className="p-4 sm:p-6 bg-[#0b141a] min-h-[150px] flex flex-col justify-end">
                {/* Outgoing WhatsApp Bubble */}
                <div className="max-w-md ml-auto bg-[#005c4b] text-slate-100 p-3.5 rounded-2xl rounded-tr-xs shadow-sm space-y-1.5 border border-[#005c4b]/50">
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-text font-normal">
                    {preview}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 pt-0.5">
                    <span>10:45 AM</span>
                    <CheckCheck size={14} className="text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Message Modal */}
      {showTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowTest(false)}
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manager-wa-test-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Smartphone size={16} />
                </div>
                <div>
                  <h2 id="manager-wa-test-title" className="text-base font-bold text-primary">
                    {tManagerUi('send_test_message')}
                  </h2>
                  <p className="text-[11px] text-secondary">
                    {templateLabel(active)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTest(false)}
                className="p-1 rounded-lg hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label={tManagerUi('close')}
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              {tManagerUi('enter_a_phone_number_to_send_a_test_version_of_this_temp_49ebdb')}
            </p>

            <div>
              <label htmlFor="test-phone-number-input" className="text-xs font-semibold text-primary block mb-1.5">
                {tManagerUi('phone_number')} (+91) *
              </label>
              <input
                id="test-phone-number-input"
                className="mgr-input h-11 text-sm font-mono w-full rounded-xl px-3.5"
                placeholder="9876543210"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                autoFocus
              />
            </div>

            {/* Preview Box Inside Modal */}
            <div className="p-3.5 rounded-xl bg-surface-highlight border border-border text-xs text-secondary space-y-1">
              <span className="font-semibold text-primary block text-[11px] uppercase tracking-wider">
                Message Preview:
              </span>
              <p className="line-clamp-3 text-xs leading-relaxed italic text-secondary">
                {preview}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTest(false)}
                className="mgr-btn-secondary text-xs h-10 px-4 rounded-xl cursor-pointer"
              >
                {tManagerUi('cancel')}
              </button>
              <button
                type="button"
                onClick={handleTest}
                className="mgr-btn-primary text-xs h-10 px-5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send size={14} />
                <span>{tManagerUi('send_test')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
