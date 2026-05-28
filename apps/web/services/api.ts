const API_BASE = process.env.NEXT_PUBLIC_API_URL

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithRetry(url: string, init: RequestInit, retries = 1): Promise<Response> {
  try {
    const response = await fetch(url, init)
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
    }
    return response
  } catch (error) {
    const isAbort = error instanceof DOMException && error.name === 'AbortError'
    if (retries > 0 && !(error instanceof ApiError) && !isAbort) {
      return fetchWithRetry(url, init, retries - 1)
    }
    throw error
  }
}

export async function apiFetch<T>(path: string, locale: string, signal?: AbortSignal): Promise<T> {
  if (!API_BASE) {
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not configured')
  }

  // 5-second timeout so builds don't hang when the API is unreachable
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  const combinedSignal = signal ?? controller.signal

  try {
    const url = `${API_BASE}${path}?locale=${locale}`
    const response = await fetchWithRetry(url, {
      next: { revalidate: process.env.NODE_ENV === 'development' ? 0 : 3600 },
      signal: combinedSignal,
    })
    return response.json() as Promise<T>
  } finally {
    clearTimeout(timeout)
  }
}
