'use client';

import '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_styles/ManagerAccountsSeatGapReportStyles.css';
import { ManagerAccountsSeatGapReportRetargetSelectors } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportRetargetSelectors';
import {
  DEMO_INQUIRY_LEADS,
  type MatchingLead,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/config/manager_accounts_seat_gap_report.demo_data';
import type { GapRow } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import {
  buildRetargetWhatsAppMessage,
  formatSeatGapMinorInr,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/utils/ManagerAccountsSeatGapReportHelpers';
import { Check, Clock, Copy, Megaphone, Send, Target, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export { DEMO_INQUIRY_LEADS };
export type { MatchingLead };

export interface ManagerAccountsSeatGapReportRetargetModalProps {
  isOpen: boolean;
  seat: GapRow | null;
  onClose: () => void;
  onOfferSent?: (lead: MatchingLead, offerType: string) => void;
}

export function ManagerAccountsSeatGapReportRetargetModal({
  isOpen,
  seat,
  onClose,
  onOfferSent,
}: ManagerAccountsSeatGapReportRetargetModalProps) {
  const [selectedOfferType, setSelectedOfferType] = useState<string>('early_bird');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const matchingLeads = useMemo(() => {
    if (!seat) return DEMO_INQUIRY_LEADS;
    const shiftKeyword = seat.shift.toLowerCase();
    return DEMO_INQUIRY_LEADS.filter((l) => {
      if (shiftKeyword.includes('morning') && l.preferredShift.toLowerCase() === 'morning') return true;
      if (shiftKeyword.includes('afternoon') && l.preferredShift.toLowerCase() === 'afternoon') return true;
      if (shiftKeyword.includes('night') && l.preferredShift.toLowerCase() === 'night') return true;
      return true;
    });
  }, [seat]);

  useEffect(() => {
    if (matchingLeads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(matchingLeads[0].id);
    }
  }, [matchingLeads, selectedLeadId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeLead = useMemo(() => matchingLeads.find((l) => l.id === selectedLeadId) || matchingLeads[0], [matchingLeads, selectedLeadId]);

  const generatedMessage = useMemo(() => {
    if (!seat || !activeLead) return '';
    return buildRetargetWhatsAppMessage(seat, activeLead, selectedOfferType);
  }, [seat, activeLead, selectedOfferType]);

  const handleCopyMessage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      toast.success('Retargeting WhatsApp offer copied!', { id: 'manager-seat-gap-copy-wa' });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    if (!activeLead) return;
    const cleanPhone = activeLead.phone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedMessage)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
    toast.success(`WhatsApp seat offer dispatched to ${activeLead.name}!`, { id: 'manager-seat-gap-send-wa' });
    onOfferSent?.(activeLead, selectedOfferType);
  };

  const handleBroadcastAll = () => {
    toast.success(`Broadcast offer sent to all ${matchingLeads.length} matching leads for ${seat?.seatNo}!`, {
      id: 'manager-seat-gap-broadcast',
    });
    if (onOfferSent && activeLead) onOfferSent(activeLead, 'broadcast_all');
    onClose();
  };

  if (!isOpen || !seat) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="retarget-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs motion-safe:animate-in fade-in motion-safe:duration-fast overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-4">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-highlight">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="retarget-modal-title" className="text-base font-bold text-primary">Seat Retargeting: Match Inquiries & Send Offer</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {seat.seatNo} • {seat.shift}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">Convert idle vacancy ({seat.gapDays} days gap) into active revenue with targeted offers</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-amber-300 font-medium">Vacant duration: <strong className="text-white">{seat.gapDays} days</strong></span>
            <span className="text-border">•</span>
            <span className="text-rose-300 font-medium">
              Revenue Lost: <strong className="text-rose-200">{formatSeatGapMinorInr(seat.revenueLoss)}</strong>
            </span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-md">
            🎯 {matchingLeads.length} Matching Student Leads Found
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <ManagerAccountsSeatGapReportRetargetSelectors
            matchingLeads={matchingLeads}
            selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId}
            selectedOfferType={selectedOfferType}
            onSelectOfferType={setSelectedOfferType}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">3. Live WhatsApp Offer Message Preview</label>
              <button type="button" onClick={handleCopyMessage} className="text-xs text-secondary hover:text-primary flex items-center gap-1 cursor-pointer">
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl sgr-wa-preview-box border text-slate-100 font-sans shadow-sm">
              <div className="max-w-md ml-auto sgr-wa-bubble p-3 rounded-xl rounded-tr-xs space-y-1 text-xs">
                <p className="whitespace-pre-wrap leading-relaxed select-text font-normal">{generatedMessage}</p>
                <div className="text-right text-[10px] text-emerald-200 opacity-75 pt-0.5">Today, 10:45 AM • Double Tick</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-4 sm:p-5 border-t border-border bg-surface-highlight">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleBroadcastAll} className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold motion-safe:transition-colors cursor-pointer" title="Send to all matching leads">
              <Megaphone size={13} />
              <span>Broadcast to All ({matchingLeads.length})</span>
            </button>
            <button type="button" onClick={handleSendWhatsApp} className="sgr-wa-send-btn inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md motion-safe:transition-all cursor-pointer">
              <Send size={13} />
              <span>Send WhatsApp Offer to {activeLead?.name || 'Student'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsSeatGapReportRetargetModal;
