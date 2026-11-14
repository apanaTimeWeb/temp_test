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
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6 w-full max-w-full min-w-0">
      {kpis.map((kpi) => {
        const isSelected = activeTab === kpi.tab;
        return (
          <button
            key={kpi.id}
            type="button"
            data-testid={`manager-kpi-card-${kpi.id}`}
            onClick={() => onSelectTab?.(kpi.tab)}
            className={`rounded-2xl border bg-[#0c0f28]/95 p-4 sm:p-5 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer shadow-md hover:border-indigo-400 hover:shadow-lg ${
              isSelected
                ? 'ring-2 ring-indigo-500 border-indigo-400 bg-[#101438]/95'
                : 'border-indigo-500/25'
            }`}
            title={`Quick filter: ${kpi.label}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider truncate">
                {kpi.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon size={18} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <span
                  data-testid={kpi.id === 'total' ? 'manager-members-total-count' : `manager-members-${kpi.id}-count`}
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${kpi.valueColor}`}
                >
                  {kpi.value}
                </span>
                <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap ${kpi.badgeStyle}`}>
                  {kpi.badge}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400 truncate">
                {kpi.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
