import type { z } from 'zod';
import { managerComplaintsComplaintResponseSchema } from '@/app/frontend_manager/manager_communication/communication_complaints/schemas/ManagerCommunicationComplaintsSchema';
export const MANAGER_COMPLAINTS_API_FIXTURES = [
 {id:'test-complaint-001',subject:'AC Water Leakage',description:'Water is dripping from the AC unit directly onto desk workspace.',createdAt:'2026-10-14',status:'open',student:'Aman Verma',phone:'9876543210',seatTag:'Seat S-14 (Hall A)',priority:'Urgent'},
 {id:'test-complaint-002',subject:'Wi-Fi Signal Drop',description:'5GHz Wi-Fi disconnecting intermittently during study hours.',createdAt:'2026-10-15',status:'in_progress',student:'Pooja Sharma',phone:'9876543211',seatTag:'Discussion Room 2',priority:'Normal'},
 {id:'test-complaint-003',subject:'Noise & Whispering',description:'Loud conversation near reading cubicles.',createdAt:'2026-10-16',status:'resolved',student:'Rohan Gupta',phone:'9876543212',seatTag:'Seat S-08 (Silent Zone)',priority:'Normal'},
 {id:'test-complaint-004',subject:'Broken Desk Armrest',description:'Chair tilt mechanism jammed and armrest wobbling.',createdAt:'2026-10-17',status:'open',student:'Neha Singh',phone:'9876543213',seatTag:'Seat S-22 (Row 3)',priority:'Normal'},
] satisfies Array<z.infer<typeof managerComplaintsComplaintResponseSchema>>;
export const MANAGER_COMPLAINTS_EMPTY_FIXTURE: typeof MANAGER_COMPLAINTS_API_FIXTURES = [];
