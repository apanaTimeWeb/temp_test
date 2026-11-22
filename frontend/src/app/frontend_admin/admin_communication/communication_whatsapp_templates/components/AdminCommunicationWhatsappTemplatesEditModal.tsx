'use client';

import {
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS,
  ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/config/admin_communication_whatsapp_templates_whatsapp_template_constants';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { CheckCircle2,MessageSquare,X } from 'lucide-react';

export interface AdminCommunicationWhatsappTemplatesEditModalProps {
  showEditModal: boolean;
  setShowEditModal: (open: boolean) => void;
  editingTemplate: any | null;
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
      <DialogContent className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-400" />
            <span>{editingTemplate ? 'Edit WhatsApp Template' : 'Create WhatsApp Template'}</span>
          </DialogTitle>
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <DialogDescription className="text-xs text-slate-400">
          Customize WhatsApp communication template text and dynamic replacement variables.
        </DialogDescription>
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Template Title
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              placeholder="e.g. Fee Due Notice, Seat Expiry Warning"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Finance, Announcements"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Trigger Event
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. 3 days before expiry"
                value={formTrigger}
                onChange={(e) => setFormTrigger(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Template Body
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {formBody.length} / {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_MAX_CHARACTERS} chars
              </span>
            </div>
            <textarea maxLength={1000}
              rows={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-sans leading-relaxed resize-none"
              placeholder="Write your template message. Use tokens like {name}, {seat}, {duedate}..."
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
            />
          </div>
          {/* Available Variables Token Pills */}
          <div>
            <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Click token to insert:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_VARIABLES.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setFormBody((prev) => `${prev} ${token}`)}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                  title={`Insert ${token}`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveTemplate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
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
