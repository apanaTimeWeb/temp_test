export type ManagerCommunicationWhatsappTemplatesNotice = {
  id: string;
  title: string;
  message: string;
  validTill: string;
  postedBy: string;
  postedDate: string;
  status: 'Active' | 'Expired';
};

export type ManagerCommunicationWhatsappTemplatesComplaintStatus = 'Open' | 'In-Progress' | 'Resolved';

export type ManagerCommunicationWhatsappTemplatesComplaint = {
  id: string;
  title: string;
  student: string | null;
  isAnonymous?: boolean;
  description: string;
  status: ManagerCommunicationWhatsappTemplatesComplaintStatus;
  date: string;
  resolvedBy: string | null;
  resolvedDate: string | null;
  resolvedNote: string | null;
};
