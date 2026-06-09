import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Amr Madkour — Senior Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          padding: '80px 100px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Violet top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}
          >
            Amr Madkour
          </div>

          <div
            style={{
              fontSize: 32,
              color: '#a855f7',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            Senior Software Engineer
          </div>

          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 12,
              fontSize: 22,
              color: '#6b7280',
            }}
          >
            <span>.NET &amp; Cloud</span>
            <span style={{ color: '#374151' }}>·</span>
            <span>Clean Architecture</span>
            <span style={{ color: '#374151' }}>·</span>
            <span>AI-augmented Engineering</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 44,
            right: 70,
            fontSize: 20,
            color: '#4b5563',
          }}
        >
          amrmadkour.dev
        </div>
      </div>
    ),
    { ...size },
  )
}
