# Backend Integration Specification — Members ID Card Generator

## 1. Overview
The ID Card Generator module (`manager_members/members_id_card_generator`) renders official learner smart ID cards with barcode generation, photo badges, validity dates, seat allocation, and live search/filter functionality.

## 2. API Endpoint Contract

| Method | Endpoint | Description | Scope / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/students` or `/api/v1/manager/members/students` | Returns list of learners with smartId, status, seat, and plan | `manager`, `branch_admin` |
| `GET` | `/students/:id` | Returns single learner details for card generation | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /students HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_idcard_01
```

### 2.2. Response Payload (Zod-Validated Schema: `ManagerMembersIdCardGeneratorListResponseSchema`)
```json
{
  "success": true,
  "message": "Learners retrieved successfully",
  "data": [
    {
      "id": "1",
      "smartId": "LIB-001",
      "name": "Alex Rivera",
      "phone": "+91 98765 43210",
      "status": "Active",
      "shift": "Morning",
      "seat": "S-01",
      "branch": "Main Branch",
      "plan": "Monthly",
      "dueMinor": 0,
      "currency": "INR",
      "joined": "01/01/2024"
    }
  ],
  "requestId": "req_idcard_01"
}
```

## 3. Frontend Architecture
- **Hook**: `useManagerIdCardGenerator()` in `hooks/useManagerMembersIdCardGenerator.ts`
- **Query Key**: `MANAGER_STUDENTS_QUERY_KEYS.list()`
- **Standalone Fallback**: Falls back to `MANAGER_STUDENTS_FIXTURES` when `/students` is offline.

