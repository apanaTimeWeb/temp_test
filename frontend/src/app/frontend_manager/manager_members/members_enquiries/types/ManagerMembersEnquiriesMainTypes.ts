export type ManagerMembersEnquiriesQueryValue = string | string[] | undefined;

export interface ManagerMembersEnquiriesSearchParams {
  view?: ManagerMembersEnquiriesQueryValue;
  id?: ManagerMembersEnquiriesQueryValue;
  name?: ManagerMembersEnquiriesQueryValue;
  phone?: ManagerMembersEnquiriesQueryValue;
  smartId?: ManagerMembersEnquiriesQueryValue;
}

export interface ManagerMembersEnquiriesMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
