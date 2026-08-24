// Thin fetch wrapper — replaces legacy's server-rendered forms POSTing
// directly to sibling .php files. Always sends credentials so the httpOnly
// auth cookie (see server/src/utils/jwt.ts) rides along automatically.
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // FormData bodies (file uploads) must NOT get a manual Content-Type — the
  // browser has to set its own multipart boundary.
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;

  const res = await fetch(`${API_BASE}/api${path}`, {
    credentials: "include",
    ...init,
    headers: { ...(isFormData ? {} : { "Content-Type": "application/json" }), ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Builds a full URL for a server-relative asset path (e.g. Movie.posterPath). */
export function assetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return `${API_BASE}${path}`;
}
