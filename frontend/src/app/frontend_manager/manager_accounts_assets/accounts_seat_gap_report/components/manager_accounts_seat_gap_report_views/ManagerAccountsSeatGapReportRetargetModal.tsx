'use client';

import type { GapRow } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/hooks/ManagerAccountsSeatGapReportDemoRepository';
import {
Check,
CheckCircle2,
Clock,
Copy,
Gift,
Megaphone,
Percent,
Send,
Sparkles,
Target,
X
} from 'lucide-react';
import { useEffect,useMemo,useState } from 'react';
import { toast } from 'sonner';

export interface MatchingLead {
  id: string;
  name: string;
  phone: string;
  inquiryDate: string;
  preferredShift: string;
  preferredFloor: string;
  budget: string;
  intent: 'Hot' | 'Warm' | 'Trial';
}

export const DEMO_INQUIRY_LEADS: MatchingLead[] = [
  {
    id: 'lead-1',
    name: 'Amit Verma',
    phone: '+91 98765 11223',
    inquiryDate: '2 days ago',
    preferredShift: 'Morning',
    preferredFloor: '1st',
    budget: '₹1,000/mo',
    intent: 'Hot',
  },
  {
    id: 'lead-2',
    name: 'Sneha Gupta',
    phone: '+91 98112 44556',
    inquiryDate: 'Yesterday',
    preferredShift: 'Morning',
    preferredFloor: '1st',
    budget: '₹1,200/mo',
    intent: 'Hot',
  },
  {
    id: 'lead-3',
    name: 'Kunal Roy',
    phone: '+91 99887 66554',
    inquiryDate: '3 days ago',
    preferredShift: 'Afternoon',
    preferredFloor: '2nd',
    budget: '₹900/mo',
    intent: 'Warm',
  },
  {
    id: 'lead-4',
    name: 'Divya Sharma',
    phone: '+91 97654 32188',
    inquiryDate: 'Today',
    preferredShift: 'Night',
    preferredFloor: '1st',
    budget: '₹1,500/mo',
    intent: 'Hot',
  },
  {
    id: 'lead-5',
    name: 'Pooja Mehra',
    phone: '+91 98223 99881',
    inquiryDate: '4 days ago',
    preferredShift: 'Morning',
    preferredFloor: '2nd',
    budget: '₹1,000/mo',
    intent: 'Trial',
  },
];

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
  const [customDiscount, setCustomDiscount] = useState<string>('100');

  // Filter matching leads based on seat's shift
  const matchingLeads = useMemo(() => {
    if (!seat) return DEMO_INQUIRY_LEADS;
    const shiftKeyword = seat.shift.toLowerCase();
    // Prioritize leads whose preferred shift is in the seat shift
    return DEMO_INQUIRY_LEADS.filter((l) => {
      if (shiftKeyword.includes('morning') && l.preferredShift.toLowerCase() === 'morning') return true;
      if (shiftKeyword.includes('afternoon') && l.preferredShift.toLowerCase() === 'afternoon') return true;
      if (shiftKeyword.includes('night') && l.preferredShift.toLowerCase() === 'night') return true;
      return true; // Return all leads as fallback pool
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

  const activeLead = useMemo(() => {
    return matchingLeads.find((l) => l.id === selectedLeadId) || matchingLeads[0];
  }, [matchingLeads, selectedLeadId]);

  // Generate customized WhatsApp retargeting pitch
  const generatedMessage = useMemo(() => {
    if (!seat || !activeLead) return '';
    let discountText = 'Special ₹100 instant registration waiver if claimed today!';
    if (selectedOfferType === 'trial') {
      discountText = 'Complimentary 2-Day free study trial pass included!';
    } else if (selectedOfferType === 'percent') {
      discountText = 'Flat 10% discount on your first monthly admission!';
    } else if (selectedOfferType === 'immediate') {
      discountText = 'Priority reservation holding valid until 6 PM today!';
    }

    return (
      `👋 *Hello ${activeLead.name}!*\n\n` +
      `Great news from *Central Study Hub*: A premium seat matching your inquiry has just opened up!\n\n` +
      `📍 *Seat Details:*\n` +
      `• Seat Number: *${seat.seatNo}*\n` +
      `• Floor: ${seat.floor}\n` +
      `• Shift: *${seat.shift}*\n` +
      `• Amenities: High-speed Wi-Fi, AC, Ergonomic study desk\n\n` +
      `🎁 *Exclusive Offer:* ${discountText}\n\n` +
      `Since this shift fills fast, reply *YES* to lock your seat or visit our front desk to complete admission.`
    );
  }, [seat, activeLead, selectedOfferType]);

  const handleCopyMessage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      toast.success('Retargeting WhatsApp offer copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    if (!activeLead) return;
    const cleanPhone = activeLead.phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(generatedMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
    toast.success(`WhatsApp seat offer dispatched to ${activeLead.name}!`);
    if (onOfferSent) onOfferSent(activeLead, selectedOfferType);
  };

  const handleBroadcastAll = () => {
    toast.success(
      `Broadcast offer sent to all ${matchingLeads.length} matching leads for ${seat?.seatNo}!`
    );
    if (onOfferSent && activeLead) onOfferSent(activeLead, 'broadcast_all');
    onClose();
  };

  if (!isOpen || !seat) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="retarget-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-highlight/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="retarget-modal-title" className="text-base font-bold text-primary">
                  Seat Retargeting: Match Inquiries & Send Offer
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {seat.seatNo} • {seat.shift}
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Convert idle vacancy ({seat.gapDays} days gap) into active revenue with targeted offers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Vacant Seat Opportunity Stats */}
        <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-amber-300 font-medium">
              Vacant duration: <strong className="text-white">{seat.gapDays} days</strong>
            </span>
            <span className="text-border">•</span>
            <span className="text-rose-300 font-medium">
              Revenue Lost: <strong className="text-rose-200">₹{(seat.revenueLoss / 100).toLocaleString('en-IN')}</strong>
            </span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-md">
            🎯 {matchingLeads.length} Matching Student Leads Found
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Step 1: Select Matching Lead */}
          <div>
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">
              1. Select Interested Student Lead
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchingLeads.map((lead) => {
                const isSelected = selectedLeadId === lead.id;
                return (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-500/60 bg-purple-500/15 shadow-sm text-primary'
                        : 'border-border bg-card hover:bg-surface-hover text-secondary'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-primary">{lead.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            lead.intent === 'Hot'
                              ? 'bg-rose-500/20 text-rose-400'
                              : lead.intent === 'Trial'
                              ? 'bg-sky-500/20 text-sky-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {lead.intent}
                        </span>
                      </div>
                      <p className="text-[10px] text-secondary">
                        {lead.phone} • Inquired: {lead.inquiryDate}
                      </p>
                      <p className="text-[10px] text-purple-300/80">
                        Prefers: {lead.preferredShift} ({lead.budget})
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 size={16} className="text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Offer Incentive */}
          <div>
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">
              2. Select Offer Incentive
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: 'early_bird',
                  label: '₹100 Waiver',
                  desc: 'Instant joining discount',
                  icon: Gift,
                },
                {
                  id: 'trial',
                  label: '2-Day Trial',
                  desc: 'Free trial pass',
                  icon: Sparkles,
                },
                {
                  id: 'percent',
                  label: 'Flat 10% Off',
                  desc: 'First month discount',
                  icon: Percent,
                },
                {
                  id: 'immediate',
                  label: 'Priority Hold',
                  desc: 'Reserved till 6 PM',
                  icon: Megaphone,
                },
              ].map((offer) => {
                const Icon = offer.icon;
                const isSelected = selectedOfferType === offer.id;
                return (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => setSelectedOfferType(offer.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400 font-bold shadow-xs'
                        : 'border-border bg-card hover:bg-surface-hover text-secondary'
                    }`}
                  >
                    <Icon size={16} className="mx-auto mb-1" />
                    <p className="text-xs leading-tight font-semibold">{offer.label}</p>
                    <p className="text-[10px] opacity-75 mt-0.5">{offer.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Live WhatsApp Offer Bubble Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                3. Live WhatsApp Offer Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs text-secondary hover:text-primary flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b141a] border border-[#202c33] text-slate-100 font-sans shadow-sm">
              <div className="max-w-md ml-auto bg-[#005c4b] p-3 rounded-xl rounded-tr-xs space-y-1 text-xs">
                <p className="whitespace-pre-wrap leading-relaxed select-text font-normal">
                  {generatedMessage}
                </p>
                <div className="text-right text-[10px] text-emerald-200/70 pt-0.5">
                  Today, 10:45 AM • Double Tick
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-4 sm:p-5 border-t border-border bg-surface-highlight/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBroadcastAll}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Send to all matching leads"
            >
              <Megaphone size={13} />
              <span>Broadcast to All ({matchingLeads.length})</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              style={{
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
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
