'use client';

import React from 'react';
import { Receipt, X, Printer, MessageSquare, Mail, Smartphone } from 'lucide-react';
import type { ManagerReceiptRecord } from './ManagerFinanceFinesPaymentsFinesAndPaymentsPage';

export interface ManagerFinanceFinesPaymentsReceiptModalProps {
  receipt: ManagerReceiptRecord | null;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  onPrint: (receipt: ManagerReceiptRecord) => void;
  onShareWhatsApp: (receipt: ManagerReceiptRecord) => void;
  onShareEmail: (receipt: ManagerReceiptRecord) => void;
  onShareSms: (receipt: ManagerReceiptRecord) => void;
}

export default function ManagerFinanceFinesPaymentsReceiptModal({
  receipt,
  onClose,
  formatCurrency,
  onPrint,
  onShareWhatsApp,
  onShareEmail,
  onShareSms,
}: ManagerFinanceFinesPaymentsReceiptModalProps) {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop backdrop-blur-xs p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden motion-safe:animate-scale-up">
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface-highlight">
          <div className="flex items-center gap-2">
            <Receipt className="text-primary" size={20} />
            <h3 className="font-bold text-primary text-base">Receipt Details — {receipt.receiptNumber}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-card text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-highlight border border-border text-xs font-mono">
            <div>
              <span className="text-secondary block">Transaction ID</span>
              <span className="font-bold text-primary">{receipt.txnId}</span>
            </div>
            <div>
              <span className="text-secondary block">Receipt Number</span>
              <span className="font-bold text-primary">{receipt.receiptNumber}</span>
            </div>
            <div>
              <span className="text-secondary block">Member</span>
              <span className="font-bold text-primary">{receipt.member}</span>
            </div>
            <div>
              <span className="text-secondary block">Contact Phone</span>
              <span className="text-primary">+91 {receipt.phone}</span>
            </div>
            <div>
              <span className="text-secondary block">Membership Plan</span>
              <span className="font-semibold text-primary">{receipt.plan}</span>
            </div>
            <div>
              <span className="text-secondary block">Payment Mode</span>
              <span className="font-semibold text-primary uppercase">{receipt.mode}</span>
            </div>
            <div>
              <span className="text-secondary block">Date & Time</span>
              <span className="text-primary">{receipt.date}</span>
            </div>
            <div>
              <span className="text-secondary block">Collected By</span>
              <span className="font-semibold text-primary">{receipt.collectedBy}</span>
            </div>
            <div>
              <span className="text-secondary block">Payment Status</span>
              <span className="mgr-badge mgr-badge--success text-xs font-bold">{receipt.status}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-sm">
            <div className="flex justify-between text-secondary">
              <span>Base Fee:</span>
              <span>{formatCurrency(receipt.amount - receipt.lateFee)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Late Fee:</span>
              <span className={receipt.lateFee > 0 ? 'text-amber-600 font-bold' : ''}>{formatCurrency(receipt.lateFee)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-base text-primary">
              <span>Total Paid:</span>
              <span className="text-success">{formatCurrency(receipt.amount)}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Share & Print Options</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onPrint(receipt)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary transition-colors cursor-pointer"
              >
                <Printer size={14} /> Print
              </button>
              <button
                type="button"
                onClick={() => onShareWhatsApp(receipt)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <MessageSquare size={14} /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => onShareEmail(receipt)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Mail size={14} /> Email
              </button>
              <button
                type="button"
                onClick={() => onShareSms(receipt)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Smartphone size={14} /> SMS
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-surface-highlight flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mgr-btn-secondary mgr-btn-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

