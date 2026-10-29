import type { z } from 'zod';
import { managerComplaintsComplaintResponseSchema } from '@/app/frontend_manager/manager_communication/communication_complaints/schemas/ManagerCommunicationComplaintsSchema';
export const MANAGER_COMPLAINTS_API_FIXTURES = [
 {id:'test-complaint-001',subject:'Access issue',description:'Unable to access the portal.',createdAt:'2026-10-14',status:'open'},
 {id:'test-complaint-002',subject:'Billing question',description:'Clarification requested.',createdAt:'2026-10-15',status:'in_progress'},
 {id:'test-complaint-003',subject:'Resolved issue',description:'Issue resolved.',createdAt:'2026-10-16',status:'resolved'},
 {id:'test-complaint-004',subject:'Service issue',description:'Service follow-up requested.',createdAt:'2026-10-17',status:'open'},
] satisfies Array<z.infer<typeof managerComplaintsComplaintResponseSchema>>;
export const MANAGER_COMPLAINTS_EMPTY_FIXTURE: typeof MANAGER_COMPLAINTS_API_FIXTURES = [];
