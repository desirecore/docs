---
sidebar_position: 2
---

# 安装与启动

## 环境要求

- **Node.js** >= 18.0
- **pnpm** >= 10.0
- **Git**

## 安装

```bash
# 克隆项目
git clone https://github.com/desirecore/desirecore.git
cd desirecore

# 安装依赖
pnpm install
```

## 启动

```bash
# 桌面应用（Electron）
pnpm dev

# 仅 Web 版本
pnpm dev:web
```

启动后，你就可以开始与你的 AI Companion 对话了。

## 构建

```bash
# macOS
pnpm build:mac

# Windows
pnpm build:win

# Linux
pnpm build:linux

# Web
pnpm build:web
```
