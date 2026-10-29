export type ManagerDashboardReportsDateRange = 'This Week' | 'This Month' | 'Last 30 Days';
export type ManagerDashboardReportsKpiIcon = 'Users' | 'CalendarCheck' | 'UserPlus' | 'Phone';
export interface ManagerDashboardReportsKpiCard { title:string; value:string; icon:ManagerDashboardReportsKpiIcon; iconClass?:string; trend?:string }
export interface ManagerDashboardReportsSeriesPoint { name?:string; date?:string; day?:string; value:number }
export interface ManagerDashboardReportsGrowthPoint { date:string; joined:number; exited:number }
export interface ManagerDashboardReportsAttendancePoint { day:string; avg:number }
export interface ManagerDashboardReportsAbsenteeChartPoint { name:string; absences:number }
export interface ManagerDashboardReportsTableAbsenteeRow { name:string; smartId:string; shift:string; daysAbsent:number; lastPresent:string }
export interface ManagerDashboardReportsConversionRow { month:string; newEnq:number; converted:number; rate:string }
export interface ManagerDashboardReportsSeatRow { shift:string; occupancy:string; avgDuration:string }
export interface ManagerDashboardReportsLockerRow { type:string; occupied:number; total:number; pct:string }
export interface ManagerDashboardReportsMaintenanceRow { item:string; location:string; reported:string; priority:'High'|'Medium'|'Low' }
export interface ManagerDashboardReportsComplaintPoint { name:string; value:number }
export interface ManagerDashboardReportsData { kpiCards:ManagerDashboardReportsKpiCard[]; occupancyData:ManagerDashboardReportsSeriesPoint[]; growthData:ManagerDashboardReportsGrowthPoint[]; attendanceData:ManagerDashboardReportsAttendancePoint[]; absenteesChartData:ManagerDashboardReportsAbsenteeChartPoint[]; complaintsData:ManagerDashboardReportsComplaintPoint[]; absenteeRows:ManagerDashboardReportsTableAbsenteeRow[]; conversionRows:ManagerDashboardReportsConversionRow[]; seatRows:ManagerDashboardReportsSeatRow[]; lockerRows:ManagerDashboardReportsLockerRow[]; maintenanceRows:ManagerDashboardReportsMaintenanceRow[] }
