# Backend Integration Specification — Notice Board & Broadcast Announcements

## 1. Overview
The Notice Board module (`manager_communication/communication_notices`) broadcasts administrative announcements, operational alerts, holiday notices, and exam guidelines to enrolled students. It supports priority tagging (`low`, `medium`, `high`, `urgent`), target audience segment filtering (All Members, Shift-specific, Floor-specific), and notice lifecycle states (`draft`, `published`, `archived`).

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/communication/notices` | `category`, `status`, `priority`, `page`, `limit` | Paginated listing of library notices | `manager`, `branch_admin`, `member` |
| `POST` | `/communication/notices` | Zod schema: `ManagerNoticesNoticeDraft` | Create and publish a new branch announcement | `manager`, `branch_admin` |
| `DELETE` | `/communication/notices/:id` | None | Remove or archive a published notice | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
GET /communication/notices?status=published HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_notices_01
```

### 2.2. Response Payload (`ManagerNoticesNoticeResponse[]`)
```json
{
  "success": true,
  "message": "Notices loaded.",
  "data": [
    {
      "id": "NOT-001",
      "title": "Branch Maintenance Closure — Sunday 19th",
      "content": "The study halls will remain closed between 8 AM and 2 PM for generator maintenance and electrical inspection.",
      "date": "2026-04-12",
      "priority": "high",
      "category": "holiday",
      "status": "published",
      "targetAudience": "All Members",
      "author": "Branch Manager"
    },
    {
      "id": "NOT-002",
      "title": "Air Conditioner Servicing Schedule",
      "content": "Hall A AC units are being serviced today. Please relocate temporarily to Hall B if required.",
      "date": "2026-04-10",
      "priority": "medium",
      "category": "general",
      "status": "published",
      "targetAudience": "Morning & Afternoon Shifts",
      "author": "Branch Manager"
    }
  ],
  "requestId": "msw-manager-communication-notices"
}
```

### 2.3. Publish Notice Request Payload (`POST /communication/notices`)
```json
{
  "title": "Library Exam Study Extended Hours",
  "content": "From May 1st to May 20th, the night shift hours are extended until 7 AM for civil services aspirants.",
  "priority": "high",
  "category": "event",
  "targetAudience": "All Members",
  "publishImmediately": true
}
```

## 3. Frontend Architecture
- **Views**: `ManagerCommunicationNoticesPage.tsx` with publish modal `ManagerCommunicationNoticesNotificationDraftForm.tsx`.
- **Validation**: Strict schema checking against `managerNoticesNoticeDraftSchema.ts`.
- **Offline / Standalone Fallback**: MSW handlers in `ManagerCommunicationNoticesHandlers.ts` hydrate from `MANAGER_NOTICES_API_FIXTURES`.
- **En-dash Fallback**: Nullable author or audience fields fall back cleanly to `—`.

