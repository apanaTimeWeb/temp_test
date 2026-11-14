// FLOW: Feature source -> superadmin_support/support_complaints/types/SuperadminSupportComplaintsTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Support Complaints types; owns only the complaint resource contract. */
import type { SUPERADMIN_SUPPORT_COMPLAINT_STATUS, SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS } from '../constants/SuperadminSupportComplaintsStaticConstants';

export type SuperadminSupportComplaintStatus = typeof SUPERADMIN_SUPPORT_COMPLAINT_STATUS[keyof typeof SUPERADMIN_SUPPORT_COMPLAINT_STATUS];
export type SuperadminSupportComplaintStatusFilter = typeof SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS[number];

/**
 * Defines the public SuperadminSupportComplaint contract for support complaints. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property title Display label for the owning feature. Declared type: string.
 * @property student Value defined by the existing feature-local contract. Declared type: string.
 * @property isAnonymous Boolean state used by the owning feature. Declared type: boolean.
 * @property description Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminSupportComplaintStatus.
 * @property date Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property resolvedBy Value defined by the existing feature-local contract. Declared type: string.
 * @property resolvedDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property resolvedNote Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminSupportComplaint {
  id: string;
  title: string;
  student: string;
  isAnonymous: boolean;
  description: string;
  status: SuperadminSupportComplaintStatus;
  date: string;
  resolvedBy: string;
  resolvedDate: string;
  resolvedNote: string;
}
