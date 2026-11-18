'use client';

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { useRef, useState, useMemo } from 'react';
import {
  X,
  Send,
  FileText,
  Layers,
  CheckCheck,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  Check,
  Paperclip,
  Smile,
  Mic,
  Copy,
  Sliders,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
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

  // Studio modal state for editing & phone simulation
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const copyTemplateToClipboard = (body: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(body);
      showToast(`"${label}" template copied to clipboard`);
    } else {
      showToast('Template copied');
    }
  };

  const openStudioForTemplate = (id: string) => {
    setActiveId(id);
    setIsStudioOpen(true);
  };

  const openTestForTemplate = (id: string) => {
    setActiveId(id);
    setShowTest(true);
  };

  const formatPreview = (rawBody: string) => {
    return rawBody
      .replace(/{name}/g, 'Rahul Sharma')
      .replace(/{amount}/g, '1,000')
      .replace(/{duedate}/g, '25-Apr-2026')
      .replace(/{planname}/g, 'Full Day Dedicated')
      .replace(/{libraryname}/g, ADMIN_BRAND_CONFIG.displayName || 'Smart Library')
      .replace(/{phone}/g, '+91 98765 43210')
      .replace(/{seat}/g, 'S-08');
  };

  const preview = formatPreview(active.body);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((tmpl) => {
      if (tmpl.category) set.add(tmpl.category);
    });
    return Array.from(set);
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tmpl) => {
      const matchesCategory = selectedCategory === 'ALL' || tmpl.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        tmpl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(tmpl.labelKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tmpl.triggerEvent && tmpl.triggerEvent.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery, t]);

  return (
    <div className="min-w-0 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-500/40 bg-slate-900/95 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      <p className="sr-only" role="status">
        {t('WHATSAPP_TEMPLATES_PREVIEW_BANNER')}
      </p>

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare size={18} />
            </div>
            <span>{t('WHATSAPP_TEMPLATES_TITLE')}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">{t('WHATSAPP_TEMPLATES_SUBTITLE')}</p>
        </div>

        {/* Quick Launch Studio Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
          >
            <Sliders size={14} />
            <span>Launch Template Studio</span>
            <ArrowUpRight size={14} className="opacity-70" />
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Templates - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Templates</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
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

        {/* Template Categories - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Template Categories</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <Layers size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">{categories.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              Lifecycle Workflows
            </span>
          </div>
        </div>

        {/* Dynamic Variables - Purple */}
        <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 p-5 shadow-lg shadow-purple-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40">
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:bg-purple-500/20" />
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dynamic Tokens</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-purple-500/15 border-purple-500/30 text-purple-400">
              <Layers size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-purple-400">
            {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.length}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-purple-300 bg-purple-500/10 border-purple-500/25">
              Auto-Populating Student Tags
            </span>
          </div>
        </div>
      </div>

      {/* Template Filter & Search Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Categories ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates or triggers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Templates Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => {
          const isSelected = activeId === template.id;
          const templatePreview = formatPreview(template.body);
          const lines = templatePreview.split('\n').filter((l) => l.trim().length > 0);
          const headline = lines[0] || '';
          const snippet = lines.slice(1, 4).join('\n');

          return (
            <div
              key={template.id}
              data-testid={`admin_communication-template-${template.id}`}
              className={`group flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-emerald-500/50 bg-gradient-to-b from-slate-900/90 to-slate-900/70 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                  : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80 shadow-md'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-800/60 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-2 rounded-xl bg-slate-800/70 border border-slate-700/60 shrink-0">
                      {template.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{t(template.labelKey)}</span>
                        <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                      </h3>
                      {template.category && (
                        <span className="text-[10px] font-semibold text-emerald-400/90 uppercase tracking-wider">
                          {template.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                    Approved
                  </span>
                </div>

                {template.triggerEvent && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock size={12} className="text-slate-500 shrink-0" />
                    <span className="truncate">Trigger: {template.triggerEvent}</span>
                  </div>
                )}
              </div>

              {/* Message Snippet Preview */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="rounded-xl border border-slate-800 bg-[#0b141a]/90 p-3 text-[11px] font-sans leading-relaxed text-slate-200 space-y-1.5">
                  <p className="font-bold text-emerald-300 truncate">{headline.replace(/\*/g, '')}</p>
                  <p className="line-clamp-4 text-slate-300 whitespace-pre-wrap font-sans">
                    {snippet.replace(/\*/g, '')}
                  </p>
                </div>

                {/* Tokens & Char count */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="font-mono text-slate-400">
                    {template.body.length} / {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS} chars
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-indigo-300">
                      7 Tokens
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-3 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => copyTemplateToClipboard(template.body, t(template.labelKey))}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                  title="Copy raw template"
                  aria-label="Copy template"
                >
                  <Copy size={14} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openTestForTemplate(template.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openStudioForTemplate(template.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all cursor-pointer"
                  >
                    <Sliders size={12} />
                    <span>Customize & Preview</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Template Studio & Live Smartphone Simulator Modal */}
      {isStudioOpen && (
        <Dialog open onOpenChange={setIsStudioOpen}>
          <DialogContent className="relative w-full max-w-5xl rounded-3xl border border-slate-800 bg-[#0d131f] p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl">
                  {active.icon}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{t(active.labelKey)}</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400">
                    Live WhatsApp Business Template Studio with real-time smartphone recipient simulator.
                  </DialogDescription>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                aria-label="Close studio"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Switcher Tabs Inside Studio */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  data-testid={`admin_communication-template-${tmpl.id}`}
                  onClick={() => setActiveId(tmpl.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeId === tmpl.id
                      ? 'border border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{tmpl.icon}</span>
                  <span>{t(tmpl.labelKey)}</span>
                </button>
              ))}
            </div>

            {/* Studio Workspace: Left Editor (58%) | Right Smartphone Mockup (42%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Template Editor */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                    htmlFor="admin-communication-template-body"
                  >
                    {t('WHATSAPP_MESSAGE_BODY')}
                  </label>
                  <span
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      charCount > ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS
                        ? 'border-red-500/50 bg-red-500/10 text-red-400'
                        : 'border-slate-700 bg-slate-800 text-slate-300'
                    }`}
                  >
                    {charCount} / {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS} chars
                  </span>
                </div>

                <textarea
                  id="admin-communication-template-body"
                  ref={textareaRef}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed shadow-inner"
                  rows={9}
                  value={active.body}
                  onChange={(e) => updateBody(e.target.value)}
                  maxLength={ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS}
                />

                {/* Dynamic Token Inserters */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3.5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers size={13} className="text-indigo-400" />
                    {t('WHATSAPP_INSERT_VARIABLE')} (Click to insert at cursor)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.map((v) => (
                      <button
                        data-testid={`admin_communication-template-variable-${v
                          .replace(/[^a-z0-9]+/gi, '-')
                          .toLowerCase()}`}
                        key={v}
                        type="button"
                        onClick={() => insertVar(v)}
                        className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 pt-0.5">
                    Tokens are resolved dynamically with recipient member records during automated dispatch.
                  </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => copyTemplateToClipboard(active.body, t(active.labelKey))}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Copy Text</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      data-testid="admin_communication-page-control-006"
                      onClick={() => setShowTest(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm cursor-pointer"
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
                        <span className="text-[9px] text-emerald-400 block font-normal leading-none">
                          Official Business Account
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Bubble Area with WhatsApp Dark Wallpaper */}
                  <div className="p-3 min-h-[340px] max-h-[400px] overflow-y-auto flex flex-col justify-end bg-gradient-to-b from-[#0b141a] to-[#080d11]">
                    <div className="relative self-end max-w-[94%] rounded-2xl rounded-tr-xs bg-[#005c4b] p-3 text-[11px] leading-relaxed text-slate-100 shadow-md">
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
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <Smartphone size={12} className="text-emerald-400" />
                  Live recipient WhatsApp smartphone simulation
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AdminCommunicationWhatsappTemplatesPage;
