import '@/app/frontend_manager/manager_communication/communication_complaints/components/manager_communication_complaints_styles/ManagerCommunicationComplaintsManager_complaints.css';
export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="communication-theme">{children}</div>;
}
