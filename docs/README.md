# Docs

Technical documentation for this repository. If you're new here, start with the root
[`README.md`](../README.md) for the project overview, then come back here for the "why" behind it.

- [`architecture/overview.md`](architecture/overview.md) — what the system is and why it's shaped
  this way: tech stack rationale, layer boundaries, folder structure, caching, deployment.
- [`architecture/decisions/`](architecture/decisions/) — Architecture Decision Records (ADRs).
  Each one is a short, standalone record of a specific choice and its trade-offs.
- [`architecture/architecture-diagram.jsx`](architecture/architecture-diagram.jsx) — interactive
  visual diagram; open it in any React sandbox (CodeSandbox, StackBlitz) for a clickable layer +
  data-flow view of the system.

There is no separate session log in this repo — `git log` is the record of what changed and when.
Durable rationale belongs in `overview.md` or a new ADR, not in a growing log file.
