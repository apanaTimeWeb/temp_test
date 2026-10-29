export type ManagerCommunicationComplaintsComplaintStatus = 'Open' | 'In-Progress' | 'Resolved';
export type ManagerCommunicationComplaintsComplaint = { id:string; title:string; student:string|null; description:string; status:ManagerCommunicationComplaintsComplaintStatus; date:string; resolvedBy:string|null; resolvedDate:string|null; resolvedNote:string|null };
