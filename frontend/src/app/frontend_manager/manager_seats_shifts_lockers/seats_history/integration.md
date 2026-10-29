# manager_seats_history — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Seats History
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/seats_history`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/seats_history`
- **Current State**: Filterable chronological audit table of seat assignments, smart IDs, shift historical records, date range filters, and CSV export.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/history`
Retrieves past seat tenure and assignment history.

**Query Parameters:**
- `seatNo` (string, optional: e.g. `S-001`)
- `startDate` (ISO string, optional)
- `endDate` (ISO string, optional)
- `search` (string, optional, debounced 300ms)

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Seats, shifts and lockers data loaded.",
  "data": [
    {
      "seatNo": "S-001",
      "studentName": "Rahul Verma",
      "smartId": "LIB-001",
      "shift": "Morning",
      "startDate": "2025-01-01",
      "endDate": "2025-06-30"
    }
  ],
  "requestId": "req-history-001"
}
```

---

## 3. Mock & Offline Fallback Strategy
- 300ms live debounced filtering across student names, smart IDs, and seat numbers.
- Fallback to `MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE` on offline/unreachable backend.
- Date ranges and missing values format with `—` (En-dash) per Rule 78.

