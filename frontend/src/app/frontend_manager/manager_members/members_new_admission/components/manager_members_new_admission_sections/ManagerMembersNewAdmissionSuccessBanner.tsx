'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, IdCard, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface AdmittedStudentInfo {
  fullName: string;
  phone: string;
  smartId: string;
  seat: string;
  shift: string;
  plan: string;
  paymentMode: string;
  amountPaid: string;
}

interface ManagerMembersNewAdmissionSuccessBannerProps {
  student: AdmittedStudentInfo;
  onReset: () => void;
}

export function ManagerMembersNewAdmissionSuccessBanner({
  student,
  onReset,
}: ManagerMembersNewAdmissionSuccessBannerProps) {
  const [showWhatsAppConfirm, setShowWhatsAppConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  let cleanPhone = student.phone.replace(/\D/g, '');
  if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);

  const handleConfirmSendWhatsApp = () => {
    setShowWhatsAppConfirm(false);
    const text = encodeURIComponent(
      `Hello ${student.fullName}, welcome to Central Library! 🎓\n\n` +
      `Your admission is successfully confirmed:\n` +
      `• Smart ID: ${student.smartId}\n` +
      `• Assigned Seat: ${student.seat || 'General Study'}\n` +
      `• Shift: ${student.shift}\n` +
      `• Plan: ${student.plan}\n` +
      `• Payment Mode: ${student.paymentMode}\n\n` +
      `Your digital ID card has been generated. Please keep these details handy during your library visits.\n\n` +
      `— Central Library Administration`
    );

    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${targetPhone}?text=${text}`;
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) {
      popup.opener = null;
    }
    toast.success(`WhatsApp message opened for ${student.fullName} (+91 ${cleanPhone})`);
  };

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    onReset();
  };

  return (
    <>
      <div
        className="mt-4 p-5 rounded-2xl bg-success-bg border border-success text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-2"
        role="status"
        data-testid="manager-admission-success-banner"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface border border-success text-success flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Admission Registered Successfully for {student.fullName}!
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Smart ID: <strong className="text-foreground font-mono">{student.smartId}</strong> • Seat: <strong className="text-foreground">{student.seat || 'General'}</strong> • Shift: <strong className="text-foreground">{student.shift}</strong> • Plan: <strong className="text-foreground">{student.plan}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* BUG-18 & BUG-19: Confirmation before WhatsApp with PII & accessible label */}
            <button
              type="button"
              onClick={() => setShowWhatsAppConfirm(true)}
              aria-label="Send Welcome and ID Card via WhatsApp to student"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              title="Send Welcome & ID Card via WhatsApp"
            >
              <MessageSquare size={15} />
              <span>Send ID Card via WhatsApp</span>
            </button>

            {/* BUG-21: Avoid passing PII (phone, name) in query parameters */}
            <Link
              href={`/frontend_manager/manager_members/members_id_card_generator?id=${encodeURIComponent(student.smartId)}`}
              aria-label="View digital ID card for student"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-foreground hover:bg-surface-hover transition-colors"
            >
              <IdCard size={15} />
              <span>View ID Card</span>
            </Link>

            {/* BUG-20: Confirmation before resetting/clearing admission state */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              aria-label="Start new admission for another student"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Admit Another</span>
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Confirmation Dialog (BUG-18) */}
      {showWhatsAppConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4" role="dialog" aria-modal="true" aria-labelledby="wa-confirm-title">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 id="wa-confirm-title" className="text-base font-bold text-foreground">Confirm WhatsApp Dispatch</h4>
                <p className="text-xs text-muted-foreground">Verify recipient before sending admission credentials.</p>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to send the digital admission slip and ID card to{' '}
              <strong className="text-foreground">{student.fullName}</strong> at{' '}
              <strong className="text-foreground font-mono">+91 {cleanPhone}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWhatsAppConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendWhatsApp}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog (BUG-20) */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4" role="dialog" aria-modal="true" aria-labelledby="reset-confirm-title">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-warning text-warning flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 id="reset-confirm-title" className="text-base font-bold text-foreground">Admit Another Student?</h4>
                <p className="text-xs text-muted-foreground">Clear current admission confirmation.</p>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Have you noted or shared the assigned Smart ID (<strong className="text-foreground font-mono">{student.smartId}</strong>)? Resetting will clear this confirmation banner and prepare the form for a new student.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-surface"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
              >
                Yes, Admit Another
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
