# manager_seats_management — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Seats Management
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/seats_management`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/seats_management`
- **Current State**: Full seat inventory, maintenance logs, status badges, inline edit/maintenance actions, with resilient fallback to sample fixtures.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/seat-matrix`
Retrieves seat inventory data with maintenance history and assignment links.

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Seats, shifts and lockers data loaded.",
  "data": [
    {
      "id": "test-seat-001",
      "seatNumber": "S-001",
      "status": "occupied",
      "studentName": "Rahul Verma",
      "smartId": "LIB-001",
      "shift": "Morning",
      "expiryDate": "2026-11-30"
    },
    {
      "id": "test-seat-002",
      "seatNumber": "S-002",
      "status": "free",
      "shift": "Evening"
    }
  ],
  "requestId": "req-seats-001"
}
```

### 2.2 POST `/seats_shifts_lockers/seats/maintenance` (Target)
Submits a maintenance record or changes seat status.

**Request Payload:**
```json
{
  "seatNo": "S-003",
  "status": "maintenance",
  "reason": "Broken chair armrest",
  "expectedResolution": "2026-10-31"
}
```

---

## 3. Mock & Offline Fallback Strategy
- 300ms debounced search filters seats by seat number, assigned student name, and smart ID.
- Fallback to `MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE` on offline/unreachable backend.
- Nullable values (such as students unassigned to free seats) format with `—` (Rule 78).

