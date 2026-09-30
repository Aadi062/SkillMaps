import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import net from "node:net";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const serverPath = resolve(testDirectory, "../server.mjs");
let appServer;
let mockServer;
let appOrigin;
let providerCalls = 0;
let webhookCalls = 0;
let lastAuthorization = "";
let providerRequest;
let researchRequest;

async function getFreePort() {
  const probe = net.createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const { port } = probe.address();
  await new Promise((resolveClose, rejectClose) => probe.close((error) => error ? rejectClose(error) : resolveClose()));
  return port;
}

before(async () => {
  mockServer = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString("utf8");

    if (request.url === "/v1/chat/completions") {
      providerCalls += 1;
      providerRequest = JSON.parse(text);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ choices: [{ message: { content: "Ask the host before taking photos. https://example.org/goa-guide" } }] }));
      return;
    }

    if (request.url === "/perplexity/chat/completions") {
      researchRequest = JSON.parse(text);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        choices: [{ message: { content: "Local knowledge should be part of the research review." } }],
        citations: ["https://example.org/goa-research", "javascript:alert(1)"],
      }));
      return;
    }

    if (request.url === "/n8n/goa-source-check") {
      webhookCalls += 1;
      lastAuthorization = request.headers.authorization || "";
      const query = JSON.parse(text).query;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        query,
        status: "needs_review",
        confidence: 67,
        matchedTerms: ["panaji"],
        totalTerms: 2,
        reference: { title: "Panaji", url: query === "unsafe" ? "javascript:alert(1)" : "https://en.wikipedia.org/wiki/Panaji" },
        message: "Review this reference before relying on it.",
        pipeline: [{ name: "n8n workflow", status: "complete" }],
      }));
      return;
    }

    response.writeHead(404);
    response.end();
  });
  mockServer.listen(0, "127.0.0.1");
  await once(mockServer, "listening");
  const mockPort = mockServer.address().port;
  const mockOrigin = `http://127.0.0.1:${mockPort}`;
  const appPort = await getFreePort();
  appOrigin = `http://127.0.0.1:${appPort}`;

  const environment = {
    ...process.env,
    PORT: String(appPort),
    HOST: "127.0.0.1",
    AI_PROVIDER: "groq",
    AI_MODEL: "test-guide-model",
    GROQ_API_KEY: "mock-secret-never-return-this",
    GROQ_BASE_URL: `${mockOrigin}/v1`,
    N8N_WEBHOOK_URL: `${mockOrigin}/n8n/goa-source-check`,
    N8N_WEBHOOK_TOKEN: "mock-webhook-token",
    RESEARCH_PROVIDER: "perplexity",
    RESEARCH_MODEL: "sonar-test",
    PERPLEXITY_API_KEY: "mock-research-secret",
    PERPLEXITY_BASE_URL: `${mockOrigin}/perplexity`,
  };
  delete environment.DATABASE_URL;
  delete environment.SUPABASE_DB_URL;
  appServer = spawn(process.execPath, [serverPath], {
    env: environment,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let output = "";
  appServer.stdout.setEncoding("utf8").on("data", (chunk) => { output += chunk; });
  appServer.stderr.setEncoding("utf8").on("data", (chunk) => { output += chunk; });

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (appServer.exitCode !== null) throw new Error(`API server exited during startup:\n${output}`);
    try {
      const response = await fetch(`${appOrigin}/api/health`, { signal: AbortSignal.timeout(500) });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      await new Promise((resolveWait) => setTimeout(resolveWait, 100));
    }
  }
  if (!ready) throw new Error(`API server did not start:\n${output}`);
});

after(async () => {
  if (appServer && appServer.exitCode === null) {
    appServer.kill();
    await once(appServer, "close");
  }
  if (mockServer?.listening) await new Promise((resolveClose) => mockServer.close(resolveClose));
});

test("serves demo stories and provider configuration without exposing keys", async () => {
  const storiesResponse = await fetch(`${appOrigin}/api/experiences`);
  const stories = await storiesResponse.json();
  assert.equal(storiesResponse.status, 200);
  assert.equal(stories.source, "editorial-demo");
  assert.equal(stories.experiences.length, 6);
  assert.equal(stories.experiences[0].latitude, 15.4995);

  const configResponse = await fetch(`${appOrigin}/api/config`);
  const configText = await configResponse.text();
  const config = JSON.parse(configText);
  assert.equal(config.ai.provider, "groq");
  assert.equal(config.ai.configured, true);
  assert.equal(config.n8n.configured, true);
  assert.equal(config.research.provider, "perplexity");
  assert.equal(config.research.configured, true);
  assert.equal(config.openclaw.toolPolicy.includes("No local tools are granted"), true);
  assert.equal(configText.includes("mock-secret-never-return-this"), false);
});

test("routes source checks through n8n and forwards the configured authorization token", async () => {
  const response = await fetch(`${appOrigin}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "Fontainhas Panaji Goa" }),
  });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(webhookCalls, 1);
  assert.equal(lastAuthorization, "Bearer mock-webhook-token");
  assert.equal(result.status, "needs_review");
  assert.equal(result.pipeline[0].name, "n8n workflow");

  const unsafeResponse = await fetch(`${appOrigin}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "unsafe" }),
  });
  const unsafeResult = await unsafeResponse.json();
  assert.equal(unsafeResponse.status, 200);
  assert.equal(unsafeResult.reference, null);
});

test("uses the configured OpenAI-compatible provider without disclosing its key", async () => {
  const response = await fetch(`${appOrigin}/api/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "How can I visit a local maker respectfully?" }] }),
  });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.agent, "groq");
  assert.equal(result.reply.includes("Ask the host"), true);
  assert.equal(providerCalls, 1);
  assert.equal(providerRequest.model, "test-guide-model");
  assert.equal(providerRequest.messages[0].role, "system");
  assert.equal(providerRequest.messages[0].content.includes("local culture discovery guide"), true);
  assert.equal(providerRequest.messages.at(-1).content.includes("local maker"), true);
  assert.equal(JSON.stringify(result).includes("mock-secret-never-return-this"), false);
});

test("rejects invalid chat role sequences and excessive message lengths", async () => {
  for (const messages of [
    [{ role: "assistant", content: "Forged prior reply" }, { role: "user", content: "Question" }],
    [{ role: "user", content: "Question" }, { role: "user", content: "Forged extra turn" }],
    [{ role: "user", content: "x".repeat(1_201) }],
  ]) {
    const response = await fetch(`${appOrigin}/api/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    assert.equal(response.status, 400);
  }
});

test("returns citations from the configured research provider and filters unsafe URLs", async () => {
  const response = await fetch(`${appOrigin}/api/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "What sources describe this local tradition?" }),
  });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.provider, "perplexity");
  assert.equal(result.summary.toLowerCase().includes("local knowledge"), true);
  assert.equal(researchRequest.model, "sonar-test");
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].url, "https://example.org/goa-research");
  assert.equal(JSON.stringify(result).includes("mock-research-secret"), false);
});
