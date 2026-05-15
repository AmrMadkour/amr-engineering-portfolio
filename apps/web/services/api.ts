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

async function fetchWithRetry(url: string, init: RequestInit, retries = 2): Promise<Response> {
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
  const url = `${API_BASE}${path}?locale=${locale}`
  const response = await fetchWithRetry(url, {
    next: { revalidate: 3600 },
    signal,
  })
  return response.json() as Promise<T>
}
