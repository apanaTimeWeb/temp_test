# finance_refunds — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Refunds
- **Canonical Route**: /frontend_manager/manager_finance/finance_refunds
- **Module Path**: src/app/frontend_manager/manager_finance/finance_refunds
- **Current State**: Refund request approval workflow, payout vouchers, reversal audit trails, and student balance adjustments.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/refunds
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
  "requestId": "req-finance_refunds-001"
}
`

### 2.2 POST /api/v1/manager/finance/refunds/approve (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "refundId": "ref_req_109",
  "approvedAmount": 1200,
  "paymentMethod": "BANK_TRANSFER"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
