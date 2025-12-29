# VIBE Release & Rollback Runbook

## CI/CD Pipeline Overview

```
PR/Push → CI (lint, typecheck, test, build, security, bundle) → Merge
Tag → Release (test, build, publish) → npm/Marketplace/Vercel
```

## Release Process

### 1. Pre-Release Checklist
- [ ] All tests passing locally
- [ ] `npm audit` clean (0 high/critical)
- [ ] Bundle size within limits
- [ ] CHANGELOG updated
- [ ] Version bumped

### 2. Release Commands

```bash
# CLI only
./scripts/release.sh cli patch

# Extension only
./scripts/release.sh extension patch

# All products
./scripts/release.sh all minor

# Push to trigger CI
git push && git push --tags
```

### 3. Version Tags
- CLI: `cli-v9.1.0`
- Extension: `ext-v5.0.2`
- All: `v9.1.0`

## Rollback Procedures

### CLI (npm)

```bash
# 1. Identify bad version
npm view vibe-ai-cli versions --json | tail -5

# 2. Deprecate bad version
npm deprecate vibe-ai-cli@9.1.0 "Critical bug - use 9.0.0"

# 3. Revert code
git revert <bad-commit>
git push

# 4. Publish fix
npm version patch
npm publish
```

### Extension (VS Code Marketplace)

```bash
# 1. Unpublish from marketplace (if critical)
npx @vscode/vsce unpublish mktech.vibe-vscode

# 2. Revert code
git revert <bad-commit>
git push

# 3. Bump version and republish
cd vibe-code
npm version patch
npm run compile
npm run package
npx @vscode/vsce publish -p $VSCE_PAT
```

### Web (Vercel)

```bash
# 1. Rollback in Vercel dashboard
# Or redeploy previous commit

# 2. Revert code
git revert <bad-commit>
git push

# Auto-deploys on push to main
```

### Git Rollback

```bash
# Single commit
git revert <commit-hash>

# Multiple commits
git revert <oldest>^..<newest>

# Hard reset (destructive)
git reset --hard <good-commit>
git push --force  # DANGEROUS

# Create backup first
git branch backup-$(date +%s)
```

## Emergency Contacts

| Issue | Action |
|-------|--------|
| npm publish failed | Check NPM_TOKEN secret |
| Marketplace failed | Check VSCE_PAT secret |
| Vercel failed | Check VERCEL_TOKEN secret |
| Tests failing | Run locally, check CI logs |

## Monitoring

### Post-Release Checks
1. npm: `npm view vibe-ai-cli`
2. Marketplace: Check VS Code extension page
3. Web: Visit https://vibe-ai.vercel.app
4. GitHub: Check release page

### Health Check Script

```bash
./scripts/health-check.sh
```
