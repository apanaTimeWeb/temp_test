'use client';

import { useState, useMemo } from 'react';
import { MessageCircle, X, Users, Sparkles, RotateCcw, CheckCircle, Info } from 'lucide-react';
import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { MANAGER_CRM_DEFAULT_WHATSAPP_TEMPLATES } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import { ManagerMembersEnquiriesBulkWhatsAppItem } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesBulkWhatsAppItem';

export interface ManagerMembersEnquiriesBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: ManagerMembersEnquiriesEnquiry[];
  onClearSelection: () => void;
}

export function ManagerMembersEnquiriesBulkWhatsAppModal({
  isOpen,
  onClose,
  recipients,
  onClearSelection,
}: ManagerMembersEnquiriesBulkWhatsAppModalProps) {
  const [template, setTemplate] = useState<string>(MANAGER_CRM_DEFAULT_WHATSAPP_TEMPLATES[0].text);
  const [openedKeys, setOpenedKeys] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredRecipients = useMemo(() => {
    if (statusFilter === 'All') return recipients;
    return recipients.filter((r) => r.status === statusFilter);
  }, [recipients, statusFilter]);

  if (!isOpen) return null;

  const personalize = (text: string, name: string) => {
    return text.replace(/{name}/gi, name);
  };

  const handleSendOne = (recipient: ManagerMembersEnquiriesEnquiry) => {
    const rawDigits = recipient.phone.replace(/\D/g, '');
    if (!rawDigits) return;

    // Normalize phone number (prefix 91 for standard 10-digit Indian numbers)
    const formattedPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    const body = personalize(template, recipient.name);
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(body)}`;

    const win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
    }

    setOpenedKeys((prev) => new Set(prev).add(recipient.id));
  };

  const handleResetProgress = () => {
    setOpenedKeys(new Set());
  };

  const handleAllDone = () => {
    setOpenedKeys(new Set());
    onClearSelection();
    onClose();
  };

  const isAllDone = openedKeys.size >= recipients.length && recipients.length > 0;
  const progressPercent =
    recipients.length > 0 ? Math.round((openedKeys.size / recipients.length) * 100) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-whatsapp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="fixed inset-0 bg-black opacity-60 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-card border border-border rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-highlight text-foreground flex items-center justify-center font-bold">
              <MessageCircle size={22} className="text-emerald-600" />
            </div>
            <div>
              <h2 id="bulk-whatsapp-modal-title" className="font-extrabold text-base sm:text-lg leading-tight">
                Bulk WhatsApp Dispatch Queue
              </h2>
              <p className="text-xs opacity-90 flex items-center gap-1.5 mt-0.5">
                <Users size={13} />
                <span>{recipients.length} Selected Leads • Click-to-Chat Queue</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-surface-hover transition-colors text-white cursor-pointer"
            title="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informational Guidance Notice */}
        <div className="px-6 py-2.5 bg-surface-highlight border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Info size={14} className="text-primary shrink-0" />
          <span>
            Uses official WhatsApp Click-to-Chat (`wa.me`). Opens each chat with personalized text without browser popup blocks or number ban risks.
          </span>
        </div>

        {/* Message Template Editor & Presets */}
        <div className="p-6 border-b border-border space-y-3 bg-muted">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="bulk-whatsapp-template-input"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-primary" />
              <span>Message Template (Use {'{name}'} for dynamic lead name)</span>
            </label>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium">Presets:</span>
              {MANAGER_CRM_DEFAULT_WHATSAPP_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setTemplate(tmpl.text)}
                  className="px-2 py-0.5 rounded-md border border-border bg-card hover:border-primary text-[11px] font-semibold text-foreground transition-colors cursor-pointer"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="bulk-whatsapp-template-input"
            rows={3}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-card text-foreground resize-none leading-relaxed"
            placeholder="Type your WhatsApp message..."
          />
        </div>

        {/* Queue Header & Filter Tabs */}
        <div className="px-6 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Filter Queue:</span>
            {['All', 'Visited', 'New', 'Interested'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-highlight text-muted-foreground hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-foreground">
              {openedKeys.size} of {recipients.length} Opened ({progressPercent}%)
            </span>
            {openedKeys.size > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                title="Reset queue checklist"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Recipient Queue List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 divide-y divide-border">
          {filteredRecipients.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-6">
              No leads match the selected status filter in this queue.
            </p>
          ) : (
            filteredRecipients.map((enq, index) => (
              <ManagerMembersEnquiriesBulkWhatsAppItem
                key={enq.id}
                enq={enq}
                index={index}
                isOpened={openedKeys.has(enq.id)}
                onSend={handleSendOne}
                disabled={!template.trim()}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted border-t border-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-surface-hover text-foreground transition-colors cursor-pointer"
          >
            {isAllDone ? 'Close Window' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            {isAllDone ? (
              <button
                type="button"
                onClick={handleAllDone}
                className="px-5 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <CheckCircle size={15} />
                <span>All Done & Clear Selection</span>
              </button>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Click each lead above to launch their WhatsApp chat.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
