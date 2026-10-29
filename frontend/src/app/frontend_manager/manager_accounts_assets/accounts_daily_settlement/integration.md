# Backend Integration Specification — Daily Settlement & Cash Reconciliation

## 1. Overview
The Daily Settlement module (`manager_accounts_assets/accounts_daily_settlement`) provides shift-by-shift financial reconciliation. At the conclusion of Morning, Afternoon, and Night shifts, managers record physical cash collected, UPI transfers, operational disbursements, and calculate net drawer closing balances with settlement status sign-offs (`pending` vs `settled`).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/accounts/settlements/daily` | `date` (ISO `YYYY-MM-DD`) | Fetch shift-wise settlement summaries for a date | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/accounts/settlements/close-shift` | `{ shift: string, openingBalance: number, cashCollected: number, upiCollected: number, expenses: number, closingBalance: number, remarks?: string }` | Finalize and submit shift cash drawer settlement | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/accounts/settlements/summary` | `startDate`, `endDate` | Aggregate multi-day settlement and cash reconciliation report | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/accounts/settlements/daily?date=2026-04-12 HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_settlement_01
```

### 2.2. Response Payload (`Entry[]`)
```json
{
  "success": true,
  "message": "Daily settlement data retrieved successfully",
  "data": [
    {
      "id": 1,
      "shift": "Morning (06:00 - 12:00)",
      "openingBalance": 100000,
      "cashCollected": 140000,
      "upiCollected": 350000,
      "expenses": 15000,
      "closingBalance": 225000,
      "settledBy": "Ramesh Kumar (Manager)",
      "status": "settled"
    },
    {
      "id": 2,
      "shift": "Afternoon (12:00 - 18:00)",
      "openingBalance": 225000,
      "cashCollected": 80000,
      "upiCollected": 120000,
      "expenses": 0,
      "closingBalance": 305000,
      "settledBy": "Staff On Duty",
      "status": "pending"
    }
  ],
  "meta": {
    "date": "2026-04-12",
    "totalCashInDrawer": 305000,
    "totalUpiCollections": 470000,
    "totalDayExpenses": 15000,
    "currency": "INR"
  },
  "requestId": "req_settlement_01"
}
```

### 2.3. Close Shift Request Payload (`POST /api/v1/manager/accounts/settlements/close-shift`)
```json
{
  "shift": "Afternoon (12:00 - 18:00)",
  "openingBalance": 225000,
  "cashCollected": 80000,
  "upiCollected": 120000,
  "expenses": 0,
  "closingBalance": 305000,
  "remarks": "Handed drawer cash over to Evening Shift supervisor."
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAccountsDailySettlementPage.tsx` using `ManagerAccountsDailySettlementNativeTable.tsx`.
- **Currency Standards**: Formatted using `useManagerDailySettlementCurrencyFormatter` in compliant ISO 4217 INR format.
- **Offline / Standalone Fallback**: Hydrates with `MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS` from `ManagerAccountsDailySettlementDemoRepository.ts`.
- **Integrity**: Enforces mathematical drawer balance verification: `closingBalance === openingBalance + cashCollected - expenses`.

