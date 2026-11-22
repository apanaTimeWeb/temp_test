# manager_seats_matrix — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Seats Matrix
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/seats_matrix`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix`
- **Current State**: High-performance visual seat grid with shift filters, seat detail dialogs, offline fallback to canonical seat matrix fixtures.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/seat-matrix`
Retrieves the real-time seat occupancy and availability status across library zones and shifts.

**Query Parameters:**
- `shift` (string, optional: `Morning` | `Afternoon` | `Evening` | `All`)
- `status` (string, optional: `free` | `occupied` | `maintenance` | `expiring`)

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Seat matrix loaded successfully",
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
      "shift": "All"
    },
    {
      "id": "test-seat-003",
      "seatNumber": "S-003",
      "status": "maintenance"
    }
  ],
  "requestId": "req-seat-matrix-001"
}
```

---

## 3. UI State & Resilient Fallback
- Displays interactive seat color-coded badges (`free`, `occupied`, `maintenance`, `expiring`).
- On backend 404 or offline state, seamlessly loads `MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE` so managers can test interactions and view full seat layout.
- Nullable/missing student or expiry values display `—` (En-dash) per Rule 78.

