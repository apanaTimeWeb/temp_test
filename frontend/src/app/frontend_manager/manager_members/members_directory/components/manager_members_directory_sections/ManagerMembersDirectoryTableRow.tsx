'use client';

import { MANAGER_MEMBERS_STATUS_BADGES } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';
import { displayValue } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDisplayValue';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { Eye, IndianRupee, MessageCircle, ShieldCheck } from 'lucide-react';

interface ManagerMembersDirectoryTableRowProps {
  member: ManagerMembersDirectoryRecord;
  locale: string;
  onSelectMemberProfile: (id: string) => void;
  onPreviewMember: (member: ManagerMembersDirectoryRecord) => void;
  onQuickCollectFee: (e: React.MouseEvent, member: ManagerMembersDirectoryRecord) => void;
  onQuickWhatsApp?: (member: ManagerMembersDirectoryRecord) => void;
  tManagerUi: (key: string) => string;
}

export function ManagerMembersDirectoryTableRow({
  member,
  locale,
  onSelectMemberProfile,
  onPreviewMember,
  onQuickCollectFee,
  onQuickWhatsApp,
  tManagerUi,
}: ManagerMembersDirectoryTableRowProps) {
  const badge = (MANAGER_MEMBERS_STATUS_BADGES as Record<string, { readonly className: string; readonly labelKey: string }>)[member.status];

  return (
    <tr
      onClick={() => onSelectMemberProfile(member.id)}
      className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface h-12 cursor-pointer motion-safe:transition-colors group"
      title={`Click to view profile of ${member.name} (${member.id})`}
    >
      <td className="px-3 py-3 align-middle">
        <span className="font-mono text-primary font-semibold group-hover:underline">{member.id}</span>
      </td>
      <td className="px-3 py-3 align-middle font-bold text-primary group-hover:text-primary-hover">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewMember(member);
            }}
            className="w-8 h-8 rounded-full border border-primary bg-surface-zebra flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary motion-safe:transition-all text-xs font-bold text-primary"
            title={`Preview Photo & KYC of ${member.name}`}
          >
            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </button>
          <div>
            <span className="block leading-tight">{member.name}</span>
            <span className="text-[11px] text-secondary font-normal block">
              {member.seat ? `Seat ${member.seat}` : 'General'} · {member.shift || 'Morning'}
            </span>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 align-middle">{maskManagerMemberPhone(member.phone)}</td>
      <td className="px-3 py-3 align-middle">
        <span className="mgr-badge mgr-badge--info">{member.type}</span>
      </td>
      <td className="px-3 py-3 align-middle">
        <span className={`mgr-badge ${badge?.className ?? 'mgr-badge--neutral'}`}>
          {badge ? tManagerUi(badge.labelKey) : tManagerUi('status_unknown')}
        </span>
      </td>
      <td className="px-3 py-3 align-middle">{formatManagerMemberDirectoryCalendarDate(displayValue(member.expiryDate), locale)}</td>
      <td className="px-3 py-3 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => onQuickCollectFee(e, member)}
            className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 motion-safe:transition-all cursor-pointer shadow-sm shadow-emerald-950/50"
            title={`Collect Fee / Renew Plan for ${member.name}`}
            aria-label={`Collect Fee for ${member.name}`}
          >
            <IndianRupee size={13} />
            <span className="hidden lg:inline text-xs font-semibold ml-1">Fee</span>
          </button>

          {onQuickWhatsApp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickWhatsApp(member);
              }}
              aria-label={`Send WhatsApp message to ${member.name}`}
              className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 motion-safe:transition-all cursor-pointer shadow-sm shadow-emerald-950/50"
              title={`Send WhatsApp to ${member.name}`}
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline text-xs font-semibold ml-1">WhatsApp</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewMember(member);
            }}
            className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/35 hover:text-purple-200 motion-safe:transition-all cursor-pointer shadow-sm shadow-purple-950/50"
            title={`Preview Photo & KYC for ${member.name}`}
          >
            <ShieldCheck size={13} />
            <span className="hidden md:inline text-xs font-semibold ml-1">KYC</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMemberProfile(member.id);
            }}
            className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 motion-safe:transition-all cursor-pointer shadow-sm shadow-sky-950/50"
            title={`View profile of ${member.name}`}
          >
            <Eye size={13} />
            <span className="text-xs font-semibold ml-1">View</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
