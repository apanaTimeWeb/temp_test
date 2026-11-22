# Backend Integration Specification — Members CRM Enquiries

## 1. Overview
The Enquiries module (`manager_members/members_enquiries`) manages prospective student enquiries, status pipeline (New, Contacted, Visited, Interested, Converted, Lost), follow-up timelines, and conversion into active memberships.

## 2. API Endpoint Contract

| Method | Endpoint | Description | Scope / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/crm/enquiries` | Returns array of prospective learner enquiries | `manager`, `counselor` |
| `GET` | `/crm/enquiries/:id` | Returns single enquiry detail with full follow-up history | `manager`, `counselor` |
| `POST` | `/crm/enquiries` | Creates a new prospective student enquiry | `manager`, `counselor` |
| `PATCH` | `/crm/enquiries/:id/status` | Updates pipeline status (e.g. Visited, Converted, Lost) | `manager`, `counselor` |
| `POST` | `/crm/enquiries/:id/follow-up` | Appends a follow-up interaction record | `manager`, `counselor` |

### 2.1. Request Headers
```http
GET /crm/enquiries HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_crm_01
```

### 2.2. Response Payload (Zod-Validated Schema: `managerCrmEnquiryResponseSchema`)
```json
{
  "success": true,
  "message": "Enquiries retrieved successfully",
  "data": [
    {
      "id": "enq_001",
      "name": "Arjun Kapoor",
      "phone": "+91 98765 43210",
      "shift": "Morning",
      "status": "New",
      "source": "Walk-in",
      "handledBy": "Sarah Jenkins",
      "preferredBranch": "Downtown Hub",
      "enquiryDate": "May 20, 2025",
      "followUps": [
        {
          "id": "fu_001",
          "date": "May 20, 2025",
          "time": "10:30 AM",
          "by": "Sarah Jenkins",
          "remark": "Walked in to check facilities. Interested in UPSC preparation."
        }
      ]
    }
  ],
  "requestId": "req_crm_01"
}
```

### 2.3. Creation Request Payload (POST `/crm/enquiries`)
```json
{
  "name": "Asha Sharma",
  "phone": "9876543210",
  "preferredShift": "Morning",
  "source": "Walk-in",
  "handledBy": "Admin",
  "notes": "Interested in 6-month UPSC study package"
}
```

### 2.4. Follow-up Interaction Payload (POST `/crm/enquiries/:id/follow-up`)
```json
{
  "date": "2026-10-30",
  "remark": "Followed up via phone call. Ready to visit tomorrow."
}
```

## 3. Frontend Architecture
- **Hook**: `useManagerMembersEnquiries()` in `hooks/useManagerMembersEnquiriesEnquiries.ts`
- **Query Key**: `MANAGER_CRM_QUERY_KEYS.list()`
- **Standalone Fallback**: Seamlessly uses `getManagerEnquiriesMockEnquiries()` when the CRM backend service is unreachable.
- **Unsaved Changes Guard**: Utilizes `useManagerMembersEnquiriesConfirm` modal to protect against dirty form state loss.

