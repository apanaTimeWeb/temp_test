# Backend Integration Specification — Absentee Report & Drop-out Risk

## 1. Overview
The Absentee Report module (`manager_attendance/attendance_absentee_report`) surfaces high-risk student absence trends, chronic drop-out indicators (e.g. 3+ consecutive days absent), last recorded branch visits, and emergency guardian contact info. It allows managers to trigger direct guardian notification alerts via SMS/WhatsApp with delivery tracking (`notified: true`).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/attendance/absentees` | `minDaysAbsent` (default `3`), `shift`, `page`, `limit` | Paginated list of chronic absentee students | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/attendance/absentees/:id/notify` | `{ channel: "whatsapp" \| "sms" \| "email", templateId?: string }` | Dispatches absent alert to student guardian | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/attendance/absentees/notify-all` | `{ studentIds: string[], channel: string }` | Bulk guardian alert notification broadcast | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/attendance/absentees?minDaysAbsent=3 HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_absentee_report_01
```

### 2.2. Response Payload (`ManagerAttendanceAbsenteeReportSampleAbsentee[]`)
```json
{
  "success": true,
  "message": "Absentee report retrieved successfully",
  "data": [
    {
      "id": "1",
      "name": "Priya Verma",
      "initials": "PV",
      "smartId": "SL-002",
      "shift": "Morning",
      "daysAbsent": 4,
      "lastSeen": "2026-04-08",
      "parentPhone": "+91 98••••1234",
      "parentEmail": "parent1@email.com",
      "notified": false
    },
    {
      "id": "2",
      "name": "Sneha Patel",
      "initials": "SP",
      "smartId": "SL-004",
      "shift": "Morning",
      "daysAbsent": 8,
      "lastSeen": "2026-04-04",
      "parentPhone": "+91 97••••5678",
      "parentEmail": "parent2@email.com",
      "notified": false
    }
  ],
  "meta": {
    "totalAbsentees": 5,
    "highRiskCount": 2,
    "notifiedCount": 1
  },
  "requestId": "req_absentee_report_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAttendanceAbsenteeReportPage.tsx` using `ManagerAttendanceAbsenteeReportNativeTable.tsx` and custom column definitions.
- **Privacy & Security**: Guardian contact information is masked in accordance with Privacy Rule 78.
- **Offline Mode**: Uses `MANAGER_ENGAGEMENT_SAMPLE_ABSENTEES` fixture from `ManagerAttendanceAbsenteeReportDemoRepository.ts` if backend connectivity is absent.
- **Date Formatting**: `ManagerAttendanceAbsenteeReportDateFormatting.ts` ensures standardized date rendering across locales.

