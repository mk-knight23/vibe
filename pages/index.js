export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Vibe CLI + Web</h1>
      <p>
        This repo includes:
      </p>
      <ul>
        <li>A Node.js CLI that chats with OpenRouter free models</li>
        <li>A Next.js web UI that proxies requests via serverless API routes</li>
      </ul>
      <h2>Quickstart (CLI)</h2>
      <ol>
        <li>Install: <code>npm install</code></li>
        <li>Run the CLI: <code>npm start</code></li>
        <li>Use <code>/help</code> for commands</li>
      </ol>
      <h2>Quickstart (Web)</h2>
      <ol>
        <li>Create an environment variable <code>OPENROUTER_API_KEY</code> in your deployment (server-side only)</li>
        <li>Start dev server locally: <code>npm run dev</code> and open <a href="/chat">/chat</a></li>
        <li>Deploy to Vercel (see steps below)</li>
      </ol>
      <h2>Install the CLI (no npm account)</h2>
      <div style={{display: 'flex', gap: 12}}>
        <button onClick={() => navigator.clipboard.writeText('npm i -g github:your-username/vibe-cli')}>Copy: npm i -g github:your-username/vibe-cli</button>
        <button onClick={() => navigator.clipboard.writeText('npx github:your-username/vibe-cli')}>Copy: npx github:your-username/vibe-cli</button>
      </div>
      <p style={{color:'#666'}}>Replace <code>your-username/vibe-cli</code> with your repo path.</p>

      <h2>Install prebuilt binary</h2>
      <div style={{display: 'flex', gap: 12}}>
        <button onClick={() => navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/your-username/vibe-cli/main/install.sh | bash')}>Copy: curl | bash (macOS/Linux)</button>
      </div>
      <p>Or download Windows exe from Releases.</p>

      <h2>Deploy the web UI</h2>
      <ol>
        <li>Push this repo to GitHub</li>
        <li>Import the repo on Vercel</li>
        <li>Set <code>OPENROUTER_API_KEY</code> as a Project Environment Variable (Production/Preview/Dev)</li>
        <li>Deploy and visit <a href="/chat">/chat</a></li>
      </ol>
      <p style={{color:'#666'}}>Security: Keep your API key server-side only (never in client code).</p>
    </main>
  );
}
