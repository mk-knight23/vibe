import axios from 'axios';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing OPENROUTER_API_KEY' });
    }
    const { model, messages } = req.body || {};
    if (!model || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid payload' });

    const r = await axios.post(
      `${OPENROUTER_BASE}/chat/completions`,
      { model, messages },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers['origin'] || 'http://localhost',
          'X-Title': 'vibe-cli-web',
        },
        timeout: 60000,
      }
    );

    res.status(200).json({ completion: r.data });
  } catch (e) {
    const status = e?.response?.status || 500;
    const data = e?.response?.data || { error: e.message };
    console.error('Chat API error:', status, data);
    res.status(status).json(data);
  }
}
