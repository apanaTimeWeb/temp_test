export type ManagerCommunicationComplaintsQueryValue = string | string[] | undefined;

export interface ManagerCommunicationComplaintsSearchParams {
  view?: ManagerCommunicationComplaintsQueryValue;
  id?: ManagerCommunicationComplaintsQueryValue;
  name?: ManagerCommunicationComplaintsQueryValue;
  phone?: ManagerCommunicationComplaintsQueryValue;
  smartId?: ManagerCommunicationComplaintsQueryValue;
}

export interface ManagerCommunicationComplaintsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
