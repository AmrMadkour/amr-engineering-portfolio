# Review Current Phase

Look at:
- the git diff
- recently changed files
- newly created folders/files
- dependency or configuration changes from this session

Produce a structured phase review with the following sections:

## What was done

List all created, modified, renamed, or removed files grouped by:
- Application
- Domain
- Infrastructure
- Presentation
- Shared/Packages
- Configuration/Tooling
- Documentation

Only include meaningful changes.

---

## Why each decision was made

For each important architectural or implementation decision, explain briefly:
- why this approach was chosen
- what problem it solves
- any tradeoffs considered

Focus on:
- libraries
- patterns
- abstractions
- folder structure
- conventions
- infrastructure decisions

---

## How to test it

Provide exact commands to validate the implementation end-to-end.

Include:
- how to start the application
- how to run tests
- how to verify APIs or UI behavior
- expected successful output/results
- important edge cases if applicable

Only include commands that actually exist in the project.

---

## Risks or follow-up improvements

List:
- technical debt
- temporary implementations
- missing validations/tests
- future refactoring opportunities

Keep the entire response concise and under 60 lines.