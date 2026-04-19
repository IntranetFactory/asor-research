# OpenClaw A2A Agent Cards Q&A

> Source: sources/openclaw seems to support a2a - does it provide an agent card for each agent_.md
> Collected: 2026-04-18
> Published: Unknown

## Question:
openclaw seems to support a2a - does it provide an agent card for each agent?

## Answer:
Yes, **OpenClaw** supports A2A (Agent-to-Agent) communication, and it generally provides or enables **Agent Cards** for each agent instance through specific plugins or external tools.

## A2A Agent Cards in OpenClaw
In the A2A protocol (originally developed by Google), an **Agent Card** is a JSON manifest that describes an agent's identity, URL, and skills, acting like a "digital business card" for discovery.

- **Plugin-Based Support**: Native OpenClaw doesn't always expose these by default, but the [OpenClaw A2A Gateway Plugin](https://github.com/win4r/openclaw-a2a-gateway) creates an **Agent Card per instance**.
- **Automatic Generation**: Some community tools like **ClawNexus** act as a standalone daemon that automatically discovers running OpenClaw instances on a local network and generates a .well-known/agent-card.json for each.
- **Customisation**: You can typically customise these cards via the CLI using `openclaw config set` to define specific skills (e.g., "chat", "code-review") and descriptions for each agent.

## How Agents Use These Cards
- **Discovery**: Other agents can query these cards to find out what a specific OpenClaw agent is capable of before delegating a task.
- **Skill Mapping**: In many implementations, each tool in an agent's capability list is automatically converted into an A2A "skill descriptor" within the card.
- **Session Management**: The cards help map an OpenClaw sessionKey to an A2A contextId, allowing a stable conversation thread even when work is delegated across different agent systems.

---

## Question:
when I have a card of an existing agent what can I do with that in openclaw?

## Answer:
In OpenClaw, once you have an **Agent Card** (a JSON manifest describing a remote agent's capabilities and URL), you can use it to enable your local OpenClaw assistant to **delegate tasks** to that external specialist.

## 1. Remote Task Delegation (A2A Client)
The most common use is setting up your local OpenClaw instance as an **A2A Client**. You can register the card's URL to give your personal agent the ability to "outsource" work.
- **Discovery:** OpenClaw uses the card to understand the remote agent's skills (e.g., image generation or deep data research) and how to authenticate with it.
- **Automated Handoff:** Your main agent can decide a task is outside its expertise and automatically send a structured "Task" to the remote agent listed in the card.
- **Artifact Retrieval:** Once the remote agent finishes, OpenClaw retrieves the results (called "Artifacts") and integrates them back into your local chat history.

## 2. Multi-Agent Orchestration
If you have multiple cards, you can build a team of specialized agents.
- **Capability Matching:** OpenClaw can use the "skills" section of multiple cards to pick the best agent for a specific sub-task.
- **Dynamic Workflows:** You can create complex pipelines where one agent (found via card A) processes data and sends it to another (found via card B).

## 3. Peer-to-Peer Discovery
With tools like **NEXUS** (a community-built coordination layer for OpenClaw), an Agent Card allows your agent to join a "Yellow Pages" for AI.
- **Search by Skill:** Your agent can query a registry of cards to find a specialist in real-time.
- **Reputation Tracking:** Some implementations use the card's unique ID to track "trust scores" or results of past collaborations.

## 4. Local Configuration Mapping
You can use the details in an Agent Card to manually register a "Sub-Agent" or "Peer" in your local configuration.
- **Skill Binding:** Map the remote skills defined in the card to local tools so your orchestrator knows exactly when to call that specific agent.
- **Auth Setup:** Use the card's authentication requirements to configure your local credentials (like API keys or mTLS certificates) needed to talk to that remote service.

---

## Question:
how would I register an agent? where would the information be stored?

## Answer:
Registering an agent in OpenClaw depends on whether you are adding a local specialist (to separate tasks) or a remote agent via an Agent Card.

## 1. How to Register an Agent

**Local Agent Registration**
The most common way to register a new local agent is via the CLI. This creates a separate persona with its own rules and workspace.

- Command: `openclaw agents add <agent-name>`
- Workflow: This triggers an interactive wizard where you define the agent's description, primary model, and dedicated workspace path.
- Advanced Setup: You can pass all parameters at once:
```bash
openclaw agents add research-expert --model anthropic:claude-3-5-sonnet --tools web,file --description "Expert in deep research"
```

**Remote Agent Registration (A2A)**
To register a remote agent using an Agent Card, you typically use a plugin or the `config set` command to link the remote manifest.
- Via URL: Many A2A setups allow you to register an agent by pointing to its manifest URL (e.g., `https://example.com`).
- Via CLI: `openclaw config set --json agents.registered.remote-agent '{"url": "...", "skills": ["code-review"]}'`

## 2. Where Information is Stored
OpenClaw uses a simple, file-based storage system for all agent registrations. By default, these are found in your home directory at `~/.openclaw/` (or `C:\Users\username\.openclaw\` on Windows).

| Component | Storage Location | Description |
|-----------|-----------------|-------------|
| Agent Registry | openclaw.json | The central configuration file. New agents are listed in the `agents.registered` section. |
| Agent Identity | agents/<agent-id>/agent.md | Contains the system prompt, role, and "personality" of the agent. |
| Workspace | workspace/ | The agent's working directory where it reads and writes files. |
| Sessions | agents/<agent-id>/sessions/ | Stores chat transcripts and context metadata for that specific agent. |
| Memory | workspace/MEMORY.md | Long-term curated facts and "learned" information. |

Pro Tip: If you manually edit the `openclaw.json` file, use JSON5 syntax (which allows comments and trailing commas) and run `openclaw doctor` afterward to validate the schema before restarting the gateway.
