<p align="center">
  <img src="static/img/icon.png" alt="DesireCore Logo" width="80" />
</p>

<h1 align="center">DesireCore Docs</h1>

<p align="center">
  <a href="https://docs.desirecore.com">docs.desirecore.com</a> · DesireCore 官方文档站
</p>

<p align="center">
  <a href="https://docs.desirecore.com"><img src="https://img.shields.io/website?url=https%3A%2F%2Fdocs.desirecore.com&label=docs" alt="Website"></a>
  <a href="https://docs.desirecore.com"><img src="https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel" alt="Deployed on Vercel"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-green" alt="Code License: MIT"></a>
  <a href="./LICENSE-docs"><img src="https://img.shields.io/badge/docs-Custom%20Terms-lightgrey" alt="Documentation Rights: Custom Terms"></a>
</p>

---

## About

This is the source repository for [DesireCore](https://www.desirecore.com) documentation, built with [Docusaurus 3](https://docusaurus.io/).

DesireCore is a **Agent OS** — a cross-platform desktop app that gives you an AI companion capable of learning, executing, auditing, and rolling back.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm start
```

The dev server runs at `http://localhost:3000` with hot reload.

## Build

```bash
pnpm build
```

Static output is generated in the `build/` directory.

## Deployment

Merging a pull request into `main` or pushing to `main` automatically triggers deployment. Publish through Git and wait for the deployment result; no manual Vercel deployment command is needed.

## Project Structure

```
docs/
├── docs/              # Markdown source (Chinese, default)
├── i18n/en/           # English translations
├── src/
│   ├── css/           # Custom styles (Liquid Glass design system)
│   └── theme/         # Theme overrides
├── static/img/        # Images & favicon
└── docusaurus.config.ts
```

## Internationalization

The site supports **Chinese** (default) and **English**. To start the dev server in English:

```bash
pnpm start -- --locale en
```

To generate translation files:

```bash
pnpm write-translations -- --locale en
```

## Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a feature branch (`git checkout -b feat/my-change`)
3. Commit your changes (`git commit -m 'feat: add something'`)
4. Push to the branch (`git push origin feat/my-change`)
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

### Feature effective versions（生效版本）

Follow the same convention as [AGENTS.md](./AGENTS.md) when writing or revising effective-version notes:

- Normalize existing client-version constraints, including vague wording such as “newer versions” or “clients containing this change.” Add a note to new content only when its feature requires an explicit effective version. Do not force version requirements onto pages that never mentioned them or propagate requirements through related features or links.
- Use a Docusaurus `info` callout titled **生效版本** in Chinese or **Effective version** in English. Write the version as inline code in the form `vX.Y.Z+`; `+` includes the named version and all later versions.
- Keep a documented introduction version. When the effective version is uncertain, use `v10.0.178+`. Do not replace a known version with the default; standing instructions retain `v10.0.179+`.
- Place the callout near the beginning of the relevant page or section and name the affected feature. A constraint on one feature must not imply that every feature on the page requires that version. Keep the callout separate from prose paragraphs and other callouts.
- When both locales already state a constraint for the same feature, their version and feature scope must agree. Do not add a constraint to a translation that had none merely to match formatting.
- Preserve existing development status, installed-package availability, platform, permission, and provider eligibility conditions. An effective-version label does not prove public release or grant authorization.
- Release history, unimplemented plans, OS/runtime requirements, agreement revisions, configuration versions, and example content versions retain their own meaning and numbering.

Use the following format, replacing the example version and feature name as appropriate:

````markdown
:::info 生效版本
`v10.0.178+`（功能名称）。
:::

:::info Effective version
`v10.0.178+` (feature name).
:::
````

Keep this convention and AGENTS.md consistent when updating either file.

## License

- Source code, theme customizations, and project configuration in this repository are licensed under the [MIT License](LICENSE).
- Documentation text and translations under `docs/` and `i18n/` are copyright © 2026 Yunnan Solar Corona Technology Co., Ltd. and are not licensed under MIT.
- Subject to the terms set out in [LICENSE-docs](LICENSE-docs), the documentation content may be copied, republished, distributed, translated, and publicly displayed, but modified versions and derivative works may not be distributed or created without prior written consent.

---

<p align="center">
  <a href="https://www.desirecore.com">Website</a> · <a href="https://docs.desirecore.com">Docs</a> · <a href="https://github.com/desirecore/docs/issues">Issues</a>
</p>
