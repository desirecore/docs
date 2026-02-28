<p align="center">
  <img src="static/img/icon.png" alt="DesireCore Logo" width="80" />
</p>

<h1 align="center">DesireCore Docs</h1>

<p align="center">
  <a href="https://docs.desirecore.com">docs.desirecore.com</a> · DesireCore 官方文档站
</p>

<p align="center">
  <a href="https://docs.desirecore.com"><img src="https://img.shields.io/website?url=https%3A%2F%2Fdocs.desirecore.com&label=docs" alt="Website"></a>
  <a href="https://github.com/desirecore/docs/actions"><img src="https://img.shields.io/github/actions/workflow/status/desirecore/docs/deploy.yml?label=deploy" alt="Deploy"></a>
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

---

## About

This is the source repository for [DesireCore](https://www.desirecore.com) documentation, built with [Docusaurus 3](https://docusaurus.io/).

DesireCore is a **Delegation OS** — a cross-platform desktop app that gives you an AI companion capable of learning, executing, auditing, and rolling back.

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

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <a href="https://www.desirecore.com">Website</a> · <a href="https://docs.desirecore.com">Docs</a> · <a href="https://github.com/desirecore/docs/issues">Issues</a>
</p>
