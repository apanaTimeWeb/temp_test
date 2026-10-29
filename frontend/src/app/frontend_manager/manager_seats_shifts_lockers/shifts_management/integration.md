# manager_shifts_management — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Shifts Management
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/shifts_management`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/shifts_management`
- **Current State**: Shift roster configuration, active occupancy gauges, shift timing and pricing cards with sample preview fixtures.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/seat-matrix`
Retrieves current shift capacity, active counts, and start/end schedules.

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Seats, shifts and lockers data loaded.",
  "data": [
    {
      "id": "1",
      "name": "Morning",
      "startTime": "06:00",
      "endTime": "12:00",
      "occupancy": 32,
      "capacity": 40,
      "active": true
    },
    {
      "id": "2",
      "name": "Afternoon",
      "startTime": "12:00",
      "endTime": "18:00",
      "occupancy": 18,
      "capacity": 40,
      "active": true
    }
  ],
  "requestId": "req-shifts-001"
}
```

### 2.2 POST `/seats_shifts_lockers/shifts` (Target)
Creates or updates a library operational shift timing.

**Request Payload:**
```json
{
  "name": "Night Owl",
  "startTime": "22:00",
  "endTime": "06:00",
  "capacity": 30,
  "ratePerMonth": 1200
}
```

---

## 3. Mock & Offline Fallback Strategy
- Fallback to `MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_SHIFTS` ensures full UI visibility during offline and early development phases.
- Time formatting adapts to localized formats (12-hour AM/PM vs 24-hour).

