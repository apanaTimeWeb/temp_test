# manager_shifts_migration — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Shifts Migration
- **Canonical Route**: `/frontend_manager/manager_seats_shifts_lockers/shifts_migration`
- **Module Path**: `src/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration`
- **Current State**: Multi-step wizard (Select Student -> Choose New Shift & Seat -> Review Prorated Adjustment -> Confirm) with unsaved changes dialog guard.

---

## 2. API Endpoints Contract

### 2.1 GET `/seats_shifts_lockers/allocations`
Retrieves list of active student shift allocations eligible for shift migration.

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
      "validFrom": "2024-10-01",
      "validTill": "2026-11-30",
      "daysLeft": 32,
      "status": "active"
    }
  ],
  "requestId": "req-alloc-001"
}
```

### 2.2 POST `/seats_shifts_lockers/shifts/migrate` (Target)
Executes migration between shifts, updating seat assignment and prorated fee differential.

**Request Payload:**
```json
{
  "studentId": "LIB-021",
  "fromShift": "Morning",
  "toShift": "Evening",
  "newSeatNo": "S-018",
  "customSlots": {
    "enabled": false
  },
  "financialAdjustment": {
    "differenceAmount": 350,
    "paymentMode": "UPI",
    "transactionId": "UPI/20261029/9871",
    "remark": "Upgraded to evening shift"
  }
}
```

**Response Schema (`200 OK`):**
```json
{
  "success": true,
  "message": "Student shifted successfully to Evening shift.",
  "data": {
    "migrationId": "mig_9812",
    "invoiceId": "inv_adj_091",
    "receiptId": "rec_adj_091"
  }
}
```

---

## 3. Mock & Offline Fallback Strategy
- 3-step wizard with 300ms debounced student search.
- Previews shift capacity and prorated balance difference using `MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_STUDENTS` and `MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_MIGRATION_SHIFTS`.
- Accessible alert dialog safeguards against accidental navigation when migration form is dirty.

