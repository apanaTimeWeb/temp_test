// RESPONSIBILITY: Render the members directory kpi section section of the components feature. It does not own backend persistence or cross-feature business logic.
import '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_styles/ManagerMembersDirectoryStyles.css';
import type { ManagerMembersDirectoryKpiSectionProps, ManagerMembersDirectoryTab } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { UserCheck,UserMinus,Users,UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
      iconBg: 'bg-indigo-500/20 border border-indigo-500/40',
      valueColor: 'text-white',
      badge: timeHorizonLabel,
      badgeStyle: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      subtext: 'All registered members',
      stroke: '#818cf8',
      unselectedBg: 'border-indigo-500/30 md-kpi-total-idle hover:border-indigo-400/60 shadow-lg shadow-indigo-950/30',
      activeBorder: 'border-2 border-indigo-400 shadow-xl shadow-indigo-500/40 md-kpi-total-active',
      activeTopBar: 'bg-indigo-400 md-kpi-total-bar',
      activeTag: 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/50',
    },
    {
      id: 'active',
      tab: 'Active Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('member_status_active'),
      value: activeMembers,
      icon: UserCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 border border-emerald-500/40',
      valueColor: 'text-emerald-400',
      badge: `${activeRate} Active`,
      badgeStyle: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      subtext: 'Valid subscriptions',
      stroke: '#34d399',
      unselectedBg: 'border-emerald-500/30 md-kpi-active-idle hover:border-emerald-400/60 shadow-lg shadow-emerald-950/30',
      activeBorder: 'border-2 border-emerald-400 shadow-xl shadow-emerald-500/40 md-kpi-active-sel',
      activeTopBar: 'bg-emerald-400 md-kpi-active-bar',
      activeTag: 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50',
    },
    {
      id: 'expired',
      tab: 'Expired Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('member_status_expired'),
      value: expiredMembers,
      icon: UserX,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/20 border border-rose-500/40',
      valueColor: expiredMembers > 0 ? 'text-rose-400' : 'text-white',
      badge: expiredMembers > 0 ? `${expiredMembers} Expired` : '0 Expired',
      badgeStyle: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
      subtext: 'Needs renewal',
      stroke: '#f87171',
      unselectedBg: 'border-rose-500/30 md-kpi-expired-idle hover:border-rose-400/60 shadow-lg shadow-rose-950/30',
      activeBorder: 'border-2 border-rose-400 shadow-xl shadow-rose-500/40 md-kpi-expired-sel',
      activeTopBar: 'bg-rose-400 md-kpi-expired-bar',
      activeTag: 'bg-rose-500/30 text-rose-300 border border-rose-400/50',
    },
    {
      id: 'suspended',
      tab: 'Suspended Members' as ManagerMembersDirectoryTab,
      label: tManagerUi('member_status_suspended'),
      value: suspendedMembers,
      icon: UserMinus,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20 border border-amber-500/40',
      valueColor: suspendedMembers > 0 ? 'text-amber-400' : 'text-white',
      badge: suspendedMembers > 0 ? `${suspendedMembers} On Hold` : '0 On Hold',
      badgeStyle: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      subtext: 'Account on hold',
      stroke: '#fbbf24',
      unselectedBg: 'border-amber-500/30 md-kpi-suspended-idle hover:border-amber-400/60 shadow-lg shadow-amber-950/30',
      activeBorder: 'border-2 border-amber-400 shadow-xl shadow-amber-500/40 md-kpi-suspended-sel',
      activeTopBar: 'bg-amber-400 md-kpi-suspended-bar',
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
            className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 text-left transition-all duration-300 cursor-pointer ${
              isSelected
                ? `${kpi.activeBorder} scale-[1.01] -translate-y-0.5 z-10 opacity-100 shadow-xl`
                : `${kpi.unselectedBg} opacity-85 hover:opacity-100 hover:scale-[1.01]`
            }`}
            title={`Quick filter: ${kpi.label}`}
          >
            {/* Top glowing accent bar when selected */}
            {isSelected && (
              <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.activeTopBar}`} />
            )}

            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-28 h-14 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke={kpi.stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="flex items-center justify-between gap-2 min-w-0 relative z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`text-xs font-semibold uppercase tracking-wider truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {kpi.label}
                </span>
                {isSelected && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${kpi.activeTag}`}>
                    Active
                  </span>
                )}
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover:scale-110 ${kpi.iconBg} ${kpi.iconColor}`}>
                <kpi.icon size={18} />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  data-testid={kpi.id === 'total' ? 'manager-members-total-count' : `manager-members-${kpi.id}-count`}
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${kpi.valueColor}`}
                >
                  {kpi.value}
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${kpi.badgeStyle}`}>
                  {kpi.badge}
                </span>
              </div>
              <p className={`mt-1 text-xs truncate ${isSelected ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                {kpi.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
