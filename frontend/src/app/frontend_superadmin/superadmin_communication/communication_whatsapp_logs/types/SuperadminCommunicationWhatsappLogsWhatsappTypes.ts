// FLOW: Feature source -> superadmin_communication/communication_whatsapp_logs/types/SuperadminCommunicationWhatsappLogsWhatsappTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Communication Whatsapp Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminCommunicationWhatsappMessageType = 'welcome' | 'fee_reminder' | 'receipt' | 'notice' | 'renewal';
/**
 * Defines the public SuperadminCommunicationWhatsappMessageStatus contract for communication whatsapp logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminCommunicationWhatsappMessageStatus = 'Pending' | 'Sent' | 'Delivered' | 'Failed';

/**
 * Defines the public SuperadminCommunicationWhatsappLog contract for communication whatsapp logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property dateTime Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property phone Value defined by the existing feature-local contract. Declared type: string.
 * @property student Value defined by the existing feature-local contract. Declared type: string.
 * @property type Value defined by the existing feature-local contract. Declared type: SuperadminCommunicationWhatsappMessageType.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminCommunicationWhatsappMessageStatus.
 * @property error User-safe error or explanatory message; raw exception details are not implied. Declared type: string.
 * @property message User-safe error or explanatory message; raw exception details are not implied. Declared type: string.
 */
export interface SuperadminCommunicationWhatsappLog {
  id: string;
  dateTime: string;
  phone: string;
  student: string;
  type: SuperadminCommunicationWhatsappMessageType;
  status: SuperadminCommunicationWhatsappMessageStatus;
  error: string;
  message: string;
}

/**
 * Defines the public SuperadminCommunicationWhatsappLogFilters contract for communication whatsapp logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property type Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: string.
 * @property search View state used to filter, sort, or page the current result set. Declared type: string.
 * @property dateFrom Value defined by the existing feature-local contract. Declared type: string.
 * @property dateTo Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminCommunicationWhatsappLogFilters {
  type: string;
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}
