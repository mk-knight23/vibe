import axios from 'axios';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

function isFreeModel(model) {
  try {
    if (model?.is_free) return true;
    const pricing = model?.pricing || model?.top_provider?.pricing;
    if (!pricing) return false;
    const nums = [];
    const pushNum = (val) => {
      if (val === undefined || val === null) return;
      if (typeof val === 'string') {
        const n = Number(val.replace(/[^0-9.]/g, ''));
        if (!isNaN(n)) nums.push(n);
      } else if (typeof val === 'number') nums.push(val);
    };
    pushNum(pricing.prompt);
    pushNum(pricing.completion);
    pushNum(pricing.input);
    pushNum(pricing.output);
    return nums.length > 0 && nums.every((n) => n === 0);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing OPENROUTER_API_KEY' });
    }
    const r = await axios.get(`${OPENROUTER_BASE}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 20000,
    });
    const models = r.data?.data || r.data || [];
    const free = models.filter(isFreeModel);
    res.status(200).json({ models: free });
  } catch (e) {
    console.error('Models API error:', e?.response?.status, e?.response?.data || e.message);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
}
