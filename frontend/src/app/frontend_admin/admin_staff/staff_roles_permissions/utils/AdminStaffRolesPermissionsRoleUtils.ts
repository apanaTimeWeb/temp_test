/** Resolve a displayed role to the existing API key without changing its casing. Missing role fields stay unknown. */
export function resolveAdminStaffRolesPermissionsRoleEntry(
  roles: Record<string, boolean>,
  requestedRole: string,
): { key: string; value: boolean } | { key: null; value: null } {
  const key = Object.keys(roles).find((candidate) => candidate.toLowerCase() === requestedRole.toLowerCase());
  if (key === undefined) return { key: null, value: null };
  const value = roles[key];
  return value === undefined ? { key: null, value: null } : { key, value };
}
