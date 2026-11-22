# Backend Integration Specification — Contactless QR Scanner Kiosk

## 1. Overview
The QR Scanner Kiosk module (`manager_attendance/attendance_qr_scanner`) delivers a high-speed contactless check-in/check-out station. When a student scans their digital ID card or physical RFID/barcode, the terminal authenticates the token, registers their in/out timestamp, verifies active subscription status, and displays real-time confirmation banners with audio/visual feedback.

## 2. API Endpoint Contract

| Method | Endpoint | Query Parameters / Body | Description | Scope / Role |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/manager/attendance/qr/scan` | `{ scanPayload: string, terminalId?: string, action?: "auto" \| "check_in" \| "check_out" }` | Validates QR token and logs real-time attendance punch | `manager`, `kiosk_terminal` |
| `GET` | `/api/v1/manager/attendance/qr/recent-scans` | `limit` (default `10`), `terminalId` | Feed of most recent automated scan entries for front-desk monitoring | `manager`, `kiosk_terminal` |
| `POST` | `/api/v1/manager/attendance/qr/manual-punch` | `{ smartId: string, punchType: "IN" \| "OUT" }` | Manual override punch when barcode reader cannot parse physical badge | `manager`, `branch_admin` |

### 2.1. Request Headers
```http
POST /api/v1/manager/attendance/qr/scan HTTP/1.1
Host: api.libraryos.com
Authorization: Bearer <terminal_or_manager_token>
Content-Type: application/json
Accept: application/json
X-Request-Id: req_qr_scan_01
```

### 2.2. Scan Request Body
```json
{
  "scanPayload": "LIB-QR-SL001-TOKEN99812",
  "terminalId": "KIOSK-MAIN-ENTRANCE-01",
  "action": "auto"
}
```

### 2.3. Scan Response Body (`ManagerAttendanceQrScannerResponse`)
```json
{
  "success": true,
  "message": "Check-in successful",
  "data": {
    "studentId": "1",
    "smartId": "SL-001",
    "name": "Rahul Sharma",
    "shift": "Morning (6 AM - 12 PM)",
    "assignedSeat": "S-14",
    "action": "CHECK_IN",
    "timestamp": "2026-04-12T09:02:15+05:30",
    "status": "VALID",
    "membershipExpiresInDays": 42
  },
  "requestId": "req_qr_scan_01"
}
```

## 3. Frontend Architecture
- **Views**: `ManagerAttendanceQrScannerPage.tsx` with scan camera viewport, camera switcher, manual Smart ID fallback input, and recent scan audit feed.
- **Resilience**: Standalone demo mode functions without webcam hardware by allowing manual test code entry against `MANAGER_ENGAGEMENT_SAMPLE_ATTENDANCE` fixture records.
- **Fail-Safe Contract**: Invalid or expired QR passes fail closed with descriptive modal warnings (`Membership Expired`, `Wrong Shift Window`, `Unrecognized Token`).

