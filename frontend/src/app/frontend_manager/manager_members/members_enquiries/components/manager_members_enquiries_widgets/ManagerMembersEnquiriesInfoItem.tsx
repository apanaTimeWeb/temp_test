
import type { ManagerMembersEnquiriesInfoItemProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
export type { ManagerMembersEnquiriesInfoItemProps };
// RESPONSIBILITY: Render the members enquiries info item component within the components feature. It does not own backend persistence or cross-feature business logic.



export function ManagerMembersEnquiriesInfoItem({ icon, label, value }: ManagerMembersEnquiriesInfoItemProps) {
  return <div><p className="crm-info-item-label">{icon}{label}</p><p className="crm-info-item-value">{value}</p></div>;
}
