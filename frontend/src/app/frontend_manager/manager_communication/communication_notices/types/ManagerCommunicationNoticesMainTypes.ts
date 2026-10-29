export type ManagerCommunicationNoticesQueryValue = string | string[] | undefined;

export interface ManagerCommunicationNoticesSearchParams {
  view?: ManagerCommunicationNoticesQueryValue;
  id?: ManagerCommunicationNoticesQueryValue;
  name?: ManagerCommunicationNoticesQueryValue;
  phone?: ManagerCommunicationNoticesQueryValue;
  smartId?: ManagerCommunicationNoticesQueryValue;
}

export interface ManagerCommunicationNoticesMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
