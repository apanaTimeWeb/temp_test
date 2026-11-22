# Architecture: Users, Roles & Permissions

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files
- Zero raw browser dialogs (`window.confirm`, `window.prompt`, `window.alert`)
- Granular permission matrix with isolated role editing.

## Data Flow
```
page.tsx -> SuperadminUsersRolesPermissionsPageClient
  -> Role Directory & Stats Header
  -> Granular Permissions Matrix Table
  -> Modals:
     - Role Create / Edit Modal
     - SuperadminUserSecurityAuditModal
       -> SuperadminUserSecurityControlsTab (MFA, Active Sessions, Lockout)
```
