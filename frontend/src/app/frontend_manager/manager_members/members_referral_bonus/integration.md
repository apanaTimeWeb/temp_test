# manager_members_referral_bonus — Backend Integration Specification

## 1. Overview & Canonical Route
- **Feature Name**: Manager Members Referral Bonus
- **Canonical Route**: `/frontend_manager/manager_members/members_referral_bonus`
- **Module Path**: `src/app/frontend_manager/manager_members/members_referral_bonus`
- **Current State**: Fail-closed UI contract with defensive error boundaries and en-dash fallback when backend endpoint is unattached.

---

## 2. API Endpoints Contract (Target Specification)

### 2.1 GET `/api/v1/manager/referrals`
Retrieves a paginated list of referral program records with KPI metrics.

**Query Parameters:**
- `page` (integer, optional, default: 1)
- `limit` (integer, optional, default: 20)
- `search` (string, optional, debounced 300ms)
- `status` (string, optional: `all` | `pending` | `approved` | `paid` | `rejected`)

**Response Schema (`200 OK`):**
```json
{
  "kpis": {
    "total_referrals": 42,
    "pending_approvals": 5,
    "total_bonus_distributed": 12500,
    "currency": "INR"
  },
  "data": [
    {
      "id": "ref_101",
      "referrer_member_id": "mem_001",
      "referrer_name": "Rahul Verma",
      "referred_member_id": "mem_089",
      "referred_name": "Sneha Sharma",
      "bonus_amount": 500,
      "status": "approved",
      "created_at": "2026-10-15T10:30:00Z",
      "payout_date": "2026-10-20T14:00:00Z"
    }
  ],
  "pagination": {
    "total_records": 42,
    "current_page": 1,
    "total_pages": 3,
    "page_size": 20
  }
}
```

### 2.2 POST `/api/v1/manager/referrals`
Manual entry or approval of a referral bonus award.

**Request Payload:**
```json
{
  "referrer_member_id": "mem_001",
  "referred_member_id": "mem_089",
  "bonus_amount": 500,
  "remarks": "Applied upon successful 3-month subscription renewal"
}
```

**Response Schema (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "ref_102",
    "status": "pending",
    "created_at": "2026-10-29T20:00:00Z"
  }
}
```

---

## 3. Mock & Offline Fallback Strategy
- When offline or when the backend returns 404/503, the module retains fail-closed safety without throwing runtime uncaught exceptions.
- Empty states adhere to Rule 78 (displaying `—` for null/unloaded values).

