# finance_collect_fee — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Collect Fee
- **Canonical Route**: /frontend_manager/manager_finance/finance_collect_fee
- **Module Path**: src/app/frontend_manager/manager_finance/finance_collect_fee
- **Current State**: Full fee collection interface, student search, subscription/custom dues, multi-mode payment, and thermal 80mm receipt generation.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/collect-fee/student/:studentId
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
  "requestId": "req-finance_collect_fee-001"
}
`

### 2.2 POST /api/v1/manager/finance/collect-fee/submit (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "studentId": "LIB-001",
  "amountPaid": 2500,
  "paymentMode": "UPI",
  "planId": "plan_monthly_01",
  "txnId": "UPI/10928371"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
