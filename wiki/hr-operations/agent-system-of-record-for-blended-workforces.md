# Agent System of Record for Blended Workforces

> Sources: Workday, Unknown; Dean Arnold, Workday Blog, Unknown; Q&A research, Unknown
> Raw: [Workday Agent System of Record](../../raw/hr-operations/workday-agent-system-of-record.md); [Workday ASOR GA Announcement](../../raw/hr-operations/2026-04-12-managing-ai-powered-future-of-work.md); [Workday ASOR Overview Q&A](../../raw/hr-operations/workday-asor-overview-qa.md); [AI Agent Governance Platforms Landscape Q&A](../../raw/hr-operations/ai-agent-governance-platforms-landscape-qa.md)
> Updated: 2026-04-12

## Overview

An Agent System of Record (ASOR) is an enterprise control plane for AI agents, analogous to how HR and finance systems provide a system of record for people and business operations. In this framing, organizations govern agents and humans together as one blended workforce. Workday's ASOR reached general availability in 2026; at that point, 82% of organizations were reported to be expanding their use of AI agents while lacking centralized management.

## Core Capability Model

### Unified Agent Visibility
ASOR centralizes inventory and measurement of AI agents to reduce **agent sprawl** — the chaos caused when different teams deploy unmanaged AI tools across an organization. It provides a consolidated view across agents built by Workday, third-party partners (e.g., Censia), or customers themselves.

### Governance and Accountability
The model emphasizes security, compliance, and accountable ownership by tracking agent behavior, interactions, and lifecycle status. This covers both internal Workday agents and external agents admitted through the Agent Gateway. ASOR enforces the same security and data privacy rules for agents as for human employees.

### Lifecycle Management
ASOR introduces explicit lifecycle stages (registration through retirement), creating operational controls similar to employee lifecycle governance. Business leaders can assign roles, set permissions, and configure agents as they would manage human staff.

### Analytics for AI ROI and Compliance (Dual Goals)
ASOR handles both compliance auditing and ROI measurement simultaneously — these are not competing priorities:

- **Compliance/Audit:** Enforces security permissions, tracks every interaction, and provides a full audit trail of "who, what, and when" for every agent action.
- **ROI/Productivity:** The Agent Analytics Hub tracks how agents impact business processes, calculates "time reclaimed" from human-to-AI work shifts, and monitors cost per agent (subscription fees, token usage) against value delivered.
- **Expense tracking is part of ROI:** Administrators can budget, forecast, and monitor financial costs for each agent. Workday also offers a specific **Expenses Agent** for automating expense submission and approval workflows.

### Pre-Built Agent Examples

Agents that can be governed within ASOR include:
- **Recruiter Agent** — automated candidate outreach
- **Payroll Agent** — auditing and payroll updates
- **Policy Agent** — answering employee queries from company handbooks
- **Expenses Agent** — automating expense report submission and approval

## Ecosystem and Standards

Workday's ASOR supports 65+ global partners and 20 Workday Ventures portfolio companies. It uses open industry standards — Model Context Protocol (MCP), Agent-to-Agent (A2A) protocols, and OpenTelemetry — for agent interoperability and observability across heterogeneous tooling.

## Architecture Pattern

A practical pattern in the source material is a secure gateway layer (Agent Gateway) that mediates interactions with enterprise data, including third-party agents. This suggests ASOR functions as a policy and observability layer above heterogeneous agent tooling, not tied to Workday-built agents only.

## Relationship to Existing HR Technology Stack

ASOR does not replace HRIS/HRMS/HCM categories. Instead, it extends workforce operations into agent governance:
- HRIS/HRMS/HCM remain the foundation for human workforce records and processes.
- ASOR adds controls for digital workforce entities (agents).
- Combined together, they support blended-workforce planning and oversight.

## See Also

- [ASOR Agent Definition API](asor-agent-definition-api.md)
- [AI Agent Governance Platforms Landscape](ai-agent-governance-platforms-landscape.md)
- [HRIS, HRMS, HCM, and Global Payroll Operating Models](hris-hrms-hcm-and-global-payroll-operating-models.md)
- [Airtable for HR Workflow Management](airtable-for-hr-workflow-management.md)
