'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, IdCard, UserPlus } from 'lucide-react';
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
  const cleanPhone = student.phone.replace(/\D/g, '');

  const handleSendWhatsApp = () => {
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
    const popup = window.open(url, '_blank');
    if (popup) {
      popup.opener = null;
    }
    toast.success(`WhatsApp message opened for ${student.fullName} (+91 ${cleanPhone})`);
  };

  return (
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
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
            title="Send Welcome & ID Card via WhatsApp"
          >
            <MessageSquare size={15} />
            <span>Send ID Card via WhatsApp</span>
          </button>

          <Link
            href={`/frontend_manager/manager_members/members_id_card_generator?id=${encodeURIComponent(student.smartId)}&name=${encodeURIComponent(student.fullName)}&phone=${encodeURIComponent(student.phone)}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-foreground hover:bg-surface-hover transition-colors"
          >
            <IdCard size={15} />
            <span>View ID Card</span>
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <UserPlus size={14} />
            <span>Admit Another</span>
          </button>
        </div>
      </div>
    </div>
  );
}
