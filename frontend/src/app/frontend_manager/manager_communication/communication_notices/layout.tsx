import '@/app/frontend_manager/manager_communication/communication_notices/components/manager_communication_notices_styles/ManagerCommunicationNoticesManager_notices.css';
export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="communication-theme">{children}</div>;
}
