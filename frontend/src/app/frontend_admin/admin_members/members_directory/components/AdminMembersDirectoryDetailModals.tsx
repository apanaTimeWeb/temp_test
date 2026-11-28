'use client';

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import {
  printWaiverSlipHtml,
  type DocPreview,
  type ReceiptPreview,
  type WaiverCategory,
  type WaiverSlipPreview,
} from '@/app/frontend_admin/admin_members/members_directory/utils/adminMembersDirectoryDetailPrint';
import { getAdminMembersDirectoryCurrencySymbol } from '@/app/frontend_admin/admin_members/members_directory/utils/formatAdminMembersDirectoryCurrency';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Award, Check, Download, FileText, MessageSquare, Printer, Receipt, ShieldCheck, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

const WAIVER_OPTIONS: readonly WaiverCategory[] = ['EWS_ASSISTANCE', 'MERIT_SCHOLARSHIP', 'LATE_FEE_WAIVER', 'SPECIAL_ADMIN_DISCRETION'];

interface AdminMembersDirectoryDetailModalsProps {
  member: AdminMembersMember;
  previewDoc: DocPreview | null;
  onCloseDoc: () => void;
  previewReceipt: ReceiptPreview | null;
  onCloseReceipt: () => void;
  showWaiverModal: boolean;
  onCloseWaiverModal: () => void;
  waiverCategory: WaiverCategory;
  onChangeWaiverCategory: (val: WaiverCategory) => void;
  waiverAmount: string;
  onChangeWaiverAmount: (val: string) => void;
  waiverReason: string;
  onChangeWaiverReason: (val: string) => void;
  onGrantWaiver: () => void;
  previewWaiverSlip: WaiverSlipPreview | null;
  onCloseWaiverSlip: () => void;
}

export function AdminMembersDirectoryDetailModals({
  member,
  previewDoc,
  onCloseDoc,
  previewReceipt,
  onCloseReceipt,
  showWaiverModal,
  onCloseWaiverModal,
  waiverCategory,
  onChangeWaiverCategory,
  waiverAmount,
  onChangeWaiverAmount,
  waiverReason,
  onChangeWaiverReason,
  onGrantWaiver,
  previewWaiverSlip,
  onCloseWaiverSlip,
}: AdminMembersDirectoryDetailModalsProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const currencySymbol = getAdminMembersDirectoryCurrencySymbol(useLocale());
  return (
    <>
      <Dialog open={previewDoc !== null} onOpenChange={(open) => { if (!open) onCloseDoc(); }}>
        <DialogContent className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-success-text" aria-hidden="true" /><DialogTitle className="text-sm font-bold text-text-primary">{previewDoc?.type} Preview</DialogTitle></div>
            <button type="button" onClick={onCloseDoc} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close document preview"><X size={18} aria-hidden="true" /></button>
          </div>
          {previewDoc && (
            <>
              <div className="rounded-xl border border-border bg-surface-highlight p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
                <div className="w-14 h-14 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center"><FileText size={28} aria-hidden="true" /></div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{member.name}</p>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">{previewDoc.number}</p>
                  <p className="text-[11px] text-success-text font-semibold mt-1">✓ {previewDoc.note || 'Government Identity Verified by Desk Manager'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary pt-2">
                <span>File: {previewDoc.fileName}</span>
                <button type="button" onClick={() => { toast.success(`Downloaded ${previewDoc.fileName}`, { id: 'admin-member-doc-download' }); onCloseDoc(); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-hover motion-safe:transition-colors">
                  <Download size={13} aria-hidden="true" /> Download
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={previewReceipt !== null} onOpenChange={(open) => { if (!open) onCloseReceipt(); }}>
        <DialogContent className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2"><Receipt size={18} className="text-success-text" aria-hidden="true" /><DialogTitle className="text-sm font-bold text-text-primary">Payment Voucher / Receipt</DialogTitle></div>
            <button type="button" onClick={onCloseReceipt} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close receipt preview"><X size={18} aria-hidden="true" /></button>
          </div>
          {previewReceipt && (
            <>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Receipt Number:</span><span className="font-mono font-bold text-text-primary">{previewReceipt.id}</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Member Name:</span><span className="font-semibold text-text-primary">{member.name} ({member.id})</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Billing Date:</span><span className="text-text-primary">{previewReceipt.date}</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Particulars:</span><span className="text-text-primary font-medium">{previewReceipt.title}</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Payment Method:</span><span className="text-text-primary">{previewReceipt.mode}</span></div>
                <div className="flex justify-between pt-1 text-sm font-bold"><span className="text-text-primary">Net Amount Settled:</span><span className="text-success-text font-mono">{previewReceipt.amount}</span></div>
                <div className="rounded-lg bg-success-bg border border-success p-2 text-center text-[11px] text-success-text font-semibold">✓ Confirmed & Reconciled in Central Treasury Ledger</div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button type="button" onClick={() => { toast.success(`Printed receipt ${previewReceipt.id}`, { id: 'admin-member-receipt-print' }); onCloseReceipt(); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover"><Printer size={13} aria-hidden="true" /> Print Slip</button>
                <button type="button" onClick={() => { toast.success(`Downloaded voucher ${previewReceipt.id}.pdf`, { id: 'admin-member-receipt-pdf' }); onCloseReceipt(); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success text-on-success font-semibold text-xs hover:opacity-90"><Download size={13} aria-hidden="true" /> Download PDF</button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showWaiverModal} onOpenChange={(open) => { if (!open) onCloseWaiverModal(); }}>
        <DialogContent className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-dialog space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-info-text" aria-hidden="true" /><DialogTitle className="text-sm font-bold text-text-primary">Admin Sanction: Grant Special Fee Waiver</DialogTitle></div>
            <button type="button" onClick={onCloseWaiverModal} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close fee waiver modal"><X size={18} aria-hidden="true" /></button>
          </div>
          <div className="rounded-xl border border-info bg-info-bg p-3 text-xs text-info-text">
            <p className="font-semibold">Member: {member.name} ({member.id}) · Plan: {member.plan}</p>
            <p className="text-[11px] text-text-primary mt-0.5">Fee concessions and late fee write-offs are reserved for Master Admin approval. An official credit memo will be generated.</p>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <label htmlFor="admin-waiver-category" className="block text-text-secondary font-medium mb-1">Concession Category / Scheme</label>
              <select
                id="admin-waiver-category"
                value={waiverCategory}
                onChange={(e) => {
                  const found = WAIVER_OPTIONS.find((item) => item === e.target.value);
                  if (found) onChangeWaiverCategory(found);
                }}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="EWS_ASSISTANCE">EWS Financial Hardship Concession (आर्थिक रूप से कमजोर छात्र)</option>
                <option value="MERIT_SCHOLARSHIP">Merit Scholarship Concession (मेधावी छात्र छात्रवृत्ति)</option>
                <option value="LATE_FEE_WAIVER">Late Fee Penalty Full/Partial Waive-Off (विलंब शुल्क माफी)</option>
                <option value="SPECIAL_ADMIN_DISCRETION">Admin Discretion Special Discount (विशेष एडमिन छूट)</option>
              </select>
            </div>
            <div>
              <label htmlFor="admin-waiver-amount" className="block text-text-secondary font-medium mb-1">{t('WAIVER_AMOUNT_LABEL')} ({currencySymbol})</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-text-secondary font-bold">{currencySymbol}</span>
                <input id="admin-waiver-amount" type="number" min="50" step="50" value={waiverAmount} onChange={(e) => onChangeWaiverAmount(e.target.value)} className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-input text-text-primary font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 1000" />
              </div>
            </div>
            <div>
              <label htmlFor="admin-waiver-reason" className="block text-text-secondary font-medium mb-1">{t('WAIVER_REASON_LABEL')}</label>
              <textarea id="admin-waiver-reason" maxLength={1000} rows={2} value={waiverReason} onChange={(e) => onChangeWaiverReason(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Reason for concession, income certificate / rank proof ref..." />
            </div>
            <div className="rounded-lg bg-surface-highlight border border-border p-2.5 flex items-center justify-between text-[11px]">
              <span className="text-text-secondary">Signing Authority:</span>
              <span className="font-semibold text-info-text">Master Operations Admin (Logged-in)</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={onCloseWaiverModal} className="px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-text-secondary hover:bg-surface-hover">{t('WAIVER_CANCEL')}</button>
            <button type="button" onClick={onGrantWaiver} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-hover shadow-card"><Check size={14} aria-hidden="true" /> {t('WAIVER_SUBMIT')}</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={previewWaiverSlip !== null} onOpenChange={(open) => { if (!open) onCloseWaiverSlip(); }}>
        <DialogContent className="relative w-full max-w-md rounded-2xl border border-info bg-card p-6 shadow-dialog space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2"><Award size={18} className="text-info-text" aria-hidden="true" /><DialogTitle className="text-sm font-bold text-text-primary">Official Concession Order</DialogTitle></div>
            <button type="button" onClick={onCloseWaiverSlip} className="text-text-secondary hover:text-text-primary p-1" aria-label="Close concession order"><X size={18} aria-hidden="true" /></button>
          </div>
          {previewWaiverSlip && (
            <>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Order Reference:</span><span className="font-mono font-bold text-info-text">{previewWaiverSlip.id}</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Beneficiary Student:</span><span className="font-semibold text-text-primary">{member.name} ({member.id})</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Concession Type:</span><span className="text-text-primary font-medium">{previewWaiverSlip.category}</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Sanction Date:</span><span className="text-text-primary">{previewWaiverSlip.date}</span></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-text-secondary">Justification:</span><span className="text-text-primary text-right max-w-xs">{previewWaiverSlip.reason}</span></div>
                <div className="flex justify-between pt-1 text-sm font-bold"><span className="text-text-primary">Approved Discount / Waiver:</span><span className="text-info-text font-mono text-base">{previewWaiverSlip.amount}</span></div>
                <div className="rounded-lg bg-info-bg border border-info p-2 text-center text-[11px] text-info-text font-semibold">✓ Sanctioned under Executive Admin Power · Dues Adjusted</div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button type="button" onClick={() => printWaiverSlipHtml(member, previewWaiverSlip)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-text-primary hover:bg-surface-hover"><Printer size={13} aria-hidden="true" /> Print Order Letter</button>
                <button type="button" onClick={() => { const popup = window.open(`https://wa.me/?text=${encodeURIComponent(`Smart Library Official Concession Notice:\nOrder: ${previewWaiverSlip.id}\nBeneficiary: ${member.name} (${member.id})\nApproved Concession: ${previewWaiverSlip.amount}\nCategory: ${previewWaiverSlip.category}\nAuthorized by Master Admin.`)}`, '_blank', 'noopener,noreferrer'); if (popup) popup.opener = null; }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success text-on-success font-semibold text-xs hover:opacity-90"><MessageSquare size={13} aria-hidden="true" /> WhatsApp Student</button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
