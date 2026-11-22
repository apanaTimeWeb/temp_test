# Backend Integration Specification — Members Group Admission

## 1. Overview
The Group Admission module (`manager_members/members_group_admission`) manages bulk registration of cohorts, study groups, friends registering together, and bulk CSV/Excel spreadsheet uploads.

## 2. API Endpoint Contract

| Method | Endpoint | Description | Scope / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/manager/members/group-admission` | Submits batch student admission records | `manager`, `branch_admin` |
| `POST` | `/api/v1/manager/members/bulk-upload` | Parses and processes CSV/Excel upload | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/members/group-admissions/recent` | Retrieves recent group admission batches | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
POST /api/v1/manager/members/group-admission HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_group_adm_01
```

### 2.2. Request Payload (JSON)
```json
{
  "groupName": "UPSC Batch 2026",
  "members": [
    {
      "name": "Manish Sharma",
      "phone": "9876543201",
      "shift": "Morning",
      "plan": "Quarterly",
      "seat": "S-10"
    },
    {
      "name": "Deepak Gupta",
      "phone": "9876543202",
      "shift": "Morning",
      "plan": "Quarterly",
      "seat": "S-11"
    }
  ],
  "paymentMode": "Bank Transfer",
  "totalAmountPaidMinor": 300000,
  "currency": "INR"
}
```

### 2.3. Response Payload
```json
{
  "success": true,
  "message": "Group admission created successfully",
  "data": {
    "batchId": "grp_2026_01",
    "admittedCount": 2,
    "groupName": "UPSC Batch 2026",
    "createdAt": "2026-10-30T10:00:00Z"
  },
  "requestId": "req_group_adm_01"
}
```

## 3. Frontend Architecture
- **Hook**: `useManagerGroupAdmissionAdmission()` in `hooks/useManagerMembersGroupAdmissionAdmission.ts`
- **Dirty Form Guard**: Utilizes `useManagerMembersGroupAdmissionConfirm` to protect multi-member draft entry against accidental navigation.
- **CSV Exporter/Parser**: `ManagerMembersGroupAdmissionCsv.ts` handles standard spreadsheet template generation.

