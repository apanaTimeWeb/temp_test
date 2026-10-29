# finance_fines_payments — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Fines & Payments
- **Canonical Route**: /frontend_manager/manager_finance/finance_fines_payments
- **Module Path**: src/app/frontend_manager/manager_finance/finance_fines_payments
- **Current State**: Library resource damage/loss penalties, noise misconduct fines, and fine collection receipts.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/fines
Fetches canonical records, metrics, and filter states.

**Query Parameters:**
- search (string, optional, 300ms debounced)
- status (string, optional: ll | active/pending variants)
- page (integer, optional, default: 1)
- limit (integer, optional, default: 20)

**Response Schema (200 OK):**
`json
{
  "success": true,
  "message": "Data loaded successfully",
  "data": [],
  "requestId": "req-finance_fines_payments-001"
}
`

### 2.2 POST /api/v1/manager/finance/fines/collect (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "fineId": "fine_304",
  "amountPaid": 300,
  "mode": "UPI",
  "txnId": "UPI/491029"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
