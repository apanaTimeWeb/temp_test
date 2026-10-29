import '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_styles/ManagerCommunicationNotificationCenterManager_notification_center.css';
export default function CommunicationModuleLayout({ children }: { children: React.ReactNode }) {
  return <div className="communication-theme">{children}</div>;
}
