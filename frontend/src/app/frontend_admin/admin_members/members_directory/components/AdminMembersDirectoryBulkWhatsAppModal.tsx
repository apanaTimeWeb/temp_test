'use client';
// RESPONSIBILITY: AdminMembersDirectoryBulkWhatsAppModal component owned by admin_members.

import { useState, useMemo } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Sparkles, ExternalLink } from 'lucide-react';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

export interface AdminMembersDirectoryBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: readonly AdminMembersMember[];
}

const PRESET_TEMPLATES = [
  {
    id: 'announcement',
    title: 'General Announcement',
    text: 'Hello {name}, this is an important announcement from Smart Library: Extended quiet study hours are now active during exam season. Please check with the front desk for more details.',
  },
  {
    id: 'renewal',
    title: 'Fee / Renewal Reminder',
    text: 'Dear {name}, this is a gentle reminder that your study seat membership renewal is due. Please clear the pending dues to ensure uninterrupted access to your allocated seat.',
  },
  {
    id: 'idcard',
    title: 'ID Card Collection',
    text: 'Hello {name}, your Smart Library ID card has been issued and is available for pickup at the front desk. Please collect it during your next visit!',
  },
];

export default function AdminMembersDirectoryBulkWhatsAppModal({
  isOpen,
  onClose,
  members,
}: AdminMembersDirectoryBulkWhatsAppModalProps) {
  const [template, setTemplate] = useState(PRESET_TEMPLATES[0].text);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  const progressPercent = useMemo(() => {
    if (members.length === 0) return 0;
    return Math.round((openedIds.size / members.length) * 100);
  }, [openedIds.size, members.length]);

  if (!isOpen) return null;

  const sanitizePhone = (rawPhone: string): string => {
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return digits;
  };

  const handleOpenChat = (member: AdminMembersMember) => {
    const phone = sanitizePhone(member.phone);
    if (!phone) return;
    const personalized = template.replace(/\{name\}/gi, member.name || 'Member');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(personalized)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpenedIds((prev) => new Set(prev).add(member.id));
  };

  const handleOpenNextPending = () => {
    const nextPending = members.find((m) => !openedIds.has(m.id));
    if (nextPending) {
      handleOpenChat(nextPending);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay" role="dialog" aria-modal="true" aria-labelledby="members-bulk-whatsapp-title">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-bg text-success-text">
              <MessageSquare size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 id="members-bulk-whatsapp-title" className="text-base font-bold text-text-primary">
                Bulk WhatsApp Members ({members.length} Selected)
              </h2>
              <p className="text-xs text-text-secondary">
                Semi-automated click-to-chat queue compliant with browser popup limits
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary" />
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {PRESET_TEMPLATES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setTemplate(preset.text)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    template === preset.text
                      ? 'border-primary bg-primary text-primary-contrast shadow-sm'
                      : 'border-border bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="members-whatsapp-template" className="text-xs font-semibold text-text-primary">
                Message Content
              </label>
              <span className="text-[11px] text-text-muted">
                Tip: Use <code className="text-primary font-bold">{'{name}'}</code> to personalize
              </span>
            </div>
            <textarea
              id="members-whatsapp-template"
              rows={3}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Enter message template..."
            />
          </div>

          {/* Progress Tracker */}
          <div className="rounded-xl border border-border bg-surface p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary">
                Sending Progress: {openedIds.size} of {members.length} Completed
              </span>
              <span className="font-bold text-success-text">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Member Queue List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Member Queue
              </label>
              {openedIds.size < members.length && (
                <button
                  type="button"
                  onClick={handleOpenNextPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-contrast hover:bg-primary-hover shadow-sm"
                >
                  <Send size={12} />
                  Open Next Pending
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-border rounded-xl border border-border bg-surface">
              {members.map((member) => {
                const isOpened = openedIds.has(member.id);
                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 text-xs transition-colors ${
                      isOpened ? 'bg-surface-zebra' : 'hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-subtle text-primary font-bold text-[11px]">
                        {member.name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{member.name}</div>
                        <div className="text-text-muted">{member.id} • {member.phone} • {member.plan}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOpened ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success-text bg-success-bg px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={13} />
                          Opened
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenChat(member)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-success-bg bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text hover:bg-success hover:text-on-success transition-all"
                        >
                          <Send size={12} />
                          Send
                          <ExternalLink size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-surface">
          <span className="text-xs text-text-muted">
            {openedIds.size === members.length ? 'All member chats opened!' : `${members.length - openedIds.size} pending`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-muted hover:bg-surface-hover px-4 py-2 text-xs font-semibold text-text-primary border border-border"
          >
            {openedIds.size === members.length ? 'All Done' : 'Close Queue'}
          </button>
        </div>
      </div>
    </div>
  );
}

