export interface ManagerMembersAlumniListUrlState {
  search: string;
  seat: string;
  status: string;
  shift: string;
}

export function readManagerAlumniListUrlState(params: URLSearchParams): ManagerMembersAlumniListUrlState {
  return {
    search: params.get('search') ?? params.get('smartId') ?? '',
    seat: params.get('seat') ?? '',
    status: params.get('status') ?? 'all',
    shift: params.get('shift') ?? 'all',
  };
}

export function updateManagerAlumniListUrl(pathname: string, currentQuery: string, key: string, value: string, defaultValue = ''): string {
  const params = new URLSearchParams(currentQuery);
  if (!value || value === defaultValue) params.delete(key); else params.set(key, value);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function updateManagerAlumniSearchUrl(pathname: string, currentQuery: string, value: string): string {
  const params = new URLSearchParams(currentQuery);
  params.delete('smartId');
  if (value.trim()) params.set('search', value); else params.delete('search');
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
