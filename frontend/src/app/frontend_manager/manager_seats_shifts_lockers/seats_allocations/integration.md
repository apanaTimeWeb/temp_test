# manager_seats_allocations — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Seats Allocations
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/seats_allocations`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations`
- **Current State**: Active allocations table, days-remaining counters, student seat tenure tracking, and direct routing to member directory and new admission.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/allocations`
Retrieves all current seat allocations across active students.

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Allocations loaded",
  "data": [
    {
      "id": "alloc-001",
      "studentName": "Alex Chen",
      "smartId": "LIB-021",
      "seatNo": "S-042",
      "shift": "Morning",
      "customSlots": "—",
      "lockerNo": "A01",
      "validFrom": "2024-10-01",
      "validTill": "2026-11-30",
      "daysLeft": 32,
      "status": "active"
    }
  ],
  "requestId": "req-alloc-001"
}
```

---

## 3. Mock & Offline Fallback Strategy
- Fallback to `MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE` ensures managers can view active student allocations and inspect table columns in offline environments.
- Status values normalized safely: `active`, `expiring`, `expired`, `cancelled`, and `unknown`.

