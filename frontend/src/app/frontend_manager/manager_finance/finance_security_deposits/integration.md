# finance_security_deposits — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Security Deposits
- **Canonical Route**: /frontend_manager/manager_finance/finance_security_deposits
- **Module Path**: src/app/frontend_manager/manager_finance/finance_security_deposits
- **Current State**: Security deposit ledger for lockers and library premises, deductions for damage, and refund processing.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/security-deposits
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
  "requestId": "req-finance_security_deposits-001"
}
`

### 2.2 POST /api/v1/manager/finance/security-deposits/refund (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "depositId": "dep_891",
  "refundAmount": 500,
  "deductionAmount": 0,
  "reason": "Locker vacated in good condition"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
