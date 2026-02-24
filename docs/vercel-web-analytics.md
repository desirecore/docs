---
sidebar_position: 5
---

# Vercel Web Analytics 入门指南

本指南将帮助您在项目中开始使用 Vercel Web Analytics，展示如何启用它、将包添加到项目中、将应用部署到 Vercel 以及在仪表板中查看数据。

**选择您的框架以查看在项目中使用 Vercel Web Analytics 的说明**。

## 前提条件

- 一个 Vercel 账户。如果您还没有，可以[免费注册](https://vercel.com/signup)。
- 一个 Vercel 项目。如果您还没有，可以[创建新项目](https://vercel.com/new)。
- 已安装 Vercel CLI。如果您还没有，可以使用以下命令安装：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-manager">
  <TabItem value="pnpm" label="pnpm">
    ```bash
    pnpm i vercel
    ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
    ```bash
    yarn add vercel
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    npm i vercel
    ```
  </TabItem>
  <TabItem value="bun" label="bun">
    ```bash
    bun add vercel
    ```
  </TabItem>
</Tabs>

## 启用 Web Analytics

在 [Vercel 仪表板](https://vercel.com/dashboard)上，选择您的项目，然后点击 **Analytics** 标签，从对话框中点击 **Enable**。

:::note
启用 Web Analytics 将在下次部署后添加新路由（作用域为 `/_vercel/insights/*`）。
:::

## 添加 `@vercel/analytics` 到您的项目

使用您选择的包管理器，将 `@vercel/analytics` 包添加到您的项目：

<Tabs groupId="package-manager">
  <TabItem value="pnpm" label="pnpm">
    ```bash
    pnpm i @vercel/analytics
    ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
    ```bash
    yarn add @vercel/analytics
    ```
  </TabItem>
  <TabItem value="npm" label="npm">
    ```bash
    npm i @vercel/analytics
    ```
  </TabItem>
  <TabItem value="bun" label="bun">
    ```bash
    bun add @vercel/analytics
    ```
  </TabItem>
</Tabs>

## 集成到您的框架

### Next.js (Pages Router)

`Analytics` 组件是跟踪脚本的包装器，提供与 Next.js 的无缝集成，包括路由支持。

如果您使用 `pages` 目录，请将以下代码添加到主应用文件：

<Tabs groupId="language">
  <TabItem value="tsx" label="TypeScript">
    ```tsx title="pages/_app.tsx" {2,8}
    import type { AppProps } from "next/app";
    import { Analytics } from "@vercel/analytics/next";

    function MyApp({ Component, pageProps }: AppProps) {
      return (
        <>
          <Component {...pageProps} />
          <Analytics />
        </>
      );
    }

    export default MyApp;
    ```
  </TabItem>
  <TabItem value="jsx" label="JavaScript">
    ```jsx title="pages/_app.js" {1,7}
    import { Analytics } from "@vercel/analytics/next";

    function MyApp({ Component, pageProps }) {
      return (
        <>
          <Component {...pageProps} />
          <Analytics />
        </>
      );
    }

    export default MyApp;
    ```
  </TabItem>
</Tabs>

### Next.js (App Router)

`Analytics` 组件是跟踪脚本的包装器，提供与 Next.js 的无缝集成，包括路由支持。

将以下代码添加到根布局：

<Tabs groupId="language">
  <TabItem value="tsx" label="TypeScript">
    ```tsx title="app/layout.tsx" {1,15}
    import { Analytics } from "@vercel/analytics/next";

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <head>
            <title>Next.js</title>
          </head>
          <body>
            {children}
            <Analytics />
          </body>
        </html>
      );
    }
    ```
  </TabItem>
  <TabItem value="jsx" label="JavaScript">
    ```jsx title="app/layout.jsx" {1,11}
    import { Analytics } from "@vercel/analytics/next";

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <head>
            <title>Next.js</title>
          </head>
          <body>
            {children}
            <Analytics />
          </body>
        </html>
      );
    }
    ```
  </TabItem>
</Tabs>

### Remix

`Analytics` 组件是跟踪脚本的包装器，提供与 Remix 的无缝集成，包括路由检测。

将以下代码添加到根文件：

<Tabs groupId="language">
  <TabItem value="tsx" label="TypeScript">
    ```tsx title="app/root.tsx" {9,21}
    import {
      Links,
      LiveReload,
      Meta,
      Outlet,
      Scripts,
      ScrollRestoration,
    } from "@remix-run/react";
    import { Analytics } from "@vercel/analytics/remix";

    export default function App() {
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            <Analytics />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      );
    }
    ```
  </TabItem>
  <TabItem value="jsx" label="JavaScript">
    ```jsx title="app/root.jsx" {9,21}
    import {
      Links,
      LiveReload,
      Meta,
      Outlet,
      Scripts,
      ScrollRestoration,
    } from "@remix-run/react";
    import { Analytics } from "@vercel/analytics/remix";

    export default function App() {
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            <Analytics />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      );
    }
    ```
  </TabItem>
</Tabs>

### Nuxt

`Analytics` 组件是跟踪脚本的包装器，提供与 Nuxt 的无缝集成，包括路由支持。

将以下代码添加到主组件：

<Tabs groupId="language">
  <TabItem value="tsx" label="TypeScript">
    ```vue title="app.vue" {2,6}
    <script setup lang="ts">
    import { Analytics } from '@vercel/analytics/nuxt';
    </script>

    <template>
      <Analytics />
      <NuxtPage />
    </template>
    ```
  </TabItem>
  <TabItem value="jsx" label="JavaScript">
    ```vue title="app.vue" {2,6}
    <script setup>
    import { Analytics } from '@vercel/analytics/nuxt';
    </script>

    <template>
      <Analytics />
      <NuxtPage />
    </template>
    ```
  </TabItem>
</Tabs>

### SvelteKit

`injectAnalytics` 函数是跟踪脚本的包装器，提供与 SvelteKit 的无缝集成，包括路由支持。

将以下代码添加到主布局：

<Tabs groupId="language">
  <TabItem value="ts" label="TypeScript">
    ```ts title="src/routes/+layout.ts"
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";

    injectAnalytics({ mode: dev ? "development" : "production" });
    ```
  </TabItem>
  <TabItem value="js" label="JavaScript">
    ```js title="src/routes/+layout.js"
    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";

    injectAnalytics({ mode: dev ? "development" : "production" });
    ```
  </TabItem>
</Tabs>

### Astro

`Analytics` 组件是跟踪脚本的包装器，提供与 Astro 的无缝集成，包括路由支持。

将以下代码添加到基础布局：

```astro title="src/layouts/Base.astro" {2,10}
---
import Analytics from '@vercel/analytics/astro';
{/* ... */}
---

<html lang="en">
	<head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
	</head>
	<body>
		<slot />
  </body>
</html>
```

:::note
`Analytics` 组件在 `@vercel/analytics@1.4.0` 及更高版本中可用。
如果您使用的是早期版本，则必须在 `astro.config.mjs` 文件中配置 Vercel 适配器的 `webAnalytics` 属性，如下面的代码所示。
更多信息请参阅 [Astro 适配器文档](https://docs.astro.build/en/guides/integrations-guide/vercel/#webanalytics)。
:::

<Tabs groupId="language">
  <TabItem value="ts" label="TypeScript">
    ```ts title="astro.config.mjs" {7-9}
    import { defineConfig } from "astro/config";
    import vercel from "@astrojs/vercel/serverless";

    export default defineConfig({
      output: "server",
      adapter: vercel({
        webAnalytics: {
          enabled: true, // 使用 @vercel/analytics@1.4.0 时设置为 false
        },
      }),
    });
    ```
  </TabItem>
  <TabItem value="js" label="JavaScript">
    ```js title="astro.config.mjs" {7-9}
    import { defineConfig } from "astro/config";
    import vercel from "@astrojs/vercel/serverless";

    export default defineConfig({
      output: "server",
      adapter: vercel({
        webAnalytics: {
          enabled: true, // 使用 @vercel/analytics@1.4.0 时设置为 false
        },
      }),
    });
    ```
  </TabItem>
</Tabs>

### Create React App

`Analytics` 组件是跟踪脚本的包装器，提供与 React 的无缝集成。

:::note
使用纯 React 实现时，没有路由支持。
:::

将以下代码添加到主应用文件：

<Tabs groupId="language">
  <TabItem value="tsx" label="TypeScript">
    ```tsx title="App.tsx" {1,7}
    import { Analytics } from "@vercel/analytics/react";

    export default function App() {
      return (
        <div>
          {/* ... */}
          <Analytics />
        </div>
      );
    }
    ```
  </TabItem>
  <TabItem value="jsx" label="JavaScript">
    ```jsx title="App.jsx" {1,7}
    import { Analytics } from "@vercel/analytics/react";

    export default function App() {
      return (
        <div>
          {/* ... */}
          <Analytics />
        </div>
      );
    }
    ```
  </TabItem>
</Tabs>

### Vue

`Analytics` 组件是跟踪脚本的包装器，提供与 Vue 的无缝集成。

:::note
如果您使用 `vue-router`，路由支持会自动启用。
:::

将以下代码添加到主组件：

<Tabs groupId="language">
  <TabItem value="tsx" label="TypeScript">
    ```vue title="src/App.vue" {2,6}
    <script setup lang="ts">
    import { Analytics } from '@vercel/analytics/vue';
    </script>

    <template>
      <Analytics />
      <!-- your content -->
    </template>
    ```
  </TabItem>
  <TabItem value="jsx" label="JavaScript">
    ```vue title="src/App.vue" {2,6}
    <script setup>
    import { Analytics } from '@vercel/analytics/vue';
    </script>

    <template>
      <Analytics />
      <!-- your content -->
    </template>
    ```
  </TabItem>
</Tabs>

### 纯 HTML

对于纯 HTML 网站，您可以将以下脚本添加到您的 `.html` 文件中：

```html title="index.html"
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

:::note
使用 HTML 实现时，无需安装 `@vercel/analytics` 包。但是，没有路由支持。
:::

### 其他框架

从包中导入 `inject` 函数，它将向您的应用添加跟踪脚本。**这应该只在您的应用中调用一次，并且必须在客户端运行**。

:::note
`inject` 函数不支持路由。
:::

将以下代码添加到主应用文件：

<Tabs groupId="language">
  <TabItem value="ts" label="TypeScript">
    ```ts title="main.ts"
    import { inject } from "@vercel/analytics";

    inject();
    ```
  </TabItem>
  <TabItem value="js" label="JavaScript">
    ```js title="main.js"
    import { inject } from "@vercel/analytics";

    inject();
    ```
  </TabItem>
</Tabs>

## 部署应用到 Vercel

使用以下命令部署您的应用：

```bash
vercel deploy
```

如果您还没有，我们还建议[连接项目的 Git 仓库](https://vercel.com/docs/git#deploying-a-git-repository)，这将使 Vercel 能够在不使用终端命令的情况下部署您对主分支的最新提交。

部署应用后，它将开始跟踪访问者和页面浏览量。

:::note
如果一切设置正确，当您访问任何页面时，应该能够在浏览器的网络选项卡中看到来自 `/_vercel/insights/view` 的 Fetch/XHR 请求。
:::

## 在仪表板中查看数据

部署应用并有用户访问您的网站后，您可以在仪表板中查看数据。

为此，请转到您的[仪表板](https://vercel.com/dashboard)，选择您的项目，然后点击 **Analytics** 标签。

几天的访问后，您将能够通过查看和[过滤](https://vercel.com/docs/analytics/filtering)面板来开始探索数据。

Pro 和 Enterprise 计划用户还可以向其数据添加[自定义事件](https://vercel.com/docs/analytics/custom-events)，以跟踪用户交互，如按钮点击、表单提交或购买。

了解更多关于 Vercel 如何支持 [隐私和数据合规标准](https://vercel.com/docs/analytics/privacy-policy) 与 Vercel Web Analytics。

## 下一步

现在您已经设置好 Vercel Web Analytics，可以探索以下主题以了解更多信息：

- [了解如何使用 `@vercel/analytics` 包](https://vercel.com/docs/analytics/package)
- [了解如何设置自定义事件](https://vercel.com/docs/analytics/custom-events)
- [了解数据过滤](https://vercel.com/docs/analytics/filtering)
- [阅读隐私和合规性](https://vercel.com/docs/analytics/privacy-policy)
- [探索定价](https://vercel.com/docs/analytics/limits-and-pricing)
- [故障排除](https://vercel.com/docs/analytics/troubleshooting)
