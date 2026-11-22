'use client';

import { AlertCircle,Armchair,Copy,MessageCircle,Phone,Send,User,X } from 'lucide-react';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';
import type { AdminFinanceAutoSuspendSuspendedStudent } from '../types/AdminFinanceAutoSuspendTypes';

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

    const initialPhone = student.phone || '9876543210';
    setPhone(initialPhone);

    const defaultMsg = `Dear ${student.studentName} (Smart ID: ${student.smartId}),\n\nThis is an official notice regarding your library membership at ${student.branch || 'Central Library'}.\n\nYour allotted seat ${student.seat} (${student.shift} Shift) is currently suspended due to pending subscription fee of ₹${(student.duesAmount || 1500).toLocaleString('en-IN')} (${student.daysOverdue} days overdue).\n\nKindly clear your pending balance online or at the reception desk to restore your turnstile gate access immediately.\n\nWarm regards,\nLibrary Administration`;
    setMessage(defaultMsg);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, student, onClose]);

  if (!isOpen || !student) return null;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(message);
      toast.success('WhatsApp reminder message copied to clipboard!');
    }
  };

  const handleSendWhatsApp = () => {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 11 && clean.startsWith('0')) {
      clean = clean.slice(1);
    }
    const targetPhone = clean.length === 10 ? `91${clean}` : clean;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${targetPhone}?text=${encoded}`;

    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;

    onSentSuccess(student.id);
    toast.success(`WhatsApp reminder opened for ${student.studentName} (+91 ${clean})`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-whatsapp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 id="admin-whatsapp-modal-title" className="text-lg font-bold text-primary tracking-tight">
                Send WhatsApp Defaulter Reminder
              </h3>
              <p className="text-xs text-secondary">
                Direct fee clearance notice sent to student's mobile number
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
            title="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Student Quick Bio Card */}
        <div className="p-3.5 rounded-xl bg-surface-ground border border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User size={15} className="text-secondary shrink-0" />
            <span className="font-bold text-primary">{student.studentName}</span>
            <span className="text-secondary font-mono">({student.smartId})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium text-secondary">
              <Armchair size={13} />
              Seat {student.seat} · {student.shift}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-bold bg-rose-500/15 text-rose-500 border border-rose-500/25">
              ₹{(student.duesAmount || 1500).toLocaleString('en-IN')} Due ({student.daysOverdue}d)
            </span>
          </div>
        </div>

        {/* Phone Input */}
        <div className="space-y-1.5">
          <label htmlFor="admin-wa-phone-input" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
            <Phone size={13} />
            <span>Target WhatsApp Number</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">
              +91
            </span>
            <input
              id="admin-wa-phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full pl-12 pr-4 py-2 text-sm rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="admin-wa-message-textarea" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <MessageCircle size={13} />
              <span>Message Template</span>
            </label>
            <span className="text-[11px] text-secondary">
              Editable preview
            </span>
          </div>
          <textarea
            id="admin-wa-message-textarea"
            rows={7}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 text-xs font-sans leading-relaxed rounded-xl border border-border bg-input-bg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        {/* Notice Info */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="leading-snug">
            Sending will open official WhatsApp Web / Mobile app with this verified message text.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-surface-hover border border-border text-primary cursor-pointer transition-all active:scale-95"
          >
            <Copy size={13} />
            <span>Copy Text</span>
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Send size={13} />
            <span>Open WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
