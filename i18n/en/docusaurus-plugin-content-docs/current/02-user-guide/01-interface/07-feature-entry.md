# Feature Entry Points and Operation Paths

This section helps new users understand the basic operation paths in DesireCore: where to choose an agent, where to view replies and results, and where to enter messages or commands.

![Conversation interface operation path](/img/user-guide/feature-entry/main1.png)

## 1. Three Core Areas of the Conversation Interface

After entering the conversation interface, first remember the three areas marked ①, ②, and ③ in the image. Most basic operations are completed through these three areas.

| No. | Area | Purpose |
|---|---|---|
| ① | Agent and Conversation List | Choose the agent you want to talk to, and view conversation history and recent messages |
| ② | Chat History Area | View agent replies, task execution progress, reports, and expanded content |
| ③ | Input and Command Area | Enter messages, send tasks, upload attachments, or use slash commands |

The most common workflow is: choose an agent in ①, enter your question or task in ③, and then view the reply or result in ②.

### ① Agent and Conversation List

The left-side list is used to choose different agents or historical conversations. Each row represents an agent or a conversation entry.

| Element | Description |
|---|---|
| Search box | Enter keywords to find agents or conversation history |
| Plus button | Create a new conversation or add a new entry |
| Agent avatar | Uses color and text to distinguish different agents |
| Agent name | Shows available professional agents, such as DesireCore, Data Analyst, or Website Generator |
| Green status dot | Indicates that the agent is online or available |
| Recent message | Shows the latest reply or task summary from that agent |
| Time | Shows the most recent conversation or update time |

How to use:

1. Find the agent you want to use in the left-side list.
2. Click the agent name or conversation card.
3. The right side switches to the corresponding chat page.
4. If the list is long, use the search box at the top to find an agent quickly.

Examples:

| What You Want to Do | Suggested Agent |
|---|---|
| Let the system assign tasks or coordinate multiple agents | DesireCore |
| Analyze tables, generate charts, or create reports | Data Analyst |
| Generate a website or page | Website Generator |
| Recognize invoice or receipt images | Receipt OCR Assistant |
| Extract content from webpages | Web Scraping Specialist |
| Send reminders or notifications | Notification Assistant |

### ② Chat History Area

The upper-right area is the chat history area. It displays the agent's replies, task progress, and result reports.

| Element | Description |
|---|---|
| Message card | Displays replies, reminders, reports, or task results returned by the agent |
| Title | Shows the topic of the current reply, such as “Heartbeat Check” |
| Summary content | Shows key conclusions, scores, status, or explanations |
| Expand all | Expands collapsed long content so you can view the full result |
| History | Keeps previous conversations and execution progress in chronological order |

In the screenshot, area ② shows the result of a “Heartbeat Check”. Users can directly view the system health score and check summary, or click “Expand all” to view the full report.

Common result types:

| Type | Description |
|---|---|
| Normal reply | A direct answer from the agent |
| Execution progress | Shows that a task is being processed, checked, or generated |
| Result report | Shows analysis reports, check results, tables, or summaries |
| Error prompt | Explains the reason when a task fails or when more information is needed |
| Operation receipt | Indicates whether the task is complete, waiting for confirmation, or needs further action |

Reading tips:

1. Check the title first to confirm which task the message belongs to.
2. Read the summary to quickly judge whether the result is normal.
3. If the content is collapsed, click “Expand all” to view the full details.
4. If the agent asks for more information, continue replying in the input area at the bottom.

### ③ Input and Command Area

The bottom area is used to send messages, upload content, or call quick commands.

| Icon / Element | Description |
|---|---|
| Plus button | Add attachments or open more input tools |
| Image icon | Upload images for the agent to recognize or process |
| Scissors icon | Take a screenshot, crop, or capture content |
| Input box | Enter questions, task requirements, or additional instructions |
| Paper plane button | Send the current message |
| `/` command | Enter a slash to display the available command list |

In the screenshot, `/` is entered in the input box, so the system displays the available command list. Common commands include:

| Command | Purpose |
|---|---|
| `/skill` | Call a specified skill |
| `/new` | Start a new conversation with isolated context |
| `/compact` | Compress older messages while keeping recent context |
| `/help` | Show help information |

Basic operation steps:

1. Enter your question or task in the input box.
2. If you need to upload an image, click the image icon.
3. If you need to use a command, type `/` first and then choose the command.
4. Click the paper plane button on the right to send.
5. Wait for the agent to return the result in area ②.

Examples:

```text
Check whether this report is missing any key points.
```

```text
Convert this receipt image into a table.
```

```text
/help
```

## 2. Beginner Example

If you want to start a conversation with an agent, follow these steps:

1. Choose an agent in area ①, such as DesireCore or Data Analyst.
2. Enter your question or task in area ③.
3. Click the paper plane button to send the message.
4. View the agent's reply, task progress, or generated result in area ②.
5. If the result is incomplete, continue adding requirements in area ③.

**Key Reminder**

For first-time use, remember these three positions:

| Position | Purpose |
|---|---|
| ① | Choose an agent or historical conversation |
| ② | View replies, task results, and reports |
| ③ | Send messages, upload files, and use commands |

Once you understand these three areas, you can complete most basic conversations and task operations.

## 3. Resource Manager

The Resource Manager is used to centrally view and manage different types of resources in DesireCore, including agents, skills, automation tasks, workflows, compute services, email accounts, storage, and code repositories.

![Resource Manager](/img/user-guide/feature-entry/resource-manager.png)

Click the “folder” icon in the left navigation bar to enter the Resource Manager page.

The numbers 1 to 8 in the Resource Manager page represent the following functions:

| No. | Function | Purpose |
|---|---|---|
| ① | Agents | View and manage agents in the current system, including online status, recently active agents, and total agent count |
| ② | Skills | View enabled skills and tool capabilities, such as creating agents, deleting agents, and brainstorming |
| ③ | Automation | View and manage scheduled tasks, recurring tasks, and automatically triggered tasks |
| ④ | Workflows | View and manage workflows that combine multiple steps into reusable processes |
| ⑤ | Compute | View available AI services, model services, or compute resources |
| ⑥ | Emails | View connected email accounts for email synchronization, sending, or related automation tasks |
| ⑦ | Storage | View and manage storage connections for file saving, reading, or external storage integration |
| ⑧ | Code Hosting / Repositories | View connected code repositories, such as GitHub repositories, for code-related tasks |

### ① Agents

The “Agents” card shows the agents available in the current system. Users can view the number of agents, their online status, and recently active agents.

Suitable scenarios:

| Scenario | Description |
|---|---|
| Find a professional assistant | See which agents are currently available |
| Check availability | Use the green status dot to confirm whether an agent is available |
| Enter agent management | Click the card or arrow to open the detailed agent list |

### ② Skills

The “Skills” card shows the capabilities enabled in the system. A skill can be understood as a tool or operation capability that agents can call.

Common skills include:

| Skill Type | Purpose |
|---|---|
| Create agent | Create a new professional agent based on requirements |
| Delete agent | Delete agents that are no longer needed |
| Brainstorming | Help generate ideas, options, or plans |
| File and data processing | Help read, organize, or generate file content |

### ③ Automation

The “Automation” card is used to view scheduled or recurring tasks. In the screenshot, there is a “Daily invoice auto-recognition task”, which means the system will run it automatically at the specified time.

Suitable scenarios:

| Scenario | Example |
|---|---|
| Scheduled reminder | Remind me to attend a meeting every day at 9:00 AM |
| Recurring execution | Automatically recognize invoices every day |
| Regular check | Check system status or data changes at regular intervals |

### ④ Workflows

“Workflows” combine multiple steps into a repeatable process. They are suitable for fixed procedures, multi-step tasks, or tasks that require multiple agents to collaborate.

Example:

```text
Collect webpage materials → Organize the table → Generate a report → Send an email
```

If there is no workflow yet, the page displays that no workflow is available. Later, you can create and manage workflows through AI in a conversation.

### ⑤ Compute

The “Compute” card shows the currently available AI services or model resources, such as DeepSeek, Kimi, and MiniMax Coding Plan.

Users usually do not need to configure compute manually. You only need to enter this area when switching models, adjusting capability sources, or checking service status.

### ⑥ Emails

The “Emails” card shows connected email accounts. After an email account is connected, the system can work with agents to complete email-related tasks.

Suitable scenarios:

| Scenario | Description |
|---|---|
| Email notification | Send task results or reminders by email |
| Email synchronization | Read or synchronize content from a specified mailbox |
| Email automation | Process emails regularly together with automation tasks |

### ⑦ Storage

The “Storage” card is used to manage file storage connections. If external storage is connected, the system can read, save, or synchronize related files.

Suitable scenarios:

| Scenario | Description |
|---|---|
| Save task results | Save reports, tables, or images to a specified location |
| Read materials | Read files from storage for agents to process |
| Connect external space | Integrate cloud storage or other file systems |

### ⑧ Code Hosting

The “Code Hosting” card shows connected code repositories, such as GitHub. Once connected, agents can help process code, repository files, and development tasks.

Suitable scenarios:

| Scenario | Description |
|---|---|
| Check repository connection | Confirm whether GitHub or other code platforms are connected |
| Handle code tasks | Let agents read, analyze, or modify code |
| Project collaboration | Use it together with website generation, automation, or workflow tasks |

For beginners, focus first on three Resource Manager entries: Agents, Skills, and Automation. Agents determine “who does the work”, Skills determine “what can be done”, and Automation determines “when it runs”.

## 4. Applications & Services

The Applications & Services module provides platform-level configuration and management features, helping you connect external AI services, integrate third-party tools, and manage platform extensions.

![Applications & Services](/img/user-guide/feature-entry/app-service.png)

Click the "Applications & Services" icon in the left navigation bar to enter the Applications & Services page.

### Core Entry Points

The main functions on the Applications & Services page include:

| No. | Function | Purpose |
|---|---|---|
| ① | Compute | Configure AI model providers and API keys, such as OpenAI, Alibaba Cloud, DeepSeek, etc. |
| ② | MCP Services | Manage external tool and service integrations, such as Chrome DevTools, file systems, etc. |
| ③ | Marketplace | Browse and install platform extension plugins to expand agent capabilities |

### Configuration Flow

#### 1. Configure Compute Services

When using DesireCore for the first time, you need to configure at least one compute service for agents to work properly:

1. Navigate to "Applications & Services" → "Compute"
2. Click "Add Provider" or "Configure"
3. Select a model provider (e.g., OpenAI, Alibaba Cloud, DeepSeek, etc.)
4. Enter your API key and save
5. Select the corresponding model in agent conversations to start using it

> 💡 We recommend configuring multiple providers so the system can automatically switch when one service is unavailable.

#### 2. Manage MCP Services

MCP (Model Context Protocol) services allow agents to connect to and use external tools:

1. Navigate to "Applications & Services" → "MCP Services"
2. View the list of connected MCP services
3. Enable or disable specific MCP services as needed
4. Adding new MCP services requires providing configuration details

#### 3. Browse the Marketplace

The marketplace provides various extension features:

| Type | Description |
|---|---|
| Document Processing | Support for generating and parsing Word, PDF, Excel, PPT, and other document formats |
| Image Generation | Support for text-to-image, image editing, and other AI drawing features |
| Text-to-Speech | Support for converting text to speech with multiple voice options |
| Video Generation | Support for text-to-video, image-to-video, and other features |
| Email Management | Support for multi-mailbox send/receive, rule configuration, and more |

### Common Navigation Paths

| Goal | Navigation Path |
|------|----------------|
| Add a model provider | Applications & Services → Compute → Add Provider → Enter Key |
| Enable MCP tools | Applications & Services → MCP Services → Enable desired tools |
| Install a plugin | Applications & Services → Marketplace → Search → Install |
| Switch default model | Applications & Services → Compute → Select Provider → Set as Default |

### Tips for Beginners

When using for the first time, we recommend configuring in the following priority order:

1. **Configure compute first** — Add at least one AI model provider, which is a prerequisite for using agents
2. **Then browse MCP services** — Understand what external tools are available to enhance agent capabilities
3. **Finally explore the marketplace** — Install extension plugins based on your actual needs

> ⚠️ Compute configuration involves sensitive information such as API keys. Please keep them secure and do not share them with others.
