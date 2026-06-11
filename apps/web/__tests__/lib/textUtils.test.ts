import { describe, it, expect } from 'vitest'
import { toCompleteSentences } from '@/lib/textUtils'

describe('toCompleteSentences', () => {
  it('returns first 2 sentences by default', () => {
    const text = 'First sentence. Second sentence. Third sentence.'
    expect(toCompleteSentences(text)).toBe('First sentence. Second sentence.')
  })

  it('appends a period when the taken text does not end with one', () => {
    const text = 'Only one sentence here'
    expect(toCompleteSentences(text)).toBe('Only one sentence here.')
  })

  it('does not double-add a period when the taken text already ends with one', () => {
    const text = 'Single sentence.'
    expect(toCompleteSentences(text)).toBe('Single sentence.')
  })

  it('respects a custom maxSentences argument', () => {
    const text = 'One. Two. Three. Four.'
    expect(toCompleteSentences(text, 3)).toBe('One. Two. Three.')
  })

  it('returns the full text when there are fewer sentences than maxSentences', () => {
    const text = 'Just one sentence.'
    expect(toCompleteSentences(text, 3)).toBe('Just one sentence.')
  })

  it('handles text with no sentence boundaries', () => {
    const text = 'No periods at all in this string'
    expect(toCompleteSentences(text)).toBe('No periods at all in this string.')
  })
})
