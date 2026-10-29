# Backend Integration Specification — Seat Gap Analytics & Revenue Leakage

## 1. Overview
The Seat Gap Report module (`manager_accounts_assets/accounts_seat_gap_report`) detects unallocated or vacant library seats across shifts and floor zones. It quantifies idle vacancy durations (`gapDays`) and estimates compounding revenue leakage to help managers target marketing, adjust pricing, or convert unused slots into flexible hot desks.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/accounts/seat-gaps` | `floor`, `shift`, `minGapDays`, `status` (`vacant`, `maintenance`) | Detailed inventory of vacant seats with revenue loss estimates | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/accounts/seat-gaps/summary` | `period` (`current_month`, `last_30_days`, `quarter`) | Aggregate vacancy rate and total projected revenue leakage | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/accounts/seat-gaps/:seatNo/promote` | `{ campaignType: "discount" \| "lead_outreach" }` | Trigger re-engagement promotions for high-gap seats | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/accounts/seat-gaps?minGapDays=7 HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_seat_gap_01
```

### 2.2. Response Payload (`GapRow[]`)
```json
{
  "success": true,
  "message": "Seat gap report retrieved successfully",
  "data": [
    {
      "seatNo": "A-04",
      "shift": "Morning",
      "floor": "Ground",
      "lastOccupied": "2026-03-28",
      "gapDays": 14,
      "revenueLoss": 70000,
      "status": "vacant"
    },
    {
      "seatNo": "B-11",
      "shift": "Afternoon",
      "floor": "First",
      "lastOccupied": "2026-03-20",
      "gapDays": 22,
      "revenueLoss": 110000,
      "status": "vacant"
    },
    {
      "seatNo": "C-07",
      "shift": "Night",
      "floor": "Ground",
      "lastOccupied": "2026-04-01",
      "gapDays": 10,
      "revenueLoss": 50000,
      "status": "maintenance"
    }
  ],
  "meta": {
    "totalGapsIdentified": 6,
    "totalRevenueLossInCents": 555000,
    "averageGapDays": 18.5,
    "currency": "INR"
  },
  "requestId": "req_seat_gap_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAccountsSeatGapReportPage.tsx` using `ManagerAccountsSeatGapReportNativeTable.tsx`.
- **Formatting**: Currency values rendered via `useManagerSeatGapReportCurrencyFormatter`.
- **Standalone Mode**: Backed by `MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS` in `ManagerAccountsSeatGapReportOperationalSampleFixtures.ts`.
- **Resilience**: En-dash `—` fallback displayed if `lastOccupied` date is null or unrecorded.

