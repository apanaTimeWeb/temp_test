'use client';

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type {
  MemberPaymentRecord,
  ReceiptPreview,
  WaiverSlipPreview,
} from '@/app/frontend_admin/admin_members/members_directory/utils/adminMembersDirectoryDetailPrint';
import { Award, FileText, MessageSquare, Receipt, ShieldCheck } from 'lucide-react';

interface AdminMembersDirectoryDetailPaymentTabProps {
  member: AdminMembersMember;
  paymentRecords: readonly MemberPaymentRecord[];
  totalWaivedAmount: number;
  onOpenWaiverModal: () => void;
  onPreviewWaiverSlip: (slip: WaiverSlipPreview) => void;
  onPreviewReceipt: (receipt: ReceiptPreview) => void;
}

export function AdminMembersDirectoryDetailPaymentTab({
  member,
  paymentRecords,
  totalWaivedAmount,
  onOpenWaiverModal,
  onPreviewWaiverSlip,
  onPreviewReceipt,
}: AdminMembersDirectoryDetailPaymentTabProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl border border-info bg-info-bg">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-info-text" aria-hidden="true" />
            <span className="text-xs font-bold text-info-text">Admin Exclusive Authority: Fee Concessions & Waivers</span>
          </div>
          <p className="text-[11px] text-text-primary mt-0.5">
            Branch managers cannot alter fee rates or grant discounts. Use official Admin authority to sanction EWS, merit scholarships, or late fee waivers.
          </p>
        </div>
        <button type="button" onClick={onOpenWaiverModal} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-on-primary font-semibold text-xs motion-safe:transition-colors shrink-0 shadow-card">
          <Award size={14} aria-hidden="true" /> Grant Fee Waiver / Discount
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-success bg-success-bg p-4"><p className="text-xs font-semibold uppercase text-success-text">Total Billed</p><p className="mt-1 text-2xl font-bold text-text-primary font-mono">₹28,000</p><p className="text-xs text-text-secondary mt-0.5">Lifetime fee billing</p></div>
        <div className="rounded-xl border border-info bg-info-bg p-4"><p className="text-xs font-semibold uppercase text-info-text">Total Paid</p><p className="mt-1 text-2xl font-bold text-text-primary font-mono">₹28,000</p><p className="text-xs text-text-secondary mt-0.5">100% payments settled</p></div>
        <div className="rounded-xl border border-border-focus bg-primary-subtle p-4"><p className="text-xs font-semibold uppercase text-primary">Total Waived</p><p className="mt-1 text-2xl font-bold text-primary font-mono">₹{totalWaivedAmount.toLocaleString('en-IN')}</p><p className="text-xs text-text-secondary mt-0.5">Admin credit notes</p></div>
        <div className="rounded-xl border border-success bg-success-bg p-4"><p className="text-xs font-semibold uppercase text-success-text">Balance Due</p><p className="mt-1 text-2xl font-bold text-success-text font-mono">₹0.00</p><p className="text-xs text-success-text font-semibold mt-0.5">No outstanding dues</p></div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-highlight text-text-secondary uppercase">
            <tr><th className="p-3 font-semibold">Receipt / Memo No</th><th className="p-3 font-semibold">Date</th><th className="p-3 font-semibold">Particulars</th><th className="p-3 font-semibold">Amount</th><th className="p-3 font-semibold">Mode & Ref</th><th className="p-3 font-semibold">Status</th><th className="p-3 font-semibold">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paymentRecords.map((p) => (
              <tr key={p.id} className={p.isWaiver ? 'bg-info-bg hover:opacity-95 motion-safe:transition-opacity' : 'hover:bg-surface-hover motion-safe:transition-colors'}>
                <td className="p-3 font-mono font-semibold text-text-primary"><div className="flex items-center gap-1.5">{p.isWaiver && <Award size={13} className="text-info-text shrink-0" aria-hidden="true" />}<span>{p.id}</span></div></td>
                <td className="p-3 text-text-secondary">{p.date}</td>
                <td className="p-3 font-medium text-text-primary">{p.title}{p.reason && <p className="text-[11px] text-info-text font-normal mt-0.5">{p.reason}</p>}</td>
                <td className={`p-3 font-bold font-mono ${p.isWaiver ? 'text-info-text' : 'text-success-text'}`}>{p.amount}</td>
                <td className="p-3 text-text-secondary">{p.mode}</td>
                <td className="p-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${p.isWaiver ? 'border-info bg-info-bg text-info-text' : 'border-success bg-success-bg text-success-text'}`}>{p.status}</span></td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    {p.isWaiver ? (
                      <button type="button" onClick={() => onPreviewWaiverSlip({ id: p.id, date: p.date, title: p.title, amount: p.amount.replace('-', ''), category: p.category || 'Special Concession', reason: p.reason || 'Admin Approved' })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-info bg-info-bg text-[11px] font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity">
                        <FileText size={12} aria-hidden="true" /> Concession Order
                      </button>
                    ) : (
                      <button type="button" onClick={() => onPreviewReceipt({ id: p.id, date: p.date, title: p.title, amount: p.amount, mode: p.mode, ref: p.ref })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card text-[11px] font-semibold text-info-text hover:bg-surface-hover motion-safe:transition-colors">
                        <Receipt size={12} aria-hidden="true" /> Receipt
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const msg = encodeURIComponent(p.isWaiver ? `Smart Library Concession Order: ${p.id}\nStudent: ${member.name} (${member.id})\nApproved Waiver: ${p.amount}\nCategory: ${p.category}\nAuthorized by Master Admin.` : `Smart Library Receipt: ${p.id}\nMember: ${member.name}\nAmount: ${p.amount}\nDate: ${p.date}\nStatus: Verified.`);
                        window.open(`https://wa.me/?text=${msg}`, '_blank');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-success bg-success-bg text-[11px] font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity"
                      title={p.isWaiver ? 'Share Concession on WhatsApp' : 'Share Receipt on WhatsApp'}
                      aria-label={p.isWaiver ? 'Share Concession on WhatsApp' : 'Share Receipt on WhatsApp'}
                    >
                      <MessageSquare size={12} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
