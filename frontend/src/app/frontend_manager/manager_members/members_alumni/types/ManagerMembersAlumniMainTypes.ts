export type ManagerMembersAlumniQueryValue = string | string[] | undefined;

export interface ManagerMembersAlumniSearchParams {
  view?: ManagerMembersAlumniQueryValue;
  id?: ManagerMembersAlumniQueryValue;
  name?: ManagerMembersAlumniQueryValue;
  phone?: ManagerMembersAlumniQueryValue;
  smartId?: ManagerMembersAlumniQueryValue;
}

export interface ManagerMembersAlumniMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
