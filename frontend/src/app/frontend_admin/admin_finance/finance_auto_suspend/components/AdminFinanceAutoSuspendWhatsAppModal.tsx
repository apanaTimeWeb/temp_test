'use client';

import type { AdminFinanceAutoSuspendSuspendedStudent } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertCircle, Armchair, Copy, MessageCircle, Phone, Send, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface AdminFinanceAutoSuspendWhatsAppModalProps {
  isOpen: boolean;
  student: AdminFinanceAutoSuspendSuspendedStudent | null;
  onClose: () => void;
  onSentSuccess: (studentId: number) => void;
}

export function AdminFinanceAutoSuspendWhatsAppModal({
  isOpen,
  student,
  onClose,
  onSentSuccess,
}: AdminFinanceAutoSuspendWhatsAppModalProps) {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !student) return;
    setPhone(student.phone || '9876543210');
    setMessage(
      `Dear ${student.studentName} (Smart ID: ${student.smartId}),\n\nThis is an official notice regarding your library membership at ${student.branch || 'Central Library'}.\n\nYour allotted seat ${student.seat} (${student.shift} Shift) is currently suspended due to pending subscription fee of ₹${(student.duesAmount || 1500).toLocaleString('en-IN')} (${student.daysOverdue} days overdue).\n\nKindly clear your pending balance online or at the reception desk to restore your turnstile gate access immediately.\n\nWarm regards,\nLibrary Administration`,
    );
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message);
      toast.success('WhatsApp reminder message copied to clipboard!', { id: 'admin-auto-suspend-wa-copy' });
    }
  };

  const handleSendWhatsApp = () => {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 11 && clean.startsWith('0')) clean = clean.slice(1);
    const targetPhone = clean.length === 10 ? `91${clean}` : clean;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
    onSentSuccess(student.id);
    toast.success(`WhatsApp reminder opened for ${student.studentName} (+91 ${clean})`, { id: 'admin-auto-suspend-wa-send' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="bg-overlay border border-border rounded-2xl shadow-dialog max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success-bg text-success-text border border-success">
              <MessageCircle size={22} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-text-primary tracking-tight">Send WhatsApp Defaulter Reminder</DialogTitle>
              <p className="text-xs text-text-secondary">Direct fee clearance notice sent to student&apos;s mobile number</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            title="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-highlight border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User size={15} className="text-text-secondary shrink-0" aria-hidden="true" />
            <span className="font-bold text-text-primary">{student.studentName}</span>
            <span className="text-text-secondary font-mono">({student.smartId})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium text-text-secondary">
              <Armchair size={13} aria-hidden="true" />
              Seat {student.seat} · {student.shift}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-bold bg-danger-bg text-danger-text border border-danger">
              ₹{(student.duesAmount || 1500).toLocaleString('en-IN')} Due ({student.daysOverdue}d)
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-wa-phone-input" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
            <Phone size={13} aria-hidden="true" />
            <span>Target WhatsApp Number</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-secondary">+91</span>
            <input
              maxLength={15}
              id="admin-wa-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full pl-12 pr-4 py-2 text-sm rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="admin-wa-message-textarea" className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
              <MessageCircle size={13} aria-hidden="true" />
              <span>Message Template</span>
            </label>
            <span className="text-[11px] text-text-secondary">Editable preview</span>
          </div>
          <textarea
            maxLength={1000}
            id="admin-wa-message-textarea"
            rows={7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 text-xs font-sans leading-relaxed rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="p-3 rounded-xl bg-warning-bg border border-warning flex items-start gap-2.5 text-xs text-warning-text">
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-snug">Sending will open official WhatsApp Web / Mobile app with this verified message text.</p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-highlight hover:bg-surface-hover border border-border text-text-primary cursor-pointer motion-safe:transition-colors"
          >
            <Copy size={13} aria-hidden="true" />
            <span>Copy Text</span>
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-on-primary shadow-card cursor-pointer motion-safe:transition-colors"
          >
            <Send size={13} aria-hidden="true" />
            <span>Open WhatsApp</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
