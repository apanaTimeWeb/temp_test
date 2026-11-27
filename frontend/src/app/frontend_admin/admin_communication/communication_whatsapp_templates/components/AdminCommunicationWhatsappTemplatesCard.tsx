'use client';

import { ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { CheckCheck, Clock, Copy, Edit2, Send, Server, ShieldCheck, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface AdminCommunicationWhatsappTemplatesCardProps {
  template: AdminCommunicationWhatsappTemplate;
  isSelected: boolean;
  onCopy: (body: string, label: string) => void;
  onEdit: (template: AdminCommunicationWhatsappTemplate) => void;
  onTest: (id: string) => void;
  formatPreview: (body: string) => string;
}

export function AdminCommunicationWhatsappTemplatesCard({
  template,
  isSelected,
  onCopy,
  onEdit,
  onTest,
  formatPreview,
}: AdminCommunicationWhatsappTemplatesCardProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  const getTemplateLabel = () => {
    if (template.customTitle?.trim()) return template.customTitle.trim();
    try {
      const translated = t(template.labelKey);
      return translated && !translated.startsWith('ADMIN_COMMUNICATION') ? translated : template.labelKey;
    } catch {
      return template.labelKey;
    }
  };

  const label = getTemplateLabel();
  const templatePreview = formatPreview(template.body);
  const isAutoApi = template.dispatchMode === 'auto_api_single';

  return (
    <div
      data-testid={`admin_communication-template-${template.id}`}
      className={`group flex flex-col justify-between rounded-2xl border motion-safe:transition-all motion-safe:duration-200 overflow-hidden bg-card ${
        isSelected ? 'border-success shadow-xl ring-1 ring-primary' : 'border-border hover:border-primary shadow-md'
      }`}
    >
      <div className="p-4 border-b border-border space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-2 rounded-xl bg-surface border border-border shrink-0">{template.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <span>{label}</span>
                <ShieldCheck size={14} className="text-success-text shrink-0" />
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                {template.category && (
                  <span className="text-[10px] font-semibold text-success-text uppercase tracking-wider">
                    {template.category}
                  </span>
                )}
                {isAutoApi ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-info-text bg-info-bg border border-info px-1.5 py-0.5 rounded">
                    <Server size={10} className="text-info-text" />
                    Server API (1x Auto)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-text bg-success-bg border border-success px-1.5 py-0.5 rounded">
                    <Smartphone size={10} className="text-success-text" />
                    WhatsApp Web (Free)
                  </span>
                )}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success-text bg-success-bg border border-success px-2 py-0.5 rounded-full shrink-0">
            Approved
          </span>
        </div>

        {template.triggerEvent && (
          <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <Clock size={12} className="text-text-secondary shrink-0" />
            <span className="truncate">Trigger: {template.triggerEvent}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border text-[10px] text-text-secondary">
            <span className="font-semibold text-success-text flex items-center gap-1">
              <ShieldCheck size={12} />
              {ADMIN_BRAND_CONFIG.displayName || 'Smart Library'}
            </span>
            <span className="font-mono text-text-secondary">Official Account</span>
          </div>

          <div className="max-h-60 overflow-y-auto pr-1 text-[11.5px] leading-relaxed text-text-primary">
            <p className="whitespace-pre-wrap font-sans break-words">{templatePreview}</p>
            <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-success-text">
              <span>10:42 AM</span>
              <CheckCheck size={13} className="text-info-text" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
          <span className="font-mono text-text-secondary">
            {template.body.length} / {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS} chars
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface border border-border font-mono text-info-text">
            7 Tokens
          </span>
        </div>
      </div>

      <div className="p-3 bg-surface border-t border-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onCopy(template.body, label)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-all cursor-pointer"
          title="Copy raw template"
          aria-label="Copy template"
        >
          <Copy size={13} />
          <span>Copy Template</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid={`admin_communication-edit-template-${template.id}`}
            onClick={() => onEdit(template)}
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-all cursor-pointer"
            title="Edit Template"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onTest(template.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-success px-3.5 py-1.5 text-xs font-semibold text-on-primary shadow-sm hover:opacity-90 motion-safe:transition-all cursor-pointer"
          >
            <Send size={12} />
            <span>Test Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappTemplatesCard;
