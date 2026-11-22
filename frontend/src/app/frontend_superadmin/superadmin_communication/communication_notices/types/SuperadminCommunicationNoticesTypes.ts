// FLOW: Feature source -> superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Communication Notices types; owns only the notice resource contract. */
export interface SuperadminCommunicationNotice {
  id: string;
  title: string;
  message: string;
  validTill: string;
  postedBy: string;
  postedDate: string;
  status: 'Active' | 'Expired';
}
