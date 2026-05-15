import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="font-medium underline underline-offset-4 hover:no-underline">
        {children}
      </a>
    ),
    pre: ({ children }) => (
      <pre className="mt-4 overflow-x-auto rounded-lg border bg-muted p-4">{children}</pre>
    ),
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-1 py-0.5 font-mono text-sm">{children}</code>
    ),
    ...components,
  }
}
