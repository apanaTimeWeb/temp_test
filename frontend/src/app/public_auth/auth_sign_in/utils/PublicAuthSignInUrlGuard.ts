/** Fail closed unless the host supplies an unambiguous root-relative API path. */
export function requirePublicAuthEndpointPath(path: string, configurationKey: string): string {
  const isAbsoluteProtocolUrl = /^[a-z][a-z\d+.-]*:/i.test(path);
  const hasAmbiguousCharacters = /[\\\u0000-\u0020\u007f?#]/.test(path);

  if (
    !path ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    isAbsoluteProtocolUrl ||
    hasAmbiguousCharacters
  ) {
    throw new Error(
      `PublicAuthentication is not configured. Set ${configurationKey} to the approved relative API path before using this flow.`,
    );
  }

  // URL parsing treats backslashes as separators for HTTP(S); reject them above before parsing.
  // Compare the normalized pathname too, so dot-segment normalization cannot silently change the endpoint.
  const validationOrigin = 'https://auth-path-validation.invalid';
  try {
    const parsed = new URL(path, validationOrigin);
    if (parsed.origin !== validationOrigin || parsed.pathname !== path || parsed.search || parsed.hash) {
      throw new Error('INVALID_AUTH_ENDPOINT_PATH');
    }
  } catch {
    throw new Error(
      `PublicAuthentication is not configured. Set ${configurationKey} to the approved relative API path before using this flow.`,
    );
  }

  return path;
}
