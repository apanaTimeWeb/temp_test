# Backend Integration Specification — Members New Admission

## 1. Overview
The New Admission module (`manager_members/members_new_admission`) handles student registration, photo upload, personal information, subscription plan selection, shift allocation, seat and locker assignment, manual discounts, and payment mode capture.

## 2. API Endpoint Contract

| Method | Endpoint | Description | Scope / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/manager/members/admission` | Registers a new student and allocates seat/shift | `manager`, `branch_admin` |
| `GET` | `/api/v1/manager/members/shifts-seats` | Retrieves available shifts and vacant seat numbers | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
POST /api/v1/manager/members/admission HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_adm_01
```

### 2.2. Request Payload (Zod-Validated Schema: `ManagerMembersNewAdmissionSchema`)
```json
{
  "name": "Dev Sharma",
  "phone": "9876543210",
  "plan": "Monthly",
  "shift": "Morning",
  "seat": "S-05",
  "locker": "L-12",
  "paymentMode": "UPI",
  "discountMinor": 20000,
  "amountPaidMinor": 120000,
  "currency": "INR"
}
```

### 2.3. Response Payload
```json
{
  "success": true,
  "message": "Student admitted successfully",
  "data": {
    "id": "stu_1092",
    "smartId": "LIB-1092",
    "name": "Dev Sharma",
    "phone": "+91 98765 43210",
    "shift": "Morning",
    "seat": "S-05",
    "plan": "Monthly",
    "joined": "2026-10-30",
    "status": "Active"
  },
  "requestId": "req_adm_01"
}
```

## 3. Frontend Architecture
- **Hook**: `useManagerNewAdmissionAdmission()` in `hooks/useManagerMembersNewAdmissionAdmission.ts`
- **Dirty Form Guard**: Protects against unsaved data loss using `useManagerMembersNewAdmissionConfirm` and `useManagerMembersNewAdmissionUnsavedChangesGuard`.
- **Currency & Minor Units**: Converts user major amounts into integer minor units without floating point drift via `toManagerNewAdmissionMinorUnits`.

