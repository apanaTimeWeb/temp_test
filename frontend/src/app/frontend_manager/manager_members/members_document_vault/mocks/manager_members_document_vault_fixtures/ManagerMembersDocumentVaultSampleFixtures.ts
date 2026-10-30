/** Illustrative document metadata only; no file bytes or storage records are present. */
export type ManagerMembersDocumentVaultSampleRecord = {
  id: string;
  name: string;
  type: 'PDF' | 'Image' | 'Document';
  size: string;
  uploadedBy: string;
  date: string;
  category: 'ID Proof' | 'Finance' | 'Study Material' | 'Other';
};

export const MANAGER_DOCUMENTS_SAMPLE_RECORDS: readonly ManagerMembersDocumentVaultSampleRecord[] = [
  { id: 'DOC-101', name: 'Aadhar_Rahul_Sharma.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Rahul Sharma', date: '2026-06-01', category: 'ID Proof' },
  { id: 'DOC-102', name: 'Photo_Sneha.jpg', type: 'Image', size: '1.1 MB', uploadedBy: 'Sneha Gupta', date: '2026-06-02', category: 'ID Proof' },
  { id: 'DOC-103', name: 'Fee_Receipt_Amit.pdf', type: 'PDF', size: '0.8 MB', uploadedBy: 'System', date: '2026-06-02', category: 'Finance' },
  { id: 'DOC-104', name: 'UPSC_Syllabus.docx', type: 'Document', size: '3.5 MB', uploadedBy: 'Manager', date: '2026-06-03', category: 'Study Material' },
  { id: 'DOC-105', name: 'College_ID_Priya_Verma.pdf', type: 'PDF', size: '1.8 MB', uploadedBy: 'Priya Verma', date: '2026-06-04', category: 'ID Proof' },
  { id: 'DOC-106', name: 'Driving_License_Vikas.pdf', type: 'PDF', size: '2.1 MB', uploadedBy: 'Vikas Mishra', date: '2026-06-05', category: 'ID Proof' },
  { id: 'DOC-107', name: 'Security_Deposit_Slip_Rahul.pdf', type: 'PDF', size: '0.6 MB', uploadedBy: 'Rahul Sharma', date: '2026-06-05', category: 'Finance' },
  { id: 'DOC-108', name: 'Annual_Invoice_Enterprise.pdf', type: 'PDF', size: '1.4 MB', uploadedBy: 'System', date: '2026-06-06', category: 'Finance' },
  { id: 'DOC-109', name: 'Current_Affairs_Compendium.pdf', type: 'PDF', size: '4.2 MB', uploadedBy: 'Manager', date: '2026-06-07', category: 'Study Material' },
  { id: 'DOC-110', name: 'Mock_Test_Schedule.pdf', type: 'PDF', size: '1.0 MB', uploadedBy: 'Staff', date: '2026-06-08', category: 'Study Material' },
  { id: 'DOC-111', name: 'Library_Rules_Undertaking.pdf', type: 'PDF', size: '0.9 MB', uploadedBy: 'Ananya Gupta', date: '2026-06-09', category: 'Other' },
  { id: 'DOC-112', name: 'Locker_Agreement_Form.pdf', type: 'PDF', size: '1.2 MB', uploadedBy: 'Rohan Mehra', date: '2026-06-10', category: 'Other' },
];
