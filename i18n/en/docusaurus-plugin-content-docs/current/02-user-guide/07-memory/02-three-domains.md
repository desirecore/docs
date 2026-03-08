---
title: Three-Domain Memory Explained
description: Deep dive into the design philosophy, read/write permissions, and use cases of Core Memory, Relationship Memory, and Shared Memory.
keywords: [three-domain memory, core memory, relationship memory, shared memory, memory scope]
---

# Three-Domain Memory Explained

DesireCore divides agent memory into three independent domains, each with different purposes, permissions, and lifecycles. Understanding them helps you better manage the agent's "cognition."

## Understanding the Three Domains at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    Agent Memory                      │
├──────────┬──────────────────┬────────────────────────┤
│   Core   │   Relationship   │       Shared           │
│  Memory  │     Memory       │       Memory           │
│          │                  │                        │
│ Factory  │ Between you and  │ Shared across multiple │
│ knowledge│ the agent        │ agents                 │
│          │                  │                        │
│ Analogy: │ Analogy:         │ Analogy:               │
│Personality│ Private diary   │ Team handbook          │
└──────────┴──────────────────┴────────────────────────┘
```

## Core Memory

**Analogy: The agent's personality traits**

Core memory is the knowledge and cognition that comes "factory-installed" with the agent. It defines who the agent is, what it's good at, and what principles it follows.

**Contains:**

- Professional knowledge base (e.g., legal statutes, coding standards)
- Role positioning and behavioral guidelines
- Skill and capability declarations

**Characteristics:**

- Defined by the agent's creator
- Usually doesn't change through user interaction
- All users of the agent share the same core memory

:::info Example
A legal advisor agent's core memory contains "I am a legal advisor, specializing in contract review and legal consultation," along with relevant legal knowledge. Regardless of who uses it, it maintains this professional identity.
:::

## Relationship Memory

**Analogy: A private diary between you and the agent**

Relationship memory records all interaction experiences between you and a specific agent. Each user's relationship memory with each agent is independent and private.

**Contains:**

- Your preferences and habits ("Mr. Zhang prefers formal tone reports")
- Key decision records ("Decided to use React tech stack in December 2024")
- Commitments and todos ("Promised to deliver first draft by next Monday")
- Milestone events ("Project Alpha launched on March 1")
- Lessons learned ("The concurrency issue last time was caused by connection pool exhaustion")

**Characteristics:**

- Your exclusive memory, other users can't see it
- Automatically accumulates through interaction
- You have complete control—view, edit, delete

:::tip Memory Types
Each relationship memory has a type tag to help the agent understand the nature of the memory:

| Type | Meaning | Example |
|------|---------|---------|
| **preference** | Preferences and habits | "I like reports in Markdown format" |
| **fact** | Objective facts | "Our company uses AWS as cloud provider" |
| **decision** | Key decisions | "Chose option B as the technical approach" |
| **commitment** | Commitments and todos | "Promised to complete design review by Friday" |
| **milestone** | Milestone events | "Product v2.0 released on January 15" |
| **lesson** | Lessons learned | "Last deployment failed because environment variables weren't updated" |
:::

## Shared Memory

**Analogy: Team shared handbook**

Shared memory is a knowledge base shared across agents. When information is valuable to multiple agents, it can be placed in the shared domain.

**Contains:**

- Team project information ("Project Alpha uses React tech stack")
- General work standards ("All documents must include version numbers")
- Cross-domain knowledge ("The company's legal advisor is Lawyer Wang")

**Characteristics:**

- Multiple agents can read it
- Writing requires your explicit consent
- Suitable for general information that spans domains

:::warning Share with Caution
Moving memory from the relationship domain to the shared domain means other agents can also see this information. The system will ask for your consent before writing to the shared domain.
:::

## Three-Domain Comparison Overview

| Dimension | Core Memory | Relationship Memory | Shared Memory |
|-----------|-------------|---------------------|---------------|
| **Analogy** | Personality traits | Private diary | Team handbook |
| **Ownership** | Agent | User + Agent | Shared space |
| **Creator** | Agent developer | Auto-generated from conversation | User-initiated sharing |
| **Visibility** | All users | Only you | All members in the space |
| **Write Permission** | Only developer/market updates | Generated from reflection + manual edit | Requires explicit user consent |
| **Lifecycle** | Updated with agent versions | Accumulates with interaction, can be forgotten | Long-term retention |
| **Typical Content** | Professional knowledge, guidelines | Preferences, decisions, events | Project info, team standards |

## Domain Assignment Rules

When the system generates a candidate memory, it follows these rules to decide which domain it should go into:

1. **Involves your personal preferences?** → Relationship Memory
2. **User explicitly allows sharing, and information has general value?** → Shared Memory
3. **Belongs to the agent's general knowledge or capabilities?** → Core Memory

In most cases, memories generated from conversations enter the **Relationship Domain**—because they record the unique experiences between you and the agent.

:::tip Memory Migration
If you think a relationship memory is worth sharing with other agents, you can manually migrate it to the shared domain in the memory management interface.
:::
