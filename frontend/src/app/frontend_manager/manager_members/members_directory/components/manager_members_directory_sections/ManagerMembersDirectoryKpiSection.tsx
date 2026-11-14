// RESPONSIBILITY: Render the members directory kpi section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { Users, UserCheck, UserX, UserMinus } from 'lucide-react';
import type { ManagerMembersDirectoryKpiSectionProps, ManagerMembersDirectoryTab } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export function ManagerMembersDirectoryKpiSection({
  totalMembers,
  activeMembers,
  expiredMembers,
  suspendedMembers,
  activeTab,
  onSelectTab,
  timeHorizonLabel = 'All Time',
}: ManagerMembersDirectoryKpiSectionProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const activeRate = totalMembers > 0 ? `${Math.round((activeMembers / totalMembers) * 100)}%` : '0%';

  const kpis = [
    {
      id: 'total',
      tab: 'All Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('kpi_total_members'),
      value: totalMembers,
      icon: Users,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/15 border border-indigo-500/30',
      valueColor: 'text-white',
      badge: timeHorizonLabel,
      badgeStyle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      subtext: 'All registered members',
      activeBorder: 'border-2 border-indigo-400 shadow-xl shadow-indigo-500/35 bg-gradient-to-br from-indigo-950/90 via-[#0e1138] to-[#0c0f28]',
      activeTopBar: 'bg-indigo-400 shadow-[0_0_14px_rgba(99,102,241,1)]',
      activeTag: 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/50',
    },
    {
      id: 'active',
      tab: 'Active Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('member_status_active'),
      value: activeMembers,
      icon: UserCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border border-emerald-500/30',
      valueColor: 'text-emerald-400',
      badge: `${activeRate} Active`,
      badgeStyle: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      subtext: 'Valid subscriptions',
      activeBorder: 'border-2 border-emerald-400 shadow-xl shadow-emerald-500/35 bg-gradient-to-br from-emerald-950/90 via-[#082218] to-[#0c0f28]',
      activeTopBar: 'bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,1)]',
      activeTag: 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50',
    },
    {
      id: 'expired',
      tab: 'Expired Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('member_status_expired'),
      value: expiredMembers,
      icon: UserX,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/15 border border-rose-500/30',
      valueColor: expiredMembers > 0 ? 'text-rose-400' : 'text-white',
      badge: expiredMembers > 0 ? `${expiredMembers} Expired` : '0 Expired',
      badgeStyle: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      subtext: 'Needs renewal',
      activeBorder: 'border-2 border-rose-400 shadow-xl shadow-rose-500/35 bg-gradient-to-br from-rose-950/90 via-[#280c18] to-[#0c0f28]',
      activeTopBar: 'bg-rose-400 shadow-[0_0_14px_rgba(244,63,94,1)]',
      activeTag: 'bg-rose-500/30 text-rose-300 border border-rose-400/50',
    },
    {
      id: 'suspended',
      tab: 'Suspended Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('member_status_suspended'),
      value: suspendedMembers,
      icon: UserMinus,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border border-amber-500/30',
      valueColor: suspendedMembers > 0 ? 'text-amber-400' : 'text-white',
      badge: suspendedMembers > 0 ? `${suspendedMembers} On Hold` : '0 On Hold',
      badgeStyle: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      subtext: 'Account on hold',
      activeBorder: 'border-2 border-amber-400 shadow-xl shadow-amber-500/35 bg-gradient-to-br from-amber-950/90 via-[#261708] to-[#0c0f28]',
      activeTopBar: 'bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,1)]',
      activeTag: 'bg-amber-500/30 text-amber-300 border border-amber-400/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-6 w-full max-w-full min-w-0 px-1 py-1">
      {kpis.map((kpi) => {
        const isSelected = activeTab === kpi.tab;
        return (
          <button
            key={kpi.id}
            type="button"
            data-testid={`manager-kpi-card-${kpi.id}`}
            onClick={() => onSelectTab?.(kpi.tab)}
            className={`relative overflow-hidden rounded-xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 text-left transition-all cursor-pointer ${
              isSelected
                ? `${kpi.activeBorder} scale-[1.01] -translate-y-0.5 z-10 opacity-100`
                : 'border border-indigo-500/20 bg-[#0c0f28]/95 hover:border-indigo-400/50 hover:bg-[#101438] opacity-80 hover:opacity-100 shadow-md'
            }`}
            title={`Quick filter: ${kpi.label}`}
          >
            {/* Top glowing accent bar when selected */}
            {isSelected && (
              <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.activeTopBar}`} />
            )}

            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {kpi.label}
                </span>
                {isSelected && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${kpi.activeTag}`}>
                    Active
                  </span>
                )}
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon size={16} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span
                  data-testid={kpi.id === 'total' ? 'manager-members-total-count' : `manager-members-${kpi.id}-count`}
                  className={`text-xl sm:text-2xl font-black tracking-tight ${kpi.valueColor}`}
                >
                  {kpi.value}
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${kpi.badgeStyle}`}>
                  {kpi.badge}
                </span>
              </div>
              <p className={`mt-1 text-[11px] truncate ${isSelected ? 'text-slate-300 font-medium' : 'text-slate-400'}`}>
                {kpi.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
