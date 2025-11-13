// OpenRouter integration with model rotation and vision support
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const fs = require('fs');
const path = require('path');

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://openrouter.ai',
  'X-Title': 'Vibe CLI',
};

const TOP_FREE_MODELS = [
  'tng/deepseek-r1t2-chimera:free',
  'z-ai/glm-4.5-air:free',
  'tng/deepseek-r1t-chimera:free',
  'kwaipilot/kat-coder-pro-v1:free',
  'deepseek/deepseek-v3-0324:free',
  'deepseek/r1-0528:free',
  'qwen/qwen3-coder-480b-a35b:free',
  'google/gemini-2.0-flash-exp:free',
  'google/gemma-3-27b:free',
];

function loadConfig() {
  const home = process.env.HOME || process.env.USERPROFILE || '.';
  const file = path.join(home, '.vibe', 'config.json');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}

function saveConfig(cfg) {
  const home = process.env.HOME || process.env.USERPROFILE || '.';
  const dir = path.join(home, '.vibe');
  try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); } catch {}
  const file = path.join(dir, 'config.json');
  fs.writeFileSync(file, JSON.stringify(cfg, null, 2), 'utf8');
}

function getApiKeyFromConfig() {
  const envKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY;
  if (envKey) return envKey.trim();
  const cfg = loadConfig();
  return cfg?.openrouter?.apiKey || '';
}

function getModelDefaults() {
  const cfg = loadConfig();
  const def = cfg?.openrouter?.defaultModel || 'z-ai/glm-4.5-air:free';
  const list = cfg?.openrouter?.topFreeModels || TOP_FREE_MODELS;
  return { defaultModel: def, topFreeModels: list };
}

async function chatCompletion({ apiKey, model, messages, temperature, maxTokens, thinking }) {
  const key = apiKey || getApiKeyFromConfig();
  if (!key) throw new Error('Missing OpenRouter API key. Set via env OPENROUTER_API_KEY or vibe config set openrouter.apiKey');
  const { topFreeModels } = getModelDefaults();
  const modelOrder = model ? [model, ...topFreeModels.filter(m => m !== model)] : topFreeModels;
  let lastErr;
  for (const mid of modelOrder) {
    try {
      const body = {
        model: mid,
        messages,
        temperature: temperature ?? 0.2,
        max_tokens: maxTokens,
      };
      if (thinking !== undefined) body.reasoning = { effort: thinking ? 'medium' : 'low' };
      const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
        method: 'POST',
        headers: { ...DEFAULT_HEADERS, Authorization: `Bearer ${key}` },
        body: JSON.stringify(body),
      });
      if (res.status === 429) throw new Error('429');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const msg = data?.choices?.[0]?.message || {};
      return { model: mid, message: msg, data };
    } catch (e) {
      lastErr = e;
      if (String(e.message).includes('429')) {
        await new Promise(r => setTimeout(r, (loadConfig()?.core?.rateLimitBackoff) || 5000));
        continue; // rotate to next model
      }
    }
  }
  throw lastErr || new Error('All models failed');
}

async function encodeImageToDataUrl(filePath) {
  const mime = filePath.toLowerCase().endsWith('.png') ? 'image/png'
    : filePath.toLowerCase().match(/\.(jpg|jpeg)$/) ? 'image/jpeg'
    : 'application/octet-stream';
  const buf = fs.readFileSync(filePath);
  const b64 = buf.toString('base64');
  return `data:${mime};base64,${b64}`;
}

module.exports = {
  loadConfig,
  saveConfig,
  getApiKeyFromConfig,
  getModelDefaults,
  chatCompletion,
  encodeImageToDataUrl,
  TOP_FREE_MODELS,
};