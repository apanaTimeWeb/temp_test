/** Reject malformed or absolute endpoint configuration before the host API client is called. */
export function requirePublicAuthPasswordResetEndpointPath(path: string): string {
  const isAbsoluteProtocolUrl = /^[a-z][a-z\d+.-]*:/i.test(path);
  const hasAmbiguousCharacters = /[\\\u0000-\u0020\u007f?#]/.test(path);
  if (!path || !path.startsWith('/') || path.startsWith('//') || isAbsoluteProtocolUrl || hasAmbiguousCharacters) {
    throw new Error('AUTH_ENDPOINT_CONFIGURATION_MISSING');
  }
  try {
    const validationOrigin = 'https://auth-path-validation.invalid';
    const parsed = new URL(path, validationOrigin);
    if (parsed.origin !== validationOrigin || parsed.pathname !== path || parsed.search || parsed.hash) throw new Error('INVALID_AUTH_ENDPOINT_PATH');
  } catch {
    throw new Error('AUTH_ENDPOINT_CONFIGURATION_MISSING');
  }
  return path;
}
