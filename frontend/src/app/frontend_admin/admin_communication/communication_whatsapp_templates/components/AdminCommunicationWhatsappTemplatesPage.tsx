'use client';

import AdminCommunicationWhatsappTemplatesCard from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesCard';
import AdminCommunicationWhatsappTemplatesEditModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesEditModal';
import AdminCommunicationWhatsappTemplatesTestModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesTestModal';
import {
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import useAdminCommunicationWhatsappTemplateState from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/hooks/useAdminCommunicationWhatsappTemplatesWhatsappTemplateState';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';
import { isAdminCommunicationPhoneNumberValid } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/utils/AdminCommunicationWhatsappTemplatesWhatsappPhoneUtils';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import {
  CheckCircle2,
  FileText,
  Layers,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';

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

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create / Edit Template State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminCommunicationWhatsappTemplate | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTrigger, setFormTrigger] = useState('');
  const [formBody, setFormBody] = useState('');

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast('');
      toastTimeoutRef.current = null;
    }, 3000);
  };

  const getTemplateLabel = (tmpl: AdminCommunicationWhatsappTemplate) => {
    try {
      const translated = t(tmpl.labelKey);
      return translated && !translated.startsWith('ADMIN_COMMUNICATION') ? translated : tmpl.labelKey;
    } catch {
      return tmpl.labelKey;
    }
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

  const handleTest = () => {
    if (!isAdminCommunicationPhoneNumberValid(testPhone)) {
      showToast(t('WHATSAPP_TEST_PHONE_INVALID'));
      return;
    }
    const activeTemplate = templates.find((tmpl) => tmpl.id === activeId) || templates[0];
    const previewMessage = formatPreview(activeTemplate.body);
    const waUrl = `https://wa.me/91${testPhone}?text=${encodeURIComponent(previewMessage)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
    showToast(`Test dispatch opened in WhatsApp Web for +91 ${testPhone}`);
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

  const openTestForTemplate = (id: string) => {
    setActiveId(id);
    setShowTest(true);
  };

  const openCreateTemplate = () => {
    setEditingTemplate(null);
    setFormTitle('');
    setFormCategory('Announcements');
    setFormTrigger('Manual notification or event trigger');
    setFormBody('Hello {name},\n\nThis is an official communication regarding your seat {seat} at {libraryname}.\n\nThank you,\nAdministration');
    setShowEditModal(true);
  };

  const openEditTemplate = (tmpl: AdminCommunicationWhatsappTemplate) => {
    setEditingTemplate(tmpl);
    setFormTitle(getTemplateLabel(tmpl));
    setFormCategory(tmpl.category || 'General');
    setFormTrigger(tmpl.triggerEvent || '');
    setFormBody(tmpl.body);
    setShowEditModal(true);
  };

  const handleSaveTemplate = () => {
    if (!formTitle.trim() || !formBody.trim()) {
      showToast('Template title and body are required');
      return;
    }
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((tmpl) =>
          tmpl.id === editingTemplate.id
            ? {
                ...tmpl,
                labelKey: formTitle as any,
                category: formCategory.trim() || 'General',
                triggerEvent: formTrigger.trim(),
                body: formBody.trim(),
              }
            : tmpl
        )
      );
      showToast(`Template "${formTitle}" updated successfully`);
    } else {
      const newId = `custom_${Date.now()}`;
      const newTmpl: AdminCommunicationWhatsappTemplate = {
        id: newId as any,
        labelKey: formTitle as any,
        icon: '💬',
        category: formCategory.trim() || 'General',
        triggerEvent: formTrigger.trim(),
        dispatchMode: 'manual_free_web',
        body: formBody.trim(),
      };
      setTemplates((prev) => [newTmpl, ...prev]);
      showToast(`Template "${formTitle}" created successfully`);
    }
    setShowEditModal(false);
  };

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
      const label = getTemplateLabel(tmpl).toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        tmpl.id.toLowerCase().includes(q) ||
        label.includes(q) ||
        tmpl.body.toLowerCase().includes(q) ||
        (tmpl.triggerEvent && tmpl.triggerEvent.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

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
      <AdminCommunicationWhatsappTemplatesTestModal
        showTest={showTest}
        setShowTest={setShowTest}
        testPhone={testPhone}
        setTestPhone={setTestPhone}
        onSendTest={handleTest}
      />

      {/* Create / Edit Template Modal */}
      <AdminCommunicationWhatsappTemplatesEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingTemplate={editingTemplate}
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formTrigger={formTrigger}
        setFormTrigger={setFormTrigger}
        formBody={formBody}
        setFormBody={setFormBody}
        onSaveTemplate={handleSaveTemplate}
      />

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="admin_communication-add-template-btn"
            onClick={openCreateTemplate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Cost Protection Banner */}
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-300">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span><strong>Cost Protection Active:</strong> System API triggers 1x on critical events (Welcome/Admission). Follow-ups & announcements use Free WhatsApp Web (Zero API Cost).</span>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Templates - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40">
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Templates</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
              <FileText size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-white">{templates.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
              Welcome & Official Notices
            </span>
          </div>
        </div>

        {/* Template Categories - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40">
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Template Categories</span>
            <div className="p-2.5 rounded-xl border shrink-0 bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
              <Layers size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">{categories.length}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
              Onboarding & Announcements
            </span>
          </div>
        </div>

        {/* Dynamic Variables - Purple */}
        <div className="group relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 p-5 shadow-lg shadow-purple-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTemplates.map((template) => (
          <AdminCommunicationWhatsappTemplatesCard
            key={template.id}
            template={template}
            isSelected={activeId === template.id}
            onCopy={copyTemplateToClipboard}
            onEdit={openEditTemplate}
            onTest={openTestForTemplate}
            formatPreview={formatPreview}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminCommunicationWhatsappTemplatesPage;
