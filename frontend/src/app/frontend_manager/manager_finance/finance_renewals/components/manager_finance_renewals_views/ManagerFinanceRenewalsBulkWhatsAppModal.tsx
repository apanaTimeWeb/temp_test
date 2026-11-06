'use client';

import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Send, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export interface RenewalRecord {
  id: number | string;
  studentName: string;
  smartId: string;
  shift: string;
  plan: string;
  expiryDate: string;
  daysLeft: number;
  due: number;
  phone?: string;
}

interface ManagerFinanceRenewalsBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  renewals: RenewalRecord[];
  onComplete: () => void;
}

const RENEWAL_TEMPLATES = [
  {
    label: 'Upcoming (Friendly)',
    text: 'Hello {name}, your Central Library subscription ({smartId} • {plan}) is expiring on {expiry} ({daysLeft} days left). Please renew timely to retain your seat. — Central Library Administration',
  },
  {
    label: 'Critical Alert (1-3 Days)',
    text: 'Urgent: Hello {name}, your Central Library access ({smartId}) will expire in {daysLeft} days. Renewal fee due: ₹{due}. Please renew today at the desk or online. — Central Library Administration',
  },
  {
    label: 'Expired Notice',
    text: 'Attention: Hello {name}, your library membership ({smartId}) expired on {expiry}. Pending renewal amount: ₹{due}. Kindly clear dues to avoid seat suspension. — Central Library Administration',
  },
];

export function ManagerFinanceRenewalsBulkWhatsAppModal({
  isOpen,
  onClose,
  renewals,
  onComplete,
}: ManagerFinanceRenewalsBulkWhatsAppModalProps) {
  const [openedKeys, setOpenedKeys] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState(RENEWAL_TEMPLATES[0].text);

  if (!isOpen || renewals.length === 0) return null;

  const personalize = (template: string, item: RenewalRecord) => {
    return template
      .replace(/{name}/gi, item.studentName)
      .replace(/{smartId}/gi, item.smartId)
      .replace(/{plan}/gi, item.plan)
      .replace(/{shift}/gi, item.shift)
      .replace(/{expiry}/gi, item.expiryDate)
      .replace(/{daysLeft}/gi, String(Math.abs(item.daysLeft)))
      .replace(/{due}/gi, String(Math.round(item.due / 100)));
  };

  const handleSendSingle = (item: RenewalRecord) => {
    const rawPhone = item.phone || `98765432${String(item.id).padStart(2, '0')}`;
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const body = encodeURIComponent(personalize(selectedTemplate, item));

    const url = `https://wa.me/${targetPhone}?text=${body}`;
    const popup = window.open(url, '_blank');
    if (popup) popup.opener = null;

    setOpenedKeys((prev) => {
      const next = new Set(prev);
      next.add(String(item.id));
      return next;
    });

    toast.success(`Renewal reminder opened for ${item.studentName} (+91 ${cleanPhone})`);
  };

  const openedCount = openedKeys.size;
  const totalCount = renewals.length;
  const progressPct = Math.round((openedCount / totalCount) * 100);
  const isComplete = openedCount === totalCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-renewals-whatsapp-title"
    >
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="bulk-renewals-whatsapp-title" className="text-base font-bold text-foreground">
                  Bulk Renewal WhatsApp Reminders
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  {renewals.length} Students in Queue
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Dispatch renewal notices without popup blocking or account ban risks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Progress */}
          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                Dispatch Progress
              </span>
              <span className="text-sm font-bold text-foreground">
                {openedCount} of {totalCount} Reminders Dispatched ({progressPct}%)
              </span>
            </div>
            <div className="w-32 bg-surface-highlight rounded-full h-2.5 overflow-hidden border border-border">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Template presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-secondary">Choose Template:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {RENEWAL_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.label}
                  onClick={() => setSelectedTemplate(tmpl.text)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    selectedTemplate === tmpl.text
                      ? 'bg-primary text-on-primary border-primary font-semibold'
                      : 'bg-surface border-border text-secondary hover:text-foreground'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template textarea */}
          <div>
            <label htmlFor="renewals-template" className="text-xs font-semibold text-secondary block mb-1">
              Message Template:
            </label>
            <textarea
              id="renewals-template"
              rows={3}
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Queue List */}
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-surface max-h-60 overflow-y-auto">
            {renewals.map((r) => {
              const isOpened = openedKeys.has(String(r.id));
              const isExpired = r.daysLeft < 0;
              return (
                <div
                  key={r.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-surface-hover transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight">
                      {r.studentName}
                    </p>
                    <p className="text-xs text-secondary mt-0.5">
                      <span className="font-mono">{r.smartId}</span> • {r.plan} • {r.shift} •{' '}
                      <span className={isExpired ? 'text-red-500 font-semibold' : 'text-amber-500 font-semibold'}>
                        {isExpired ? `Expired ${Math.abs(r.daysLeft)}d ago` : `Expires in ${r.daysLeft}d`}
                      </span>{' '}
                      • Due: ₹{Math.round(r.due / 100)}
                    </p>
                  </div>

                  <div>
                    {isOpened ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                        <CheckCircle2 size={13} />
                        <span>Opened</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendSingle(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                        title={`Send reminder to ${r.studentName}`}
                      >
                        <Send size={12} />
                        <span>Send WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
          <div className="flex items-center gap-1.5 text-xs text-secondary">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Anti-spam click-to-chat protected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              Close
            </button>
            {isComplete && (
              <button
                type="button"
                onClick={onComplete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                All Done & Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

