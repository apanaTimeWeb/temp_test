# Backend Integration Specification — Members Alumni Directory

## 1. Overview
The Alumni Directory module (`manager_members/members_alumni`) tracks graduated students, competitive exam successes (UPSC, State PSC, SSC, Banking, NEET), duration of study, and provides communication channels (WhatsApp outreach) for alumni engagements and testimonials.

## 2. API Endpoint Contract

| Method | Endpoint | Description | Scope / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/manager/members/alumni` | Retrieves paginated list of past learners / alumni | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/members/alumni` | Marks a student as graduated / alumni with exam outcome | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /api/v1/manager/members/alumni HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_alumni_01
```

### 2.2. Response Payload (JSON)
```json
{
  "success": true,
  "message": "Alumni records retrieved successfully",
  "data": [
    {
      "id": "alm_01",
      "name": "Kavita Singhania",
      "phone": "+91 98765 11111",
      "studiedFor": "2 Years",
      "targetExam": "UPSC CSE",
      "currentStatus": "Selected — IRS 2024",
      "leftOn": "2024-06-15"
    }
  ],
  "requestId": "req_alumni_01"
}
```

## 3. Frontend Architecture
- **Hook**: `useManagerMembersAlumniList()` in `hooks/useManagerMembersAlumniList.ts`
- **Fallback State**: When the authoritative alumni API is offline, the interface displays the standard empty/fixture state without crashing.
- **WhatsApp Integration**: Complies with the design system by preserving the official WhatsApp brand icon and color tokens.

