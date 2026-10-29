# finance_late_fees — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Late Fees
- **Canonical Route**: /frontend_manager/manager_finance/finance_late_fees
- **Module Path**: src/app/frontend_manager/manager_finance/finance_late_fees
- **Current State**: Accrued daily overdue penalty calculator, grace period evaluation, and late fee waiver requests.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/late-fees
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
  "requestId": "req-finance_late_fees-001"
}
`

### 2.2 POST /api/v1/manager/finance/late-fees/waive (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "studentId": "LIB-091",
  "waiveAmount": 250,
  "approvalNotes": "Medical leave approved by admin"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
