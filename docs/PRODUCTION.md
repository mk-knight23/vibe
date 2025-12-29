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
