# finance_trust_scores — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Trust Scores
- **Canonical Route**: /frontend_manager/manager_finance/finance_trust_scores
- **Module Path**: src/app/frontend_manager/manager_finance/finance_trust_scores
- **Current State**: Student payment reliability gauge (0-100), promise adherence metrics, and financial risk rankings.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/trust-scores
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
  "requestId": "req-finance_trust_scores-001"
}
`

### 2.2 POST /api/v1/manager/finance/trust-scores/recalculate (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "scope": "branch",
  "forceRecalculation": true
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
