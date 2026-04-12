# Claude Plugin Agents and Tools

> Sources: Unknown, Unknown
> Raw: [Claude Plugin Agents, Subagents, and Tools Q&A](../../raw/hr-operations/claude-plugin-agents-subagents-and-tools-qa.md)
> Updated: 2026-04-12

## Overview

Claude plugins support three component types beyond skills: **agents** (subagents that run in isolated context windows), **commands** (user-invoked slash commands), and **tools** (MCP servers, local CLIs, and bundled scripts). Together these allow a plugin to deliver both expert knowledge (skills) and autonomous execution capacity (agents + tools) in a single installable unit.

## Defining Subagents in a Plugin

Subagents are defined by placing Markdown files in an `agents/` directory at the plugin root. Each file combines YAML frontmatter (configuration) with a Markdown system prompt (behavior).

```
plugin-name/
└── agents/
    └── code-reviewer.md
```

Example agent definition:

```yaml
---
name: code-reviewer
description: Expert code reviewer that focuses on security and best practices.
model: sonnet
tools: [Read, Grep, Glob]
---
You are a senior code reviewer. Analyze code for vulnerabilities and suggest
improvements for readability and performance.
```

Key frontmatter fields:
- **`name`** — identifier; appears in `/agents` listing and `claude agents` CLI output.
- **`description`** — used by Claude to decide when to automatically delegate to the subagent.
- **`model`** — model to use for this agent (e.g. `sonnet`, `opus`).
- **`tools`** / **`disallowedTools`** — restrict or limit inherited tools for safety or focus.

## Plugin Security Restrictions on Subagents

Subagents shipped inside plugins operate under tighter constraints than locally-installed agents. The following fields are **blocked** in plugin-distributed agents:

| Blocked field | Reason |
|---|---|
| `hooks` | Event-driven automation requires local trust |
| `mcpServers` | MCP server configuration must be controlled by the user |
| `permissionMode` | Permission escalation not allowed via marketplace plugins |

If an agent requires any of these, it must be installed as a local project agent or user agent, not bundled in a shareable plugin.

## Skills vs Agents

| | Skill (SKILL.md) | Agent (agents/*.md) |
|---|---|---|
| Execution scope | Current conversation | Isolated context window |
| Context impact | Loads into main session | Returns only a summary; doesn't bloat main chat |
| Autonomy | Single-task instruction | Multi-step Plan → Execute → Verify loops |
| Tool access | Inherits active session tools | Can be locked to a specific subset |
| Trigger | Automatic (description match) | Automatic (description) or explicit delegation |

Use a **skill** when you want Claude to apply domain expertise to the current task without leaving the conversation. Use an **agent** when the task is large, needs extensive search/file work, or benefits from a specialized role with restricted tool access.

Skills and agents can be composed: an agent can preload specific skills into its context before starting work, and a skill can be configured to fork into a temporary subagent for isolation.

## Tool Types in Claude Plugins

Claude plugins are not limited to MCP servers. Three tool integration patterns are supported:

### MCP Tools (`.mcp.json`)
Best for third-party APIs, databases, and external services. Standardized connection model; requires a running MCP server process. All connectors in the knowledge-work-plugins and financial-services-plugins collections use this pattern.

### Local CLIs (via skills/agents)
Teach Claude how to use any CLI already installed on the machine (`git`, `docker`, custom tools) by writing a skill or agent prompt with explicit command patterns. Claude's built-in `bash` tool executes the commands in the terminal environment. Lighter than MCP — no background process, fewer tokens.

### Bundled Scripts (`${CLAUDE_PLUGIN_ROOT}`)
Include Python, Node, or Bash scripts inside the plugin directory. Reference them in skill/agent instructions using the `${CLAUDE_PLUGIN_ROOT}` environment variable, which resolves to the plugin's installation path at runtime.

### Comparison

| Method | Best for | Trade-off |
|---|---|---|
| MCP Tools | Third-party APIs, complex data sources | Requires subscription/API key + running process |
| CLI / Local Scripts | Terminal tools already on the machine | Claude-version-specific; no schema introspection |
| LSP Servers | Real-time code intelligence (type checking, go-to-definition) | IDE-like features; heavier setup |

**Context tip:** When a CLI produces large output, filter at the command level (e.g. `my-tool \| grep "error"`) rather than reading the full log — subagents are ideal for this since their output is summarized before returning to the main session.

## See Also

- [Agent Skills Format Specification](agent-skills-format-specification.md)
- [Anthropic Knowledge Work Plugins](anthropic-knowledge-work-plugins.md)
- [Anthropic Financial Services Plugins](anthropic-financial-services-plugins.md)
