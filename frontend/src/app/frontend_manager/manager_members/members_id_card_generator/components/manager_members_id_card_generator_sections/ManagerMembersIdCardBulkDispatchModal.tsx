'use client';

import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Send, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ManagerStudent } from '../../types/ManagerMembersIdCardGeneratorTypes';

interface ManagerMembersIdCardBulkDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: ManagerStudent[];
  onComplete: () => void;
}

export function ManagerMembersIdCardBulkDispatchModal({
  isOpen,
  onClose,
  students,
  onComplete,
}: ManagerMembersIdCardBulkDispatchModalProps) {
  const [openedKeys, setOpenedKeys] = useState<Set<string>>(new Set());
  const [customNote, setCustomNote] = useState(
    'Please present your digital ID details at the library reception upon arrival.'
  );

  if (!isOpen || students.length === 0) return null;

  const handleSendSingle = (student: ManagerStudent) => {
    const digits = student.phone.replace(/\D/g, '');
    const displayPhone = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
    const targetPhone = digits.length === 10 ? `91${digits}` : digits;

    const message = encodeURIComponent(
      `Hello ${student.name},\nYour Library Smart ID Card is ready! 🪪\n\n` +
      `• Smart ID: ${student.smartId}\n` +
      `• Shift: ${student.shift}\n` +
      `• Assigned Seat: ${student.seat}\n` +
      `• Plan: ${student.plan}\n\n` +
      `${customNote}\n\n` +
      `— Central Library Administration`
    );

    const url = `https://wa.me/${targetPhone}?text=${message}`;
    const popup = window.open(url, '_blank');
    if (popup) {
      popup.opener = null;
    }

    setOpenedKeys((prev) => {
      const next = new Set(prev);
      next.add(student.smartId);
      return next;
    });

    toast.success(`ID Card WhatsApp opened for ${student.name} (+91 ${displayPhone})`);
  };

  const openedCount = openedKeys.size;
  const totalCount = students.length;
  const progressPct = totalCount > 0 ? Math.round((openedCount / totalCount) * 100) : 0;
  const isComplete = openedCount === totalCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-id-card-title"
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
                <h2 id="bulk-id-card-title" className="text-base font-bold text-foreground">
                  Bulk ID Card WhatsApp Dispatch
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  {students.length} Students in Queue
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Safe semi-automated click-to-chat queue (avoids popup blockers & number bans)
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
          {/* Progress Banner */}
          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                Dispatch Progress
              </span>
              <span className="text-sm font-bold text-foreground">
                {openedCount} of {totalCount} ID Cards Opened ({progressPct}%)
              </span>
            </div>
            <div className="w-32 bg-surface-highlight rounded-full h-2.5 overflow-hidden border border-border">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Custom Note input */}
          <div>
            <label htmlFor="id-card-custom-note" className="text-xs font-semibold text-secondary block mb-1">
              Instructions note appended to ID card message:
            </label>
            <input
              id="id-card-custom-note"
              type="text"
              aria-label="Instructions note appended to ID card message"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter special instructions or visiting rules..."
            />
          </div>

          {/* Students Queue List */}
          <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-surface">
            {students.map((student) => {
              const isOpened = openedKeys.has(student.smartId);
              const digits = student.phone.replace(/\D/g, '');
              const displayPhone = digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
              return (
                <div
                  key={student.smartId}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-highlight border border-border flex items-center justify-center font-bold text-xs text-primary shrink-0">
                      {student.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {student.name}
                      </p>
                      <p className="text-xs text-secondary mt-0.5">
                        <span className="font-mono">{student.smartId}</span> • Seat: {student.seat} • Shift: {student.shift} • +91 {displayPhone}
                      </p>
                    </div>
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
                        onClick={() => handleSendSingle(student)}
                        data-testid="manager-id-card-bulk-send-btn"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                        title={`Send ID Card to ${student.name}`}
                      >
                        <Send size={12} />
                        <span>Send via WhatsApp</span>
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
                All Done & Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

