# Claude Plugins vs AgentSkills.io Standard — Q&A

> Source: sources/how do https___code.claude.com_docs_en_plugins related to https___agentskills.io_home.md
> Collected: 2026-04-12
> Published: Unknown

## Question:
how do https://code.claude.com/docs/en/plugins related to https://agentskills.io/home

## Answer:
The relationship between [Claude Plugins](https://code.claude.com/docs/en/plugins) and [AgentSkills.io](https://agentskills.io/home) is that of a **software package** to a **data standard**.

In simple terms: **Agent Skills** is an open format for writing AI instructions, and **Claude Plugins** are the boxes used to wrap up those skills (and other tools) so they can be easily shared and installed.

## Key Connections
- **The Standard (AgentSkills.io):** This defines a specific way to write a SKILL.md file. It ensures that if you write a "skill" for Claude, it could theoretically work with other AI tools (like VS Code Copilot or Cursor) because they all follow the same "language" for procedural knowledge.
- **The Delivery Vehicle (Claude Plugins):** A plugin is a folder that can contain many things: slash commands, custom agents, and **Agent Skills**. While you can create a skill just for yourself in a local folder, a plugin is what you use when you want to bundle that skill with other code and share it via a marketplace.
- **Automatic Discovery:** When you install a plugin in Claude Code, it automatically looks inside the plugin for any skills that follow the agentskills.io format and loads them into Claude's "brain".

## Quick Comparison

| Feature | Agent Skills (Standard) | Claude Plugins (Implementation) |
| --- | --- | --- |
| What is it? | A format for instruction-based capabilities. | A container for distributing AI tools. |
| Main File | SKILL.md. | .claude-plugin/ folder or marketplace link. |
| Portability | High (works across different AI platforms). | Specific to the Claude ecosystem. |
| Contents | Instructions, examples, and validation scripts. | Skills, Agents, Hooks, and MCP servers. |

---

## Question:
so https://agentskills.io/home only covers part of what an agent is and does?

## Answer:
Yes, exactly. **[AgentSkills.io](https://agentskills.io/home)** describes the **"Recipe"** and **"Procedural Knowledge,"** but it is not the **"Brain"** or the **"Hands."** To have a functioning AI agent, you typically need three distinct layers. Agent Skills only standardizes the third one.

## The 3 Layers of an AI Agent
- **The Brain (Model & Orchestrator):** This is the LLM (like Claude 3.5 Sonnet or GPT-4o) and the framework that manages its "thoughts." It decides *which* skill to use, handles errors when a skill fails, and manages the overall conversation flow. The standard doesn't define the brain; it just gives the brain a standard way to read capabilities so it doesn't get overwhelmed by "context bloat."
- **The Hands (Tools & MCP):** These are the low-level technical connections to the outside world — like the Model Context Protocol (MCP) or basic APIs. It provides the raw ability to "read a file," "search Google," or "post to Slack." A skill often *uses* these tools. For example, a "Legal Review Skill" might use a "File Search Tool" to find contracts.
- **The Expertise (Agent Skills):** This is the **SKILL.md** file defined by AgentSkills.io. It tells the agent *how* to do a specific job (e.g., "When reviewing a contract, first look for the indemnification clause, then check for these 5 red flags..."). Without this layer, the agent has the "tools" but doesn't know your specific business process or expert methodology.

## Why this "partial" approach matters
By only covering the **expertise/workflow** part, Agent Skills allows you to:
- **Avoid Context Bloat:** The agent only "reads" the full instructions for a skill when it actually needs it, keeping its memory clean and focused.
- **Work Everywhere:** You can write a "Security Audit Skill" once and use it in **Claude Code**, **OpenAI Codex**, or your own custom Python agent.
- **Version Control Knowledge:** Since skills are just folders of Markdown and scripts, you can track changes to your "company procedures" in GitHub just like code.

---

## Question:
why does https://agentskills.io/home only cover a part? would it make sense to pair skills with tools?

## Answer:
It only covers a part because it is designed to be **modular**. If you bake the "Tools" (the code) directly into the "Skills" (the instructions), you lose the ability to swap things out.

## Why it makes perfect sense to pair them
In fact, you **must** pair them for an agent to be useful. In the Agent Skills standard, this is usually handled via **"Dependencies."** A skill often specifies which tools it needs to function. Here is why pairing them is the "Gold Standard" for building agents:

- **Context Management (The "Just-in-Time" approach):** If an agent has 100 tools and 100 skills loaded at once, it gets "confused" or misses details (Context Window saturation). By pairing them, the agent only loads the "Search Tool" and the "Database Tool" when it activates the "Quarterly Report Skill."
- **Safety & Validation:** You can pair a skill with a **Validation Script**. The skill tells the AI how to write code, and the tool (the script) immediately runs a test to see if the AI's output is actually valid. If it's not, the skill provides the instructions on how to fix it.
- **Specialization vs. Generalization:** The Tool is general: `read_file()`. The Skill is specialized: `review_medical_record()`. The skill gives the general tool a specific "purpose" and "guardrails."

## How they are paired in practice
If you look at the architecture of a **Claude Plugin**, it actually forces this pairing:
- **mcp_servers**: These are your **Tools** (e.g., a connection to GitHub or a local SQLite database).
- **skills**: These are your **Instruction sets** (e.g., your specific company's workflow for PR reviews).

By keeping them as separate files in the same plugin folder, you get the best of both worlds: **technical power** (Tools) and **expert guidance** (Skills).
