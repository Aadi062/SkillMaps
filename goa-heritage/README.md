# Goa, Unfolded

A local-first discovery app for Goa's neighbourhoods, makers, foodways, and living culture. The project is intentionally separate from the existing SkillMap app.

## Quick start

Requires Node.js 20.19+ and npm. Docker Desktop is optional for PostgreSQL/n8n. No API key is required to explore the sample collection.

```powershell
cd goa-heritage
Copy-Item .env.example .env
npm install
npm run dev
```

Open <http://localhost:5173>. Vite serves React and proxies API calls to the local Node service on <http://127.0.0.1:4173>. For a production-style local run, use `npm start` and open <http://127.0.0.1:4173>.

## App features

- React 19 + Vite app workspace with Overview, Discover, Map, Saved Stories, and a browser-local Trip Plan; includes story search, filters, details, and keyboard search (`Ctrl/⌘ K`).
- Interactive Leaflet map with OpenStreetMap tiles. Story markers are approximate editorial regions, not addresses for businesses or community hosts.
- Local guide backed by one configured AI provider: Hermes, Gemini, OpenRouter, Groq, Hugging Face, or an OpenClaw OpenAI-compatible endpoint.
- Optional source-grounded research adapters for Gemini Google Search grounding, Claude Web Search, or Perplexity.
- Source check through a local n8n webhook when configured, otherwise through Wikimedia's public REST search endpoint.
- Optional PostgreSQL/Supabase-backed published-story collection. Without a database, the app serves the six clearly labeled editorial demo stories.
- Browser speech-to-text where supported and device text-to-speech for agent replies.
- AR/XR is a future extension; this app does not present mock overlays as working AR.

## Architecture

```text
React/Vite browser
  ├── /api/experiences ── Node API ── PostgreSQL/Supabase (optional)
  │                                    └── editorial demo data (fallback)
  ├── /api/verify ─────── Node API ── local n8n webhook (optional)
  │                                    └── Wikimedia REST search (fallback)
  ├── /api/agent/chat ─── Node API ── Hermes CLI or configured model API
  └── /api/research ───── Node API ── Gemini / Claude / Perplexity (optional)

Leaflet → OpenStreetMap tiles             Browser → Speech APIs
OpenClaw → optional OpenAI-compatible gateway endpoint
```

The design system is implemented in the app and can be carried into Google Stitch/Figma; those design tools are not runtime dependencies. Emergent and Antigravity/VS Code are development workflow choices rather than deployed services. The current architecture separates UI, API/provider secrets, data, orchestration and optional future AR work so those tools can be used without making the web app depend on them.

## Configure AI providers

Edit `.env`. Provider API keys remain server-side and are not returned by `/api/config`.

```dotenv
AI_PROVIDER=hermes
HERMES_COMMAND=hermes.exe
HERMES_TOOLSETS=web
```

Supported `AI_PROVIDER` values:

| Provider | Configuration |
|---|---|
| `hermes` | Install [NousResearch Hermes Agent](https://github.com/NousResearch/hermes-agent), run `hermes setup --portal`, and make `hermes.exe` available to the account running Node. |
| `gemini` | Set `GEMINI_API_KEY`; optional `AI_MODEL` overrides the default Gemini model. |
| `openrouter` | Set `OPENROUTER_API_KEY`. Optional `OPENROUTER_BASE_URL` and `AI_MODEL`. |
| `groq` | Set `GROQ_API_KEY`. Optional `GROQ_BASE_URL` and `AI_MODEL`. |
| `huggingface` | Set `HUGGINGFACE_API_KEY`. Optional `HUGGINGFACE_BASE_URL` and `AI_MODEL`. |
| `openclaw` | Run an OpenClaw Gateway with an OpenAI-compatible `/v1/chat/completions` route; set `OPENCLAW_BASE_URL`, optional `OPENCLAW_API_KEY`, and `AI_MODEL`. Plain HTTP is accepted only for loopback gateway URLs. |

For example, to use Groq:

```dotenv
AI_PROVIDER=groq
AI_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=your-server-side-key
```

Restart `npm run dev` after changing `.env`. An unconfigured provider returns a clear API error rather than a fake or success-shaped response.

### OpenClaw, MCP and permissions

The app can call a configured OpenClaw-compatible chat endpoint. It does **not** grant OpenClaw, Hermes, or MCP tools unrestricted access to your computer. Hermes defaults to the `web` toolset; don't add terminal, filesystem, or deployment toolsets unless you separately understand and intentionally approve the implications. Keep gateways bound to loopback or put an authenticated, access-controlled gateway in front of remote use.

## Configure source research

Set one `RESEARCH_PROVIDER` and its key:

```dotenv
RESEARCH_PROVIDER=gemini
GEMINI_API_KEY=your-server-side-key
```

Supported providers are `gemini`, `claude`, `perplexity`, and `none`. Claude requires `ANTHROPIC_API_KEY`; Perplexity requires `PERPLEXITY_API_KEY`. `RESEARCH_MODEL` can override the default. Gemini uses Google Search grounding, Claude uses its web-search tool, and Perplexity returns provider citations. These are short, synchronous research requests—not long-running Gemini Deep Research jobs. Research citations are leads to inspect and can be incomplete or stale.

## Start local PostgreSQL and n8n

The supplied Compose file binds both services to localhost. Set unique credentials before starting:

```powershell
Copy-Item .env.example .env
$password = openssl rand -hex 24
$encryptionKey = openssl rand -hex 32
```

Put those generated values into `POSTGRES_PASSWORD` and `N8N_ENCRYPTION_KEY` in `.env`. Then configure a local database URL (the hex password is safe in the URL), for example:

```dotenv
POSTGRES_PASSWORD=replace-with-generated-value
N8N_ENCRYPTION_KEY=replace-with-generated-value
DATABASE_URL=postgresql://goa:replace-with-generated-value@127.0.0.1:5432/goa_heritage
DATABASE_SSL=false
```

Start and seed:

```powershell
docker compose up -d
npm run db:seed
```

n8n is available at <http://localhost:5678>; PostgreSQL is mapped only to `127.0.0.1:5432`. Import `n8n/goa-source-cross-check.json` into n8n and activate it. Then add this to `.env` and restart the app:

```dotenv
N8N_WEBHOOK_URL=http://127.0.0.1:5678/webhook/goa-source-check
```

For a shared or remote n8n deployment, use HTTPS and configure authentication on the n8n Webhook node. Set the matching bearer token as `N8N_WEBHOOK_TOKEN`. The app passes the token server-to-server; it is never sent to the browser.

When `DATABASE_URL` is configured, only rows with `status = 'published'` are served. The seed command creates the schema and inserts demo rows without overwriting rows that already exist. If the configured database is unavailable or not seeded, the API returns an explicit error rather than silently switching to demo data. Supabase works through its PostgreSQL connection string; set `DATABASE_SSL=true` where its connection requires TLS.

## Maps and voice

- Leaflet uses OpenStreetMap tiles by default with attribution. To use a different provider, set `VITE_MAP_TILE_URL` to a tile URL template and rebuild. Any token in a browser tile URL is public: use a restricted browser token, not a server secret.
- Map pins describe broad editorial story areas. They are not maker addresses or verified recommendations.
- Speech-to-text uses the browser's Web Speech API where present; the browser may ask for microphone permission and may use its configured recognition service. Text-to-speech uses the device's speech synthesis. Neither capability is guaranteed in every browser.

## Verify the app

```powershell
npm test
npm run build
```

`/api/health`, `/api/config`, and `/api/agent/status` report runtime configuration without returning API keys. `/api/experiences` reports its data source. The API binds to `127.0.0.1` by default; set `HOST=0.0.0.0` only behind an intentional, protected deployment.

## Trust and data limits

- The six starter cards are editorial demo data, not a live directory of providers.
- Wikipedia matching is a keyword heuristic, not a fact-check, truth score, or official verification. No claim is automatically approved.
- AI and research prompts send visitor text to whichever server-side provider is configured. Do not enter sensitive personal data.
- The app does not scrape websites, publish user submissions, or auto-approve cultural claims.
- Stitch/Figma/Emergent are not connected to this repo at runtime; no design artifacts are included.
