# Backend Integration Specification — Members Directory

## 1. Overview
The Members Directory module (`manager_members/members_directory`) provides the central directory of all branch learners, searchable by name, Smart ID, and phone number, with tabbed filtering by status (All, Active, Expired, Suspended), detailed member profile view, and operational action shortcuts (Renew, View ID Card, Collect Fee, Send Reminder).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/members` | `search`, `status`, `page`, `limit` | Paginated list of student member records | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/members/:id` | None | Full profile including emergency contact, college, join/expiry dates, seat | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/members?status=Active HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_members_dir_01
```

### 2.2. Response Payload (Zod-Validated Schema: `ManagerMembersDirectoryDemoRecordSchema`)
```json
{
  "success": true,
  "message": "Members retrieved successfully",
  "data": [
    {
      "id": "LIB-001",
      "name": "Alex Rivera",
      "phone": "+91 98765 43210",
      "type": "Monthly",
      "status": "Active",
      "shift": "Morning (6 AM - 12 PM)",
      "seat": "S-01",
      "joinDate": "2024-01-01",
      "expiryDate": "2026-12-31",
      "avatar": "AR",
      "college": "Delhi University",
      "emergencyPhone": "+91 98765 00000"
    }
  ],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "requestId": "req_members_dir_01"
}
```

## 3. Frontend Architecture
- **Hook**: `useManagerMemberDirectoryPageState(_routeQuery)` in `hooks/useManagerMembersDirectoryPageState.ts`
- **Search Debounce**: 300ms live debounce to eliminate excessive re-rendering and search thrashing.
- **Privacy Masking**: PII phone numbers are masked using `maskManagerMemberPhone`.
- **Standalone Mode**: `getManagerMemberDirectoryDemoRecords()` in `ManagerMembersDirectoryDemoRepository.ts` supplies stable fixture records when offline.

