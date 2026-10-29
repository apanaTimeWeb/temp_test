# Backend Integration Specification — Manager Dashboard Reports

## 1. Overview
The Reports submodule (`manager_dashboard/dashboard_reports`) renders comprehensive branch performance reports, attendance analytics, shift occupancy trends, monthly student growth, absentee records, complaints tracking, and top/least occupied seats.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/reports` | `range=week` \| `month` \| `thirty_days` | Returns full report KPI, charts, and summary tables | `manager`, `branch_admin` |

### 2.1. Request Headers & URL
```http
GET /api/v1/manager/reports?range=month HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_rep_01
```

### 2.2. Response Payload (Zod-Validated Schema: `managerReportsSchema`)
```json
{
  "success": true,
  "message": "Reports data retrieved successfully",
  "data": {
    "dateRange": "month",
    "kpiCards": [
      {
        "title": "Monthly Revenue",
        "value": "₹1,45,200",
        "trend": "+12% this month",
        "icon": "DollarSign"
      },
      {
        "title": "Avg Daily Attendance",
        "value": "78%",
        "trend": "+4% this month",
        "icon": "Users"
      },
      {
        "title": "New Admissions",
        "value": "34",
        "trend": "+8 this month",
        "icon": "Calendar"
      },
      {
        "title": "Active Complaints",
        "value": "3",
        "trend": "-2 this month",
        "icon": "AlertCircle"
      }
    ],
    "attendanceChart": {
      "categories": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "series": [
        { "name": "Morning", "data": [45, 52, 48, 55, 50, 42, 38] },
        { "name": "Afternoon", "data": [30, 35, 32, 38, 34, 28, 25] },
        { "name": "Evening", "data": [40, 45, 42, 48, 44, 36, 32] }
      ]
    },
    "shiftOccupancy": {
      "labels": ["Morning (6AM-12PM)", "Afternoon (12PM-5PM)", "Evening (5PM-11PM)", "Night (11PM-6AM)"],
      "series": [85, 65, 75, 40]
    },
    "growthChart": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "series": [{ "name": "Learners", "data": [95, 110, 125, 138, 142, 155] }]
    },
    "frequentAbsentees": [
      { "id": "1", "name": "Rajesh Kumar", "smartId": "SM-1012", "absentDays": 8, "shift": "Morning" }
    ],
    "complaintsSummary": [
      { "id": "1", "category": "AC / Temperature", "count": 5, "resolved": 4, "pending": 1 }
    ],
    "topOccupiedSeats": [
      { "seatNumber": "S-12", "occupancyRate": "98%", "shift": "Morning" }
    ],
    "leastOccupiedSeats": [
      { "seatNumber": "S-55", "occupancyRate": "22%", "shift": "Night" }
    ]
  },
  "requestId": "req_rep_01"
}
```

## 3. Frontend Architecture & Theme-Reactive Charts
- **Hook**: `useManagerDashboardReportsData(dateRange)` in `hooks/useManagerDashboardReportsData.ts`
- **Theme Observer**: `useManagerDashboardReportsChartTheme.ts` extracts resolved CSS tokens via `MutationObserver` on `document.documentElement` so ApexCharts reactively switches hex colors on theme toggle.
- **Standalone Fallback**: `getManagerReportsFixture(dateRange)` in `ManagerDashboardReportsFixtures.ts` provides complete reactive mock data when backend is not running.

