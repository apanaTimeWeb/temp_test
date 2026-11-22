'use client';

import { ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import {
  CheckCheck,
  Clock,
  Copy,
  Edit2,
  Send,
  Server,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
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
                <span>{label}</span>
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                {template.category && (
                  <span className="text-[10px] font-semibold text-emerald-400/90 uppercase tracking-wider">
                    {template.category}
                  </span>
                )}
                {/* Cost / Dispatch Mode Badge */}
                {isAutoApi ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                    <Server size={10} className="text-indigo-400" />
                    Server API (1x Auto)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    <Smartphone size={10} className="text-emerald-400" />
                    WhatsApp Web (Free)
                  </span>
                )}
              </div>
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

      {/* Live WhatsApp Bubble Preview */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="rounded-2xl border border-slate-800 bg-[#0b141a] p-3.5 shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/70 text-[10px] text-slate-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={12} />
              {ADMIN_BRAND_CONFIG.displayName || 'Smart Library'}
            </span>
            <span className="font-mono text-slate-500">Official Account</span>
          </div>

          <div className="max-h-60 overflow-y-auto pr-1 text-[11.5px] leading-relaxed text-slate-200">
            <p className="whitespace-pre-wrap font-sans break-words">{templatePreview}</p>
            <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-emerald-300/80">
              <span>10:42 AM</span>
              <CheckCheck size={13} className="text-cyan-400" />
            </div>
          </div>
        </div>

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
          onClick={() => onCopy(template.body, label)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
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
            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            title="Edit Template"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onTest(template.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all cursor-pointer"
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
