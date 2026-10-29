export type ManagerCommunicationNotificationCenterNotice = {
  id: string;
  title: string;
  message: string;
  validTill: string;
  postedBy: string;
  postedDate: string;
  status: 'Active' | 'Expired';
};

export type ManagerCommunicationNotificationCenterComplaintStatus = 'Open' | 'In-Progress' | 'Resolved';

export type ManagerCommunicationNotificationCenterComplaint = {
  id: string;
  title: string;
  student: string | null;
  isAnonymous?: boolean;
  description: string;
  status: ManagerCommunicationNotificationCenterComplaintStatus;
  date: string;
  resolvedBy: string | null;
  resolvedDate: string | null;
  resolvedNote: string | null;
};
