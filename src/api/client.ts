/**
 * The backend cable — transport only.
 *
 * This module knows how to reach the diminish API and nothing else. It imports
 * no UI type and no app data type, so the plug is genuinely one-directional:
 * pulling it (`src/api/` gone, `VITE_API_BASE_URL` unset) leaves the app on the
 * bundled demo catalogue with no other file needing a change.
 *
 * The backend itself is a separate service (`apps/api-server` in the
 * `diminish-studio` repo). No backend code lives here, and none should: this
 * layer only speaks HTTP to it.
 */

/**
 * Whatever `VITE_API_BASE_URL` holds, without trailing slashes — so
 * `` `${API_BASE_URL}${path}` `` never produces a double slash.
 */
const normalizedBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '');

/**
 * `null` means "no backend configured". Every caller is expected to treat that
 * as the normal, unplugged state — not as an error.
 */
export const API_BASE_URL: string | null = normalizedBaseUrl === '' ? null : normalizedBaseUrl;

/** Whether a backend is configured at all. Cheap, synchronous, no network. */
export function isApiConnected(): boolean {
  return API_BASE_URL !== null;
}

/**
 * A failed request, carrying the status so a caller can tell "no such song"
 * (404) from "the backend is down" (network failure → status 0) from a real
 * server fault (500).
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * The one request both verbs go through.
 *
 * Deliberately thin: JSON in, JSON out, aborts honoured, no retries, no caching,
 * no auth. Anything more opinionated belongs to the caller, which knows whether
 * a failure is fatal or worth falling back from.
 *
 * The API's own error envelope (`{ code, error }`, see `lib/http-errors.ts` on
 * the backend) is read when it is there, so a caller gets the backend's own
 * words rather than a bare status.
 */
async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  if (API_BASE_URL === null) {
    throw new ApiError(0, 'No backend configured — VITE_API_BASE_URL is empty');
  }

  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method,
    signal,
    headers: body === undefined
      ? { Accept: 'application/json' }
      : { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await messageFor(response, method, url));
  }

  return (await response.json()) as T;
}

/** The backend's `{ code, error }` when it sent one; the raw status otherwise. */
async function messageFor(response: Response, method: string, url: string): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === 'object') {
      const envelope = body as { code?: unknown; error?: unknown };
      const code = typeof envelope.code === 'string' ? envelope.code : '';
      const text = typeof envelope.error === 'string' ? envelope.error : '';
      if (code || text) return `${method} ${url} → ${response.status} ${code || text}`.trim();
    }
  } catch {
    // Not JSON (a proxy's HTML, an empty body) — the status is all there is.
  }
  return `${method} ${url} → HTTP ${response.status}`;
}

/** `GET` a path that starts with `/`, resolved against the configured base URL. */
export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>('GET', path, undefined, signal);
}

/** `POST` a JSON body to a path that starts with `/`. */
export function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>('POST', path, body, signal);
}
