# finance_receipts — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Finance Receipts
- **Canonical Route**: /frontend_manager/manager_finance/finance_receipts
- **Module Path**: src/app/frontend_manager/manager_finance/finance_receipts
- **Current State**: Official payment receipts registry, thermal 80mm print view, and digital proof-of-payment lookup.

---

## 2. API Endpoints Contract

### 2.1 GET /api/v1/manager/finance/receipts
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
  "requestId": "req-finance_receipts-001"
}
`

### 2.2 POST /api/v1/manager/finance/receipts/reissue (Target)
Executes mutation or state update.

**Request Payload:**
`json
{
  "receiptId": "rec_991",
  "deliveryMode": "WHATSAPP",
  "recipientPhone": "+919876543210"
}
`

---

## 3. Mock & Offline Fallback Strategy
- Retains full UI layout with sample fixture fallback when backend is unreachable.
- All numeric currency values format via Intl.NumberFormat with ISO 4217 validation.
- Nullable values display — (En-dash) per Rule 78.
