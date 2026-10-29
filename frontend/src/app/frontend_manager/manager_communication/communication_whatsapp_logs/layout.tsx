import '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_styles/ManagerCommunicationWhatsappLogsManager_whatsapp_logs.css';
export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="communication-theme">{children}</div>;
}
