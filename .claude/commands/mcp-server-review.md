# MCP Server Review (No Installation)

Analyze the current repository, architecture, tooling, workflows, and development setup.

Check whether this project would benefit from using any MCP (Model Context Protocol) servers.

## Review areas

Inspect:
- project architecture
- frontend/backend stack
- databases
- APIs
- package managers
- testing setup
- deployment workflow
- documentation workflow
- design/dev tooling
- developer productivity workflows

## Objective

Determine:
- whether any MCP servers would meaningfully improve development workflow, architecture understanding, debugging, testing, documentation, deployment, or productivity
- whether the current project complexity justifies them

## Required output

For each recommended MCP server provide:

### 1. MCP Server Name
Example:
- filesystem
- github
- postgres
- playwright
- figma
- docker
- browser/devtools
- etc.

### 2. Why it would help
Explain:
- what problem it solves
- why it fits this project
- what workflow it improves

### 3. Expected benefits
Examples:
- faster debugging
- safer refactoring
- database inspection
- UI testing
- architecture visibility
- deployment validation
- documentation sync

### 4. Priority
Mark as:
- Recommended
- Optional
- Not Needed Yet

## Rules

- DO NOT install any MCP server
- DO NOT modify configuration files
- DO NOT generate setup commands
- DO NOT assume approval
- Only analyze and recommend

## Final summary

At the end provide:
- which MCP servers are truly worth adding now
- which should wait until later phases
- which are unnecessary for this project currently