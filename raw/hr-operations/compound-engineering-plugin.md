# Compound Engineering Plugin

> Source: https://github.com/EveryInc/compound-engineering-plugin
> Collected: 2026-04-13
> Published: Unknown

## Description

The Compound Engineering Plugin is an official AI-powered toolkit for Claude Code, Codex, and multiple other AI coding environments. It provides "AI skills and agents that make each unit of engineering work easier than the last."

## Core Philosophy

The project embraces a principle that **each development task should simplify future work rather than adding complexity**. The approach allocates "80% to planning and review, 20% to execution" through thorough planning, quality reviews, knowledge codification, and maintained code quality standards.

## Primary Workflow

The plugin operates through a cyclical process:

- **Brainstorm** → refines ideas into requirements through interactive Q&A
- **Plan** → converts requirements into technical implementation plans
- **Work** → executes plans using worktrees and task management
- **Review** → multi-agent code analysis before merging
- **Compound** → documents learnings for future reusability
- **Ideate** (optional) → surfaces improvement opportunities based on existing codebases

## Key Commands

- `/ce:brainstorm` - Primary entry point for requirement exploration
- `/ce:plan` - Technical planning from requirements
- `/ce:work` - Execution with task tracking
- `/ce:review` - Multi-agent code review
- `/ce:compound` - Knowledge documentation
- `/ce:ideate` - Proactive improvement discovery

## Installation Support

The plugin supports multiple AI coding platforms through a Bun/TypeScript CLI converter:

- Claude Code (native)
- Cursor (native)
- OpenCode, Codex, Factory Droid, Pi, Gemini CLI, GitHub Copilot, Kiro, Windsurf, OpenClaw, Qwen Code (via conversion)

## Repository Structure

Directories at repo root:
- `.claude-plugin/` — Claude Code plugin definition
- `.claude/commands/` — slash command definitions
- `.cursor-plugin/` — Cursor plugin definition
- `docs/`
- `plugins/` — multi-platform plugin outputs
- `src/` — TypeScript source for the CLI converter
- `tests/`

Key files: `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `PRIVACY.md`, `SECURITY.md`

## Development Features

- Local checkout development with live plugin reloading
- Branch-based testing via deterministic caching
- Personal configuration synchronization across multiple AI tools (via `sync` command)
- Shell aliases for streamlined workflows
- Skills managed as symlinks for real-time updates
- Requires `/ce-setup` on first run (verifies environment, installs agent-browser, GitHub CLI, ffmpeg)

## Technology Stack

TypeScript (75%), Python (10.7%), JavaScript (6.3%), Shell (5.6%), Ruby (2.4%)

## License

MIT
