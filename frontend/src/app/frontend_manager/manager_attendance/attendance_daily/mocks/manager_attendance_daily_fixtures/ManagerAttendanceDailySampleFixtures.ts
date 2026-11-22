/** Explicitly illustrative records only; never treated as persisted attendance. */
export type ManagerAttendanceDailySampleAttendanceStudent = {
  id: string; smartId: string; name: string; initials: string; shift: string; consecutiveAbsent: number;
  status: 'present' | 'absent' | 'late' | null; inTime: string; outTime: string;
  seat?: string; isOverstay?: boolean; overstayMinutes?: number; shiftEnd?: string;
};
export const MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE: readonly ManagerAttendanceDailySampleAttendanceStudent[] = [
  { id:'1', smartId:'SL-001', name:'Rahul Sharma', initials:'RS', shift:'Morning', consecutiveAbsent:0, status:'present', inTime:'06:15', outTime:'', seat:'Seat A-14', isOverstay:true, overstayMinutes:90, shiftEnd:'14:00' },
  { id:'2', smartId:'SL-002', name:'Priya Verma', initials:'PV', shift:'Morning', consecutiveAbsent:4, status:null, inTime:'', outTime:'', seat:'Seat A-15' },
  { id:'3', smartId:'SL-003', name:'Amit Kumar', initials:'AK', shift:'Afternoon', consecutiveAbsent:0, status:'present', inTime:'13:00', outTime:'18:00', seat:'Seat B-08' },
  { id:'4', smartId:'SL-004', name:'Sneha Patel', initials:'SP', shift:'Morning', consecutiveAbsent:7, status:null, inTime:'', outTime:'', seat:'Seat B-12' },
  { id:'5', smartId:'SL-005', name:'Rohan Das', initials:'RD', shift:'Evening', consecutiveAbsent:0, status:null, inTime:'18:00', outTime:'22:00', seat:'Seat C-21' },
  { id:'6', smartId:'SL-006', name:'Kavita Singh', initials:'KS', shift:'Afternoon', consecutiveAbsent:0, status:null, inTime:'13:00', outTime:'18:00', seat:'Seat C-22' },
  { id:'7', smartId:'SL-007', name:'Arjun Mehta', initials:'AM', shift:'Morning', consecutiveAbsent:2, status:null, inTime:'', outTime:'', seat:'Seat D-05' },
  { id:'8', smartId:'SL-008', name:'Nisha Gupta', initials:'NG', shift:'Evening', consecutiveAbsent:0, status:null, inTime:'18:00', outTime:'22:00', seat:'Seat D-06' },
  { id:'9', smartId:'SL-009', name:'Vikram Malhotra', initials:'VM', shift:'Night', consecutiveAbsent:0, status:'present', inTime:'22:05', outTime:'06:00', seat:'Seat E-01', shiftEnd:'06:00' },
  { id:'10', smartId:'SL-010', name:'Ananya Sharma', initials:'AS', shift:'Night', consecutiveAbsent:1, status:null, inTime:'', outTime:'', seat:'Seat E-02', shiftEnd:'06:00' },
  { id:'11', smartId:'SL-011', name:'Suresh Reddy', initials:'SR', shift:'Full Day', consecutiveAbsent:0, status:'present', inTime:'08:00', outTime:'20:00', seat:'Seat F-10', shiftEnd:'20:00' },
  { id:'12', smartId:'SL-012', name:'Meera Joshi', initials:'MJ', shift:'Full Day', consecutiveAbsent:0, status:'late', inTime:'09:15', outTime:'20:00', seat:'Seat F-11', shiftEnd:'20:00' },
];
export type ManagerAttendanceDailySampleAbsentee = { id:string; name:string; initials:string; smartId:string; shift:string; daysAbsent:number; lastSeen:string; parentPhone:string; parentEmail:string; notified:boolean };
export const MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES: readonly ManagerAttendanceDailySampleAbsentee[] = [
  { id:'1', name:'Priya Verma', initials:'PV', smartId:'SL-002', shift:'Morning', daysAbsent:4, lastSeen:'2026-04-08', parentPhone:'+91 98••••1234', parentEmail:'parent1@email.com', notified:false },
  { id:'2', name:'Sneha Patel', initials:'SP', smartId:'SL-004', shift:'Morning', daysAbsent:8, lastSeen:'2026-04-04', parentPhone:'+91 97••••5678', parentEmail:'parent2@email.com', notified:false },
  { id:'3', name:'Deepak Mishra', initials:'DM', smartId:'SL-008', shift:'Afternoon', daysAbsent:3, lastSeen:'2026-04-09', parentPhone:'+91 96••••9012', parentEmail:'parent3@email.com', notified:false },
  { id:'4', name:'Anita Roy', initials:'AR', smartId:'SL-011', shift:'Evening', daysAbsent:12, lastSeen:'2026-03-31', parentPhone:'+91 95••••3456', parentEmail:'parent4@email.com', notified:true },
  { id:'5', name:'Vikram Nair', initials:'VN', smartId:'SL-015', shift:'Morning', daysAbsent:5, lastSeen:'2026-04-07', parentPhone:'+91 94••••7890', parentEmail:'parent5@email.com', notified:false },
];
