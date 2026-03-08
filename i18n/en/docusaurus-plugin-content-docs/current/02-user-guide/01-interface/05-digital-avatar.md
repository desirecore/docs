---
title: Digital Avatar Interface
description: Learn about DesireCore's 3D Digital Avatar interface, flip interaction, and immersive conversation mode.
keywords: [digital avatar, Digital Human, 3D, flip view, immersive interaction, BackFace]
---

# Digital Avatar Interface

DesireCore provides a unique **3D Digital Avatar interface** — you can "flip" the chat panel over to interact with the Agent's virtual avatar more intuitively.

## Flip View

The main interface uses a **card flip** design:

- **Front Face**: Standard three-column chat interface, the interface you use daily
- **Back Face**: 3D Digital Avatar interface, presenting the Agent from a new perspective

The flip has about a 1-second 3D card flip animation, and the background color changes from light to dark space theme.

## How to Enter the Digital Avatar Interface

There are two ways to enter:

1. **Chat Header Button**: Click the "Immersive Interaction" button (blue label) on the right side of the header
2. **More Menu**: In compact mode, select "Immersive Interaction" from the "More" menu

Click the same button again to flip back to the chat interface.

## Interface Composition

The Digital Avatar interface contains the following core elements:

### 3D Core Orb

A dynamic 3D sphere in the center of the interface is the visualization of the Agent's "consciousness":

- Sphere color changes dynamically with Agent status
- Surrounded by particle shells and glowing rings, creating a sci-fi atmosphere
- Real-time audio waveform below the sphere (displayed during voice interaction)

### Status Panels

Information panels are distributed around the Digital Avatar interface, each identified by a different color:

| Panel | Color | Content |
|------|------|------|
| **Persona** | Cyan | Agent's identity definition and personality traits |
| **Memory** | Purple | Currently active memory entries and associations |
| **Tools** | Green | Available tools and skill list |
| **Activity** | Orange | Operations being performed and status |

### Agent States

The Digital Avatar has four main states, each with unique visual representation:

| State | Color Tone | Description |
|------|---------|------|
| **Idle** | Cyan | Default state, sphere breathes gently |
| **Listening** | Light Cyan | Receiving voice input, waveform animation active |
| **Thinking** | Purple | Processing request, sphere pulsation accelerates |
| **Speaking** | Green | Voice reply in progress, waveform follows speech rhythm |

## Interaction Methods

In the Digital Avatar interface, you can:

- **Text Input**: There is still an input box at the bottom of the interface, you can type to communicate with the Agent
- **Voice Interaction**: Have voice conversations with the Agent through the microphone (voice function needs to be enabled)
- **Real-time Subtitles**: Agent replies are displayed in real-time as subtitles
- **Settings Adjustment**: Adjust the appearance and behavior parameters of the Digital Avatar through the settings panel

:::tip Performance Tip
The 3D Digital Avatar interface uses WebGL rendering. After returning to the chat interface, the 3D scene is automatically unloaded after the flip animation completes, without continuously occupying GPU resources.
:::

:::info Feature Evolution
The Digital Avatar interface currently mainly provides visualized status display and basic voice interaction. Richer interaction capabilities (such as gesture recognition, expression feedback) will be gradually introduced in subsequent versions.
:::
