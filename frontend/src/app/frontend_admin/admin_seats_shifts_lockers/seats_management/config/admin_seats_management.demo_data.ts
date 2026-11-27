import {
  type AdminSeatsSeatStatus,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/constants/AdminSeatsManagementConstants';

export interface AdminSeatsDemoSeat {
  id: string;
  seatNo: string;
  branch: string;
  status: AdminSeatsSeatStatus;
  assignedTo: string;
  lastMaintenance: string;
}

export const ADMIN_SEATS_DEMO_SEATS: AdminSeatsDemoSeat[] = [
  { id: '1', seatNo: 'S-042', branch: 'Downtown Central', status: 'Working', assignedTo: 'Elias Hawthorne', lastMaintenance: 'Oct 14, 2024' },
  { id: '2', seatNo: 'S-109', branch: 'Westside Branch', status: 'Maintenance', assignedTo: '—', lastMaintenance: 'Today' },
  { id: '3', seatNo: 'S-012', branch: 'North Hub', status: 'Broken', assignedTo: '—', lastMaintenance: 'Pending' },
  { id: '4', seatNo: 'S-088', branch: 'Downtown Central', status: 'Working', assignedTo: 'Seraphina Vane', lastMaintenance: 'Nov 02, 2024' },
];
