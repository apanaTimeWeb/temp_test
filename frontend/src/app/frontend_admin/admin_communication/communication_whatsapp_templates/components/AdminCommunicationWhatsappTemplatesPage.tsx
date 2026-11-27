'use client';

import AdminCommunicationWhatsappTemplatesCard from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesCard';
import AdminCommunicationWhatsappTemplatesEditModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesEditModal';
import AdminCommunicationWhatsappTemplatesKpiGrid from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesKpiGrid';
import AdminCommunicationWhatsappTemplatesTestModal from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/components/AdminCommunicationWhatsappTemplatesTestModal';
import { ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/constants/AdminCommunicationWhatsappTemplatesConstants';
import useAdminCommunicationWhatsappTemplateState from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/hooks/useAdminCommunicationWhatsappTemplatesWhatsappTemplateState';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';
import { isAdminCommunicationPhoneNumberValid } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/utils/AdminCommunicationWhatsappTemplatesWhatsappPhoneUtils';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { CheckCircle2, MessageSquare, Plus, Search, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminCommunicationWhatsappTemplate | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTrigger, setFormTrigger] = useState('');
  const [formBody, setFormBody] = useState('');

  const showToast = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => { setToast(''); toastTimeoutRef.current = null; }, 3000);
  };

  const getTemplateLabel = useCallback((tmpl: AdminCommunicationWhatsappTemplate) => {
    if (tmpl.customTitle?.trim()) return tmpl.customTitle.trim();
    try {
      const translated = t(tmpl.labelKey);
      return translated && !translated.startsWith('ADMIN_COMMUNICATION') ? translated : tmpl.labelKey;
    } catch {
      return tmpl.labelKey;
    }
  }, [t]);

  const formatPreview = (rawBody: string) =>
    rawBody
      .replace(/{name}/g, 'Rahul Sharma')
      .replace(/{amount}/g, '1,000')
      .replace(/{duedate}/g, '25-Apr-2026')
      .replace(/{planname}/g, 'Full Day Dedicated')
      .replace(/{libraryname}/g, ADMIN_BRAND_CONFIG.displayName || 'Smart Library')
      .replace(/{phone}/g, '+91 98765 43210')
      .replace(/{seat}/g, 'S-08');

  const handleTest = () => {
    if (!isAdminCommunicationPhoneNumberValid(testPhone)) {
      showToast(t('WHATSAPP_TEST_PHONE_INVALID'));
      return;
    }
    const activeTemplate = templates.find((tmpl) => tmpl.id === activeId) || templates[0];
    const waUrl = `https://wa.me/91${testPhone}?text=${encodeURIComponent(formatPreview(activeTemplate.body))}`;
    if (typeof window !== 'undefined') window.open(waUrl, '_blank', 'noopener,noreferrer');
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
            ? { ...tmpl, customTitle: formTitle.trim(), category: formCategory.trim() || 'General', triggerEvent: formTrigger.trim(), body: formBody.trim() }
            : tmpl
        )
      );
      showToast(`Template "${formTitle}" updated successfully`);
    } else {
      const newTmpl: AdminCommunicationWhatsappTemplate = {
        id: `custom_${Date.now()}`,
        labelKey: 'WHATSAPP_TEMPLATE_NOTICE',
        customTitle: formTitle.trim(),
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

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((tmpl) => { if (tmpl.category) set.add(tmpl.category); });
    return Array.from(set);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return templates.filter((tmpl) => {
      const matchesCategory = selectedCategory === 'ALL' || tmpl.category === selectedCategory;
      const label = getTemplateLabel(tmpl).toLowerCase();
      const matchesSearch =
        q === '' ||
        tmpl.id.toLowerCase().includes(q) ||
        label.includes(q) ||
        tmpl.body.toLowerCase().includes(q) ||
        Boolean(tmpl.triggerEvent && tmpl.triggerEvent.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery, getTemplateLabel]);

  return (
    <div className="min-w-0 space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-success bg-card px-4 py-3 text-xs font-bold text-text-primary shadow-toast flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={16} className="text-success-text shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      <p className="sr-only" role="status">{t('WHATSAPP_TEMPLATES_PREVIEW_BANNER')}</p>

      <AdminCommunicationWhatsappTemplatesTestModal showTest={showTest} setShowTest={setShowTest} testPhone={testPhone} setTestPhone={setTestPhone} onSendTest={handleTest} />
      <AdminCommunicationWhatsappTemplatesEditModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} editingTemplate={editingTemplate} formTitle={formTitle} setFormTitle={setFormTitle} formCategory={formCategory} setFormCategory={setFormCategory} formTrigger={formTrigger} setFormTrigger={setFormTrigger} formBody={formBody} setFormBody={setFormBody} onSaveTemplate={handleSaveTemplate} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-success-bg border border-success flex items-center justify-center text-success-text">
              <MessageSquare size={18} />
            </div>
            <span>{t('WHATSAPP_TEMPLATES_TITLE')}</span>
          </h1>
          <p className="mt-1 text-xs text-text-secondary">{t('WHATSAPP_TEMPLATES_SUBTITLE')}</p>
        </div>

        <button
          type="button"
          data-testid="admin_communication-add-template-btn"
          onClick={openCreateTemplate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-success px-3.5 py-1.5 text-xs font-semibold text-on-primary shadow-lg hover:opacity-90 motion-safe:transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Template</span>
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-success bg-success-bg px-3.5 py-2 text-xs font-medium text-success-text">
        <ShieldCheck className="h-4 w-4 text-success-text shrink-0" />
        <span><strong>Cost Protection Active:</strong> System API triggers 1x on critical events (Welcome/Admission). Follow-ups & announcements use Free WhatsApp Web (Zero API Cost).</span>
      </div>

      <AdminCommunicationWhatsappTemplatesKpiGrid
        templateCount={templates.length}
        categoryCount={categories.length}
        variableCount={ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.length}
      />

      <div className="rounded-2xl border border-border bg-card p-4 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold motion-safe:transition-all ${
                selectedCategory === 'ALL' ? 'bg-success-bg border border-success text-success-text' : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-card-hover'
              }`}
            >
              All Categories ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold motion-safe:transition-all ${
                  selectedCategory === cat ? 'bg-success-bg border border-success text-success-text' : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-card-hover'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              maxLength={100}
              type="text"
              placeholder="Search templates or triggers..."
              aria-label="Search templates"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-input pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTemplates.map((template) => (
          <AdminCommunicationWhatsappTemplatesCard
            key={template.id}
            template={template}
            isSelected={activeId === template.id}
            onCopy={copyTemplateToClipboard}
            onEdit={openEditTemplate}
            onTest={(id) => { setActiveId(id); setShowTest(true); }}
            formatPreview={formatPreview}
          />
        ))}
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappTemplatesPage;
