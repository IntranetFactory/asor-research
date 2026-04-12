# Anthropic Financial Services Plugins

> Sources: Anthropic, Unknown
> Raw: [Claude for Financial Services Plugins README](../../raw/hr-operations/anthropics-financial-services-plugins-readme.md)
> Updated: 2026-04-12

## Overview

The `anthropics/financial-services-plugins` GitHub repository is Anthropic's official reference implementation of Claude plugins for financial services professionals. It packages domain knowledge, slash commands, MCP data connectors, and event hooks into five installable plugins targeting investment banking, equity research, private equity, wealth management, and shared financial analysis. The repo ships **41 skills, 38 commands, and 11 MCP integrations** and is the primary real-world example of Claude's plugin architecture at professional scale.

## Plugin Architecture

Every plugin follows a five-component layout that extends the basic Agent Skills format with Claude-specific additions:

```
plugin-name/
├── .claude-plugin/plugin.json   # Manifest: name, description, version, discovery
├── .mcp.json                    # MCP tool connections
├── commands/                    # Explicit slash commands (*.md files)
├── skills/                      # Auto-invoked domain knowledge (skills/*/SKILL.md)
└── hooks/                       # Event-driven automation
```

The key distinction from the plain Agent Skills format: plugins add **commands** (user-invoked via `/plugin:command-name`), **hooks** (event triggers), and an explicit **plugin manifest** (`plugin.json`) on top of the SKILL.md-based skills layer.

Skills fire automatically when relevant; commands require explicit invocation. Every component is file-based — markdown and JSON, no code, no build steps.

## Plugin Catalog

The marketplace follows a **core + add-on** composition model: `financial-analysis` must be installed first; it provides all MCP connectors shared by the add-ons.

| Plugin | Type | Skills | Key Capabilities |
|--------|------|--------|-----------------|
| `financial-analysis` | Core | 11 | Comps, DCF, LBO, 3-statement models; Excel QC; PPT template creation; all MCP connectors |
| `investment-banking` | Add-on | 9 | CIMs, teasers, process letters, buyer lists, merger models, strip profiles, deal tracking |
| `equity-research` | Add-on | 9 | Earnings analysis/preview, initiating coverage, morning notes, thesis tracking, idea screening |
| `private-equity` | Add-on | 10 | Deal sourcing/screening, DD checklists, IC memos, unit economics, portfolio monitoring |
| `wealth-management` | Add-on | 6 | Client meeting prep, financial plans, portfolio rebalance, tax-loss harvesting, client reports |

Partner-built plugins from data providers (LSEG, S&P Global) follow the same structure but are maintained externally.

## Skills by Plugin

**financial-analysis:** `3-statement-model`, `audit-xls`, `clean-data-xls`, `competitive-analysis`, `comps-analysis`, `dcf-model`, `deck-refresh`, `ib-check-deck`, `lbo-model`, `ppt-template-creator`, `skill-creator`

**investment-banking:** `buyer-list`, `cim-builder`, `datapack-builder`, `deal-tracker`, `merger-model`, `pitch-deck`, `process-letter`, `strip-profile`, `teaser`

**equity-research:** `catalyst-calendar`, `earnings-analysis`, `earnings-preview`, `idea-generation`, `initiating-coverage`, `model-update`, `morning-note`, `sector-overview`, `thesis-tracker`

**private-equity:** `ai-readiness`, `dd-checklist`, `dd-meeting-prep`, `deal-screening`, `deal-sourcing`, `ic-memo`, `portfolio-monitoring`, `returns-analysis`, `unit-economics`, `value-creation-plan`

**wealth-management:** `client-report`, `client-review`, `financial-plan`, `investment-proposal`, `portfolio-rebalance`, `tax-loss-harvesting`

## MCP Integrations

All 11 MCP connectors are centralized in the core `financial-analysis` plugin and shared by all add-ons:

| Provider | Category |
|----------|---------|
| Daloopa, Morningstar, S&P Global (Kensho), FactSet | Financial data / modeling |
| Moody's, MT Newswires, Aiera | Credit / news / earnings intelligence |
| LSEG | Multi-asset analytics |
| PitchBook, Chronograph | Private markets / PE data |
| Egnyte | Document management |

MCP access typically requires a subscription or API key from each provider.

## End-to-End Workflow Patterns

The plugins are designed to connect upstream data (MCP) to downstream outputs (Excel, PowerPoint, Word) without context-switching:

- **Research to Report:** pull live data → analyze earnings → publish-ready equity research report, in one session
- **Spreadsheet Analysis:** comps, DCF, LBO as functional Excel workbooks with formulas, sensitivity tables, and color conventions
- **Deal Materials:** draft CIM/teaser/process letter → generate slides using firm-branded PPT templates
- **Portfolio to Presentation:** screen deals → DD checklist → IC memo → portfolio KPI tracking

## Customization Model

The repo is explicitly a starting point. Firms are expected to customize:

- **Swap connectors** — edit `.mcp.json` to point to internal data sources
- **Add firm context** — embed terminology, deal processes, formatting standards in skill files
- **Bring templates** — use `/ppt-template` to encode firm-branded PowerPoint layouts
- **Build new plugins** — same directory structure, pure markdown + JSON

This mirrors the ASOR concept of encoding organizational context: as teams add firm-specific context to plugins, Claude accumulates institutional knowledge that reduces re-explanation overhead.

## Installation

```bash
claude plugin marketplace add anthropics/financial-services-plugins
claude plugin install financial-analysis@financial-services-plugins   # core first
claude plugin install investment-banking@financial-services-plugins   # then add-ons
```

Key slash commands after installation:
`/comps`, `/dcf`, `/earnings`, `/one-pager`, `/ic-memo`, `/source`, `/client-review`

## Relation to Agent Skills Format

This repo extends the agentskills.io specification. The `skills/*/SKILL.md` files follow the same format (YAML frontmatter + Markdown instructions). What Claude plugins add on top:

- `commands/` — explicit user-invoked actions (not present in base Agent Skills spec)
- `hooks/` — event-driven triggers
- `.claude-plugin/plugin.json` — plugin-level manifest (vs. skill-level SKILL.md frontmatter)
- `.mcp.json` — wired MCP tool connections
- `marketplace.json` — cross-plugin discovery registry

The base Agent Skills spec governs individual SKILL.md files; the Claude plugin layer governs how multiple skills, commands, and connectors are bundled and distributed together.

## See Also

- [Anthropic Knowledge Work Plugins](anthropic-knowledge-work-plugins.md)
- [Agent Skills Format Specification](agent-skills-format-specification.md)
- [Google Workspace CLI Skills Catalog](google-workspace-cli-skills-catalog.md)
- [AI Agent Governance Platforms Landscape](ai-agent-governance-platforms-landscape.md)
