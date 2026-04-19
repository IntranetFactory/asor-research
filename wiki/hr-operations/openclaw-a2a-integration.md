# OpenClaw A2A Integration

> Sources: Unknown, Unknown
> Raw: [OpenClaw A2A Agent Cards Q&A](../../raw/hr-operations/2026-04-18-openclaw-a2a-agent-cards-qa.md)
> Updated: 2026-04-18

## Overview

OpenClaw is an AI agent platform that supports the Agent-to-Agent (A2A) protocol, enabling local agents to discover and delegate tasks to remote specialist agents via standardized Agent Card JSON manifests. Agent Cards are published at `/.well-known/agent-card.json` and serve as machine-readable "digital business cards" for discovery and capability advertising. Native OpenClaw does not expose cards by default; support comes through the OpenClaw A2A Gateway Plugin or community tools like ClawNexus.

## Agent Cards in OpenClaw

An Agent Card is a JSON manifest describing an agent's identity, URL, capabilities, and skills. In OpenClaw, there are three ways to get a card per agent:

- **A2A Gateway Plugin** (`openclaw-a2a-gateway`) — creates a card per running instance.
- **ClawNexus** — a standalone daemon that auto-discovers local OpenClaw instances and generates `.well-known/agent-card.json` for each.
- **CLI customization** — `openclaw config set` lets you define specific skills and descriptions that appear in the card.

Each tool in an agent's capability list is typically converted automatically into an A2A "skill descriptor" within the card.

## Using a Remote Agent Card

Once you have a card from an external agent, OpenClaw enables four classes of interaction:

**Remote Task Delegation** — Register the card's URL to configure your local instance as an A2A client. OpenClaw reads the remote agent's skills and authentication requirements, then routes tasks to it automatically. Results ("Artifacts") are retrieved and merged back into your local chat history.

**Multi-Agent Orchestration** — With multiple cards, an orchestrator can match a sub-task's requirements against the `skills` sections of all registered cards and pick the best specialist for each step in a pipeline.

**Peer-to-Peer Discovery via NEXUS** — NEXUS is a community-built registry layer. Agents can query it by skill to find specialists in real-time, and track "trust scores" based on past collaboration history.

**Local Configuration Mapping** — Manually bind the skills listed in a card to local tool invocations so the orchestrator knows precisely when to route a request to that remote agent.

## Registering Agents

**Local agents** are added via:
```bash
openclaw agents add <agent-name>
# or with parameters:
openclaw agents add research-expert --model anthropic:claude-3-5-sonnet --tools web,file --description "Expert in deep research"
```

**Remote agents** (via Agent Card) are registered by URL:
```bash
openclaw config set --json agents.registered.remote-agent '{"url": "...", "skills": ["code-review"]}'
```

## Storage Layout

All agent data is file-based under `~/.openclaw/`:

| Component | Location | Contents |
|-----------|----------|---------|
| Agent registry | `openclaw.json` | `agents.registered` list |
| Agent identity | `agents/<id>/agent.md` | System prompt, role, persona |
| Workspace | `workspace/` | Agent's read/write directory |
| Sessions | `agents/<id>/sessions/` | Chat transcripts and context metadata |
| Memory | `workspace/MEMORY.md` | Long-term curated facts |

After manually editing `openclaw.json` (JSON5 syntax supported), run `openclaw doctor` to validate the schema.

## Session Continuity

OpenClaw maps a local `sessionKey` to an A2A `contextId`, ensuring that a stable conversation thread persists even when tasks are delegated across different agent systems mid-session.

## See Also

- [A2A Agent Card Taxonomy and Governance](a2a-agent-card-taxonomy-and-governance.md)
- [ASOR Agent Definition API](asor-agent-definition-api.md)
- [Agent System of Record for Blended Workforces](agent-system-of-record-for-blended-workforces.md)
- [Agent Skills Format Specification](agent-skills-format-specification.md)
