const API_BASE_DEFAULT = '/api';

function normalizeBase(base: string) {
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function getApiBase() {
  return normalizeBase(process.env.REACT_APP_API_BASE || API_BASE_DEFAULT);
}

export function getToken() {
  return localStorage.getItem('ajiva_token');
}

export function clearToken() {
  localStorage.removeItem('ajiva_token');
}

export async function apiFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers || undefined);
  if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${getApiBase()}${path}`, { ...init, headers });
  return res;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data && typeof data.error === 'string' ? data.error : `Request failed (${res.status})`;
    const err = new Error(msg);
    // @ts-expect-error attaching metadata
    err.status = res.status;
    // @ts-expect-error attaching metadata
    err.data = data;
    throw err;
  }
  return data as T;
}
