# Workday ASOR GitHub Repository — Agent Definition API

> Source: https://github.com/Workday/asor
> Collected: 2026-04-12
> Published: Unknown

## Repository Overview

**Repository:** Workday/asor
**Description:** "Documentation and Information for the Agent System of Record API"
**Primary Language:** JSON/Markdown (specification and documentation)
**Visibility:** Public

## Core Purpose

Documents the Workday Agent Definition API, designed to facilitate creation of agent definitions that operate with Workday tools and resources. Enables partners and ecosystems to allow users to interact with Workday data securely.

Primary objectives:
1. Create agents with skills that safely access Workday data
2. Discover capabilities available through agents and their skills
3. Implement fine-grained user access knowledge

## Repository Contents

- **README.md** — Main documentation with core concepts
- **considerations.md** — Development considerations
- **observability.md** — Monitoring and observability guidance
- **versions/v1.2.md** — Current specification (Markdown format)
- **versions/v1.2.json** — Current specification (JSON schema)

---

## Key Architectural Concepts

### Hierarchical Structure

Three levels:
- **Agents** — ambient or delegate entities
- **Skills** — discrete capabilities within agents
- **Tools** — external resources, services, or data sources

### Agent Types

**Ambient Agents:** Invoked by system events/notifications; operate independently without human interaction; can execute on schedules.

**Delegate Agents:** Invoked by humans directly or through conversation orchestrators; can hand off to other agent skills; don't require push notifications upon completion.

### Agent Lifecycle in ASOR

Registration → Discovery → Activation/Configuration → Operation → Evolution → Deactivation

### Skill Characteristics

Skills are atomic, parameterized capabilities featuring:
- Single, focused purpose
- Defined input parameters
- Deterministic, predictable outputs
- Programmatic discoverability
- Composability with other skills
- Context awareness

---

## API Specification v1.2

**Base URL:** `https://{workday-host}/api/asor/v1/{tenantname}/agentDefinition`

### Endpoints

**GET `/agentDefinition/{id}`**
- Security: Setup: Agents
- Returns: Agent Definition with Skills and Tools
- Success: 200 (agentCardAndTools)

**POST `/agentDefinition`**
- Security: Development
- Body: agentCardAndTools (required)
- Success: 201 (agentCardAndTools)
- Note: Updates existing agents matching same name, provider organization, and version

### Core Data Model: agentCardAndTools

| Field | Type | Required |
|-------|------|----------|
| id | string | No |
| name | string | Yes |
| description | string | Yes |
| url | string | Yes |
| overview | string | No |
| iconUrl | string | No |
| provider | object | Yes |
| platform | object | Yes |
| version | string | Yes |
| documentationUrl | string | No |
| externalAgentID | string | No |
| externalTenantID | string | No |
| capabilities | object | Yes |
| defaultInputModes | array[mimeType] | No |
| defaultOutputModes | array[mimeType] | No |
| skills | array[agentSkill] | Yes |
| supportsAuthenticatedExtendedCard | boolean | No |
| workdayConfig | array[agentSkillResource] | No |

**Supporting Objects:**
- **provider**: `{id: string}` (format: "Provider={name}")
- **platform**: `{id: string}` (format: "Platform={name}")
- **capabilities**: Optional boolean flags (pushNotifications, streaming, stateTransitionHistory)
- **mimeType**: `{type: string}`

### agentSkill

Required: id, name, description, tags (array[agentSkillTag])
Optional: inputModes, outputModes

### agentSkillResource

Required: skillId, executionMode, workdayResources
- **executionMode**: Enum[Ambient, Delegate] (format: "Mode=Ambient" or "Mode=Delegate")

### workdayResource

Required: tool_name
Optional: agent_resource, description, tools (array with id)

---

## Developer Considerations (from considerations.md)

### Clear Agent Description
Craft consumer-focused descriptions covering:
- **Purpose**: The specific outcomes the agent delivers
- **Scope**: Which systems and Workday domains are accessible
- **Data Flow**: What inputs are required and what outputs/changes result

### Strategic Tagging for Discoverability
Tags enhance both discoverability and A2A (Agent-to-Agent) interoperability:
- Reference Workday business domains (HCM, Finance, Time Tracking)
- Describe operational capabilities (create, update, report, approval)
- Signal sensitivity levels (read-only, PII-related, SOX-compliance)
- Use lowercase standardized tags for consistency

### Pre-Registration Identifier Collection
"If your Agent uses Workday APIs, you must populate the Agent Resource section of the Registration API." Requires:
- Consulting the Workday API Explorer for specific endpoints and resource identifiers
- Reviewing tenant admin documentation to locate ID definitions
- Validating each ID within the target environment
- **Anti-pattern**: Never guess at identifiers — resolve with Workday administrators before registration

---

## Design Best Practices

**Recommended:**
- Single responsibility principle per skill
- Modular, reusable skills
- Abstract tool interfaces

**Anti-patterns:**
- Monolithic skills
- Hardcoded tool implementations
- Inadequate error handling

---

## Technical Features

- Streaming capability support
- Multiple input/output modes (text/plain, application/json, application/ms-excel)
- Workday API integrations
- Security group enforcement
- API client credential management
- Partner agents in non-Workday ecosystems supported via Agent Gateway (validates security permissions in customer tenant)
