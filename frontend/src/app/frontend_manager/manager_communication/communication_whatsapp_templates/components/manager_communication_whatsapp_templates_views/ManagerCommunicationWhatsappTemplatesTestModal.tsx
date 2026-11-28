'use client';

import { Send, Smartphone, X } from 'lucide-react';
import React, { useRef } from 'react';
import { useManagerWhatsappTemplatesDialogFocus } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDialogFocus';
import type { Template } from '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/hooks/ManagerCommunicationWhatsappTemplatesDemoRepository';

interface ManagerCommunicationWhatsappTemplatesTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplate: Template;
  templateLabel: string;
  testPhone: string;
  setTestPhone: (phone: string) => void;
  onSendTest: () => void;
  previewText: string;
  tManagerUi: (k: string) => string;
}

export function ManagerCommunicationWhatsappTemplatesTestModal({
  isOpen,
  onClose,
  activeTemplate,
  templateLabel,
  testPhone,
  setTestPhone,
  onSendTest,
  previewText,
  tManagerUi,
}: ManagerCommunicationWhatsappTemplatesTestModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerWhatsappTemplatesDialogFocus(dialogRef, onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-wa-test-title"
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Smartphone size={16} />
            </div>
            <div>
              <h2 id="manager-wa-test-title" className="text-base font-bold text-primary">
                {tManagerUi('send_test_message')}
              </h2>
              <p className="text-[11px] text-secondary">
                {templateLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            aria-label={tManagerUi('close')}
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-secondary leading-relaxed">
          {tManagerUi('enter_a_phone_number_to_send_a_test_version_of_this_temp_49ebdb')}
        </p>

        <div>
          <label htmlFor="test-phone-number-input" className="text-xs font-semibold text-primary block mb-1.5">
            {tManagerUi('phone_number')} (+91) *
          </label>
          <input
            id="test-phone-number-input"
            className="mgr-input h-11 text-sm font-mono w-full rounded-xl px-3.5"
            placeholder="9876543210"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            autoFocus
          />
        </div>

        <div className="p-3.5 rounded-xl bg-surface-highlight border border-border text-xs text-secondary space-y-1">
          <span className="font-semibold text-primary block text-[11px] uppercase tracking-wider">
            Message Preview:
          </span>
          <p className="line-clamp-3 text-xs leading-relaxed italic text-secondary">
            {previewText}
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="mgr-btn-secondary text-xs sm:text-sm h-10 px-4 rounded-xl cursor-pointer w-full sm:w-auto"
          >
            {tManagerUi('cancel')}
          </button>
          <button
            type="button"
            onClick={onSendTest}
            className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer motion-safe:transition-colors w-full sm:w-auto"
          >
            <Send size={14} />
            <span>{tManagerUi('send_test')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
