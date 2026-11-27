'use client';

import {
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS,
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { CheckCircle2, MessageSquare, X } from 'lucide-react';

export interface AdminCommunicationWhatsappTemplatesEditModalProps {
  showEditModal: boolean;
  setShowEditModal: (open: boolean) => void;
  editingTemplate: AdminCommunicationWhatsappTemplate | null;
  formTitle: string;
  setFormTitle: (val: string) => void;
  formCategory: string;
  setFormCategory: (val: string) => void;
  formTrigger: string;
  setFormTrigger: (val: string) => void;
  formBody: string;
  setFormBody: (val: string | ((prev: string) => string)) => void;
  onSaveTemplate: () => void;
}

export function AdminCommunicationWhatsappTemplatesEditModal({
  showEditModal,
  setShowEditModal,
  editingTemplate,
  formTitle,
  setFormTitle,
  formCategory,
  setFormCategory,
  formTrigger,
  setFormTrigger,
  formBody,
  setFormBody,
  onSaveTemplate,
}: AdminCommunicationWhatsappTemplatesEditModalProps) {
  if (!showEditModal) return null;

  return (
    <Dialog open onOpenChange={setShowEditModal}>
      <DialogContent className="relative w-full max-w-lg rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-text-primary flex items-center gap-2">
            <MessageSquare size={16} className="text-success-text" />
            <span>{editingTemplate ? 'Edit WhatsApp Template' : 'Create WhatsApp Template'}</span>
          </DialogTitle>
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="rounded-xl p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <DialogDescription className="text-xs text-text-secondary">
          Customize WhatsApp communication template text and dynamic replacement variables.
        </DialogDescription>
        <div className="space-y-3.5">
          <div>
            <label htmlFor="wa-template-title" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Template Title
            </label>
            <input
              id="wa-template-title"
              maxLength={100}
              type="text"
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
              placeholder="e.g. Fee Due Notice, Seat Expiry Warning"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="wa-template-category" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Category
              </label>
              <input
                id="wa-template-category"
                maxLength={100}
                type="text"
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
                placeholder="e.g. Finance, Announcements"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="wa-template-trigger" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Trigger Event
              </label>
              <input
                id="wa-template-trigger"
                maxLength={100}
                type="text"
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
                placeholder="e.g. 3 days before expiry"
                value={formTrigger}
                onChange={(e) => setFormTrigger(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="wa-template-body" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Template Body
              </label>
              <span className="text-[11px] font-mono text-text-secondary">
                {formBody.length} / {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS} chars
              </span>
            </div>
            <textarea
              id="wa-template-body"
              maxLength={1000}
              rows={6}
              className="w-full rounded-xl border border-border bg-input p-3 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none font-sans leading-relaxed resize-none"
              placeholder="Write your template message. Use tokens like {name}, {seat}, {duedate}..."
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
            />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-secondary mb-1.5">
              Click token to insert:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setFormBody((prev) => `${prev} ${token}`)}
                  className="rounded-lg border border-border bg-surface px-2 py-0.5 text-[11px] font-mono text-info-text hover:bg-info-bg hover:border-info motion-safe:transition-colors"
                  title={`Insert ${token}`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-card-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveTemplate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-success px-4 py-2 text-xs font-semibold text-on-primary shadow-lg hover:opacity-90"
          >
            <CheckCircle2 size={13} />
            <span>{editingTemplate ? 'Save Changes' : 'Create Template'}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AdminCommunicationWhatsappTemplatesEditModal;
