## Question:
can I define an agent or subagent with a claude plugin

## Answer:

```
Yes, you can define specialized agents (commonly called subagents) within a Claude plugin to perform focused tasks. 
Claude
 +1
When you bundle subagents into a plugin, they become portable, allowing you to share specialized workflows across different projects or teams without manually copying configuration files. 
Level Up Coding
 +1
How to Define a Subagent in a Plugin
To include a subagent in your plugin, you must place a Markdown file in an agents/ directory at the root of your plugin. The file uses YAML frontmatter for configuration, followed by a system prompt that defines the agent's behavior. 
Level Up Coding
 +3
Example file structure:
Example code-reviewer.md content:
yaml
---
name: code-reviewer
description: Expert code reviewer that focuses on security and best practices.
model: sonnet
tools: [Read, Grep, Glob]
---
You are a senior code reviewer. Your goal is to analyze code for potential 
vulnerabilities and suggest improvements for readability and performance.

Use code with caution.
Key Capabilities and Limits
Automatic Delegation: Claude uses the description field to decide when to automatically spin up the subagent for a task.
Context Isolation: Each subagent runs in its own context window. This prevents your main conversation from becoming bloated with technical details like long search results or logs.
Inherited Tools: By default, subagents inherit the tools of the parent conversation unless you explicitly restrict them using the tools or disallowedTools fields.
Plugin Security Restrictions: For security reasons, subagents shipped via plugins cannot use certain advanced fields like hooks, mcpServers, or permissionMode. If your agent requires these, it must be installed as a local project or user agent instead. 
Claude
 +4
Managing Subagents
Once your plugin is loaded, its subagents will appear in the /agents interface within Claude Code. You can also see all available agents by running the command claude agents in your terminal. 
Claude
 +1
Are you planning to build a subagent for a specific language or a general workflow like code reviews?****
AI responses may include mistakes. Learn more
```


---

## Question:
what is the difference between a skill and an agent ?

## Answer:
The primary difference is their
**role in the workflow**
:
a
**Skill**
is a piece of modular knowledge or a specific "how-to" recipe that Claude follows, while an
**Agent**
(or subagent) is a separate, autonomous worker that operates in its own isolated workspace
.
## Comparison at a Glance

| Feature | Skill (The "How-to") | Agent (The "Worker") |
| --- | --- | --- |
| Primary Goal | Provides domain-specific instructions or repeatable workflows. | Offloads tasks to an isolated environment to save context and run in parallel. |
| Context Window | Loads directly into your current conversation (can increase token "bloat"). | Runs in a fresh, isolated context window (doesn't clutter your main chat). |
| Autonomy | Usually a single-task instruction applied to current work. | Can perform multi-step loops (Plan → Execute → Verify) independently. |
| Tool Access | Generally uses whatever tools are active in the current session. | Can be strictly limited to certain tools (e.g., a "Reviewer" that can read but not write). |

## When to Use a Skill
Use a
**Skill**
when you want Claude to get better at a specific, repeatable task without leaving the main conversation.
- **Examples:** A style guide for your API, a specific checklist for PR descriptions, or a script to format complex data.
- **Key Advantage:** It’s "on-demand" knowledge. Claude only loads the full instructions when the task matches the skill's description, saving tokens compared to putting everything in a permanent CLAUDE.md.
## When to Use an Agent
Use an
**Agent**
when a task is large, requires extensive searching, or needs a specialized role.
- **Examples:** A "Security Auditor" that scans 50 files for vulnerabilities or a "Research Assistant" that searches the web in parallel with your coding.
- **Key Advantage:** **Context Isolation.** If an agent reads 10,000 lines of logs to find one error, only the final summary is sent back to your main chat, preventing your session from hitting token limits.
## How They Work Together
In a Claude plugin, these layers often overlap:
- **Skills inside Agents:** You can define an agent and tell it to **preload** specific skills so it starts its work with that specialized knowledge already "in its head".
- **Forking Skills:** You can configure a skill to "fork" its execution, essentially telling the skill to automatically spin up a temporary subagent to run its instructions in isolation.
Do you have a specific
**multi-step workflow**
in mind that you're trying to automate?****

---

## Question:
can a plugin only reference mcp tools? how about locally installed clis ?

## Answer:
Claude plugins are quite flexible—they are
**not**
limited to MCP tools.
You can reference
**locally installed CLIs**
, bundled scripts, and even Language Server Protocol (LSP) servers within a single plugin
.
In fact, for many developer workflows, using a CLI is often better than an MCP server because it reduces context bloat and doesn't require maintaining a separate background process.
## 1. Referencing Locally Installed CLIs
You can use
**Skills**
or
**Subagents**
to teach Claude how to use any CLI already on your machine (like
git
,
docker
, or your own custom tools).
- **How it works:** You write a Markdown file that instructs Claude on which commands to run and what flags to use.
- **The "bash" tool:** Claude uses its built-in bash tool to execute these commands directly in your terminal environment.
- **Best Practice:** Define a **Skill** that includes the exact command patterns and common error fixes for your CLI. This "on-demand" knowledge is lighter than an MCP definition.
## 2. Bundling Scripts with your Plugin
If you have a script (Python, Node, Bash) that isn't globally installed, you can include it inside your plugin folder and reference it using environment variables.
- **${CLAUDE_PLUGIN_ROOT}**: This variable points to your plugin's installation directory. You can use it in your skill or agent prompts to tell Claude exactly where to find your script.
- **Example Instruction:** "Run the script located at ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.py using the local python3 interpreter."
## 3. Comparison of Methods

| Method | Best For... | Why use it? |
| --- | --- | --- |
| MCP Tools | Third-party APIs (Slack, GitHub) or complex databases. | Standardised connection to external services. |
| CLI / Local Scripts | Tools already in your terminal (compilers, linters, custom CLI). | Fast, zero-config, and uses fewer tokens than full MCP schemas. |
| LSP Servers | Real-time code intelligence (go-to-definition, type checking). | Powers "IDE-like" features directly in Claude Code. |

**Pro Tip:**
If your CLI outputs a massive amount of data, it’s often better to have the agent run a command that filters the output (like
my-tool | grep "error"
) rather than reading the whole log, which saves your context window.
Do you have a
**specific CLI tool**
or
**local script**
you're trying to integrate right now?
