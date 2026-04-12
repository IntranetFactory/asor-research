# Anthropic Knowledge Work Plugins

> Sources: Anthropic, Unknown
> Raw: [Knowledge Work Plugins README](../../raw/hr-operations/anthropics-knowledge-work-plugins-readme.md)
> Updated: 2026-04-12

## Overview

`anthropics/knowledge-work-plugins` is Anthropic's open-source collection of 11 general-purpose Claude plugins covering common professional roles — from sales and marketing to legal, finance, data, and bio-research. Built for Claude Cowork and compatible with Claude Code, each plugin bundles skills, slash commands, MCP connectors, and sub-agents into a single installable unit. The collection establishes Claude's **general plugin marketplace** model, complementing the domain-specific `financial-services-plugins` repo.

## Plugin Catalog

| Plugin | Core Job | Key Connectors |
|--------|----------|----------------|
| `productivity` | Tasks, calendars, daily workflow, personal context | Slack, Notion, Asana, Linear, Jira, Monday, ClickUp, Microsoft 365 |
| `sales` | Prospect research, call prep, pipeline review, outreach, battlecards | Slack, HubSpot, Close, Clay, ZoomInfo, Fireflies |
| `customer-support` | Ticket triage, response drafting, escalation, KB article creation | Slack, Intercom, HubSpot, Guru, Jira, Notion |
| `product-management` | Spec writing, roadmaps, user research synthesis, stakeholder updates | Slack, Jira, Linear, Figma, Amplitude, Pendo, Fireflies |
| `marketing` | Content, campaigns, brand voice, competitor briefs, channel reporting | Slack, Canva, Figma, HubSpot, Ahrefs, SimilarWeb, Klaviyo |
| `legal` | Contract review, NDA triage, compliance, risk assessment, templated responses | Slack, Box, Egnyte, Jira, Microsoft 365 |
| `finance` | Journal entries, reconciliation, financial statements, variance analysis, audit support | Snowflake, Databricks, BigQuery, Microsoft 365 |
| `data` | SQL, statistical analysis, dashboards, data validation | Snowflake, Databricks, BigQuery, Definite, Hex, Amplitude |
| `enterprise-search` | Cross-tool search across email, chat, docs, wikis | Slack, Notion, Guru, Jira, Asana, Microsoft 365 |
| `bio-research` | Preclinical R&D: literature search, genomics, target prioritization | PubMed, BioRender, bioRxiv, ClinicalTrials.gov, ChEMBL, Benchling, Owkin |
| `cowork-plugin-management` | Create and customize plugins for your org | — |

## Plugin Architecture

All 11 plugins share the same four-component directory structure:

```
plugin-name/
├── .claude-plugin/plugin.json   # Manifest (name, description, version)
├── .mcp.json                    # MCP tool connections
├── commands/                    # Explicit slash commands (e.g. /sales:call-prep)
└── skills/                      # Auto-invoked domain knowledge (SKILL.md files)
```

- **Skills** fire automatically when relevant context is detected — no user invocation required.
- **Commands** are explicit, user-triggered actions (e.g. `/product-management:write-spec`, `/data:write-query`).
- **Connectors** wire Claude to external systems via MCP servers.
- **Everything is file-based** — markdown and JSON, no code, no build steps, no infrastructure.

This structure is identical to the `financial-services-plugins` architecture. The knowledge-work-plugins collection confirms this as the canonical Claude plugin layout.

## Installation

```bash
# Cowork: install from claude.com/plugins
# Claude Code:
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

Once installed, skills activate automatically and slash commands appear in the session.

## Customization Model

The plugins are designed as starting points. Teams are expected to adapt them:

- **Swap connectors** — edit `.mcp.json` to match the actual tool stack.
- **Add company context** — embed terminology, org structure, and processes into skill files.
- **Adjust workflows** — rewrite skill instructions to match team-specific practices.
- **Build new plugins** — use `cowork-plugin-management` or copy the directory structure.

As plugins accumulate organization-specific context, Claude acquires institutional knowledge that reduces repetitive explanation overhead — the same compounding principle behind ASOR and the Agent Skills format.

## Relation to Other Plugin Collections

The knowledge-work-plugins collection is the **general marketplace** layer. Domain-specific collections (e.g. `financial-services-plugins`) follow the same structure but go deeper on a single vertical — more skills, more MCP integrations, core+add-on composition. Both share the underlying plugin architecture defined by the Agent Skills format.

## See Also

- [Claude Plugin Agents and Tools](claude-plugin-agents-and-tools.md)
- [Anthropic Financial Services Plugins](anthropic-financial-services-plugins.md)
- [Agent Skills Format Specification](agent-skills-format-specification.md)
- [Google Workspace CLI Skills Catalog](google-workspace-cli-skills-catalog.md)
