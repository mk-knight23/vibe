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
