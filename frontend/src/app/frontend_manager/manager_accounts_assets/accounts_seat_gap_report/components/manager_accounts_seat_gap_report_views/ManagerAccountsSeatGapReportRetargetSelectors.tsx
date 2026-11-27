'use client';

import type { MatchingLead } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/config/manager_accounts_seat_gap_report.demo_data';
import { formatSeatGapInrRupees } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/utils/ManagerAccountsSeatGapReportHelpers';
import { CheckCircle2, Gift, Megaphone, Percent, Tag } from 'lucide-react';

interface ManagerAccountsSeatGapReportRetargetSelectorsProps {
  matchingLeads: MatchingLead[];
  selectedLeadId: string;
  onSelectLead: (id: string) => void;
  selectedOfferType: string;
  onSelectOfferType: (id: string) => void;
}

export function ManagerAccountsSeatGapReportRetargetSelectors({
  matchingLeads,
  selectedLeadId,
  onSelectLead,
  selectedOfferType,
  onSelectOfferType,
}: ManagerAccountsSeatGapReportRetargetSelectorsProps) {
  const offerOptions = [
    { id: 'early_bird', label: `${formatSeatGapInrRupees(100)} Waiver`, desc: 'Instant joining discount', icon: Gift },
    { id: 'trial', label: '2-Day Trial', desc: 'Free trial pass', icon: Tag },
    { id: 'percent', label: 'Flat 10% Off', desc: 'First month discount', icon: Percent },
    { id: 'immediate', label: 'Priority Hold', desc: 'Reserved till 6 PM', icon: Megaphone },
  ];

  return (
    <>
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
                onClick={() => onSelectLead(lead.id)}
                className={`p-2.5 rounded-xl border text-left motion-safe:transition-all cursor-pointer flex items-center justify-between ${
                  isSelected ? 'border-purple-500/60 bg-purple-500/15 shadow-sm text-primary' : 'border-border bg-card hover:bg-surface-hover text-secondary'
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
                  <p className="text-[10px] text-secondary">{lead.phone} • Inquired: {lead.inquiryDate}</p>
                  <p className="text-[10px] text-purple-300 opacity-80">Prefers: {lead.preferredShift} ({lead.budget})</p>
                </div>
                {isSelected && <CheckCircle2 size={16} className="text-purple-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">
          2. Select Offer Incentive
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {offerOptions.map((offer) => {
            const Icon = offer.icon;
            const isSelected = selectedOfferType === offer.id;
            return (
              <button
                key={offer.id}
                type="button"
                onClick={() => onSelectOfferType(offer.id)}
                className={`p-2.5 rounded-xl border text-center motion-safe:transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400 font-bold shadow-xs' : 'border-border bg-card hover:bg-surface-hover text-secondary'
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
    </>
  );
}
