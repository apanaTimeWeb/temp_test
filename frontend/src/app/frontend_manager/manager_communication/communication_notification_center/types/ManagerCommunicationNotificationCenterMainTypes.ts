export type ManagerCommunicationNotificationCenterQueryValue = string | string[] | undefined;

export interface ManagerCommunicationNotificationCenterSearchParams {
  view?: ManagerCommunicationNotificationCenterQueryValue;
  id?: ManagerCommunicationNotificationCenterQueryValue;
  name?: ManagerCommunicationNotificationCenterQueryValue;
  phone?: ManagerCommunicationNotificationCenterQueryValue;
  smartId?: ManagerCommunicationNotificationCenterQueryValue;
}

export interface ManagerCommunicationNotificationCenterMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
