'use client';
// RESPONSIBILITY: AdminMembersEnquiriesBulkWhatsAppModal component owned by admin_members_enquiries.

import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { CheckCircle2, ExternalLink, MessageSquare, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface AdminMembersEnquiriesBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiries: readonly Enquiry[];
}

const PRESET_TEMPLATES = [
  {
    id: 'demo',
    title: 'Demo Pass Invite',
    text: 'Hello {name}, greetings from Smart Library! We invite you to experience our peaceful study environment and high-speed Wi-Fi with a free 1-day demo pass. Would you like to schedule your visit?',
  },
  {
    id: 'followup',
    title: 'Seat Availability Follow-up',
    text: 'Hi {name}, following up on your inquiry with us. We have limited premium study seats remaining for this shift. Would you like us to reserve a seat for you?',
  },
  {
    id: 'offer',
    title: 'Special Fee Discount',
    text: 'Hello {name}! Register this week and get an exclusive 10% discount on your study seat subscription. Let us know if you would like to proceed with admission!',
  },
];

export default function AdminMembersEnquiriesBulkWhatsAppModal({
  isOpen,
  onClose,
  enquiries,
}: AdminMembersEnquiriesBulkWhatsAppModalProps) {
  const [template, setTemplate] = useState(PRESET_TEMPLATES[0].text);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  const progressPercent = useMemo(() => {
    if (enquiries.length === 0) return 0;
    return Math.round((openedIds.size / enquiries.length) * 100);
  }, [openedIds.size, enquiries.length]);

  const sanitizePhone = (rawPhone: string): string => {
    let digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return digits;
  };

  const handleOpenChat = (enq: Enquiry) => {
    const phone = sanitizePhone(enq.phone);
    if (!phone) return;
    const personalized = template.replace(/\{name\}/gi, enq.name || 'Member');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(personalized)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    setOpenedIds((prev) => new Set(prev).add(enq.id));
  };

  const handleOpenNextPending = () => {
    const nextPending = enquiries.find((e) => !openedIds.has(e.id));
    if (nextPending) handleOpenChat(nextPending);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-dialog overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-highlight">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-success-text">
              <MessageSquare size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">
                Bulk WhatsApp Queue ({enquiries.length} Enquiries)
              </DialogTitle>
              <p className="text-xs text-text-secondary">
                Semi-automated click-to-chat queue compliant with browser security
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
              Quick Message Templates
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {PRESET_TEMPLATES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setTemplate(preset.text)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium motion-safe:transition-colors ${
                    template === preset.text
                      ? 'border-primary bg-primary text-on-primary shadow-card'
                      : 'border-border bg-surface-highlight hover:bg-surface-hover text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="enquiry-whatsapp-template" className="text-xs font-semibold text-text-primary">
                Message Content
              </label>
              <span className="text-[11px] text-text-secondary">
                Tip: Use <code className="text-primary font-bold">{'{name}'}</code> to personalize
              </span>
            </div>
            <textarea
              maxLength={1000}
              id="enquiry-whatsapp-template"
              rows={3}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Enter message template..."
            />
          </div>

          <div className="rounded-xl border border-border bg-surface-highlight p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary">
                Sending Progress: {openedIds.size} of {enquiries.length} Completed
              </span>
              <span className="font-bold text-success-text">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-zebra">
              <div className="h-full bg-success motion-safe:transition-[width] motion-safe:duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Recipient Queue
              </span>
              {openedIds.size < enquiries.length && (
                <button
                  type="button"
                  onClick={handleOpenNextPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-on-primary hover:bg-primary-hover shadow-card"
                >
                  <Send size={12} aria-hidden="true" />
                  Open Next Pending
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-border rounded-xl border border-border bg-card">
              {enquiries.map((enq) => {
                const isOpened = openedIds.has(enq.id);
                return (
                  <div key={enq.id} className={`flex items-center justify-between p-3 text-xs motion-safe:transition-colors ${isOpened ? 'bg-surface-zebra' : 'hover:bg-surface-hover'}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-subtle text-primary font-bold text-[11px]">
                        {enq.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{enq.name}</div>
                        <div className="text-text-secondary">{enq.phone} • {enq.shift || 'General'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOpened ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success-text bg-success-bg px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={13} aria-hidden="true" /> Opened
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenChat(enq)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:bg-success hover:text-on-success motion-safe:transition-colors"
                        >
                          <Send size={12} aria-hidden="true" /> Send <ExternalLink size={10} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-surface-highlight">
          <span className="text-xs text-text-secondary">
            {openedIds.size === enquiries.length ? 'All enquiries opened!' : `${enquiries.length - openedIds.size} pending`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-highlight hover:bg-surface-hover px-4 py-2 text-xs font-semibold text-text-primary border border-border"
          >
            {openedIds.size === enquiries.length ? 'All Done' : 'Close Queue'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
