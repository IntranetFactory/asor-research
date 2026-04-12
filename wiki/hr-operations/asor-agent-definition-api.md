# ASOR Agent Definition API

> Sources: Workday (GitHub/asor), Unknown
> Raw: [Workday ASOR GitHub API Spec](../../raw/hr-operations/2026-04-12-workday-asor-github-api-spec.md)
> Updated: 2026-04-12

## Overview

The Workday Agent Definition API is the technical registration interface for the [Agent System of Record](agent-system-of-record-for-blended-workforces.md). It allows partners and ecosystem developers to register agent definitions that operate with Workday tools and resources, enabling secure access to Workday data by external agents.

The public specification lives at: https://github.com/Workday/asor

## Object Hierarchy

The API structures agent capabilities in three levels:

```
Agent
 └── Skills  (discrete capabilities within an agent)
       └── Tools  (external resources, services, or data sources)
```

**Skills** are atomic, composable units with:
- Single, focused purpose
- Defined input parameters and deterministic outputs
- Programmatic discoverability
- Context awareness

## Agent Types

| Type | Invocation | Human interaction | Push notifications |
|------|-----------|-------------------|--------------------|
| **Ambient** | System events / schedules | None | Required |
| **Delegate** | Human or conversation orchestrator | Direct | Not required |

Ambient agents operate autonomously; Delegate agents participate in conversational flows and can hand off to other agent skills.

## Agent Lifecycle

**Registration → Discovery → Activation/Configuration → Operation → Evolution → Deactivation**

Registration via `POST /agentDefinition`. Subsequent posts with the same name + provider + version update the existing definition.

## API Reference (v1.2)

**Base URL:** `https://{workday-host}/api/asor/v1/{tenantname}/agentDefinition`

### Endpoints

| Method | Path | Auth scope | Purpose |
|--------|------|------------|---------|
| GET | `/agentDefinition/{id}` | Setup: Agents | Retrieve definition |
| POST | `/agentDefinition` | Development | Create or update definition |

### Key Fields (agentCardAndTools)

Required fields: `name`, `description`, `url`, `provider`, `platform`, `version`, `capabilities`, `skills`

Notable optional fields:
- `externalAgentID` / `externalTenantID` — links to the agent's identity in the partner system
- `workdayConfig` — maps skills to Workday resource access and execution modes
- `capabilities` — boolean flags: `pushNotifications`, `streaming`, `stateTransitionHistory`
- `defaultInputModes` / `defaultOutputModes` — MIME type arrays (e.g. text/plain, application/json, application/ms-excel)

### Provider and Platform Format

Both use a structured ID string:
- Provider: `"Provider={name}"`
- Platform: `"Platform={name}"`

### Execution Mode (agentSkillResource)

Each skill resource declares an `executionMode` enum:
- `"Mode=Ambient"` — skill runs on schedule or system event
- `"Mode=Delegate"` — skill runs on human or orchestrator invocation

## Developer Considerations

### Tagging Strategy (for Discoverability and A2A)

Tags serve both human discoverability and Agent-to-Agent (A2A) interoperability. Effective tag taxonomy:
- **Domain**: Workday business domains (HCM, Finance, Time Tracking)
- **Capability**: operational verbs (create, update, report, approval)
- **Sensitivity**: access profile (read-only, PII-related, SOX-compliance)

Use lowercase standardized tags; avoid ad hoc variations.

### Pre-Registration: Workday IDs (WIDs)

If an agent uses Workday APIs, its `workdayConfig` must include Workday resource identifiers (WIDs). These must be looked up — not guessed — via:
- Workday API Explorer (for endpoints and resource IDs)
- Tenant admin documentation (for ID definitions)
- Validation in the target environment before registration

### Skill Design Principles

**Recommended:** single responsibility per skill; modular, reusable skills; abstract tool interfaces.

**Anti-patterns:** monolithic skills; hardcoded tool implementations; inadequate error handling.

## Agent Gateway Integration

Partner agents running outside Workday connect through the **Agent Gateway**, which validates security permissions configured in the customer's tenant. This is the same gateway layer described in the ASOR product architecture.

## See Also

- [Agent System of Record for Blended Workforces](agent-system-of-record-for-blended-workforces.md)
- [HRIS, HRMS, HCM, and Global Payroll Operating Models](hris-hrms-hcm-and-global-payroll-operating-models.md)
