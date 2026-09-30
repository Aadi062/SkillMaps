import React, { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  Database,
  ExternalLink,
  Filter,
  Globe2,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Mic,
  MicOff,
  Search,
  Send,
  Settings,
  Settings2,
  ShieldCheck,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "/styles.css";

const categoryList = ["All", "Places", "Food & drink", "Makers", "Living culture"];
const greeting = "Namaskar! I can help you explore the stories in this collection, plan a gentle day out, or suggest questions to ask a local host. What are you curious about?";
const defaultMapTile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed with HTTP ${response.status}.`);
  return payload;
}

function Brand({ footer = false }) {
  return (
    <a className={`brand ${footer ? "footer-brand" : ""}`} href="#discover" aria-label="Goa, Unfolded home">
      <span className="brand-mark">g<span>o</span></span>
      <span className="brand-name">GOA, <b>UNFOLDED</b></span>
    </a>
  );
}

function Eyebrow({ children, light = false }) {
  return <span className={`eyebrow ${light ? "light-eyebrow" : ""}`}><span className="eyebrow-dot" />{children}</span>;
}

function Modal({ label, onClose, className = "", children }) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`app-modal ${className}`} role="dialog" aria-modal="true" aria-label={label}>
        <button className="dialog-close" type="button" onClick={onClose} aria-label={`Close ${label}`}><X size={17} /></button>
        {children}
      </section>
    </div>
  );
}

function ExperienceCard({ experience, index, saved, onOpen, onSave }) {
  return (
    <article className="experience-card" style={{ "--card-index": index }}>
      <button className="card-image-button" type="button" onClick={onOpen} aria-label={`View ${experience.title}`}>
        <img src={experience.image} alt={experience.imageAlt} loading="lazy" />
        <span className="card-category">{experience.category}</span>
        <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      </button>
      <div className="card-body">
        <div className="card-location"><MapPin size={12} /> {experience.district} <span className="card-location-dot">·</span> {experience.duration}</div>
        <button className="card-title-button" type="button" onClick={onOpen}><h3>{experience.title}</h3></button>
        <p className="card-subtitle">{experience.subtitle}</p>
        <div className="card-footer">
          <a className="source-link" href={experience.sourceUrl} target="_blank" rel="noreferrer">{experience.sourceName} <ArrowUpRight size={12} /></a>
          <button className={`save-button ${saved ? "is-saved" : ""}`} type="button" onClick={onSave} aria-label={`${saved ? "Remove from" : "Save to"} saved stories`}>
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ExperienceDetail({ experience, saved, planned, onClose, onSave, onPlan, onVerify }) {
  if (!experience) return null;
  return (
    <Modal label="story details" onClose={onClose} className="detail-dialog">
      <img className="detail-image" src={experience.image} alt={experience.imageAlt} />
      <div className="detail-inner">
        <div className="detail-kicker">{experience.category} <span>·</span> {experience.district}</div>
        <h2>{experience.title}</h2>
        <p className="detail-subtitle">{experience.subtitle}</p>
        <p className="detail-description">{experience.description}</p>
        <div className="detail-tags">{experience.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="detail-duration"><span>TIME TO SET ASIDE</span><b>{experience.duration}</b></div>
        <div className="detail-source">
          <span>START WITH THIS REFERENCE</span>
          <a href={experience.sourceUrl} target="_blank" rel="noreferrer">{experience.sourceName} ↗</a>
          <small>Demo editorial content. Follow the source and confirm details with a local host before travel.</small>
        </div>
        <div className="detail-actions">
          <button className={`save-detail ${saved ? "is-saved" : ""}`} type="button" onClick={onSave}>{saved ? "♥ Saved" : "♡ Save story"}</button>
          <button className="plan-detail" type="button" onClick={onPlan}>{planned ? "✓ In trip plan" : "+ Add to trip plan"}</button>
          <button className="verify-detail" type="button" onClick={() => onVerify(experience.query)}>Cross-check a source ↗</button>
        </div>
      </div>
    </Modal>
  );
}

function LinkedText({ text }) {
  const pieces = text.split(/(https:\/\/[^\s<>()]+)/g);
  return pieces.map((piece, index) => piece.startsWith("https://")
    ? <a key={`${piece}-${index}`} href={piece.replace(/[.,!?]+$/, "")} target="_blank" rel="noreferrer">{piece}</a>
    : <React.Fragment key={index}>{piece}</React.Fragment>);
}

function SourceDialog({ initialQuery, onClose, n8nEnabled }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    setResult(null);
    try {
      setResult(await fetchJson("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal label="source cross-check" onClose={onClose} className="pipeline-dialog">
      <div className="dialog-kicker">LIVE SOURCE CROSS-CHECK <span className="live-dot" /></div>
      <h2>Follow a claim <em>to its source.</em></h2>
      <p className="dialog-intro">The app checks a place or claim against a public reference index, then shows a citation and trace. A match is a research lead, not proof.</p>
      <form className="verify-form" onSubmit={submit}>
        <label htmlFor="verify-query">PLACE OR CLAIM</label>
        <div className="verify-input-row">
          <input id="verify-query" value={query} onChange={(event) => setQuery(event.target.value)} minLength={2} maxLength={120} placeholder="e.g. Fontainhas, Panaji" required />
          <button type="submit" disabled={pending}>{pending ? "Checking…" : "Check source"} <ArrowUpRight size={13} /></button>
        </div>
      </form>
      {error && <p className="request-error" role="alert">{error}</p>}
      {pending && <p className="requesting-state"><span className="spinner" /> Following the source-check pipeline…</p>}
      {result && (
        <div className="verify-result">
          <div className="result-topline">
            <span className={`result-status ${result.status}`}>{result.status?.replaceAll("_", " ")}</span>
            {result.confidence !== undefined && <span className="result-score">{result.confidence}% term overlap</span>}
          </div>
          {result.reference && <div className="reference-card">
            <span className="reference-label">REFERENCE FOUND</span>
            <h3>{result.reference.title}</h3>
            {result.reference.description && <p className="reference-description">{result.reference.description}</p>}
            <p>{result.reference.excerpt || "No excerpt was supplied by the reference provider."}</p>
            <a href={result.reference.url} target="_blank" rel="noreferrer">Open source to review ↗</a>
          </div>}
          <p className="result-caveat">{result.message}</p>
          <details className="trace-details" open>
            <summary>PIPELINE TRACE <span>{n8nEnabled ? "n8n workflow" : "direct reference check"}</span></summary>
            <ol>{result.pipeline?.map((stage, index) => <li key={`${stage.name}-${index}`}><span className={`trace-state ${stage.status}`}>{stage.status}</span>{stage.name}</li>)}</ol>
          </details>
        </div>
      )}
    </Modal>
  );
}

function ResearchDialog({ configuration, onClose }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const research = configuration?.research;
  const ready = Boolean(research?.configured && research?.provider !== "none");

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    setResult(null);
    try {
      setResult(await fetchJson("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal label="research a Goa culture question" onClose={onClose} className="research-dialog">
      <div className="dialog-kicker">SOURCE-GROUNDED RESEARCH <span className={`live-dot ${ready ? "provider-ready" : ""}`} /></div>
      <h2>Go beyond the <em>first search result.</em></h2>
      <p className="dialog-intro">Ask a focused question. Your configured research provider will return a short summary and web sources to inspect. Online research is not local verification.</p>
      <div className={`research-provider-note ${ready ? "ready" : ""}`}>
        <Sparkles size={14} />
        <span>{research?.provider && research.provider !== "none" ? `${research.provider} · ${research.model}` : "Gemini, Claude, or Perplexity"}</span>
        <small>{ready ? "configured" : research?.message || "Set RESEARCH_PROVIDER and the provider key in .env"}</small>
      </div>
      <form className="verify-form" onSubmit={submit}>
        <label htmlFor="research-query">YOUR QUESTION</label>
        <div className="research-input-row">
          <textarea id="research-query" value={query} onChange={(event) => setQuery(event.target.value)} minLength={8} maxLength={1200} rows={3} placeholder="What sources describe how Goan azulejo tile craft is practiced today?" required />
          <button type="submit" disabled={pending}><Search size={15} /> {pending ? "Researching…" : "Research"} <ArrowUpRight size={13} /></button>
        </div>
      </form>
      {error && <p className="request-error" role="alert">{error}</p>}
      {pending && <p className="requesting-state"><span className="spinner" /> Searching sources and preparing a cited summary…</p>}
      {result && <div className="research-result">
        <div className="research-result-meta">{result.provider} · {result.model}</div>
        <p>{result.summary}</p>
        {!!result.sources?.length && <div className="research-sources"><b>SOURCES TO REVIEW</b>{result.sources.map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink size={12} /></a>)}</div>}
        <small>{result.caveat}</small>
      </div>}
    </Modal>
  );
}

function speak(text) {
  if (!("speechSynthesis" in window)) return null;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.96;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

function useSpeechRecognition(onText, onError) {
  const [listening, setListening] = useState(false);
  const recognitionRef = React.useRef(null);
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function toggle() {
    if (!Recognition) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => onText(event.results[0][0].transcript);
    recognition.onerror = (event) => {
      setListening(false);
      onError(`Voice input failed: ${event.error}. You can still type your question.`);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      setListening(false);
      onError(`Voice input could not start: ${error.message}. You can still type your question.`);
    }
  }
  useEffect(() => () => recognitionRef.current?.stop(), []);
  return { supported: Boolean(Recognition), listening, toggle };
}

function GuideDialog({ onClose, configuration }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [speakingId, setSpeakingId] = useState("");
  const scrollRef = React.useRef(null);
  const speech = useSpeechRecognition((text) => setInput((value) => `${value}${value ? " " : ""}${text}`), setError);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, pending, error]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    const transcript = [...history, { role: "user", content: text }];
    setHistory(transcript);
    setInput("");
    setPending(true);
    setError("");
    try {
      const payload = await fetchJson("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: transcript.slice(-9) }),
      });
      setHistory([...transcript, { role: "assistant", content: payload.reply }]);
    } catch (requestError) {
      setHistory(history);
      setInput(text);
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  }

  function reset() {
    if (pending) return;
    window.speechSynthesis?.cancel();
    setHistory([]);
    setInput("");
    setError("");
  }

  const providerLabel = configuration?.agent?.provider
    ? `${configuration.agent.provider}${configuration.agent.model ? ` · ${configuration.agent.model}` : ""}`
    : "Checking configured provider…";
  const providerReady = Boolean(configuration?.agent?.available);

  return (
    <Modal label="Goa local guide" onClose={onClose} className="guide-dialog">
      <div className="guide-header">
        <div className="guide-avatar" aria-hidden="true">g<span>o</span></div>
        <div className="guide-title-block">
          <div className="dialog-kicker">GOA, UNFOLDED</div>
          <h2>Your local guide</h2>
          <span className="guide-status"><i className={providerReady ? "available" : ""} />{providerReady ? providerLabel : configuration?.agent?.message || "AI provider needs setup"}</span>
        </div>
        <button className="new-chat-button" type="button" disabled={pending} onClick={reset}>New chat ↺</button>
      </div>
      <p className="guide-disclaimer">A culture-aware discovery assistant. AI suggestions may be incomplete; confirm travel and cultural details with local sources.</p>
      <div className="chat-messages" ref={scrollRef} aria-live="polite">
        {!history.length && <div className="chat-bubble assistant-bubble"><b>Goa, Unfolded</b><p>{greeting}</p></div>}
        {history.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role === "assistant" ? "assistant-bubble" : "visitor-bubble"}`}>
            <b>{message.role === "assistant" ? "Goa, Unfolded" : "You"}</b>
            <p><LinkedText text={message.content} /></p>
            {message.role === "assistant" && "speechSynthesis" in window && <button className="speak-message" type="button" onClick={() => {
              if (speakingId === String(index)) {
                window.speechSynthesis.cancel();
                setSpeakingId("");
              } else {
                setSpeakingId(String(index));
                const utterance = speak(message.content);
                if (utterance) {
                  utterance.onend = () => setSpeakingId("");
                  utterance.onerror = () => setSpeakingId("");
                }
              }
            }} aria-label="Read guide response aloud"><Volume2 size={13} /></button>}
          </div>
        ))}
        {pending && <div className="chat-bubble assistant-bubble chat-pending"><span className="spinner" /> Consulting the configured agent…</div>}
      </div>
      {error && <div className="guide-error" role="status">{error}</div>}
      <form className="chat-form" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="chat-input">Ask the local guide</label>
        <textarea id="chat-input" value={input} onChange={(event) => setInput(event.target.value)} rows={2} maxLength={1200} placeholder="Ask about places, food, makers or local traditions…" required />
        <div className="chat-actions">
          {speech.supported && <button className={`voice-button ${speech.listening ? "listening" : ""}`} type="button" onClick={speech.toggle} aria-label={speech.listening ? "Stop voice input" : "Start voice input"}>{speech.listening ? <MicOff size={15} /> : <Mic size={15} />}</button>}
          <button className="chat-send" type="submit" disabled={pending || !input.trim()} aria-label="Send message"><Send size={15} /></button>
        </div>
      </form>
      <div className="chat-footnote"><span>{speech.supported ? "BROWSER VOICE INPUT · DEVICE TTS" : "LOCAL PROVIDER · DEVICE TTS"}</span><span>UP TO 1,200 CHARACTERS</span></div>
    </Modal>
  );
}

function MapPanel({ experiences: places, onOpen }) {
  const mapped = places.filter((place) => Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
  const center = [15.42, 73.91];
  const tileUrl = import.meta.env.VITE_MAP_TILE_URL || defaultMapTile;
  return (
    <div className="map-layout">
      <div className="map-shell">
        <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="goa-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
          />
          {mapped.map((place) => (
            <CircleMarker key={place.id} center={[place.latitude, place.longitude]} radius={9} pathOptions={{ color: "#f8f5ee", weight: 3, fillColor: "#49634d", fillOpacity: 0.96 }}>
              <Tooltip direction="top" offset={[0, -6]}>{place.title}</Tooltip>
              <Popup>
                <div className="map-popup"><b>{place.title}</b><span>{place.mapArea || `${place.district} · approximate`}</span><button type="button" onClick={() => onOpen(place)}>Read story ↗</button></div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        <div className="map-disclaimer"><MapPin size={13} /> Approximate story regions, not host addresses</div>
      </div>
      <div className="map-story-list">
        <div className="map-list-heading"><Compass size={15} /><span>EXPLORE THE MAP</span></div>
        {places.map((place) => <button className="map-story-item" type="button" key={place.id} onClick={() => onOpen(place)}>
          <span><b>{place.title}</b><small>{place.mapArea || place.district}</small></span><ArrowUpRight size={14} />
        </button>)}
      </div>
    </div>
  );
}

function IntegrationStatus({ configuration, onShow }) {
  const services = [
    { name: "AI guide", value: configuration?.agent?.available ? `${configuration.agent.provider} configured` : "Setup required", connected: Boolean(configuration?.agent?.available), icon: Sparkles },
    { name: "n8n", value: configuration?.n8n?.configured ? "Webhook configured" : "Optional · direct check", connected: Boolean(configuration?.n8n?.configured), icon: Settings2 },
    { name: "Database", value: configuration?.database?.source || "Editorial demo", connected: Boolean(configuration?.database?.configured), icon: Database },
    { name: "Map", value: "OpenStreetMap", connected: true, icon: MapIcon },
  ];
  return (
    <div className="integration-strip">
      {services.map(({ name, value, connected, icon: Icon }) => <div className="integration-pill" key={name}>
        <Icon size={14} />
        <span><b>{name}</b><small>{value}</small></span>
        <i className={connected ? "online" : ""} />
      </div>)}
      <button className="stack-details-button" type="button" onClick={onShow}>Stack details <ArrowUpRight size={12} /></button>
    </div>
  );
}

function StackDialog({ configuration, onClose }) {
  const agent = configuration?.agent;
  const research = configuration?.research;
  const openclawReady = agent?.provider === "openclaw" && agent.available;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSynthesisAvailable = "speechSynthesis" in window;
  const speechStatus = SpeechRecognition && speechSynthesisAvailable
    ? "Speech input + output available"
    : SpeechRecognition
      ? "Speech input available · no device output"
      : speechSynthesisAvailable
        ? "Text-to-speech available · no speech input"
        : "Unavailable in this browser";
  const rows = [
    ["React + Vite", "UI / dev server", "Active"],
    ["Hermes / Gemini / OpenRouter / Groq / Hugging Face", "AI provider adapters", agent?.available ? `${agent.provider} · ready` : `${agent?.provider || "AI provider"} · setup required`],
    ["OpenClaw Gateway", "Optional OpenAI-compatible endpoint", openclawReady ? "Gateway reachable" : configuration?.openclaw?.configured ? "Configured · not active" : "Not configured"],
    ["Research providers", "Gemini Search / Claude Web Search / Perplexity", research?.provider === "none" ? "No provider selected" : research?.configured ? `${research.provider} configured` : `${research?.provider || "Provider"} · API key required`],
    ["n8n Local", "Source-check orchestration", configuration?.n8n?.configured ? "Webhook configured" : "Wikimedia fallback active"],
    ["PostgreSQL / Supabase", "Published story storage", configuration?.database?.configured ? "Connection configured" : "Editorial demo data active"],
    ["OpenStreetMap", "Leaflet map tiles", "Active"],
    ["Browser Speech API", "Speech-to-text + device text-to-speech", speechStatus],
    ["AR / XR", "Future experience layer", "Roadmap · not enabled"],
    ["MCP / OpenClaw tools", "Optional agent ecosystem", "Disabled · no tool permissions granted"],
  ];
  return (
    <Modal label="platform and integrations" onClose={onClose} className="stack-dialog">
      <div className="dialog-kicker">SYSTEM ARCHITECTURE</div>
      <h2>A local-first stack, <em>with clear boundaries.</em></h2>
      <p className="dialog-intro">Local features and fallbacks work without extra setup. External providers need credentials or services; their status is shown honestly here.</p>
      <div className="stack-list">{rows.map(([name, role, status]) => <div className="stack-row" key={name}>
        <span><b>{name}</b><small>{role}</small></span><span>{status}</span>
      </div>)}</div>
      <p className="stack-security-note"><ShieldCheck size={15} /> OpenClaw/MCP is not granted broad shell, filesystem, or deployment access by default. Connect a separately permissioned gateway if needed.</p>
      {configuration?.agent?.error && <p className="request-error">{configuration.agent.error}</p>}
    </Modal>
  );
}

function App() {
  const [experiences, setExperiences] = useState([]);
  const [configuration, setConfiguration] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [appView, setAppView] = useState("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [district, setDistrict] = useState("All");
  const [view, setView] = useState("grid");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("goa-unfolded-saved") || "[]")); } catch { return new Set(); }
  });
  const [itinerary, setItinerary] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("goa-unfolded-itinerary") || "[]")); } catch { return new Set(); }
  });
  const [detail, setDetail] = useState(null);
  const [sourceQuery, setSourceQuery] = useState(null);
  const [researchOpen, setResearchOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.all([fetchJson("/api/experiences"), fetchJson("/api/config")])
      .then(([content, status]) => {
        setExperiences(content.experiences || []);
        setConfiguration(status);
      })
      .catch((error) => setLoadError(error.message));
  }, []);

  useEffect(() => {
    localStorage.setItem("goa-unfolded-saved", JSON.stringify([...saved]));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("goa-unfolded-itinerary", JSON.stringify([...itinerary]));
  }, [itinerary]);

  const districts = useMemo(() => [...new Set(experiences.map((item) => item.district))], [experiences]);
  const visible = useMemo(() => experiences.filter((item) => {
    const text = [item.title, item.subtitle, item.description, item.category, item.district, ...(item.tags || [])].join(" ").toLocaleLowerCase();
    return (!query || text.includes(query.toLocaleLowerCase()))
      && (category === "All" || item.category === category)
      && (district === "All" || item.district === district)
      && (!savedOnly || saved.has(item.id));
  }), [experiences, query, category, district, savedOnly, saved]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setAppView("discover");
        setSavedOnly(false);
        window.setTimeout(() => document.querySelector(".workspace-search input")?.focus(), 0);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function toggleSaved(experience) {
    const removing = saved.has(experience.id);
    setSaved((previous) => {
      const next = new Set(previous);
      if (removing) next.delete(experience.id);
      else next.add(experience.id);
      return next;
    });
    setToast(removing ? "Removed from your saved stories." : "Story saved for later.");
  }

  function resetFilters() {
    setCategory("All");
    setDistrict("All");
    setQuery("");
    setSavedOnly(appView === "saved");
  }

  function openSource(value = "") {
    setDetail(null);
    setSourceQuery(value);
  }

  function toggleItinerary(experience) {
    const removing = itinerary.has(experience.id);
    setItinerary((previous) => {
      const next = new Set(previous);
      if (removing) next.delete(experience.id);
      else next.add(experience.id);
      return next;
    });
    setToast(removing ? "Removed from your trip plan." : "Added to your trip plan.");
  }

  function goToView(nextView) {
    setAppView(nextView);
    setSavedOnly(nextView === "saved");
    if (nextView === "map") setView("map");
    else if (nextView === "discover" || nextView === "home") setView("grid");
    setQuery("");
    setCategory("All");
    setDistrict("All");
  }

  const isDiscoverView = ["discover", "map", "saved"].includes(appView);
  const pageTitles = {
    home: ["Good morning, explorer", "A thoughtful way to find your Goa."],
    discover: ["Discover Goa", "Find a place, maker, flavour or tradition."],
    map: ["Explore the map", "Browse story areas across Goa."],
    saved: ["Your saved stories", "A small collection to come back to."],
    itinerary: ["Your trip plan", "Put together a slower, more thoughtful day."],
  };
  const currentPage = pageTitles[appView] || pageTitles.home;

  return (
    <div className="workspace">
      <aside className="app-sidebar">
        <Brand />
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          {[
            ["home", "Overview", LayoutDashboard],
            ["discover", "Discover", Compass],
            ["map", "Map explorer", MapIcon],
            ["saved", "Saved stories", Bookmark],
            ["itinerary", "My trip plan", CalendarDays],
          ].map(([id, label, Icon]) => <button key={id} className={`sidebar-link ${appView === id ? "active" : ""}`} type="button" onClick={() => goToView(id)}>
            <Icon size={17} /><span>{label}</span>{id === "saved" && saved.size > 0 && <small>{saved.size}</small>}{id === "itinerary" && itinerary.size > 0 && <small>{itinerary.size}</small>}
          </button>)}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-section-label">YOUR COMPANION</div>
        <button className="sidebar-link" type="button" onClick={() => setGuideOpen(true)}><MessageCircle size={17} /><span>Ask the local guide</span><span className={`sidebar-status ${configuration?.agent?.available ? "connected" : ""}`} /></button>
        <button className="sidebar-link" type="button" onClick={() => setResearchOpen(true)}><Sparkles size={17} /><span>Research a question</span></button>
        <div className="sidebar-spacer" />
        <div className="sidebar-demo-note"><span className="demo-note-icon"><Globe2 size={15} /></span><div><b>Local stories, thoughtfully.</b><small>Sample collection · Goa, India</small></div></div>
        <button className="sidebar-link sidebar-settings" type="button" onClick={() => setStackOpen(true)}><Settings size={17} /><span>Connections & setup</span></button>
        <div className="sidebar-profile"><span className="profile-avatar">G</span><span><b>Guest explorer</b><small>Local workspace</small></span><ChevronDown size={14} /></div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="breadcrumbs"><span>Goa, Unfolded</span><ChevronRight size={14} /><b>{appView === "home" ? "Overview" : currentPage[0]}</b></div>
          <div className="workspace-top-actions">
            <span className="workspace-location"><MapPin size={14} /> Goa, India</span>
            <button className="workspace-icon-button" type="button" onClick={() => setStackOpen(true)} aria-label="Connections and setup"><Settings2 size={17} /></button>
            <button className="top-guide-button" type="button" onClick={() => setGuideOpen(true)}><Sparkles size={14} /> Ask your guide</button>
          </div>
        </header>

        <main className="workspace-content">
          <div className="page-heading">
            <div><span className="page-overline">{appView === "home" ? "YOUR GOA, AT YOUR OWN PACE" : "GOA · DISCOVERY WORKSPACE"}</span><h1>{currentPage[0]}</h1><p>{currentPage[1]}</p></div>
            <div className="heading-actions">
              {appView === "home" && <button className="primary-action" type="button" onClick={() => goToView("discover")}><Compass size={15} /> Explore stories <ArrowUpRight size={14} /></button>}
              <button className="secondary-action" type="button" onClick={() => setStackOpen(true)}><span className={`status-indicator ${configuration?.agent?.available ? "active" : ""}`} />{configuration?.agent?.available ? `${configuration.agent.provider} ready` : "Demo mode"}<ChevronDown size={13} /></button>
            </div>
          </div>

          {appView === "home" && <>
            <section className="welcome-banner">
              <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1500&q=85" alt="" />
              <div className="welcome-banner-shade" />
              <div className="welcome-banner-content"><span>✳ &nbsp; THE LOCAL EDIT</span><h2>Find the Goa<br />that <em>stays with you.</em></h2><p>Small places. Living traditions. Stories worth following.</p><button type="button" onClick={() => goToView("discover")}>Start exploring <ArrowUpRight size={14} /></button></div>
              <div className="welcome-banner-foot"><span>15°29′ N &nbsp; 73°49′ E</span><span>01 — A PLACE, MANY STORIES</span></div>
            </section>
            <section className="dashboard-stats">
              <div><span className="stat-icon"><Compass size={16} /></span><span><small>STORIES TO EXPLORE</small><b>{experiences.length || "—"}</b></span></div>
              <div><span className="stat-icon peach"><Bookmark size={16} /></span><span><small>YOUR SAVED STORIES</small><b>{saved.size}</b></span></div>
              <div><span className="stat-icon blue"><MapPin size={16} /></span><span><small>GOAN DISTRICTS</small><b>{districts.length || "—"}</b></span></div>
              <div><span className="stat-icon gold"><Sparkles size={16} /></span><span><small>YOUR TRIP PLAN</small><b>{itinerary.size} <small className="stat-suffix">STORIES</small></b></span></div>
            </section>
            <section className="dashboard-section">
              <div className="dashboard-section-heading"><div><span className="page-overline">CURATED FOR THE CURIOUS</span><h2>Where will you <em>wander?</em></h2></div><button type="button" onClick={() => goToView("discover")}>All stories <ArrowUpRight size={13} /></button></div>
              <div className="dashboard-story-grid">{experiences.slice(0, 3).map((experience, index) => <ExperienceCard key={experience.id} experience={experience} index={index} saved={saved.has(experience.id)} onOpen={() => setDetail(experience)} onSave={() => toggleSaved(experience)} />)}</div>
            </section>
            <section className="dashboard-bottom-grid">
              <button className="guide-promo-card" type="button" onClick={() => setGuideOpen(true)}><span className="promo-icon"><MessageCircle size={17} /></span><span><small>YOUR LOCAL COMPANION</small><b>Have a question?<br />Start a conversation.</b><em>Ask the local guide <ArrowUpRight size={13} /></em></span><ArrowUpRight className="promo-corner" size={16} /></button>
              <div className="trust-summary-card"><div><ShieldCheck size={17} /><span>FOLLOW THE STORY</span></div><b>Every reference is a place to begin.</b><p>See where a story comes from, then use your own judgment and local knowledge.</p><button type="button" onClick={() => openSource("Fontainhas Panaji Goa")}>Try a source check <ArrowUpRight size={13} /></button></div>
            </section>
          </>}

          {isDiscoverView && <>
            <section className="discover-toolbar">
              <label className="workspace-search"><Search size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, flavours, makers…" autoComplete="off" /><kbd>⌘ K</kbd></label>
              <button className="research-open-button" type="button" onClick={() => setResearchOpen(true)}><Sparkles size={14} /> Research</button>
              <span className="source-mode-pill"><span className="status-indicator active" />{configuration?.database?.configured ? "Connected collection" : "Sample collection"}</span>
            </section>
            <section className="discover-panel">
              <div className="discover-controls">
                <div className="category-filters" aria-label="Filter by category">{categoryList.map((item) => <button key={item} className={`filter-chip ${category === item ? "active" : ""}`} type="button" onClick={() => setCategory(item)}>{item}</button>)}</div>
                <label className="district-select-wrap"><span className="sr-only">Filter by district</span><MapPin size={13} /><select value={district} onChange={(event) => setDistrict(event.target.value)}><option value="All">All Goa</option>{districts.map((name) => <option value={name} key={name}>{name}</option>)}</select><ChevronDown size={13} /></label>
              </div>
              <div className="discover-results-bar"><span>{visible.length} {visible.length === 1 ? "story" : "stories"}{savedOnly ? " saved" : ""}</span><div><button className={`view-toggle ${view === "grid" ? "active" : ""}`} type="button" onClick={() => { setView("grid"); setAppView(appView === "map" ? "discover" : appView); }}><Filter size={13} /> Grid</button><button className={`view-toggle ${view === "map" ? "active" : ""}`} type="button" onClick={() => { setView("map"); setAppView("map"); }}><MapIcon size={13} /> Map</button>{(category !== "All" || district !== "All" || query || savedOnly) && <button className="text-button" type="button" onClick={resetFilters}>Clear filters</button>}</div></div>
              {loadError && <div className="load-error" role="alert"><b>Could not load stories.</b><span>{loadError}</span><button type="button" onClick={() => window.location.reload()}>Retry</button></div>}
              {!loadError && view === "grid" && <div className="workspace-story-grid">{visible.map((experience, index) => <ExperienceCard key={experience.id} experience={experience} index={index} saved={saved.has(experience.id)} onOpen={() => setDetail(experience)} onSave={() => toggleSaved(experience)} />)}</div>}
              {!loadError && view === "map" && <MapPanel experiences={visible} onOpen={setDetail} />}
              {!loadError && !visible.length && <div className="workspace-empty"><span><Compass size={22} /></span><b>{savedOnly ? "Nothing saved yet" : "No stories match those filters"}</b><p>{savedOnly ? "Save a story you would like to revisit." : "Try a different search or clear a filter."}</p><button type="button" onClick={resetFilters}>Show all stories</button></div>}
            </section>
          </>}

          {appView === "itinerary" && <section className="plan-panel">
            <div className="plan-intro"><span className="plan-intro-icon"><CalendarDays size={19} /></span><div><span className="page-overline">SLOW TRAVEL, YOUR WAY</span><h2>{itinerary.size ? "A little room to wander." : "Your plan starts with a story."}</h2><p>Add places, traditions and makers from Discover. These are ideas, not reservations—confirm every detail locally.</p></div></div>
            {itinerary.size > 0 ? <div className="itinerary-list">{experiences.filter((experience) => itinerary.has(experience.id)).map((experience, index) => <article key={experience.id} className="itinerary-item"><span className="itinerary-number">{String(index + 1).padStart(2, "0")}</span><img src={experience.image} alt="" /><button className="itinerary-story" type="button" onClick={() => setDetail(experience)}><b>{experience.title}</b><small><MapPin size={12} /> {experience.district} · {experience.duration}</small></button><button className="remove-plan-button" type="button" onClick={() => toggleItinerary(experience)} aria-label={`Remove ${experience.title} from plan`}><X size={16} /></button></article>)}</div> : <div className="workspace-empty"><span><Compass size={22} /></span><b>Your trip plan is a blank page.</b><p>Save a few story ideas here, then check details with the people who make Goa special.</p><button type="button" onClick={() => goToView("discover")}>Browse stories <ArrowUpRight size={13} /></button></div>}
            <div className="plan-footer-note"><ShieldCheck size={14} /> This plan is saved in this browser only. It does not book, reserve or contact anyone.</div>
          </section>}

          {appView === "home" && <section className="workspace-info-row"><span><Database size={15} /><b>Collection</b><small>{configuration?.database?.source || "Loading…"}</small></span><span><Sparkles size={15} /><b>Local guide</b><small>{configuration?.agent?.available ? `${configuration.agent.provider} configured` : "Provider setup needed"}</small></span><button type="button" onClick={() => setStackOpen(true)}>Connections <ArrowUpRight size={13} /></button></section>}
        </main>
      </div>

      {detail && <ExperienceDetail experience={detail} saved={saved.has(detail.id)} planned={itinerary.has(detail.id)} onClose={() => setDetail(null)} onSave={() => toggleSaved(detail)} onPlan={() => toggleItinerary(detail)} onVerify={openSource} />}
      {sourceQuery !== null && <SourceDialog initialQuery={sourceQuery} onClose={() => setSourceQuery(null)} n8nEnabled={Boolean(configuration?.n8n?.configured)} />}
      {researchOpen && <ResearchDialog configuration={configuration} onClose={() => setResearchOpen(false)} />}
      {guideOpen && <GuideDialog configuration={configuration} onClose={() => setGuideOpen(false)} />}
      {stackOpen && <StackDialog configuration={configuration} onClose={() => setStackOpen(false)} />}
      {toast && <div className="toast visible" role="status">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
