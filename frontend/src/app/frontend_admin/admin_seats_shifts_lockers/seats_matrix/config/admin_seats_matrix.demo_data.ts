import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';

const DEMO_STUDENT_NAMES = [
  'Aarav Sharma', 'Aditi Rao', 'Ananya Gupta', 'Aryan Verma', 'Bhavya Mishra',
  'Dev Patel', 'Diya Sen', 'Ishaan Malhotra', 'Kavya Nair', 'Manish Joshi',
  'Neha Choudhary', 'Pranav Kulkarni', 'Pooja Reddy', 'Rohan Saxena', 'Riya Kapoor',
  'Sahil Khan', 'Sanya Singhania', 'Siddharth Jain', 'Sneha Pillai', 'Tanvi Bhatia',
  'Utkarsh Pandey', 'Vaishnavi Mehta', 'Varun Dhawan', 'Zoya Sheikh',
];

const SHIFT_TYPES = ['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'];
const PLANS = ['Full Day Dedicated Desk', 'Flexi Shift Half Day', 'Night Owl Special', 'Weekend Warrior Pass'];

export function generateFallbackSeatMatrix(): AdminSeatMatrixSeatMatrixViewModel[] {
  const seats: AdminSeatMatrixSeatMatrixViewModel[] = [];

  for (let i = 1; i <= 24; i++) {
    const seatId = String(i).padStart(2, '0');
    let status: AdminSeatMatrixSeatMatrixViewModel['status'] = 'occupied';
    if (i === 4 || i === 9 || i === 15 || i === 21 || i === 23) status = 'free';
    else if (i === 8 || i === 18) status = 'expiring';
    else if (i === 12) status = 'maintenance';

    const isAssigned = status === 'occupied' || status === 'expiring';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i - 1) % DEMO_STUDENT_NAMES.length] : undefined;
    const shift = isAssigned ? SHIFT_TYPES[(i * 2) % SHIFT_TYPES.length] : undefined;

    seats.push({
      id: seatId,
      uuid: `seat-dt-${seatId}`,
      status,
      student,
      smartId: isAssigned ? `SL-DT-${1000 + i}` : undefined,
      phone: isAssigned ? `98765${String(43210 + i).slice(-5)}` : undefined,
      shift,
      plan: isAssigned ? PLANS[i % PLANS.length] : undefined,
      locker: isAssigned && i % 2 === 0 ? `L-${String(i).padStart(2, '0')}` : undefined,
      validFrom: isAssigned ? '2026-04-01' : undefined,
      expiry: status === 'expiring' ? '2026-04-20' : isAssigned ? '2026-05-31' : undefined,
      branchId: 'BR-001',
      branchName: 'Downtown Central',
    });
  }

  for (let i = 25; i <= 36; i++) {
    const seatId = String(i).padStart(2, '0');
    let status: AdminSeatMatrixSeatMatrixViewModel['status'] = 'occupied';
    if (i === 27 || i === 31 || i === 34 || i === 36) status = 'free';
    else if (i === 30) status = 'maintenance';

    const isAssigned = status === 'occupied';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i + 3) % DEMO_STUDENT_NAMES.length] : undefined;
    const shift = isAssigned ? SHIFT_TYPES[(i * 3) % SHIFT_TYPES.length] : undefined;

    seats.push({
      id: seatId,
      uuid: `seat-ws-${seatId}`,
      status,
      student,
      smartId: isAssigned ? `SL-WS-${2000 + i}` : undefined,
      phone: isAssigned ? `98111${String(54320 + i).slice(-5)}` : undefined,
      shift,
      plan: isAssigned ? PLANS[(i + 1) % PLANS.length] : undefined,
      locker: isAssigned && i % 3 === 0 ? `L-${String(i).padStart(2, '0')}` : undefined,
      validFrom: isAssigned ? '2026-04-05' : undefined,
      expiry: isAssigned ? '2026-05-15' : undefined,
      branchId: 'BR-002',
      branchName: 'Westside Branch',
    });
  }

  for (let i = 37; i <= 48; i++) {
    const seatId = String(i).padStart(2, '0');
    let status: AdminSeatMatrixSeatMatrixViewModel['status'] = 'occupied';
    if (i === 39 || i === 44 || i === 47) status = 'free';
    else if (i === 42) status = 'expiring';

    const isAssigned = status === 'occupied' || status === 'expiring';
    const student = isAssigned ? DEMO_STUDENT_NAMES[(i + 5) % DEMO_STUDENT_NAMES.length] : undefined;
    const shift = isAssigned ? SHIFT_TYPES[(i * 4) % SHIFT_TYPES.length] : undefined;

    seats.push({
      id: seatId,
      uuid: `seat-nh-${seatId}`,
      status,
      student,
      smartId: isAssigned ? `SL-NH-${3000 + i}` : undefined,
      phone: isAssigned ? `99555${String(65430 + i).slice(-5)}` : undefined,
      shift,
      plan: isAssigned ? PLANS[(i + 2) % PLANS.length] : undefined,
      locker: isAssigned && i % 2 !== 0 ? `L-${String(i).padStart(2, '0')}` : undefined,
      validFrom: isAssigned ? '2026-04-10' : undefined,
      expiry: status === 'expiring' ? '2026-04-22' : isAssigned ? '2026-06-10' : undefined,
      branchId: 'BR-003',
      branchName: 'North Hub',
    });
  }

  return seats;
}
