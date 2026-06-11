export function toCompleteSentences(text: string, maxSentences = 2): string {
  const parts = text.split(/\.\s+/)
  const taken = parts.slice(0, maxSentences).join('. ')
  return taken.endsWith('.') ? taken : taken + '.'
}
