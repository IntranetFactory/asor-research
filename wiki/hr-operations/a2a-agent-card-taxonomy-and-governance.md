# A2A Agent Card Taxonomy and Governance

> Sources: Unknown, Unknown
> Raw: [A2A Agent Card Taxonomy Q&A](../../raw/hr-operations/2026-04-18-a2a-agent-card-taxonomy-qa.md)
> Updated: 2026-04-18

## Overview

Agent-to-Agent (A2A) Agent Cards carry structured taxonomy tags that enable automated discovery and policy enforcement without human involvement. Three tag categories work together: domain tags identify what business area an agent belongs to, capability tags describe what actions it can perform, and sensitivity tags encode what governance rules apply. The A2A protocol standardizes the JSON structure (field names and types) but intentionally leaves the vocabulary of tag values to each organization or emerging industry standards.

## Tag Categories

### Domain Tags — The "What"

Domain tags categorize an agent by business vertical, narrowing the discovery search space so a client agent doesn't scan unrelated services.

| Tag | Scope |
|-----|-------|
| HCM | Personnel data, payroll, recruitment |
| Finance | Ledger access, payment initiation, financial reporting |
| SCM | Logistics, inventory, procurement |
| Legal | Contract analysis, regulatory compliance |
| ITSM | IT service management |
| Operations | Facilities, administration, travel |

### Capability Tags — The "How"

Capability tags describe the class of actions a skill can perform, allowing orchestrators to match tasks to the right specialist.

| Tag | Meaning |
|-----|---------|
| `create` | Writes new records |
| `report` | Read-heavy, analytical output |
| `approval` | Triggers or manages workflow approvals |
| `delete` | Removes records |
| `transactional` | Commits a real-world transaction |
| `read-only` | No write side effects |

### Sensitivity Tags — The "Should"

Sensitivity tags are the backbone of automated governance and policy enforcement. API gateways and orchestrators use these to enforce security requirements without manual review.

| Tag | Trigger |
|-----|---------|
| `read-only` | Restrict all write operations |
| `PII` | Stricter encryption, logging, consent requirements |
| `SOX` | Immutable audit trails required (Sarbanes-Oxley) |
| `PCI-DSS` | Financial-grade API (FAPI) security profile required |
| `GDPR` | EU data residency and subject-rights compliance |
| `Confidential` | Internal access control restrictions |

An additional `environment` tag (`Dev`, `Staging`, `Production`) prevents dev agents from accidentally hitting production data.

## Agent Card JSON Examples

Tags appear as JSON arrays within the card, exposed at `/.well-known/agent-card.json`. Skills can carry their own tags in addition to the top-level card tags.

**Finance payroll agent (high regulation):**
```json
{
  "name": "Global Payroll Processor",
  "version": "1.2.0",
  "url": "https://acme-corp.com",
  "tags": {
    "domain": ["Finance", "HCM"],
    "sensitivity": ["PII", "GDPR", "Confidential"],
    "environment": ["Production"]
  },
  "capabilities": { "streaming": true, "stateTransitionHistory": true },
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
      "tags": ["report", "read-only", "SOX"]
    }
  ],
  "security": { "schemes": ["OAuth2"], "scopes": ["payroll.read", "payroll.write"] }
}
```

**Travel orchestrator (lower sensitivity):**
```json
{
  "name": "Corporate Travel Bot",
  "version": "2.0.4",
  "url": "https://acme-corp.com",
  "tags": {
    "domain": ["Operations", "Procurement"],
    "sensitivity": ["Internal-Use-Only"],
    "capability_class": ["Orchestrator"]
  },
  "skills": [
    { "id": "book_flight", "name": "Flight Booking", "tags": ["create", "transactional"] },
    { "id": "view_itinerary", "name": "View Travel Plans", "tags": ["report", "read-only"], "outputModes": ["text/markdown"] }
  ]
}
```

## Standardization Level

The A2A protocol standardizes the **structure** (JSON schema, field names, data types), not the **vocabulary** of tag values:

| Element | Standardized? | Format |
|---------|--------------|--------|
| Field name (e.g., `tags`) | Yes — A2A spec | JSON key |
| Field value (e.g., `HCM`) | No — org-defined | Plain text string |
| Semantic metadata | Emerging — JSON-LD | URI / Linked Data |

**JSON-LD direction:** Newer proposals suggest expressing tags as URIs (e.g., pointing to a GDPR definition URL) so two organizations sharing only a card URL arrive at the exact same interpretation of a tag value. This moves from opaque strings toward a shared ontology.

## Governance Enforcement Patterns

Tags enable two automated governance patterns downstream of the card:

**Registry-based discovery** — An agent registry indexes cards by domain and capability tags. Orchestrators query with filters like `domain=Finance AND capability=approval` to find the right sub-agent at runtime.

**Gateway-based policy enforcement** — An API gateway applies rules keyed on sensitivity tags, for example: "If `PII` tag is present, require Mutual TLS; if `SOX` tag is present, route all responses to the audit log sink."

## Agent Card Skills vs SKILL.md

Skills declared in an Agent Card serve a fundamentally different purpose than `SKILL.md` files:

| Feature | SKILL.md | Agent Card Skill |
|---------|----------|-----------------|
| Format | Markdown (text) | JSON/YAML (structured) |
| Primary audience | LLM prompting | Orchestrators & API gateways |
| Validation | Hard to automate | Easy (schema validation) |
| Governance | Manual review | Automated (via tags) |
| Execution | Descriptive | Functional / callable |

A `SKILL.md` tells an LLM *how to do a job*. An Agent Card skill tells an orchestrator *that a specific endpoint exists, what it accepts, and whether it's safe to call*. The two are complementary: some A2A implementations include a `description_url` in the skill pointing to a `SKILL.md` for the LLM reasoning layer while the JSON entry handles programmatic invocation and governance.

## See Also

- [ASOR Agent Definition API](asor-agent-definition-api.md)
- [OpenClaw A2A Integration](openclaw-a2a-integration.md)
- [Agent Skills Format Specification](agent-skills-format-specification.md)
- [Agent System of Record for Blended Workforces](agent-system-of-record-for-blended-workforces.md)
- [AI Agent Governance Platforms Landscape](ai-agent-governance-platforms-landscape.md)
