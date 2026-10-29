import type { z } from 'zod';
import { managerNoticesNoticeResponseSchema } from '@/app/frontend_manager/manager_communication/communication_notices/schemas/ManagerCommunicationNoticesSchema';
export const MANAGER_NOTICES_API_FIXTURES = [
 { id:'test-notice-001', title:'Maintenance Notice', message:'Scheduled maintenance window.', createdAt:'2026-10-14', validTill:'2026-11-14' },
 { id:'test-notice-002', title:'Holiday Notice', message:'Office holiday schedule.', createdAt:'2026-10-15', validTill:'2026-10-20' },
 { id:'test-notice-003', title:'Safety Notice', message:'Review the safety guidance.', createdAt:'2026-10-16', validTill:'2026-12-16' },
 { id:'test-notice-004', title:'Service Notice', message:'Service desk hours updated.', createdAt:'2026-10-17', validTill:'2026-11-17' },
] satisfies Array<z.infer<typeof managerNoticesNoticeResponseSchema>>;
export const MANAGER_NOTICES_EMPTY_FIXTURE: typeof MANAGER_NOTICES_API_FIXTURES = [];
