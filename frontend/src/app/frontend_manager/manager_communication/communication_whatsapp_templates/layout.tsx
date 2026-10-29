import '@/app/frontend_manager/manager_communication/communication_whatsapp_templates/components/manager_communication_whatsapp_templates_styles/ManagerCommunicationWhatsappTemplatesManager_whatsapp_templates.css';
export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="communication-theme">{children}</div>;
}
