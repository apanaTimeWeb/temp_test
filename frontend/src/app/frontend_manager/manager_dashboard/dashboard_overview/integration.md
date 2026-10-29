# Backend Integration Specification — Manager Dashboard Overview

## 1. Overview
The Dashboard Overview module (`manager_dashboard/dashboard_overview`) aggregates executive KPIs, seat occupancy state, action items requiring manager attention, recent admissions, recent enquiries, and quick links.

## 2. API Endpoint Contract

| Method | Endpoint | Description | Auth Required | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/dashboard/overview` | Returns aggregate dashboard metrics and widget feeds | Yes (Bearer JWT / Session Cookie) | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/dashboard/overview HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_overview_01
```

### 2.2. Response Payload (Zod-Validated Schema)
```json
{
  "success": true,
  "message": "Dashboard overview retrieved successfully",
  "data": {
    "kpiData": [
      {
        "title": "Total Members",
        "value": 142,
        "trend": "+12% this month",
        "icon": "Users",
        "iconClass": "mgr-kpi-icon--primary"
      },
      {
        "title": "Today Attendance",
        "value": 89,
        "trend": "63% capacity",
        "icon": "CalendarCheck",
        "iconClass": "mgr-kpi-icon--success"
      },
      {
        "title": "New Inquiries",
        "value": 7,
        "trend": "+3 today",
        "icon": "Phone",
        "iconClass": "mgr-kpi-icon--info"
      },
      {
        "title": "Seats Occupied",
        "value": "45/60",
        "trend": "75% occupied",
        "icon": "Armchair",
        "iconClass": "mgr-kpi-icon--warning"
      }
    ],
    "seatData": [
      { "id": "S-01", "status": "occupied" },
      { "id": "S-02", "status": "occupied" },
      { "id": "S-03", "status": "available" },
      { "id": "S-04", "status": "expiring" },
      { "id": "S-05", "status": "available" },
      { "id": "S-06", "status": "occupied" }
    ],
    "actionItems": [
      {
        "title": "Fees due today",
        "count": "4",
        "countClass": "mgr-badge mgr-badge--danger",
        "href": "/frontend_manager/manager_finance/finance_collect_fee",
        "showRenew": false
      },
      {
        "title": "Renewals due",
        "count": "6",
        "countClass": "mgr-badge mgr-badge--warning",
        "href": "/frontend_manager/manager_finance/finance_renewals",
        "showRenew": true
      },
      {
        "title": "New enquiries",
        "count": "5",
        "countClass": "mgr-badge mgr-badge--info",
        "href": "/frontend_manager/manager_members/members_enquiries",
        "showRenew": false
      }
    ],
    "recentAdmissions": [
      { "name": "Rahul Sharma", "smartId": "SM-1042", "shift": "Morning" },
      { "name": "Priya Verma", "smartId": "SM-1043", "shift": "Full Day" },
      { "name": "Amit Singh", "smartId": "SM-1044", "shift": "Evening" }
    ],
    "recentEnquiries": [
      { "name": "Vikram Mehta", "phone": "+91 98765 43210", "status": "New" },
      { "name": "Ananya Gupta", "phone": "+91 98765 43211", "status": "Interested" },
      { "name": "Suresh Kumar", "phone": "+91 98765 43212", "status": "Visited" }
    ]
  },
  "requestId": "req_overview_01"
}
```

## 3. Frontend Data Flow & React Query Hook
- **Hook**: `useManagerDashboardData()` in `hooks/useManagerDashboardOverviewData.ts`
- **Query Key**: `['manager', 'dashboard', 'overview']` via `MANAGER_DASHBOARD_QUERY_KEYS.overview()`
- **Stale Time**: 30 seconds (`30_000ms`)
- **Offline / Standalone Fallback**: When `process.env.NEXT_PUBLIC_USE_MOCKS === 'true'` or when running standalone, the frontend serves `HARDCODED_DASHBOARD_DATA` to ensure 100% UI stability.

## 4. Error Envelope Handling
When the backend returns an error:
```json
{
  "success": false,
  "message": "Unauthorized access to branch dashboard",
  "data": null,
  "errorCode": "FORBIDDEN",
  "statusCode": 403,
  "requestId": "req_err_01"
}
```
The React Query client transitions into `isError` state and `ManagerDashboardOverviewErrorState` renders a user-friendly retry button that executes `refetch()`.

