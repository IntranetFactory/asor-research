# A2A Agent Card Taxonomy and Governance Q&A

> Source: sources/what are Tag _ Taxonomy Entry For A2A discoverability and governance queries_ Domain tags (HCM, Finance, etc.) Capability tags (create, report, approval) Sensitivity tags (read-only, PII, SOX).md
> Collected: 2026-04-18
> Published: Unknown

## Question:
What are Tag / Taxonomy Entry For A2A discoverability and governance queries: Domain tags (HCM, Finance, etc.) Capability tags (create, report, approval) Sensitivity tags (read-only, PII, SOX)?

## Answer:
In the context of **Agent-to-Agent (A2A)** and API governance, these tags serve as machine-readable metadata within an **Agent Card** or API specification. They allow agents to autonomously discover, filter, and safely interact with one another while adhering to enterprise compliance rules.

## 1. Domain Tags (The "What")
Domain tags categorise an agent or API by its business vertical or functional area. They are crucial for narrowing down the "search space" during discovery so a client agent doesn't have to scan thousands of unrelated services.
- **HCM (Human Capital Management):** Used for personnel data, payroll, and recruitment services.
- **Finance:** Designated for ledger access, payment initiation, or financial reporting.
- **SCM (Supply Chain):** For logistics, inventory management, and procurement agents.
- **Legal:** For contract analysis and regulatory compliance check agents.

## 2. Capability Tags (The "How")
Capability tags describe the specific actions or **skills** an agent can perform. This allows orchestrator agents to match a complex task to the right specialized sub-agent.
- **Create:** Indicates the agent can write new records (e.g., "create-invoice").
- **Report:** Signifies read-heavy, analytical capabilities (e.g., "generate-quarterly-report").
- **Approval:** Marks agents that can trigger or manage workflow approvals (e.g., "approve-expense-claim").
- **Route Planning:** A specialized skill for logistics or map-based agents.

## 3. Sensitivity Tags (The "Should")
Sensitivity tags are the backbone of **automated governance** and **policy enforcement**. They inform the system whether an agent is allowed to handle certain types of data or perform high-risk actions.
- **Read-Only:** Restricts the agent from modifying any backend data.
- **PII (Personally Identifiable Information):** Flags that the agent handles sensitive personal data (e.g., names, emails), triggering stricter encryption and logging requirements.
- **SOX (Sarbanes-Oxley):** Indicates the data is subject to financial audit regulations, requiring immutable audit trails.
- **PCI-DSS:** Marks agents handling payment card information, necessitating specific security profiles like **Financial-grade API (FAPI)**.

## Implementation in A2A
These tags are typically embedded in the **Agent Card JSON**, allowing a client agent to perform a GET request to a `.well-known` URI and immediately understand the target's domain, what it can do, and what security constraints apply.

---

## Question:
provide some samples of agent card json and tags

## Answer:
An Agent Card is a machine-readable JSON document—essentially a "digital business card"—that allows AI agents to discover each other's capabilities and follow governance rules automatically. It is typically hosted at a standard location like `/.well-known/agent-card.json`.

### Sample Agent Card: Finance Payroll Agent

```json
{
  "name": "Global Payroll Processor",
  "version": "1.2.0",
  "description": "Calculates monthly disbursements and handles tax compliance for EU employees.",
  "url": "https://acme-corp.com",
  "tags": {
    "domain": ["Finance", "HCM"],
    "sensitivity": ["PII", "GDPR", "Confidential"],
    "environment": ["Production"]
  },
  "capabilities": {
    "streaming": true,
    "stateTransitionHistory": true
  },
  "skills": [
    {
      "id": "calc_disbursement",
      "name": "Calculate Net Pay",
      "tags": ["create", "compute"],
      "inputModes": ["application/json"],
      "outputModes": ["application/json"]
    },
    {
      "id": "audit_log_fetch",
      "name": "Fetch Payroll Audit",
      "tags": ["report", "read-only", "SOX"],
      "description": "Read-only access to transaction history for audit purposes."
    }
  ],
  "security": {
    "schemes": ["OAuth2"],
    "scopes": ["payroll.read", "payroll.write"]
  }
}
```

### Sample Agent Card: Corporate Travel Assistant

```json
{
  "name": "Corporate Travel Bot",
  "version": "2.0.4",
  "description": "Orchestrates flight and hotel bookings based on corporate policy.",
  "url": "https://acme-corp.com",
  "tags": {
    "domain": ["Operations", "Procurement"],
    "sensitivity": ["Internal-Use-Only"],
    "capability_class": ["Orchestrator"]
  },
  "skills": [
    {
      "id": "book_flight",
      "name": "Flight Booking",
      "tags": ["create", "transactional"],
      "examples": ["Book a flight to London for next Tuesday"]
    },
    {
      "id": "view_itinerary",
      "name": "View Travel Plans",
      "tags": ["report", "read-only"],
      "outputModes": ["text/markdown"]
    }
  ]
}
```

### Summary of Common Taxonomy Tags

| Tag Category | Common Entries | Purpose |
|-------------|----------------|---------|
| Domain | HCM, Finance, Legal, ITSM | Discovery (Finding the right department) |
| Capability | create, report, approval, delete | Action matching (Can this agent perform a write?) |
| Sensitivity | PII, SOX, Public, Read-Only | Access Control (Is this safe for this agent to see?) |
| Environment | Dev, Staging, Production | Deployment safety (Prevents dev agents hitting prod data) |

---

## Question:
are the tags part of the standard or just any plain text?

## Answer:
**The structure of the "tags" field is standardized, but the specific values (the actual text) are often flexible.**

In the **Agent-to-Agent (A2A) Protocol**, the **Agent Card** is a standardized JSON document exposed at `/.well-known/agent-card.json`. While the protocol defines *where* these details go, it often leaves the specific taxonomy of the tags to the organization or community implementing them.

## 1. The Standardized Part (The "Envelope")
The A2A specification defines a structured schema for the Agent Card. This ensures that any "Client Agent" knows exactly which JSON keys to look for. For example:
- **The Key Name:** The protocol expects a field named `tags` or `skills` within the JSON.
- **The Data Type:** These are typically defined as **Arrays of Strings** or **Key-Value Pairs** so that machines can iterate through them.

## 2. The Plain Text Part (The "Vocabulary")
The specific values (like HCM, PII, or SOX) are often **plain text values** that follow a specific **taxonomy** or **ontology** rather than a rigid global standard.
- **Industry Standards:** For specific industries, tags might follow existing standards like **ISO** or **W3C DCAT** for metadata.
- **Semantic Interoperability:** Newer proposals suggest using **JSON-LD** (Linked Data). This turns "plain text" into a globally unique identifier (URI). For example, instead of just PII, a tag might point to a specific definition of PII at a URL, ensuring two agents from different companies have the exact same understanding of that term.

## 3. Why This Matters for Governance
- **Discovery:** A search engine for agents (a **Registry**) uses these tags to filter results (e.g., "Find all agents in the Finance domain").
- **Policy Enforcement:** An API Gateway can be programmed with a rule: "If an agent has the PII sensitivity tag, it must use Mutual TLS for communication."

| Element | Is it Standardised? | Format |
|---------|---------------------|--------|
| Field Name (e.g., tags) | Yes (Defined by A2A Protocol) | JSON Key |
| Field Value (e.g., HCM) | No (Defined by the Organisation) | Plain Text String |
| Advanced Metadata | Emerging (via JSON-LD) | URIs / Linked Data |

---

## Question:
so skills in agents cards are not like skill.md they are more like mcp tools?

## Answer:
You are correct: In an **Agent Card**, "Skills" function much more like **MCP (Model Context Protocol) Tools** or **OpenAPI Operations** than a static `skill.md` file.

## 1. The skill.md approach (Legacy/Human-Centric)
- **What it is:** A markdown file written for humans or LLMs to read.
- **How it works:** An LLM reads the text, understands the "vibe" or general instructions of the skill, and tries to follow them.
- **The Problem:** It's "fuzzy." A computer can't easily validate if the inputs are correct or if the agent is authorized to perform that specific action based on a governance policy.

## 2. The Agent Card / MCP approach (Modern/Machine-Centric)
- **What it is:** A structured JSON entry that defines a **specific execution endpoint**.
- **How it works:** Just like an **MCP Tool**, it defines: Name/ID, Parameters (what data is needed), and Governance Tags (e.g., domain: finance, sensitivity: PII).
- **The Benefit:** An orchestrator agent doesn't just "read" about the skill; it **executes** it programmatically.

## Comparison: Skill.md vs. Agent Card Skill (MCP-style)

| Feature | skill.md | Agent Card Skill (MCP-like) |
|---------|----------|------------------------------|
| Format | Markdown (Text) | JSON/YAML (Structured) |
| Primary Audience | LLM Prompting | Orchestrators & API Gateways |
| Validation | Hard to automate | Easy (Schema validation) |
| Governance | Manual review | Automated (via tags) |
| Execution | Descriptive | Functional / Callable |

## How MCP fits in
When Agent A reads Agent B's card:
- It sees a skill (tool).
- It checks the **tags** (governance) to see if it's allowed to call it.
- It uses the JSON schema (like an MCP tool definition) to format the request perfectly.

## The "Hybrid" Reality
In many A2A implementations, the Agent Card provides the **structured metadata** (the MCP-style tool definition), but it might also include a `description_url` that points to a `skill.md` or documentation page for the LLM to use as "long-form reasoning" guidance.
