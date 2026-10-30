/** Frontend session data contract. The host application must supply the real authenticated session adapter. */
export interface AdminSessionUser {
  id: string;
  role: string;
  name?: string;
}

/**
 * BLOCKED BY SUPPLIED SCOPE: the supplied frontend bundle contains no verified session endpoint/SDK contract.
 * Fail closed rather than inventing an endpoint or pretending a user is authenticated.
 * Replace this adapter during host integration with the host application's authenticated session source.
 */
export async function getCurrentUser(): Promise<AdminSessionUser | null> {
  return null;
}
