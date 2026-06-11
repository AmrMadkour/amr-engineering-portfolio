import { describe, it, expect, vi, afterEach } from 'vitest'

// NEXT_PUBLIC_API_URL is set to 'http://test-api' in vitest.config.ts env

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function mockOkFetch(data: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  }))
}

describe('getProfile', () => {
  it('calls /v1/profile with the locale', async () => {
    mockOkFetch({ name: 'Amr' })
    const { getProfile } = await import('@/services/profile')
    await getProfile('en')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/profile?locale=en'),
      expect.any(Object),
    )
  })
})

describe('getExperience', () => {
  it('calls /v1/experience with the locale', async () => {
    mockOkFetch([])
    const { getExperience } = await import('@/services/experience')
    await getExperience('nl')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/experience?locale=nl'),
      expect.any(Object),
    )
  })
})

describe('getProjects', () => {
  it('calls /v1/projects with the locale', async () => {
    mockOkFetch([])
    const { getProjects } = await import('@/services/projects')
    await getProjects('ar')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/projects?locale=ar'),
      expect.any(Object),
    )
  })
})

describe('getRecommendations', () => {
  it('calls /v1/recommendations with the locale', async () => {
    mockOkFetch([])
    const { getRecommendations } = await import('@/services/recommendations')
    await getRecommendations('en')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/recommendations?locale=en'),
      expect.any(Object),
    )
  })
})
