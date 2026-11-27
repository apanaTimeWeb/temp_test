'use client';

import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Send, X } from 'lucide-react';
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
      <DialogContent className="relative w-full max-w-sm rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <DialogTitle className="text-base font-bold text-text-primary flex items-center gap-2">
            <Send size={16} className="text-success-text" />
            {t('WHATSAPP_TEST_DIALOG_TITLE')}
          </DialogTitle>
          <button
            type="button"
            data-testid="admin_communication-page-control-001"
            onClick={() => setShowTest(false)}
            className="rounded-xl p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            aria-label={t('WHATSAPP_TEMPLATE_CLOSE_DIALOG')}
          >
            <X size={16} />
          </button>
        </div>
        <DialogDescription className="text-xs text-text-secondary">
          {t('WHATSAPP_TEST_DIALOG_DESCRIPTION')}
        </DialogDescription>
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1"
            htmlFor="admin-communication-test-phone"
          >
            {t('WHATSAPP_PHONE_LABEL')}
          </label>
          <input
            id="admin-communication-test-phone"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none font-mono"
            type="tel"
            autoComplete="tel"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <button
            data-testid="admin_communication-page-control-002"
            type="button"
            onClick={() => setShowTest(false)}
            className="rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-card-hover"
          >
            {t('WHATSAPP_BUTTON_CANCEL')}
          </button>
          <button
            data-testid="admin_communication-page-control-003"
            type="button"
            onClick={onSendTest}
            className="inline-flex items-center gap-1.5 rounded-xl bg-success px-4 py-2 text-xs font-semibold text-on-primary shadow-lg hover:opacity-90 disabled:opacity-40"
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
