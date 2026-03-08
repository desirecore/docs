---
title: File Format Specification
description: Format specifications and structure descriptions for files in AgentFS
keywords: [file format, AgentFS, agent.json, SKILL.md, memory, principles]
---

# File Format Specification

This document describes the format and structure of core files in AgentFS.

## agent.json -- Agent Identity Configuration

Each agent has an `agent.json` in its root directory defining the agent's basic information.

```json
{
  "name": "Legal Advisor",
  "version": "1.2.0",
  "description": "Professional contract review and legal consultation",
  "role": "Legal Advisor",
  "author": "DesireCore Team",
  "traits": ["Rigorous", "Professional", "Patient"],
  "risk_level": "medium",
  "greeting": "Hello! I'm your legal advisor, focusing on contract review and legal risk assessment. How can I help you?",
  "access_control": {
    "owner": "user_001",
    "visibility": "private"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Agent display name |
| `version` | string | Yes | Version number (semver format) |
| `description` | string | No | One-sentence description |
| `role` | string | Yes | Role positioning |
| `author` | string | No | Author |
| `traits` | string[] | No | Personality trait tags list |
| `risk_level` | enum | No | Risk level: `low`/`medium`/`high`/`critical` |
| `greeting` | string | No | Greeting message for first conversation |
| `access_control` | object | No | Access control configuration |

## persona.md -- Persona Profile

Defines the agent's communication style and behavioral norms. Recommended structure:

```markdown
## How I Want You to Respond
- Give conclusion first, then reasons; less pleasantries.
- Ambiguous: Ask 1 key question first; otherwise proceed with default assumptions and label them.

## What I Don't Want to See
- Template tone/customer service tone/excessive empathy
- "Both options have pros and cons" type of conclusion avoidance

## Safety & Confirmation
- Reading files, organizing, generating drafts, doing analysis: Do directly and write receipts.
- Sending messages/emails, deleting/paying, online changes, external publishing: Must go through human gate confirmation first.

## When Uncertain
- Explain uncertainty points and provide verification paths; escalate to human when necessary.
```

**Important Principle**: Persona profile is **executable specification**, not "character copy." Should be short, hard, and testable.

## principles.md -- Principles

Defines the agent's behavioral rules and safety red lines:

```markdown
## Must Do
- Must confirm before monetary operations
- Show diff before modifying files
- Generate receipt after task completion

## Never Do
- Don't delete user files (unless user confirms three times)
- Don't send external messages without confirmation
- Don't modify other agents' configurations

## Escalation Path
- Escalate to user when legal risk judgment is uncertain
- Operations over 10,000 CNY must be escalated
```

**Note**: The "Never Do" section is evolution-protected and will not be overridden by the agent's self-evolution.

## SKILL.md -- Skill Definition

The core file of each skill pack, using YAML frontmatter + Markdown body:

```markdown
---
metadata:
  id: contract-review
  version: 1.0.0
  name: Contract Review
  description: Professional contract review skill, supporting risk identification and clause analysis
  author: DesireCore Team
  tags: [Legal, Contract, Review]
  dependencies: []
  requiredTools: [Read, Write, Edit]
---

# Contract Review

## Trigger Conditions
Triggered when users mention "review contract," "look at this contract," "any issues with the contract," etc.

## Execution Steps

### 1. File Parsing (Hardened Step)
- Read contract file
- Parse document structure, identify chapters

### 2. Clause Analysis (Flexible Step)
- Analyze contract clauses one by one
- Mark risk levels: High/Medium/Low
- Focus on: Payment terms, liability for breach, intellectual property, confidentiality clauses

### 3. Generate Report (Hardened Step)
- Generate review report according to template
- Include: Risk summary, item-by-item comments, modification suggestions

### 4. User Confirmation (Human Gate)
- Display review report for user confirmation
- Wait for user feedback before subsequent operations

## Reference Materials
- Legal templates and cases in the references/ directory
```

### SKILL.md frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metadata.id` | string | Yes | Skill unique identifier |
| `metadata.version` | string | Yes | Version number (semver) |
| `metadata.name` | string | Yes | Display name |
| `metadata.description` | string | Yes | Brief description |
| `metadata.author` | string | No | Author |
| `metadata.tags` | string[] | No | Tags list |
| `metadata.dependencies` | string[] | No | Dependencies on other skills |
| `metadata.requiredTools` | string[] | No | Required tools |

## Memory Files

Memory files use Markdown format, stored in the `memory/` directory:

```markdown
---
type: fact
importance: high
created: 2026-01-15T10:30:00Z
source: user_teaching
---

# User Preference: Contract Review

User has the following preferences when reviewing contracts:
- Prioritize payment terms and liability for breach
- Mark in red when penalty exceeds 30% of contract amount
- Special reminder needed when confidentiality period is below 2 years
- Report format: Summary first, then details
```

| frontmatter Field | Description |
|-------------------|-------------|
| `type` | Memory type: `fact`(fact), `preference`(preference), `experience`(experience), `rule`(rule) |
| `importance` | Importance: `high`/`medium`/`low` |
| `created` | Creation time |
| `source` | Source: `user_teaching`(user teaching), `interaction`(interaction inference), `reflection`(self-reflection) |

## Receipt Files

Receipts are stored in YAML format in the `runs/<run_id>/receipts/` directory:

```yaml
receipt_id: "rcpt_20260115_143022_abc123"
repo_ref: "a1b2c3d4..."

session:
  session_id: "sess_xyz789"
  agent_id: "legal-advisor"
  user_id: "user_001"

task:
  input_summary: "Review clause 3 of supplier contract"
  output_summary: "Review completed, found 2 high-risk clauses"
  outcome:
    status: completed
    auto_completed: true
    user_edits: 0

step_types:
  deterministic: 3
  adaptive: 5
  human_gate: 1

time_metrics:
  agent_execution_time: 45
  actual_human_time: 120
```

## Directory Structure Convention

| Directory/File | Management | Description |
|----------------|------------|-------------|
| `agents/<id>/` | Git managed | Agent本体, shareable and publishable |
| `users/<id>/` | No Git | User private data |
| `runs/` | No Git | Runtime temporary data |
| `cache/` | No Git | Rebuildable cache |
| `logs/` | No Git | Log files |
