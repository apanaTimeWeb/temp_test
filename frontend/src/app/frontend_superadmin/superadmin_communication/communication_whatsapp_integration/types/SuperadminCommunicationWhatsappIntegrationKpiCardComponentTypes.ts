// RESPONSIBILITY: Define compile-time types for communication whatsapp integration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_communication/communication_whatsapp_integration/types/SuperadminCommunicationWhatsappIntegrationKpiCardComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminCommunicationWhatsappIntegrationKpiCard.tsx. */
export interface SuperadminSystemKpiCardProps {
  title: string; value: string | number; subtitle?: string; icon?: string;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string; className?: string;
}
