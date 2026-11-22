# finance_payment_promises — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Payment Promises
- **Canonical Route**: /frontend_manager/manager_finance/finance_payment_promises
- **Module Path**: src/app/frontend_manager/manager_finance/finance_payment_promises
- **Current State**: Pledged fee commitments, expected payment dates, fulfillment indicators, and promise extension management.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/payment-promises
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
  "requestId": "req-finance_payment_promises-001"
}
`

### 2.2 POST /api/v1/manager/finance/payment-promises/create (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "studentId": "LIB-022",
  "promisedAmount": 3000,
  "expectedDate": "2026-11-05",
  "reason": "Salary credit pending"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
