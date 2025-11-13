# Changelog

## v1.0.2 (2025-11-14)
- Fix GitHub Actions release artifacts to match pkg outputs (cli-linux, cli-macos, cli-win.exe)
- Add smoke test step to Release workflow
- Scaffold Vibe Code CLI v2 entry (bin/vibe.cjs) and libs (lib/openrouter.cjs, lib/agent.cjs)
- Preserve legacy chat (cli.cjs) and add ASCII welcome banner on startup
- Add themes/, plugins/, sessions/ scaffolding
- Update package.json bin, files, dependencies; lock engines to Node >=18

## v1.0.1
- Minor improvements and initial release pipeline
