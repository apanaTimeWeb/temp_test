# manager_lockers_management — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Lockers Management
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/lockers_management`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/lockers_management`
- **Current State**: Full locker registry table with student assignment details, search, locker status filter, and assignment modal dialogs.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/lockers`
Retrieves locker units, allocation statuses, and assigned student references.

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Seats, shifts and lockers data loaded.",
  "data": [
    {
      "id": "1",
      "lockerId": "A01",
      "status": "Occupied",
      "assignedTo": "Alex Chen",
      "studentId": "LIB-021",
      "assignedSince": "2024-10-01"
    },
    {
      "id": "2",
      "lockerId": "A02",
      "status": "Free",
      "assignedTo": "—",
      "studentId": "—",
      "assignedSince": "—"
    }
  ],
  "requestId": "req-lockers-001"
}
```

### 2.2 POST `/seats_shifts_lockers/lockers/assign` (Target)
Assigns or releases a locker unit for a student.

**Request Payload:**
```json
{
  "lockerId": "A02",
  "studentId": "LIB-055",
  "assignedSince": "2026-10-29",
  "securityDepositPaid": true
}
```

---

## 3. Mock & Offline Fallback Strategy
- Fallback to `MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE` ensures offline resilience.
- Locker statuses correctly normalized (`Free`, `Occupied`, `Maintenance`, `unknown`).
- Nullable fields display `—` (En-dash) per Rule 78.

