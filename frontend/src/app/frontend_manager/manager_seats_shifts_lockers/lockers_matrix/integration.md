# manager_lockers_matrix — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Lockers Matrix
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/lockers_matrix`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix`
- **Current State**: Visual 2D/3D interactive locker grid matrix, bay organization, assigned student drawer/popover, status legend (`Free`, `Occupied`, `Maintenance`).

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/lockers`
Retrieves locker coordinates, zone/bay groupings, and occupancy state.

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Seats, shifts and lockers matrix data loaded.",
  "data": [
    {
      "id": "1",
      "lockerNumber": "L-A01",
      "status": "occupied",
      "studentName": "Alex Chen",
      "smartId": "LIB-021",
      "location": "Bay A"
    },
    {
      "id": "2",
      "lockerNumber": "L-A02",
      "status": "free",
      "location": "Bay A"
    }
  ],
  "requestId": "req-lockers-matrix-001"
}
```

---

## 3. Mock & Offline Fallback Strategy
- Fallback to `MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE` ensures visual locker grid renders even when offline.
- Status normalization maps any unverified statuses directly to `unknown`.

