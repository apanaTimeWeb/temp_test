'use client';

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Send,X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface AdminCommunicationWhatsappTemplatesTestModalProps {
  showTest: boolean;
  setShowTest: (open: boolean) => void;
  testPhone: string;
  setTestPhone: (phone: string) => void;
  onSendTest: () => void;
}

export function AdminCommunicationWhatsappTemplatesTestModal({
  showTest,
  setShowTest,
  testPhone,
  setTestPhone,
  onSendTest,
}: AdminCommunicationWhatsappTemplatesTestModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  if (!showTest) return null;

  return (
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
            onClick={onSendTest}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-40"
            disabled={!testPhone.trim()}
          >
            <Send size={13} />
            {t('WHATSAPP_TEST_VALIDATE_ONLY')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AdminCommunicationWhatsappTemplatesTestModal;
