import { describe, it, expect, vi, afterEach } from 'vitest'
import { apiFetch, ApiError } from '@/services/api'

// NEXT_PUBLIC_API_URL is set to 'http://test-api' via vitest.config.ts test.env,
// so API_BASE is available when the module is loaded.

describe('apiFetch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('throws ApiError when API_BASE is not set (module reloaded without env)', async () => {
    // Reload the module with the env var cleared so API_BASE is falsy
    vi.stubEnv('NEXT_PUBLIC_API_URL', '')
    vi.resetModules()
    const { apiFetch: apiFetchFresh, ApiError: ApiErrorFresh } = await import('@/services/api')
    await expect(apiFetchFresh('/v1/profile', 'en')).rejects.toThrow(ApiErrorFresh)
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('fetches and returns parsed JSON on success', async () => {
    const mockData = { name: 'Amr' }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    }))

    const result = await apiFetch('/v1/profile', 'en')
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith(
      'http://test-api/v1/profile?locale=en',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('throws ApiError on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }))

    await expect(apiFetch('/v1/profile', 'en')).rejects.toThrow(ApiError)
  })

  it('includes the locale as a query param', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }))

    await apiFetch('/v1/experience', 'ar')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('locale=ar'),
      expect.any(Object),
    )
  })
})
