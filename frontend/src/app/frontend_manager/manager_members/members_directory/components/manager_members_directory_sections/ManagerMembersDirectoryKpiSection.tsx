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
  timeHorizonLabel = 'All Members',
}: ManagerMembersDirectoryKpiSectionProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const kpis: { id: string; tab: ManagerMembersDirectoryTab; label: string; value: number; icon: typeof Users; color: string; bg: string }[] = [
    { id: 'total', tab: 'All Members', label: tManagerUi('kpi_total_members'), value: totalMembers, icon: Users, color: 'text-info', bg: 'bg-info-bg' },
    { id: 'active', tab: 'Active Members', label: tManagerUi('member_status_active'), value: activeMembers, icon: UserCheck, color: 'text-success', bg: 'bg-success-bg' },
    { id: 'expired', tab: 'Expired Members', label: tManagerUi('member_status_expired'), value: expiredMembers, icon: UserX, color: 'text-danger', bg: 'bg-danger-bg' },
    { id: 'suspended', tab: 'Suspended Members', label: tManagerUi('member_status_suspended'), value: suspendedMembers, icon: UserMinus, color: 'text-warning', bg: 'bg-warning-bg' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => {
        const isSelected = activeTab === kpi.tab;
        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => onSelectTab?.(kpi.tab)}
            className={`mgr-card p-4 flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
              isSelected ? 'ring-2 ring-primary border-primary shadow-sm' : 'hover:border-primary'
            }`}
            title={`Quick filter: ${kpi.label}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary uppercase">{kpi.label}</p>
                <h3 data-testid={kpi.id === 'total' ? 'manager-members-total-count' : undefined} className="text-2xl font-black text-primary">
                  {kpi.value}
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border shrink-0">
              [{timeHorizonLabel}]
            </span>
          </button>
        );
      })}
    </div>
  );
}
