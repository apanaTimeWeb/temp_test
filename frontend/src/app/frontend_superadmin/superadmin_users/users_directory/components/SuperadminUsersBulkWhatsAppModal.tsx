'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import type { SuperadminUserData } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';

export interface SuperadminUsersBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: readonly SuperadminUserData[];
}

const PRESET_TEMPLATES = [
  {
    id: 'system_notice',
    title: 'System Announcement',
    text: 'Hello {name}, this is an important platform notification from SuperAdmin: Scheduled infrastructure maintenance is planned tonight. All services will remain uninterrupted.',
  },
  {
    id: 'security_2fa',
    title: '2FA Security Notice',
    text: 'Dear {name}, security audit reminder: Please ensure Two-Factor Authentication (2FA) is enabled on your {role} account for compliance and data protection.',
  },
  {
    id: 'onboarding',
    title: 'Admin Access Confirmation',
    text: 'Hello {name}, your role permissions for tenant/branch "{branch}" have been updated. Please log in to review your access privileges.',
  },
];

export default function SuperadminUsersBulkWhatsAppModal({
  isOpen,
  onClose,
  users,
}: SuperadminUsersBulkWhatsAppModalProps) {
  const [template, setTemplate] = useState(PRESET_TEMPLATES[0].text);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  const progressPercent = useMemo(() => {
    if (users.length === 0) return 0;
    return Math.round((openedIds.size / users.length) * 100);
  }, [openedIds.size, users.length]);

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
    if (!rawPhone) return '919876543210'; // default demo recipient
    let digits = rawPhone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    return digits;
  };

  const handleOpenChat = (user: SuperadminUserData) => {
    const phone = sanitizePhone(user.phone);
    const personalized = template
      .replace(/\{name\}/gi, user.name || 'User')
      .replace(/\{role\}/gi, user.role || 'Member')
      .replace(/\{branch\}/gi, user.branch || 'Main');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(personalized)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) {
      popup.opener = null;
    }
    setOpenedIds((prev) => new Set(prev).add(user.id));
  };

  const handleOpenNextPending = () => {
    const nextPending = users.find((u) => !openedIds.has(u.id));
    if (nextPending) {
      handleOpenChat(nextPending);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="superadmin-users-bulk-whatsapp-title"
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
              <h2 id="superadmin-users-bulk-whatsapp-title" className="text-base font-bold text-white">
                SuperAdmin Broadcast on WhatsApp
              </h2>
              <p className="text-xs text-slate-400">
                Contact selected administrators & managers ({users.length} recipient{users.length === 1 ? '' : 's'})
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
              <label htmlFor="superadmin-whatsapp-msg-editor" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Message Content
              </label>
              <span className="text-[11px] text-slate-500">
                Variables: <code className="text-indigo-400">{"{name}"}</code>, <code className="text-indigo-400">{"{role}"}</code>, <code className="text-indigo-400">{"{branch}"}</code>
              </span>
            </div>
            <textarea
              id="superadmin-whatsapp-msg-editor"
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
              <span className="text-emerald-400 font-bold">{openedIds.size} of {users.length} contacted ({progressPercent}%)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Recipients List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recipients</span>
              <button
                type="button"
                onClick={handleOpenNextPending}
                disabled={openedIds.size >= users.length}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Send size={12} /> Open Next Pending
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/40 p-2 divide-y divide-slate-800/50">
              {users.map((u) => {
                const isOpened = openedIds.has(u.id);
                return (
                  <div key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-800/40 rounded-lg transition-colors pt-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{u.email} · {u.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenChat(u)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                        isOpened
                          ? 'border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white'
                          : 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                      }`}
                    >
                      {isOpened ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-400" />
                          <span>Sent</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink size={12} />
                          <span>Open Chat</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-indigo-500/20 px-6 py-3.5 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Messages open safely in WhatsApp Web or WhatsApp Desktop.
          </span>
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
