---
sidebar_position: 5
---

# Getting Started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

**Select your framework to view instructions on using the Vercel Web Analytics in your project**.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

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

## Enable Web Analytics in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

:::note
Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.
:::

## Add `@vercel/analytics` to Your Project

Using the package manager of your choice, add the `@vercel/analytics` package to your project:

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

## Integration with Your Framework

### Next.js (Pages Router)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

If you are using the `pages` directory, add the following code to your main app file:

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

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

Add the following code to the root layout:

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

The `Analytics` component is a wrapper around the tracking script, offering a seamless integration with Remix, including route detection.

Add the following code to your root file:

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

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Nuxt, including route support.

Add the following code to your main component:

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

The `injectAnalytics` function is a wrapper around the tracking script, offering more seamless integration with SvelteKit, including route support.

Add the following code to the main layout:

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

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Astro, including route support.

Add the following code to your base layout:

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
The `Analytics` component is available in version `@vercel/analytics@1.4.0` and later.
If you are using an earlier version, you must configure the `webAnalytics` property of the Vercel adapter in your `astro.config.mjs` file as shown in the code below.
For further information, see the [Astro adapter documentation](https://docs.astro.build/en/guides/integrations-guide/vercel/#webanalytics).
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
          enabled: true, // set to false when using @vercel/analytics@1.4.0
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
          enabled: true, // set to false when using @vercel/analytics@1.4.0
        },
      }),
    });
    ```
  </TabItem>
</Tabs>

### Create React App

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with React.

:::note
When using the plain React implementation, there is no route support.
:::

Add the following code to the main app file:

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

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Vue.

:::note
Route support is automatically enabled if you're using `vue-router`.
:::

Add the following code to your main component:

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

### Plain HTML

For plain HTML sites, you can add the following script to your `.html` files:

```html title="index.html"
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

:::note
When using the HTML implementation, there is no need to install the `@vercel/analytics` package. However, there is no route support.
:::

### Other Frameworks

Import the `inject` function from the package, which will add the tracking script to your app. **This should only be called once in your app, and must run in the client**.

:::note
There is no route support with the `inject` function.
:::

Add the following code to your main app file:

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

## Deploy Your App to Vercel

Deploy your app using the following command:

```bash
vercel deploy
```

If you haven't already, we also recommend [connecting your project's Git repository](https://vercel.com/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

:::note
If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.
:::

## View Your Data in the Dashboard

Once your app is deployed, and users have visited your site, you can view your data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Analytics** tab.

After a few days of visitors, you'll be able to start exploring your data by viewing and [filtering](https://vercel.com/docs/analytics/filtering) the panels.

Users on Pro and Enterprise plans can also add [custom events](https://vercel.com/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next Steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/analytics` package](https://vercel.com/docs/analytics/package)
- [Learn how to set up custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/analytics/troubleshooting)
