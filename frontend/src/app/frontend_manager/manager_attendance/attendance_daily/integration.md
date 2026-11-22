# Backend Integration Specification — Daily Attendance Tracking

## 1. Overview
The Daily Attendance Tracking module (`manager_attendance/attendance_daily`) facilitates real-time morning, afternoon, and evening shift attendance management. It displays student check-in/check-out timestamps, tracks consecutive absent counts, enables single-click status tagging (`present`, `absent`, `late`), and tallies live shift statistics.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/attendance/daily` | `date` (ISO `YYYY-MM-DD`), `shift` (`All`, `Morning`, `Afternoon`, `Evening`) | List attendance roster for a specific date and shift | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/attendance/daily/bulk` | JSON payload of student attendance records | Batch save/update attendance statuses and timestamps | `manager`, `branch_admin` |
| `PUT` | `/api/v1/manager/attendance/daily/:studentId` | `{ status, inTime, outTime, date }` | Single-student attendance record update | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/attendance/daily?date=2026-04-12&shift=Morning HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_attendance_daily_01
```

### 2.2. Response Payload (`ManagerAttendanceDailySampleAttendanceStudent[]`)
```json
{
  "success": true,
  "message": "Daily attendance retrieved successfully",
  "data": [
    {
      "id": "1",
      "smartId": "SL-001",
      "name": "Rahul Sharma",
      "initials": "RS",
      "shift": "Morning",
      "consecutiveAbsent": 0,
      "status": "present",
      "inTime": "09:00",
      "outTime": "13:00"
    },
    {
      "id": "2",
      "smartId": "SL-002",
      "name": "Priya Verma",
      "initials": "PV",
      "shift": "Morning",
      "consecutiveAbsent": 4,
      "status": "absent",
      "inTime": "",
      "outTime": ""
    }
  ],
  "meta": {
    "date": "2026-04-12",
    "totalStudents": 48,
    "presentCount": 38,
    "absentCount": 8,
    "lateCount": 2
  },
  "requestId": "req_attendance_daily_01"
}
```

### 2.3. Bulk Save Request Payload (`POST /api/v1/manager/attendance/daily/bulk`)
```json
{
  "date": "2026-04-12",
  "records": [
    {
      "studentId": "1",
      "status": "present",
      "inTime": "09:00",
      "outTime": "13:00"
    },
    {
      "studentId": "2",
      "status": "absent",
      "inTime": null,
      "outTime": null
    }
  ]
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAttendanceDailyPage.tsx` with `ManagerAttendanceDailyStudentRow.tsx` and `ManagerAttendanceDailyEmptyState.tsx`.
- **Locale Support**: Dynamic shift naming (`morning`, `afternoon`, `evening`, `all`) localized via `next-intl`.
- **Offline / Standalone Fallback**: Hydrates immediately with `MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE` from `ManagerAttendanceDailyDemoRepository.ts` for offline or disconnected branch kiosks.
- **Contract Resilience**: Nullable status values default to en-dash `—` or empty state fallback without crashing on incomplete records.

