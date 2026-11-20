'use client';
// RESPONSIBILITY: Template inspection and editor modal with channel previews (Email/SMS/WhatsApp).
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
  Sparkles,
} from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useUpdateTemplateMutation } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import type { NotificationChannel } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export function SuperadminCommunicationNotificationCenterTemplateModal() {
  const { selectedTemplate, setSelectedTemplate, isTemplateModalOpen, setIsTemplateModalOpen } =
    useSuperadminCommunicationNotificationCenterStore();
  const updateMutation = useUpdateTemplateMutation();

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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsTemplateModalOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-modal-title"
        className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl p-6 relative my-8 space-y-4"
        data-testid="template-detail-dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <FileText className="w-4 h-4" />
              </span>
              <h2 id="template-modal-title" className="text-base font-bold text-foreground">
                {selectedTemplate.name}
              </h2>
            </div>
            <p className="text-2xs text-muted-foreground mt-0.5">{selectedTemplate.description}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close template dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/40 border border-border/60">
          <button
            type="button"
            onClick={() => setActiveChannel('EMAIL')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeChannel === 'EMAIL' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>Email Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('SMS')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeChannel === 'SMS' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>SMS Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('WHATSAPP')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeChannel === 'WHATSAPP' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
            <span>WhatsApp Template</span>
          </button>
        </div>

        {/* Dynamic Variable Chips */}
        <div className="space-y-1">
          <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Click Variable to Copy into Clipboard:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedTemplate.variables.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleCopyVar(v)}
                className="px-2 py-1 rounded-md text-2xs font-mono bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{`{{${v}}}`}</span>
                {copiedVar === v ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Channel Template Form / Preview */}
        {activeChannel === 'EMAIL' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Email Body</label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeChannel === 'SMS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>DLT Template ID: <strong className="text-foreground">{selectedTemplate.channelTemplates.sms.dltTemplateId ?? 'DLT-AUTO-REG'}</strong></span>
              <span>Length: {smsBody.length} chars (1 SMS unit)</span>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">SMS Body (GSM 7-bit)</label>
              <textarea
                rows={4}
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeChannel === 'WHATSAPP' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Meta Name: <strong className="text-foreground">{selectedTemplate.channelTemplates.whatsapp.metaTemplateName ?? 'lib_template_v1'}</strong></span>
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Meta Status: APPROVED
              </span>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">WhatsApp Template Message</label>
              <textarea
                rows={6}
                value={whatsappBody}
                onChange={(e) => setWhatsappBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={updateMutation.isPending}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-primary text-black font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer min-w-32 justify-center shadow-xs"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Template</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
