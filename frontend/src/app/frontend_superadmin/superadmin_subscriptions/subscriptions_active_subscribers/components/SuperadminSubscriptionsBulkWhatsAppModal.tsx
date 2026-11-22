'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, MessageSquare, ExternalLink } from 'lucide-react';
import type { SuperadminSubscriptionRecord } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/types/SuperadminSubscriptionsActiveSubscribersTypes';

export interface SuperadminSubscriptionsBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: readonly SuperadminSubscriptionRecord[];
}

const PRESET_TEMPLATES = [
  {
    id: 'renewal_notice',
    title: 'Renewal Reminder',
    text: 'Hello {tenant}, reminder from Smart Library SaaS: your {plan} subscription status is currently "{status}". Please review your account to keep library branches operational. — SaaS Administration',
  },
  {
    id: 'payment_alert',
    title: 'Payment / Dues Alert',
    text: 'Urgent: Hello {tenant}, your software subscription for {plan} plan (MRR ₹{mrr}) is {status}. Kindly clear pending dues to avoid automated service suspension. — Smart Library Billing',
  },
  {
    id: 'platform_update',
    title: 'Platform Feature Update',
    text: 'Hello {tenant}, we have released new features and optimizations for your library branch management portal. Login to explore! — Smart Library SaaS',
  },
];

export default function SuperadminSubscriptionsBulkWhatsAppModal({
  isOpen,
  onClose,
  subscribers,
}: SuperadminSubscriptionsBulkWhatsAppModalProps) {
  const [template, setTemplate] = useState(PRESET_TEMPLATES[0].text);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  const progressPercent = useMemo(() => {
    if (subscribers.length === 0) return 0;
    return Math.round((openedIds.size / subscribers.length) * 100);
  }, [openedIds.size, subscribers.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sanitizePhone = (rawPhone?: string): string => {
    if (!rawPhone) return '919876543210';
    let digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return digits;
  };

  const handleOpenChat = (sub: SuperadminSubscriptionRecord) => {
    const phone = sanitizePhone(sub.phone);
    const personalized = template
      .replace(/\{tenant\}/gi, sub.tenant || 'Library Partner')
      .replace(/\{plan\}/gi, sub.plan || 'Plan')
      .replace(/\{status\}/gi, sub.status || 'Active')
      .replace(/\{mrr\}/gi, String(sub.mrr || 0));
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(personalized)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) {
      popup.opener = null;
    }
    setOpenedIds((prev) => new Set(prev).add(sub.id));
  };

  const handleOpenNextPending = () => {
    const nextPending = subscribers.find((s) => !openedIds.has(s.id));
    if (nextPending) {
      handleOpenChat(nextPending);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="superadmin-subscribers-bulk-whatsapp-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-indigo-500/30 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <MessageSquare size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 id="superadmin-subscribers-bulk-whatsapp-title" className="text-base font-bold text-white">
                SuperAdmin Broadcast to Subscribers
              </h2>
              <p className="text-xs text-slate-400">
                Contact filtered library tenants ({subscribers.length} subscriber{subscribers.length === 1 ? '' : 's'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close WhatsApp dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          {/* Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Select Message Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.text)}
                  className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                    template === t.text
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-semibold truncate">{t.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="superadmin-subscribers-msg-editor" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Message Content
              </label>
              <span className="text-[11px] text-slate-500">
                Variables: <code className="text-indigo-400">{"{tenant}"}</code>, <code className="text-indigo-400">{"{plan}"}</code>, <code className="text-indigo-400">{"{status}"}</code>, <code className="text-indigo-400">{"{mrr}"}</code>
              </span>
            </div>
            <textarea
              id="superadmin-subscribers-msg-editor"
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="Type your WhatsApp notification message here..."
            />
          </div>

          {/* Progress bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">Dispatch Progress</span>
              <span className="text-emerald-400 font-bold">{openedIds.size} of {subscribers.length} contacted ({progressPercent}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Recipient list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Subscribers Queue ({subscribers.length})
              </span>
              <button
                type="button"
                onClick={handleOpenNextPending}
                disabled={openedIds.size >= subscribers.length}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Launch Next Uncontacted</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {subscribers.map((sub) => {
                const isSent = openedIds.has(sub.id);
                return (
                  <div
                    key={sub.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isSent
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-400'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold truncate text-white">{sub.tenant}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                            {sub.plan}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                            sub.status === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : sub.status === 'Due Soon'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {sub.billingContact || sub.email || 'Contact'} • MRR: ₹{(sub.mrr || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenChat(sub)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 border border-slate-700'
                      }`}
                    >
                      <MessageSquare size={12} className={isSent ? 'text-emerald-400' : 'text-slate-400'} />
                      <span>{isSent ? 'Re-open' : 'Open WhatsApp'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-indigo-500/20 px-6 py-3.5 bg-slate-950/80">
          <p className="text-[11px] text-slate-400">
            Click-to-chat opens WhatsApp Web directly without paid 3rd-party API gateways.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
