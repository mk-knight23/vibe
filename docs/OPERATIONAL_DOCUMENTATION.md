# VIBE Operational Documentation

This document consolidates all operational documentation for VIBE products, including production readiness, security guidelines, release procedures, and runbooks.

## Table of Contents

- [Production Readiness](#production-readiness)
- [Security Documentation](#security-documentation)
- [Release Runbook](#release-runbook)

---

## Production Readiness

# VIBE Production Readiness

## Architecture

### Stateless Design
- No local state required for execution
- All state in git or environment variables
- Safe to run in containers/serverless

### Configuration (12-Factor)
All config via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `VIBE_PROVIDER` | megallm | AI provider |
| `VIBE_MODEL` | qwen/qwen3-next-80b-a3b-instruct | Model |
| `VIBE_TIMEOUT` | 60000 | Request timeout (ms) |
| `VIBE_MAX_RETRIES` | 3 | Retry attempts |
| `VIBE_DRY_RUN` | false | Block writes |
| `VIBE_AUDIT` | true | Enable audit log |
| `VIBE_LOG_LEVEL` | info | Log verbosity |

### API Keys
```bash
OPENROUTER_API_KEY=sk-...
MEGALLM_API_KEY=...
AGENTROUTER_API_KEY=...
ROUTEWAY_API_KEY=...
```

## Observability

### Health Check
```typescript
import { getHealthStatus } from './core/health';
const health = await getHealthStatus();
// { status: 'healthy', checks: { config, provider, memory } }
```

### Metrics
```typescript
import { getMetrics } from './core/config';
const metrics = getMetrics();
// { requestCount, errorCount, avgLatency, uptime }
```

### Logging
- Structured JSON logs
- Levels: debug, info, warn, error
- Secrets auto-masked

## Graceful Degradation

### Provider Fallback
```
Primary fails → Retry (3x with backoff) → Fallback provider → Error
```

### Fallback Chain
1. MegaLLM (primary)
2. OpenRouter (fallback)
3. AgentRouter (fallback)
4. Routeway (fallback)

### Offline Mode
- Read operations: Work with cached files
- Write operations: Queue for later
- Git operations: Local only

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| CLI cold start | < 500ms | 115ms ✅ |
| Extension load | < 2s | < 1s ✅ |
| CLI bundle | < 5MB | 1.8MB ✅ |
| Extension bundle | < 500KB | 82KB ✅ |
| Memory limit | < 128MB | ~50MB ✅ |

## Deployment

### npm (CLI)
```bash
npm install -g vibe-ai-cli
```

### Docker
```dockerfile
FROM node:18-alpine
RUN npm install -g vibe-ai-cli
ENV VIBE_PROVIDER=megallm
CMD ["vibe"]
```

### CI Environment
```yaml
env:
  CI: true
  VIBE_PROVIDER: megallm
  MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
```

## Monitoring Checklist

- [ ] Health endpoint responding
- [ ] Error rate < 10%
- [ ] Avg latency < 5s
- [ ] Memory < 128MB
- [ ] At least one provider available

---

## Security Documentation

# VIBE Security Documentation

## Command Governance

### DENY LIST (Never Executed)
| Pattern | Reason |
|---------|--------|
| `rm -rf /` or `~` | Filesystem destruction |
| `mkfs` | Format filesystem |
| `dd if=` | Direct disk write |
| Fork bombs | System crash |
| `chmod 777` | Overly permissive |
| `curl \| sh` | Remote code execution |
| `sudo rm` | Privileged deletion |
| `shutdown/reboot` | System control |
| Write to `/etc/` | System config modification |

### ALLOW LIST (Always Safe)
- Read commands: `ls`, `cat`, `head`, `tail`, `grep`, `find`
- Git read: `git status`, `git log`, `git diff`, `git branch`
- Info: `pwd`, `whoami`, `date`, `which`, `hostname`
- npm read: `npm list`, `npm outdated`, `npm audit`

### APPROVAL REQUIRED (High Risk)
- `npm publish` - Package publication
- `git push --force` - History rewrite
- `git reset --hard` - Destructive reset
- `docker rm` / `kubectl delete` - Container/pod deletion
- `aws ... delete` - Cloud resource deletion
- SQL: `DROP TABLE`, `DELETE FROM`, `TRUNCATE`

## Risk Classification

| Level | Indicator | Operations | Approval |
|-------|-----------|------------|----------|
| Safe | 🟢 | Read-only | None |
| Low | 🟡 | Unknown | Recommended |
| Medium | 🟠 | File modifications | Required |
| High | 🔴 | Destructive operations | Explicit + reason |
| Blocked | ⛔ | Deny list matches | N/A |

## Secret Handling

### Detected Patterns
- OpenAI keys: `sk-...`
- GitHub tokens: `ghp_...`, `gho_...`, `github_pat_...`
- Slack tokens: `xox[baprs]-...`
- AWS keys: `AKIA...`
- JWTs: `eyJ...`
- Bearer tokens
- Password/API key assignments

### Masking Format
- Short secrets (≤8 chars): `***`
- Long secrets: `first4***last4`

## Audit Trail

### Log Location
`.vibe/audit.log`

### Entry Schema
```json
{
  "timestamp": "ISO-8601",
  "action": "shell_command|tool_execution",
  "command": "masked command",
  "riskLevel": "safe|low|medium|high|blocked",
  "approved": true|false,
  "result": "success|failure|blocked",
  "operationType": "read|write|unknown",
  "dryRun": true|false
}
```

## Dry-Run Mode

Enable: `VIBE_DRY_RUN=true` or `--dry-run` flag

Behavior:
- Read operations: Allowed
- Write operations: Blocked with preview
- Audit entries marked with `dryRun: true`

## Test Coverage

| Area | Tests | File |
|------|-------|------|
| Command validation | 61 | `security-hardening.test.ts` |
| Dangerous commands | 15 | `dangerous-commands.spec.ts` |
| Security scanner | 17 | `security-scanner-v2.test.ts` |
| **Total** | **93** | |

## Verification Commands

```bash
# Run security tests
npm run test:security

# Check for vulnerabilities
npm audit --audit-level=high

# Scan for hardcoded secrets
grep -r "sk-\|ghp_\|AKIA" src/ --include="*.ts"
```

---

## Release Runbook

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