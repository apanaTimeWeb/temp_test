'use client';

import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { Calendar, CheckCircle2, Clock, Gift, Receipt, Trash2, X } from 'lucide-react';

export function ManagerMembersReferralBonusTableRow({
  row,
  onApprove,
  onApplyToRenewal,
  onDeleteReferral,
}: {
  row: ReferralRow;
  onApprove: (id: string) => void;
  onApplyToRenewal: (referral: ReferralRow) => void;
  onDeleteReferral?: (id: string) => void;
}) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover motion-safe:transition-colors">
      <td className="py-3 px-4 font-mono font-bold text-primary text-xs align-middle whitespace-nowrap">{row.id}</td>
      <td className="py-3 px-4 font-semibold text-primary text-xs align-middle whitespace-nowrap">{row.referrer}</td>
      <td className="py-3 px-4 text-primary text-xs align-middle whitespace-nowrap">{row.referred}</td>
      <td className="py-3 px-4 text-secondary text-xs align-middle whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-primary shrink-0" /><span>{row.date}</span></span>
      </td>
      <td className="py-3 px-4 font-bold text-success text-xs font-mono align-middle whitespace-nowrap">{row.bonus}</td>
      <td className="py-3 px-4 text-secondary text-xs align-middle whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5"><Gift size={13} className="text-warning shrink-0" /><span>{row.method}</span></span>
      </td>
      <td className="py-3 px-4 align-middle whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.status === 'Adjusted in Renewal' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : row.status === 'Credited' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
          {row.status === 'Adjusted in Renewal' ? <Receipt size={12} className="shrink-0 text-indigo-400" /> : row.status === 'Credited' ? <CheckCircle2 size={12} className="shrink-0 text-success" /> : <Clock size={12} className="shrink-0 text-warning" />}
          <span>{row.status}</span>
        </span>
      </td>
      <td className="py-3 px-4 text-right align-middle whitespace-nowrap">
        <div className="inline-flex items-center gap-1.5 justify-end">
          {row.status === 'Adjusted in Renewal' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <CheckCircle2 size={12} className="shrink-0 text-indigo-400" />
              <span>Adjusted (-{row.bonus})</span>
            </span>
          ) : (
            <>
              {row.status === 'Pending' && (
                <button type="button" onClick={() => onApprove(row.id)} className="mgr-btn-primary text-xs h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg font-semibold motion-safe:transition-colors" title="Approve referral">
                  <CheckCircle2 size={13} className="shrink-0 text-on-primary" /><span>Approve</span>
                </button>
              )}
              <button type="button" onClick={() => onApplyToRenewal(row)} className="inline-flex items-center gap-1.5 text-xs h-8 px-2.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm motion-safe:transition-colors cursor-pointer" title={`Apply ${row.bonus} referral discount to ${row.referrer}'s next monthly fee renewal`} data-testid={`apply-renewal-btn-${row.id}`}>
                <Receipt size={13} className="shrink-0 text-white" /><span>Apply to Renewal</span>
              </button>
            </>
          )}
          {onDeleteReferral && (
            <button type="button" onClick={() => onDeleteReferral(row.id)} className="inline-flex items-center justify-center p-1.5 h-8 w-8 rounded-lg border border-border text-danger hover:border-danger hover:bg-danger-bg motion-safe:transition-colors" title={`Remove referral ${row.id}`} aria-label={`Remove referral ${row.id}`}>
              <Trash2 size={14} className="shrink-0 text-danger" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function ManagerMembersReferralBonusDeleteModal({
  deleteTarget,
  onCancel,
  onConfirm,
}: {
  deleteTarget: ReferralRow | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!deleteTarget) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs motion-safe:animate-in fade-in" role="dialog" aria-modal="true" aria-labelledby="delete-referral-dialog-title">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xl motion-safe:animate-in zoom-in-95 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-danger-bg text-danger border border-border flex items-center justify-center mb-3.5 shrink-0">
          <Trash2 size={22} className="text-danger shrink-0" />
        </div>
        <h3 id="delete-referral-dialog-title" className="text-base font-bold text-primary">Remove Referral Record?</h3>
        <p className="text-xs text-secondary mt-1.5 leading-relaxed">
          Are you sure you want to remove referral <strong className="text-primary font-semibold">{deleteTarget.id}</strong> for <strong className="text-primary font-semibold">{deleteTarget.referred}</strong>? This action cannot be undone.
        </p>
        <div className="grid grid-cols-2 gap-2.5 w-full mt-5">
          <button type="button" onClick={onCancel} className="mgr-btn mgr-btn-secondary text-xs h-9 px-3 rounded-lg font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
            <X size={14} className="text-secondary shrink-0" /><span>Cancel</span>
          </button>
          <button type="button" onClick={onConfirm} className="inline-flex items-center justify-center gap-1.5 text-xs h-9 px-3 rounded-lg font-semibold bg-danger text-white hover:opacity-90 motion-safe:transition-colors shadow-sm cursor-pointer">
            <Trash2 size={14} className="text-white shrink-0" /><span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
