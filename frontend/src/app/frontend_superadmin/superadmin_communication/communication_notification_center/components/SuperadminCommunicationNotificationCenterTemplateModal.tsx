'use client';
// RESPONSIBILITY: Template inspection and editor modal with channel previews (Email/SMS/WhatsApp) in Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNotificationCenterMain -> TemplateModal -> useUpdateTemplateMutation.

import { useState } from 'react';
import {
  X,
  FileText,
  Mail,
  MessageSquare,
  PhoneCall,
  Save,
  CheckCircle2,
  Copy,
  Loader2,
} from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useUpdateTemplateMutation } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import type { NotificationChannel } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

export function SuperadminCommunicationNotificationCenterTemplateModal() {
  const { selectedTemplate, isTemplateModalOpen, setIsTemplateModalOpen } =
    useSuperadminCommunicationNotificationCenterStore();
  const updateMutation = useUpdateTemplateMutation();

  useModalScrollLock(isTemplateModalOpen);

  const [activeChannel, setActiveChannel] = useState<NotificationChannel>('EMAIL');
  const [emailSubject, setEmailSubject] = useState(selectedTemplate?.channelTemplates.email.subject ?? '');
  const [emailBody, setEmailBody] = useState(selectedTemplate?.channelTemplates.email.body ?? '');
  const [smsBody, setSmsBody] = useState(selectedTemplate?.channelTemplates.sms.body ?? '');
  const [whatsappBody, setWhatsappBody] = useState(selectedTemplate?.channelTemplates.whatsapp.body ?? '');
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  if (!isTemplateModalOpen || !selectedTemplate) return null;

  const handleCopyVar = (v: string) => {
    navigator.clipboard?.writeText(`{{${v}}}`);
    setCopiedVar(v);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const handleSave = async () => {
    const idempotencyKey = `idemp-tmpl-save-${selectedTemplate.id}-${Date.now()}`;
    await updateMutation.mutateAsync({
      id: selectedTemplate.id,
      payload: {
        channelTemplates: {
          ...selectedTemplate.channelTemplates,
          email: {
            ...selectedTemplate.channelTemplates.email,
            subject: emailSubject || selectedTemplate.channelTemplates.email.subject,
            body: emailBody || selectedTemplate.channelTemplates.email.body,
          },
          sms: {
            ...selectedTemplate.channelTemplates.sms,
            body: smsBody || selectedTemplate.channelTemplates.sms.body,
          },
          whatsapp: {
            ...selectedTemplate.channelTemplates.whatsapp,
            body: whatsappBody || selectedTemplate.channelTemplates.whatsapp.body,
          },
        },
      },
      idempotencyKey,
    });
    setIsTemplateModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsTemplateModalOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-modal-title"
        className="bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] border border-indigo-500/30 text-slate-100 shadow-2xl rounded-3xl w-full max-w-2xl p-6 sm:p-7 relative space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ease-out"
        data-testid="template-detail-dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-indigo-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="template-modal-title" className="text-base sm:text-lg font-bold text-white">
                {selectedTemplate.name}
              </h2>
              <p className="text-2xs text-slate-400 mt-0.5 leading-relaxed">{selectedTemplate.description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Close template dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-indigo-500/25">
          <button
            type="button"
            onClick={() => setActiveChannel('EMAIL')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeChannel === 'EMAIL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('SMS')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeChannel === 'SMS'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>SMS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('WHATSAPP')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeChannel === 'WHATSAPP'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-teal-400" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Dynamic Variable Chips */}
        <div className="space-y-1.5">
          <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
            Click Variable Chip to Copy into Clipboard:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedTemplate.variables.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleCopyVar(v)}
                className="px-2.5 py-1 rounded-lg text-2xs font-mono bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{`{{${v}}}`}</span>
                {copiedVar === v ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Channel Template Form */}
        {activeChannel === 'EMAIL' && (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Email HTML / Plaintext Body</label>
              <textarea maxLength={1000}
                rows={5}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 font-mono leading-relaxed shadow-inner"
              />
            </div>
          </div>
        )}

        {activeChannel === 'SMS' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>DLT Template ID: <strong className="text-white font-mono">{selectedTemplate.channelTemplates.sms.dltTemplateId ?? 'DLT-AUTO-REG'}</strong></span>
              <span>Length: <strong className="text-white">{smsBody.length}</strong> chars (1 SMS unit)</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">SMS Body (GSM 7-bit)</label>
              <textarea maxLength={1000}
                rows={4}
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 font-mono leading-relaxed shadow-inner"
              />
            </div>
          </div>
        )}

        {activeChannel === 'WHATSAPP' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Meta Name: <strong className="text-white font-mono">{selectedTemplate.channelTemplates.whatsapp.metaTemplateName ?? 'lib_template_v1'}</strong></span>
              <span className="text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-2xs">
                Meta Status: APPROVED
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">WhatsApp Template Message</label>
              <textarea maxLength={1000}
                rows={5}
                value={whatsappBody}
                onChange={(e) => setWhatsappBody(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 font-mono leading-relaxed shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-indigo-500/20 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(false)}
            className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-indigo-500/25 text-xs sm:text-sm font-semibold cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={updateMutation.isPending}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer min-w-36 justify-center shadow-lg shadow-indigo-500/25"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
