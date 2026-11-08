'use client';

import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Send, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerMembersDirectoryRecord } from '../../types/ManagerMembersDirectoryTypes';

interface ManagerMembersDirectoryBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ManagerMembersDirectoryRecord[];
  onComplete: () => void;
}

const DIRECTORY_TEMPLATES = [
  {
    label: 'General Notice',
    text: 'Hello {name}, this is an official announcement from Central Library. Please be informed that library hours will remain standard this week. Happy studying! — Central Library Administration',
  },
  {
    label: 'Membership Status',
    text: 'Hello {name}, your library membership ({type} plan) expires on {expiry}. Please ensure timely renewal to continue uninterrupted seat access. — Central Library Administration',
  },
  {
    label: 'Seat Allotment Update',
    text: 'Hello {name}, your assigned study seat {seat} in {shift} is verified. Please carry your Smart ID card during visits. — Central Library Administration',
  },
];

export function ManagerMembersDirectoryBulkWhatsAppModal({
  isOpen,
  onClose,
  members,
  onComplete,
}: ManagerMembersDirectoryBulkWhatsAppModalProps) {
  const [openedKeys, setOpenedKeys] = useState<Set<string>>(new Set());
  const [messageTemplate, setMessageTemplate] = useState(DIRECTORY_TEMPLATES[0].text);

  if (!isOpen || members.length === 0) return null;

  const personalize = (template: string, member: ManagerMembersDirectoryRecord) => {
    return template
      .replace(/{name}/gi, member.name)
      .replace(/{id}/gi, member.id)
      .replace(/{type}/gi, member.type)
      .replace(/{seat}/gi, member.seat || 'S-01')
      .replace(/{shift}/gi, member.shift || 'General Shift')
      .replace(/{expiry}/gi, member.expiryDate || 'N/A');
  };

  const handleSendSingle = (member: ManagerMembersDirectoryRecord) => {
    const cleanPhone = member.phone.replace(/\D/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const body = encodeURIComponent(personalize(messageTemplate, member));

    const url = `https://wa.me/${targetPhone}?text=${body}`;
    const popup = window.open(url, '_blank');
    if (popup) {
      popup.opener = null;
    }

    setOpenedKeys((prev) => {
      const next = new Set(prev);
      next.add(member.id);
      return next;
    });

    toast.success(`WhatsApp message opened for ${member.name} (+91 ${cleanPhone})`);
  };

  const openedCount = openedKeys.size;
  const totalCount = members.length;
  const progressPct = Math.round((openedCount / totalCount) * 100);
  const isComplete = openedCount === totalCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-members-whatsapp-title"
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
                <h2 id="bulk-members-whatsapp-title" className="text-base font-bold text-foreground">
                  Bulk WhatsApp Dispatch Queue
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  {members.length} Members in Queue
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Safe semi-automated click-to-chat queue (avoids popup blockers & spam flags)
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
                Queue Progress
              </span>
              <span className="text-sm font-bold text-foreground">
                {openedCount} of {totalCount} Messages Opened ({progressPct}%)
              </span>
            </div>
            <div className="w-32 bg-surface-highlight rounded-full h-2.5 overflow-hidden border border-border">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Preset Template Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-secondary">Preset Templates:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DIRECTORY_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.label}
                  onClick={() => setMessageTemplate(tmpl.text)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    messageTemplate === tmpl.text
                      ? 'bg-primary text-on-primary border-primary font-semibold'
                      : 'bg-surface border-border text-secondary hover:text-foreground'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Textarea */}
          <div>
            <label htmlFor="members-msg-template" className="text-xs font-semibold text-secondary block mb-1">
              Message Template (supports <code className="text-primary">{'{name}'}</code>, <code className="text-primary">{'{id}'}</code>, <code className="text-primary">{'{expiry}'}</code>, <code className="text-primary">{'{seat}'}</code>):
            </label>
            <textarea
              id="members-msg-template"
              rows={3}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Queue List */}
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-surface max-h-60 overflow-y-auto">
            {members.map((m) => {
              const isOpened = openedKeys.has(m.id);
              return (
                <div
                  key={m.id}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-surface-hover transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground leading-tight">
                      {m.name}
                    </p>
                    <p className="text-xs text-secondary mt-0.5">
                      <span className="font-mono">{m.id}</span> • {m.type} • +91 {m.phone} • Status: {m.status}
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
                        onClick={() => handleSendSingle(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
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
                onClick={() => {
                  const count = members.length;
                  onComplete();
                  toast.success(`Cleared selection of ${count} members.`);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                All Done & Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

