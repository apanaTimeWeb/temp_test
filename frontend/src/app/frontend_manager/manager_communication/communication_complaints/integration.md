# Backend Integration Specification — Student Complaints & Feedback

## 1. Overview
The Complaints & Feedback module (`manager_communication/communication_complaints`) captures student grievances regarding noise disturbance, Wi-Fi speed, temperature control/air conditioning, seat condition, and facility cleanliness. It provides a triage dashboard with priority escalation, status progression (`open` -> `in-progress` -> `resolved`), and student communication feedback loops.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/communication/complaints` | `status`, `category`, `priority`, `page`, `limit` | Paginated listing of student complaints | `manager`, `branch_admin` |
| `PATCH` | `/communication/complaints/:id/status` | `{ status: "in-progress" \| "resolved" \| "rejected", resolutionNotes: string, sendUpdateToStudent: boolean }` | Update complaint status and log internal notes | `manager`, `branch_admin` |
| `POST` | `/communication/complaints` | Zod schema: `ManagerComplaintsComplaintDraft` | Internal or front-desk manual grievance ticket creation | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /communication/complaints?status=open HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_complaints_01
```

### 2.2. Response Payload (`ManagerComplaintsComplaintResponse[]`)
```json
{
  "success": true,
  "message": "Complaints loaded.",
  "data": [
    {
      "id": "CMP-101",
      "studentName": "Alex Rivera",
      "studentId": "LIB-001",
      "seatNo": "S-01",
      "category": "wifi",
      "subject": "Intermittent Wi-Fi Disconnection on Ground Floor",
      "description": "The 5GHz access point drops every 20 minutes near desks S-01 to S-08.",
      "date": "2026-04-12",
      "priority": "high",
      "status": "open",
      "resolutionNotes": null
    },
    {
      "id": "CMP-102",
      "studentName": "Priya Verma",
      "studentId": "LIB-002",
      "seatNo": "S-14",
      "category": "facility",
      "subject": "Hall A AC Temperature Too Cold",
      "description": "Temperature is set at 18°C directly above seat S-14. Please adjust to 24°C.",
      "date": "2026-04-11",
      "priority": "medium",
      "status": "in-progress",
      "resolutionNotes": "Technician contacted to adjust airflow louvers."
    }
  ],
  "requestId": "msw-manager-communication-complaints"
}
```

### 2.3. Resolve Ticket Payload (`PATCH /communication/complaints/:id/status`)
```json
{
  "status": "resolved",
  "resolutionNotes": "Router firmware restarted and frequency bands separated into 2.4/5GHz channels.",
  "sendUpdateToStudent": true
}
```

## 3. Frontend Architecture
- **Views**: `ManagerCommunicationComplaintsPage.tsx` with resolution dialog and detail drawer.
- **Privacy & Safety**: Student ID and name are displayed; phone numbers are masked.
- **Offline / Standalone Fallback**: MSW intercepts and serves `MANAGER_COMPLAINTS_API_FIXTURES` when no backend is available.
- **Display Integrity**: Status pills are color-coded (Open: Warning, In-Progress: Info, Resolved: Success, Rejected: Neutral).

