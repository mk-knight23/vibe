# Splitting into two packages

Goal: publish the CLI to npm and host the web UI separately (e.g., on Vercel).

Option A: Two separate repos
- Repo 1: `vibe-cli` (npm package)
  - Keep only: `cli.cjs`, `tools.cjs`, `package.json`, `README.md`, `LICENSE`
  - Ensure `package.json` has `bin: { "vibe": "cli.cjs" }` and `files` whitelist
  - Publish: `npm publish`
- Repo 2: `vibe-web` (Next.js app)
  - Keep: `pages/`, `next.config.mjs`, `package.json` (web-only scripts)
  - Deploy to Vercel with `OPENROUTER_API_KEY`

Option B: Monorepo (npm workspaces)
- Create structure:
  - `packages/cli` -> move `cli.cjs`, `tools.cjs`, and a minimal `package.json`
  - `apps/web` -> move `pages/`, `next.config.mjs`, and its own `package.json`
- Root `package.json` with `"private": true` and `"workspaces": ["packages/*", "apps/*"]`
- Publish CLI from `packages/cli`: `npm publish`
- Deploy `apps/web` to Vercel

Migration steps (current repo)
1. Create a new repo for CLI and copy files (`cli.cjs`, `tools.cjs`, `README.md`, `LICENSE`, new `package.json`)
2. Create a new repo for the web UI and copy `pages/`, `next.config.mjs`, `README_WEB.md`, plus a web-specific `package.json`
3. Update links in READMEs and set up CI/deploy

Naming
- CLI: `vibe-cli` or `@your-scope/vibe-cli`
- Web: `vibe-web` (deployed at Vercel)
