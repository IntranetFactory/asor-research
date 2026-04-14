# Compound Engineering Plugin

> Sources: EveryInc, Unknown
> Raw: [Compound Engineering Plugin](../../raw/hr-operations/compound-engineering-plugin.md)
> Updated: 2026-04-13

## Overview

The Compound Engineering Plugin is an open-source Claude Code plugin (MIT) that operationalizes a "compound engineering" philosophy: allocate 80% of development effort to planning and review, 20% to execution, so that each task actively simplifies the next. It ships as a native Claude Code plugin and supports Cursor natively, with a Bun/TypeScript CLI that converts it to a dozen other AI coding environments.

## The Compound Engineering Philosophy

The central thesis is that engineering work should be **self-amortizing**: documentation, structured planning, and rigorous review aren't overhead—they are the primary deliverable, because they reduce friction on every future task. This inverts the common pattern where speed during execution accumulates technical debt.

The plugin encodes this philosophy into a mandatory workflow cycle rather than leaving it as a cultural aspiration:

1. **Ideate** — divergent exploration of improvement opportunities in the existing codebase.
2. **Brainstorm** → refine requirements through interactive Q&A before any plan is written.
3. **Plan** → generate a formal technical implementation plan from the requirements.
4. **Work** → execute the plan using worktrees and structured task tracking.
5. **Review** → multi-agent code analysis gate before merging.
6. **Compound** → document learnings explicitly for future reuse.

The cycle's "Compound" step is architecturally significant: it is the feedback loop that makes the system self-improving over time, similar in intent to the `/llm-wiki` pattern of accumulating a compounding knowledge base.

## Commands

| Command | Role |
|---|---|
| `/ce:brainstorm` | Primary entry point; explores requirements interactively |
| `/ce:plan` | Converts requirements into a technical implementation plan |
| `/ce:work` | Executes plans with task tracking and worktree isolation |
| `/ce:review` | Multi-agent code review before merge |
| `/ce:compound` | Codifies learnings and decisions for future reuse |
| `/ce:ideate` | Proactively surfaces improvement opportunities |

Initial setup runs via `/ce-setup`, which validates the environment and installs dependencies (agent-browser, GitHub CLI, ffmpeg).

## Multi-Platform Support

The plugin ships with native definitions for Claude Code (`.claude-plugin/`) and Cursor (`.cursor-plugin/`). A TypeScript/Bun CLI converts the plugin into formats accepted by:

> OpenCode, Codex, Factory Droid, Pi, Gemini CLI, GitHub Copilot, Kiro, Windsurf, OpenClaw, Qwen Code

A `sync` command propagates personal Claude Code configuration across these alternate tools automatically. Skills are managed as symlinks, enabling live reload during local development.

## Relation to Claude Plugin Architecture

The repository exemplifies the Claude plugin structure: `.claude-plugin/` root, slash commands in `.claude/commands/`, and a multi-agent review workflow. It is distinct from Anthropic's official plugin collections (Knowledge Work, Financial Services) in that it targets the engineering development workflow itself rather than a business domain.

The multi-agent review step (`/ce:review`) is a practical demonstration of the agent isolation pattern described in [Claude Plugin Agents and Tools](claude-plugin-agents-and-tools.md): separate agents analyze code independently, preventing anchoring bias that occurs when a single LLM both writes and reviews its own output.

## See Also

- [Claude Plugin Agents and Tools](claude-plugin-agents-and-tools.md)
- [Agent Skills Format Specification](agent-skills-format-specification.md)
- [Anthropic Knowledge Work Plugins](anthropic-knowledge-work-plugins.md)
