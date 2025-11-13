# Vibe Web (Next.js)

A simple Next.js web UI for chatting with OpenRouter free models using serverless API routes.

Quickstart
1. Set `OPENROUTER_API_KEY` in your environment (server-side only)
2. `npm run dev`
3. Open `http://localhost:3000/chat`

Deploy to Vercel
1. Push repo to GitHub
2. Import on Vercel
3. Add Project Environment Variable `OPENROUTER_API_KEY`
4. Deploy and visit `/chat`

Security
- Do not embed API keys in client code
- `/api/models` and `/api/chat` routes run on the server and proxy requests securely

Notes
- Default model: `z-ai/glm-4.5-air:free`
- Only free models are listed in the model selector
