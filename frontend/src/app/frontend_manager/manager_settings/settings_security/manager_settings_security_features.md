# Settings Security — Features Contract

## Purpose
This terminal leaf module manages Manager Account Security, including password updating, TOTP Two-Factor Authentication (2FA), active device sessions inspection and remote revocation, and authentication audit trail logging.

## Architectural Separation from `settings_branch_info`
- **Branch Info (`settings_branch_info`)**: Owns physical and operational branch data — branch name, branch code, facility address, seat capacity, daily operational shifts, front desk hours, student Wi-Fi network credentials, and printable front desk standee QR.
- **Security Settings (`settings_security`)**: Owns manager personal identity and protection — password changes, 2FA authenticator QR & secret key setup, emergency recovery codes, active signed-in session termination (desktop/mobile/tablet), and login audit history.

## Routes
- `/frontend_manager/manager_settings/settings_security`
- `/frontend_manager/manager_settings/settings_security?tab=password`
- `/frontend_manager/manager_settings/settings_security?tab=2fa`
- `/frontend_manager/manager_settings/settings_security?tab=sessions`
- `/frontend_manager/manager_settings/settings_security?tab=history`

## Key Capabilities
1. **Password Management**:
   - Current password validation
   - Interactive strength meter (Weak -> Strong)
   - Real-time rule checklist (8+ chars, uppercase, lowercase, number, symbol, match)
   - Visibility toggles for all password fields
2. **Two-Factor Authentication (2FA)**:
   - TOTP secret key & scannable SVG QR code
   - Compatible with Google Authenticator, Microsoft Authenticator, and Authy
   - 6-digit confirmation code verification
   - 8 Emergency backup codes with one-click copy and regeneration
   - Disable 2FA modal with confirmation
3. **Active Sessions**:
   - Lists all authenticated manager devices (desktop, smartphone, laptop)
   - Displays device model, OS, browser, IP address, geographic location, and last active timestamp
   - Distinguishes "Current Device" from remote sessions
   - Remote revocation of individual sessions
   - Bulk "Log Out All Other Devices" action
4. **Login History**:
   - Audit trail of successful and failed/blocked attempts
   - Filter by All, Successful, and Blocked/Failed
   - Details including timestamp, device, browser, IP, location, and security warning flags
