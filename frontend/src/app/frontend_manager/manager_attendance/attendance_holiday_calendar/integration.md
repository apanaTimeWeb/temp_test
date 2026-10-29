# Backend Integration Specification — Library Holiday Calendar

## 1. Overview
The Library Holiday Calendar module (`manager_attendance/attendance_holiday_calendar`) maintains the branch calendar of operational closures, gazetted holidays, and study recesses. Holidays automatically suspend attendance absence penalties, notify enrolled members in advance, and adjust shift billing periods.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/calendar/holidays` | `year` (e.g. `2026`), `month` (optional), `type` (e.g. `National`, `Religious`, `Optional`) | List all scheduled holidays for the branch | `manager`, `branch_admin`, `member` |
| `POST` | `/api/v1/manager/calendar/holidays` | `{ name: string, date: string, type: string, description?: string }` | Register a new branch holiday or closure | `manager`, `branch_admin` |
| `DELETE` | `/api/v1/manager/calendar/holidays/:id` | None | Remove a scheduled holiday | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/calendar/holidays?year=2026 HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_holidays_01
```

### 2.2. Response Payload (`Holiday[]`)
```json
{
  "success": true,
  "message": "Holidays retrieved successfully",
  "data": [
    {
      "id": "1",
      "date": "2026-04-14",
      "name": "Dr. Ambedkar Jayanti",
      "type": "National"
    },
    {
      "id": "2",
      "date": "2026-04-21",
      "name": "Ram Navami",
      "type": "Religious"
    },
    {
      "id": "3",
      "date": "2026-05-01",
      "name": "International Labour Day",
      "type": "National"
    },
    {
      "id": "4",
      "date": "2026-08-15",
      "name": "Independence Day",
      "type": "National"
    },
    {
      "id": "5",
      "date": "2026-10-02",
      "name": "Gandhi Jayanti",
      "type": "National"
    }
  ],
  "meta": {
    "year": 2026,
    "totalHolidays": 5
  },
  "requestId": "req_holidays_01"
}
```

### 2.3. Create Holiday Request Payload (`POST /api/v1/manager/calendar/holidays`)
```json
{
  "name": "Diwali Vacation",
  "date": "2026-11-08",
  "type": "Religious"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAttendanceHolidayCalendarPage.tsx` with stats cards (`ManagerAttendanceHolidayCalendarStats.tsx`), month list groupings (`ManagerAttendanceHolidayCalendarHolidayLists.tsx`), and creation modal (`ManagerAttendanceHolidayCalendarAddModal.tsx`).
- **Resilience**: Hydrates from canonical `MANAGER_ENGAGEMENT_SAMPLE_HOLIDAYS` in `ManagerAttendanceHolidayCalendarHolidaySampleFixtures.ts` when operating in mock or offline mode.
- **Form Validation**: Strict ISO date format validation and non-empty name enforcement before submission.

