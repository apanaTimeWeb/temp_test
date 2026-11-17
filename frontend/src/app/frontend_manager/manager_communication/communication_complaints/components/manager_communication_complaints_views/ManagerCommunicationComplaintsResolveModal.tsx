'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  MessageSquare,
  Armchair,
  User,
  Phone,
  Send,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { toast } from 'sonner';
import type { ManagerCommunicationComplaintsComplaint } from '../../types/ManagerCommunicationComplaintsTypes';

interface ManagerCommunicationComplaintsResolveModalProps {
  complaint: ManagerCommunicationComplaintsComplaint | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmResolve: (
    complaintId: string,
    resolvedNote: string,
    shouldSendWhatsApp: boolean,
    openBrowserWhatsApp: boolean
  ) => void;
}

export function ManagerCommunicationComplaintsResolveModal({
  complaint,
  isOpen,
  onClose,
  onConfirmResolve,
}: ManagerCommunicationComplaintsResolveModalProps) {
  const [resolutionNote, setResolutionNote] = useState('');
  const [notifyStudent, setNotifyStudent] = useState(true);

  useEffect(() => {
    if (complaint) {
      const location = complaint.seatTag || 'workspace';
      setResolutionNote(
        `Issue inspected and resolved by library facility team for ${location}. Facility is verified operational.`
      );
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const studentName = complaint.student || 'Student';
  const cleanPhone = (complaint.phone || '9876543210').replace(/\D/g, '');
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const locationTag = complaint.seatTag || 'General Study Area';

  const previewMessage =
    `Hello ${studentName},\n` +
    `✅ Your complaint #${complaint.id} ("${complaint.title}") regarding [${locationTag}] has been marked as RESOLVED.\n\n` +
    `Action Taken: ${resolutionNote.trim()}\n\n` +
    `Thank you for your patience! Please feel free to reach out if you need any further help.\n` +
    `— Central Library Administration`;

  const handleResolveAndOpenWhatsApp = () => {
    if (!resolutionNote.trim()) {
      toast.error('Please enter a brief resolution note.');
      return;
    }
    const encoded = encodeURIComponent(previewMessage);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    onConfirmResolve(complaint.id, resolutionNote.trim(), true, true);
    toast.success(`Complaint #${complaint.id} resolved and WhatsApp dispatched to ${studentName}!`);
    onClose();
  };

  const handleResolveWithAutoNotify = () => {
    if (!resolutionNote.trim()) {
      toast.error('Please enter a brief resolution note.');
      return;
    }
    onConfirmResolve(complaint.id, resolutionNote.trim(), notifyStudent, false);
    if (notifyStudent) {
      toast.success(
        `Complaint #${complaint.id} marked Resolved. Automated WhatsApp notification sent to ${studentName} (+91 ${cleanPhone})!`
      );
    } else {
      toast.success(`Complaint #${complaint.id} marked Resolved without notification.`);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resolve-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <h3 id="resolve-modal-title" className="text-base font-bold text-primary">
                  Resolve Complaint & Notify Student
                </h3>
                <span className="text-[11px] text-secondary">Ticket #{complaint.id}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Complaint Details Card */}
        <div className="p-3.5 rounded-xl bg-surface/40 border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-sm">{complaint.title}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/25">
              <Armchair size={11} /> {locationTag}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-secondary">
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-secondary shrink-0" />
              <span className="truncate">{studentName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-secondary shrink-0" />
              <span className="font-mono">+91 {cleanPhone}</span>
            </div>
          </div>
        </div>

        {/* Resolution Note Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-primary flex items-center justify-between">
            <span>Action Taken / Resolution Note *</span>
            <span className="text-[10px] text-secondary">Included in student WhatsApp</span>
          </label>
          <textarea
            rows={2}
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            className="mgr-input text-xs w-full resize-none p-2.5 rounded-lg bg-surface/50 border border-border focus:border-primary"
            placeholder="Describe what was repaired, fixed, or addressed..."
            required
          />
        </div>

        {/* Live WhatsApp Message Preview Bubble */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
              <MessageSquare size={12} className="text-emerald-400" />
              <span>Student WhatsApp Preview</span>
            </span>
            <label className="flex items-center gap-1.5 text-xs text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyStudent}
                onChange={(e) => setNotifyStudent(e.target.checked)}
                className="rounded border-border text-emerald-600 focus:ring-emerald-500"
              />
              <span>Send WhatsApp Notification</span>
            </label>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-[#0b141a] p-3 text-[11px] text-slate-100 space-y-1 shadow-inner font-sans">
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mb-1">
              <CheckCircle2 size={12} />
              <span>Resolution WhatsApp Message</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed bg-[#005c4b]/80 p-2.5 rounded-lg border border-[#005c4b]">
              {previewMessage}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleResolveWithAutoNotify}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-hover hover:bg-surface border border-border text-primary transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck size={13} />
              <span>Resolve Status</span>
            </button>
            <button
              type="button"
              onClick={handleResolveAndOpenWhatsApp}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>Resolve & WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
