---
title: Create Custom Agent
description: Learn how to create custom Agents in DesireCore—through conversation creation and manual creation.
keywords: [Create Agent, Custom Agent, Conversation Creation, Template]
---

# Create Custom Agent

When there is no Agent in the marketplace that meets your needs, you can create a fully custom Agent. DesireCore provides two creation methods.

## Create Through Conversation (Recommended)

The simplest way is to directly tell the DesireCore Core Agent what kind of assistant you need.

### Operation Steps

1. Open a conversation with DesireCore Core Agent
2. Describe the Agent you want, for example:

   > "Help me create a financial analysis assistant, professional and rigorous, good at data analysis and report writing."

3. The Core Agent will guide you to confirm the following information:
   - **Name and Description**: What the Agent is called and what it does
   - **Role Positioning**: Professional domain and behavioral style
   - **Skill Requirements**: What capabilities are needed
   - **Behavioral Guidelines**: What should or shouldn't be done

4. After confirmation, the Core Agent automatically creates the complete Agent configuration
5. The new Agent appears in your Agent list and can be used immediately

:::tip Why Recommend Conversation Creation?
The conversation creation process itself is a "teaching"—you describe your needs, and the Agent helps you transform vague ideas into structured configurations. After creation, you can continue teaching it new things through conversation at any time.
:::

## Manual Creation (Advanced Users)

If you are familiar with the AgentFS file system structure, you can directly create and edit configuration files.

### Operation Steps

1. Click "New Agent" on the Agent management page
2. Fill in basic information:
   - Name (required)
   - Description
   - Avatar
   - Category tags

3. Configure Persona (`persona.md`):
   - Role positioning and tone style
   - Response strategy and confirmation strategy
   - Forbidden zones and boundaries

4. Configure Principles (`principles.md`):
   - Core principles
   - Safety rules
   - Escalation conditions

5. Add Skills (optional):
   - Install from skill marketplace
   - Or manually write SKILL.md

### AgentFS Directory Structure

After creation, the Agent's files are stored in `~/.desirecore/agents/<agent_id>/`:

```
<agent_id>/
├── agent.json        # Entry configuration (name, description, version, etc.)
├── persona.md        # Persona
├── principles.md     # Principles
├── memory/           # Memory directory
├── skills/           # Skills directory
├── tools/            # Tool registration
└── .git/             # Git version management
```

## Creation Process Steps

Regardless of the method, the creation process follows these steps:

```
Select creation method
    |
    v
Fill in basic information (name, description)
    |
    v
Configure Persona
    |
    v
Configure Principles (optional, can be added later)
    |
    v
Add Skills (optional, can be added later)
    |
    v
Creation complete, initialize Git repository
    |
    v
Start using
```

## Best Practices

:::tip Creating Useful Agents
1. **Start small**: Create a simple Agent first and gradually improve it through use. You don't need to configure everything at the beginning.
2. **Clear role**: Give the Agent a clear positioning, such as "Legal assistant focused on contract review," rather than "All-purpose assistant that can do everything."
3. **Set boundaries**: Clearly tell the Agent what it should and shouldn't do. Agents with clear boundaries are more reliable than "universal" Agents.
4. **Leverage teaching**: After creation, continuously teach it through daily conversation—it will learn your preferences and continuously improve.
:::

## Next Steps

- [Edit Persona](./04-edit-persona.md) — Deep dive into how to adjust the Agent's personality
- [Edit Principles](./05-edit-principles.md) — Set behavioral boundaries for the Agent
