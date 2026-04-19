# Agent Skills Format Specification

> Sources: agentskills.io, Unknown; Unknown, Unknown
> Raw: [Agent Skills Specification](../../raw/hr-operations/agentskills-io-specification.md); [Claude Plugins vs AgentSkills Standard Q&A](../../raw/hr-operations/claude-plugins-vs-agentskills-standard-qa.md)
> Updated: 2026-04-12

## Overview

Agent Skills is an open format for packaging AI agent capabilities as portable, self-contained units. A skill is a directory with a required `SKILL.md` file (YAML frontmatter + Markdown instructions) and optional subdirectories for scripts, reference docs, and assets. The spec is designed for progressive disclosure: only metadata is loaded at startup; full instructions load on activation; supporting files load on demand.

## Directory Structure

A skill is a directory with a predictable layout:

```
skill-name/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: additional documentation
├── assets/           # Optional: templates, data files, images
```

The directory name must match the `name` field in `SKILL.md`.

## `SKILL.md` Frontmatter Fields

| Field           | Required | Notes |
|----------------|----------|-------|
| `name`          | Yes      | 1–64 chars; lowercase letters, numbers, hyphens only; no leading/trailing/consecutive hyphens; must match directory name |
| `description`   | Yes      | 1–1024 chars; should describe both what the skill does and when to trigger it; include task-specific keywords |
| `license`       | No       | License name or reference to a bundled license file |
| `compatibility` | No       | 1–500 chars; note environment requirements (product, packages, network); omit if no special requirements |
| `metadata`      | No       | Arbitrary string key-value map for non-spec properties |
| `allowed-tools` | No       | Space-separated list of pre-approved tools (experimental; support varies by agent) |

### Name Constraints

Valid: `pdf-processing`, `data-analysis`, `code-review`

Invalid: `PDF-Processing` (uppercase), `-pdf` (leading hyphen), `pdf--processing` (consecutive hyphens)

### Description Quality

The description is the primary signal agents use to decide whether to activate a skill. A weak description reduces discoverability.

- **Good:** "Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction."
- **Poor:** "Helps with PDFs."

## Body Content

The Markdown body after the frontmatter is free-form. Recommended structure:
- Step-by-step instructions
- Input/output examples
- Common edge cases

The entire `SKILL.md` body is loaded when a skill is activated, so the spec recommends keeping it under 500 lines and moving detailed reference material to `references/` files.

## Progressive Disclosure Model

The spec defines a three-tier loading strategy to minimize unnecessary token use:

1. **Startup (~100 tokens):** Only `name` and `description` are loaded for all installed skills — used for activation decisions.
2. **On activation (<5000 tokens recommended):** The full `SKILL.md` body is loaded.
3. **On demand:** Files under `scripts/`, `references/`, and `assets/` are loaded only when explicitly referenced or needed.

This design means skill authors should front-load essential instructions in `SKILL.md` and defer detailed reference material to separate files.

## Optional Subdirectories

**`scripts/`** — Executable code the agent can run. Should be self-contained, document dependencies, include helpful error messages. Supported languages depend on the agent implementation (Python, Bash, JavaScript common).

**`references/`** — Additional documentation loaded on demand. Common files: `REFERENCE.md`, `FORMS.md`, domain-specific files (`finance.md`). Keep files focused so agents load only what they need.

**`assets/`** — Static resources: document/configuration templates, images, lookup tables, schemas.

## File References

Skills reference other files using paths relative to the skill root directory:

```markdown
See [the reference guide](references/REFERENCE.md) for details.
Run: scripts/extract.py
```

The spec recommends keeping references one level deep; avoid deeply nested chains.

## Validation

The `skills-ref` reference library (GitHub: `agentskills/agentskills`) validates frontmatter conformance:

```bash
skills-ref validate ./my-skill
```

## Relation to Claude Plugins

The AgentSkills open standard and Claude's plugin system are related but distinct:

| | Agent Skills (Standard) | Claude Plugins (Implementation) |
|---|---|---|
| What is it? | Format for instruction-based capabilities | Container for distributing AI tools |
| Main file | `SKILL.md` | `.claude-plugin/plugin.json` |
| Portability | High — works across Claude, VS Code Copilot, Cursor, custom agents | Claude ecosystem only |
| Contents | Instructions, examples, validation scripts | Skills + agents + commands + hooks + MCP servers |

Claude plugins *include* Agent Skills as one component. When a plugin is installed in Claude Code, it automatically discovers and loads any `SKILL.md` files inside the plugin that conform to the agentskills.io format. The plugin layer adds delivery, distribution, and additional components (commands, agents, hooks) that the base spec does not define.

## Agent Architecture Context: Where Skills Fit

A fully functioning AI agent has three layers. Agent Skills only standardizes the third:

- **The Brain (Model & Orchestrator):** The LLM and its orchestration framework. Decides which skill to use, manages conversation flow, handles errors. The spec gives the brain a standard way to read capabilities without context bloat.
- **The Hands (Tools & MCP):** Low-level technical connections — MCP servers, APIs, bash commands. Provides the raw ability to read files, call APIs, post to Slack. Skills frequently *use* these tools.
- **The Expertise (Agent Skills):** The `SKILL.md` file. Tells the agent *how* to do a specific job: the methodology, the sequence, the business-specific guardrails. Without this layer, the agent has tools but no expert procedure.

By covering only the expertise layer, the spec achieves:
- **Portability** — a skill written once works across any compliant agent platform.
- **Context efficiency** — full instructions load only when the skill activates (progressive disclosure model).
- **Version-controlled knowledge** — company procedures live in a Git repo, not in conversation history.

Skills and tools must be paired for an agent to be useful. Claude plugins enforce this pairing by co-locating `skills/` (SKILL.md files) and `.mcp.json` (tool connections) in the same directory.

## Agent Card Skills vs SKILL.md

A2A Agent Cards define "skills" as structured JSON execution endpoints — closer in nature to MCP tools or OpenAPI operations than to `SKILL.md` files. Where `SKILL.md` tells an LLM *how to perform a job* (descriptive, human/LLM-centric), an Agent Card skill tells an orchestrator *that a specific endpoint exists and is callable* (functional, machine-centric with schema validation and governance tags). The two are complementary: some implementations include a `description_url` in the card pointing to a `SKILL.md` for LLM reasoning while the JSON entry handles programmatic dispatch. See [A2A Agent Card Taxonomy and Governance](a2a-agent-card-taxonomy-and-governance.md) for the full comparison and JSON examples.

## See Also

- [Claude Plugin Agents and Tools](claude-plugin-agents-and-tools.md)
- [Google Workspace CLI Skills Catalog](google-workspace-cli-skills-catalog.md)
- [Anthropic Financial Services Plugins](anthropic-financial-services-plugins.md)
- [Anthropic Knowledge Work Plugins](anthropic-knowledge-work-plugins.md)
- [ASOR Agent Definition API](asor-agent-definition-api.md)
- [AI Agent Governance Platforms Landscape](ai-agent-governance-platforms-landscape.md)
- [Agent System of Record for Blended Workforces](agent-system-of-record-for-blended-workforces.md)
