export type ManagerMembersGroupAdmissionQueryValue = string | string[] | undefined;

export interface ManagerMembersGroupAdmissionSearchParams {
  view?: ManagerMembersGroupAdmissionQueryValue;
  id?: ManagerMembersGroupAdmissionQueryValue;
  name?: ManagerMembersGroupAdmissionQueryValue;
  phone?: ManagerMembersGroupAdmissionQueryValue;
  smartId?: ManagerMembersGroupAdmissionQueryValue;
}

export interface ManagerMembersGroupAdmissionMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
