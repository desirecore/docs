import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'DesireCore Docs',
  tagline: 'DesireCore 官方文档',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true,
  },

  url: 'https://docs.desirecore.com',
  baseUrl: '/',

  organizationName: 'desirecore',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': { label: '中文' },
      en: { label: 'English' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/desirecore/docs/edit/main/',
          routeBasePath: '/',
          sidebarCollapsible: true,
          sidebarCollapsed: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'DesireCore',
      logo: {
        alt: 'DesireCore Logo',
        src: 'img/icon.png',
      },
      items: [
        // ===== 左侧 =====
        {
          to: '/',
          label: '文档首页',
          position: 'left',
          activeBaseRegex: '^/$',
        },
        {
          to: '/getting-started',
          label: '快速上手',
          position: 'left',
        },
        {
          to: '/user-guide',
          label: '功能指南',
          position: 'left',
        },
        {
          to: '/use-cases',
          label: '应用场景',
          position: 'left',
        },
        {
          to: '/concepts',
          label: '概念解析',
          position: 'left',
        },
        {
          to: '/faq',
          label: '常见问题',
          position: 'left',
        },
        {
          to: '/more',
          label: '更多',
          position: 'left',
        },
        // ===== 右侧 =====
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://www.desirecore.cn',
          label: '官网',
          position: 'right',
          customProps: {
            localeHrefs: {
              en: 'https://www.desirecore.com',
            },
          },
        },
        {
          href: 'https://github.com/desirecore/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            { label: '快速上手', to: '/getting-started' },
            { label: '功能指南', to: '/user-guide' },
            { label: '应用场景', to: '/use-cases' },
          ],
        },
        {
          title: '资源',
          items: [
            { label: '概念解析', to: '/concepts' },
            { label: '更多', to: '/more' },
            { label: '常见问题', to: '/faq' },
          ],
        },
        {
          title: '社区',
          items: [
            { label: '官方网站', href: 'https://www.desirecore.com' },
            { label: '文档仓库', href: 'https://github.com/desirecore/docs' },
          ],
        },
        {
          title: '法律声明',
          items: [
            { label: '隐私政策', to: '/privacy' },
            { label: '使用条款', to: '/terms' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Yunnan Solar Corona Technology Co., Ltd. All rights reserved.`,
    },
    algolia: {
      appId: '68TB6NUYVW',
      apiKey: 'd22553216ab4cff9ec3a7d146b0572c4',
      indexName: 'DesireCore Docs',
      contextualSearch: true,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
