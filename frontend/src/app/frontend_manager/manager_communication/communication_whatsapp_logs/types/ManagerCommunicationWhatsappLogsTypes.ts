export type ManagerCommunicationWhatsappLogsNotice = {
  id: string;
  title: string;
  message: string;
  validTill: string;
  postedBy: string;
  postedDate: string;
  status: 'Active' | 'Expired';
};

export type ManagerCommunicationWhatsappLogsComplaintStatus = 'Open' | 'In-Progress' | 'Resolved';

export type ManagerCommunicationWhatsappLogsComplaint = {
  id: string;
  title: string;
  student: string | null;
  isAnonymous?: boolean;
  description: string;
  status: ManagerCommunicationWhatsappLogsComplaintStatus;
  date: string;
  resolvedBy: string | null;
  resolvedDate: string | null;
  resolvedNote: string | null;
};
