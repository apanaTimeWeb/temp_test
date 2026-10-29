// RESPONSIBILITY: Render the members directory kpi section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { Users, UserCheck, UserX, UserMinus } from 'lucide-react';
import type { ManagerMembersDirectoryKpiSectionProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';

export function ManagerMembersDirectoryKpiSection({ totalMembers, activeMembers, expiredMembers, suspendedMembers }: ManagerMembersDirectoryKpiSectionProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  return (
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { id: 'total', label: tManagerUi('kpi_total_members'), value: totalMembers, icon: Users, color: 'text-info', bg: 'bg-info-bg' },
          { id: 'active', label: tManagerUi('member_status_active'), value: activeMembers, icon: UserCheck, color: 'text-success', bg: 'bg-success-bg' },
          { id: 'expired', label: tManagerUi('member_status_expired'), value: expiredMembers, icon: UserX, color: 'text-danger', bg: 'bg-danger-bg' },
          { id: 'suspended', label: tManagerUi('member_status_suspended'), value: suspendedMembers, icon: UserMinus, color: 'text-warning', bg: 'bg-warning-bg' },
        ].map((kpi) => (
          <div key={kpi.id} className="mgr-card p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-secondary uppercase">{kpi.label}</p>
              <h3 data-testid={kpi.id === 'total' ? 'manager-members-total-count' : undefined} className="text-2xl font-black text-primary">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>
  );
}
