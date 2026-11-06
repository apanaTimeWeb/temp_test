'use client';

import { Send, CheckCircle, Phone, ExternalLink } from 'lucide-react';
import type { ManagerMembersEnquiriesEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { maskManagerEnquiriesPhone } from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';

export interface ManagerMembersEnquiriesBulkWhatsAppItemProps {
  enq: ManagerMembersEnquiriesEnquiry;
  index: number;
  isOpened: boolean;
  onSend: (enq: ManagerMembersEnquiriesEnquiry) => void;
  disabled: boolean;
}

export function ManagerMembersEnquiriesBulkWhatsAppItem({
  enq,
  index,
  isOpened,
  onSend,
  disabled,
}: ManagerMembersEnquiriesBulkWhatsAppItemProps) {
  return (
    <div
      className={`pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
        isOpened
          ? 'bg-success-bg border-border'
          : 'bg-surface-highlight border-border hover:border-primary'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-muted-foreground mt-0.5">#{index + 1}</span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground">{enq.name}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card border border-border text-foreground">
              {enq.status}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              {enq.shift}
            </span>
          </div>
          <p className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Phone size={11} className="text-primary" />
            <span>{maskManagerEnquiriesPhone(enq.phone)}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {isOpened ? (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success-bg text-success border border-border text-xs font-semibold">
            <CheckCircle size={13} />
            <span>Opened</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onSend(enq)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title={`Open WhatsApp for ${enq.name}`}
          >
            <Send size={12} />
            <span>Send WhatsApp</span>
            <ExternalLink size={11} className="opacity-75" />
          </button>
        )}
      </div>
    </div>
  );
}

