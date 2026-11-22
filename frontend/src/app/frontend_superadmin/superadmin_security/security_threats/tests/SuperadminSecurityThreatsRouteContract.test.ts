// RESPONSIBILITY: Define source-level test coverage for security threats using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_threats/tests/SuperadminSecurityThreatsRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SECURITY_THREATS_ROUTES as __SUPERADMIN_SECURITY_THREATS_ROUTES } from "@/app/frontend_superadmin/superadmin_security/security_threats/config/superadmin_security_threats.url_config";

describe('security_threats route contract', () => { it('owns its canonical refreshable route', () => { expect(__SUPERADMIN_SECURITY_THREATS_ROUTES.SUPERADMIN_SECURITY_AUDIT_THREATS_URLS.PAGE).toBe('/superadmin/superadmin_security/security_threats'); expect(__SUPERADMIN_SECURITY_THREATS_ROUTES.SUPERADMIN_SECURITY_AUDIT_THREATS_URLS.SCREEN).toBe(__SUPERADMIN_SECURITY_THREATS_ROUTES.SUPERADMIN_SECURITY_AUDIT_THREATS_URLS.PAGE); }); });
