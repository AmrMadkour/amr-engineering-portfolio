import { useState } from "react";

// Six layers, left to right through a typical request:
//   client    → the visitor's browser (locale-aware: en/ar/nl)
//   frontend  → Next.js renders the page, fetching data via ISR
//   backend   → .NET Minimal API, Clean Architecture (Api → Application → Domain, Infrastructure → Application)
//   content   → the "database": JSON + MDX files the backend reads and caches, no DB
//   ai        → the "Ask Amr" chat widget and its Gemini backend, called directly from the browser via SSE
//   infra     → CI/CD and hosting: GitHub Actions gates deploys to Vercel (frontend) and Render (backend), DNS via Cloudflare
// Click any node below to highlight the FLOWS that connect it to other layers.
const LAYERS = {
  client: {
    label: "Client / Browser",
    color: "#6366f1",
    bg: "#1e1b4b",
    border: "#4338ca",
  },
  frontend: {
    label: "Frontend — Next.js 15",
    color: "#0ea5e9",
    bg: "#0c1a2e",
    border: "#0369a1",
  },
  backend: {
    label: "Backend — .NET 10 API",
    color: "#10b981",
    bg: "#052e16",
    border: "#047857",
  },
  content: {
    label: "Content Layer",
    color: "#f59e0b",
    bg: "#1c1004",
    border: "#b45309",
  },
  infra: {
    label: "Infrastructure / CI-CD",
    color: "#a855f7",
    bg: "#1a0a2e",
    border: "#7c3aed",
  },
  ai: {
    label: "AI Layer",
    color: "#ec4899",
    bg: "#2d0a1a",
    border: "#be185d",
  },
};

const NODES = {
  browser: { layer: "client", label: "User Browser", sub: "EN / AR / NL", icon: "🌐" },
  nextjs: { layer: "frontend", label: "Next.js 15 App Router", sub: "TypeScript · Tailwind CSS", icon: "▲" },
  intl: { layer: "frontend", label: "next-intl", sub: "i18n + RTL routing", icon: "🌍" },
  themes: { layer: "frontend", label: "next-themes", sub: "Dark / Light mode", icon: "🎨" },
  framer: { layer: "frontend", label: "Framer Motion", sub: "Animations", icon: "✨" },
  isr: { layer: "frontend", label: "Next.js ISR", sub: "1hr revalidation", icon: "⚡" },
  dotnet: { layer: "backend", label: ".NET 10 Minimal API", sub: "Clean Architecture", icon: "⚙️" },
  domain: { layer: "backend", label: "Domain Layer", sub: "Core models & interfaces", icon: "📦" },
  application: { layer: "backend", label: "Application Layer", sub: "Use cases · FluentValidation", icon: "🔧" },
  infrastructure: { layer: "backend", label: "Infrastructure Layer", sub: "JSON readers · IMemoryCache 15min", icon: "🗄️" },
  api_layer: { layer: "backend", label: "API Layer", sub: "Minimal API endpoints · Scalar/Swagger", icon: "🔌" },
  serilog: { layer: "backend", label: "Serilog", sub: "Structured logging", icon: "📋" },
  json_content: { layer: "content", label: "JSON Content Files", sub: "content/{en,ar,nl}/", icon: "📄" },
  mdx: { layer: "content", label: "MDX Pages", sub: "@next/mdx — compiled at build", icon: "📝" },
  gemini: { layer: "ai", label: "Google Gemini", sub: "Mscc.GenerativeAI · SSE streaming", icon: "🤖" },
  chat_widget: { layer: "ai", label: '"Ask Amr" Chat Widget', sub: "Function calling · auto-detect locale", icon: "💬" },
  github_actions: { layer: "infra", label: "GitHub Actions", sub: "CI: lint · typecheck · build · test", icon: "🔄" },
  vercel: { layer: "infra", label: "Vercel", sub: "Frontend deploy (amrmadkour.com)", icon: "▲" },
  render: { layer: "infra", label: "Render", sub: "Backend .NET API deploy", icon: "☁️" },
  cloudflare: { layer: "infra", label: "Cloudflare", sub: "DNS", icon: "🛡️" },
};

const FLOWS = [
  { from: "browser", to: "nextjs", label: "HTTPS request", type: "primary" },
  { from: "nextjs", to: "isr", label: "ISR fetch", type: "primary" },
  { from: "isr", to: "dotnet", label: "fetch() w/ revalidate", type: "primary" },
  { from: "dotnet", to: "infrastructure", label: "DI pipeline", type: "internal" },
  { from: "infrastructure", to: "json_content", label: "reads + caches", type: "data" },
  { from: "nextjs", to: "mdx", label: "build-time compile", type: "data" },
  { from: "chat_widget", to: "gemini", label: "SSE stream", type: "ai" },
  { from: "gemini", to: "chat_widget", label: "streamed response", type: "ai" },
  { from: "github_actions", to: "vercel", label: "deploy frontend", type: "cicd" },
  { from: "github_actions", to: "render", label: "deploy API", type: "cicd" },
  { from: "cloudflare", to: "vercel", label: "DNS → Vercel", type: "cicd" },
];

const FLOW_COLORS = {
  primary: "#0ea5e9",
  internal: "#10b981",
  data: "#f59e0b",
  ai: "#ec4899",
  cicd: "#a855f7",
};

const ARCH_GROUPS = [
  {
    id: "monorepo",
    label: "npm workspaces Monorepo",
    nodes: ["nextjs", "intl", "themes", "framer", "isr", "dotnet", "domain", "application", "infrastructure", "api_layer", "serilog"],
  },
];

function Badge({ color, label }) {
  return (
    <span
      style={{
        background: color + "22",
        border: `1px solid ${color}55`,
        color: color,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function NodeCard({ nodeKey, onClick, selected }) {
  const node = NODES[nodeKey];
  const layer = LAYERS[node.layer];
  const isSelected = selected === nodeKey;

  return (
    <div
      onClick={() => onClick(nodeKey)}
      style={{
        background: isSelected ? layer.bg : "#0d0d0d",
        border: `1.5px solid ${isSelected ? layer.color : layer.border + "55"}`,
        borderRadius: 8,
        padding: "10px 14px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: isSelected ? `0 0 14px ${layer.color}44` : "none",
        minWidth: 170,
        flex: "1 1 170px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 16 }}>{node.icon}</span>
        <span style={{ color: isSelected ? layer.color : "#e2e8f0", fontWeight: 600, fontSize: 13 }}>
          {node.label}
        </span>
      </div>
      <div style={{ color: "#64748b", fontSize: 11, marginLeft: 22 }}>{node.sub}</div>
    </div>
  );
}

function LayerSection({ layerKey, nodeKeys, selected, onSelect }) {
  const layer = LAYERS[layerKey];
  return (
    <div
      style={{
        border: `1px solid ${layer.border}55`,
        borderRadius: 12,
        padding: "14px 16px",
        background: layer.bg + "88",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          color: layer.color,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: layer.color,
          }}
        />
        {layer.label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {nodeKeys.map((k) => (
          <NodeCard key={k} nodeKey={k} onClick={onSelect} selected={selected} />
        ))}
      </div>
    </div>
  );
}

function FlowLegend() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        padding: "10px 14px",
        background: "#0d0d0d",
        borderRadius: 8,
        border: "1px solid #1e293b",
        marginBottom: 14,
      }}
    >
      <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, alignSelf: "center" }}>DATA FLOWS:</span>
      {Object.entries(FLOW_COLORS).map(([type, color]) => (
        <span key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 2,
              background: color,
              borderRadius: 2,
            }}
          />
          <span style={{ color: "#94a3b8", fontSize: 11, textTransform: "capitalize" }}>{type}</span>
        </span>
      ))}
    </div>
  );
}

function ArrowFlow({ from, to, label, type }) {
  const color = FLOW_COLORS[type];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 10px",
        borderRadius: 6,
        background: color + "0d",
        border: `1px solid ${color}22`,
        fontSize: 12,
      }}
    >
      <span style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }}>{from}</span>
      <span style={{ color: color, fontWeight: 700 }}>→</span>
      <span style={{ color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }}>{to}</span>
      <span
        style={{
          color: "#475569",
          fontSize: 10,
          marginLeft: "auto",
          whiteSpace: "nowrap",
          fontStyle: "italic",
        }}
      >
        {label}
      </span>
    </div>
  );
}

const LAYER_NODE_MAP = {
  client: ["browser"],
  frontend: ["nextjs", "intl", "themes", "framer", "isr"],
  backend: ["dotnet", "domain", "application", "infrastructure", "api_layer", "serilog"],
  content: ["json_content", "mdx"],
  ai: ["gemini", "chat_widget"],
  infra: ["github_actions", "vercel", "render", "cloudflare"],
};

export default function ArchDiagram() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("diagram");

  const handleSelect = (key) => setSelected(selected === key ? null : key);

  const relatedFlows = selected
    ? FLOWS.filter((f) => f.from === selected || f.to === selected)
    : [];

  return (
    <div
      style={{
        background: "#080b10",
        minHeight: "100vh",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        color: "#e2e8f0",
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
              AMR Engineering Portfolio
            </div>
            <div style={{ color: "#475569", fontSize: 12 }}>System Architecture Diagram</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {["Next.js 15", ".NET 10", "Clean Architecture", "Google Gemini", "Vercel + Render"].map((t) => (
            <Badge key={t} color="#6366f1" label={t} />
          ))}
        </div>
        <div style={{ color: "#64748b", fontSize: 12, maxWidth: 640, lineHeight: 1.5 }}>
          Six layers, left to right through a typical request: the visitor's <b style={{ color: "#6366f1" }}>browser</b> hits the{" "}
          <b style={{ color: "#0ea5e9" }}>Next.js frontend</b>, which fetches from the{" "}
          <b style={{ color: "#10b981" }}>.NET backend</b>, which reads the <b style={{ color: "#f59e0b" }}>JSON/MDX content</b> layer
          (no database). The <b style={{ color: "#ec4899" }}>AI layer</b> ("Ask Amr") talks to Gemini directly from the browser over SSE.{" "}
          <b style={{ color: "#a855f7" }}>Infra</b> (GitHub Actions, Vercel, Render, Cloudflare) deploys and hosts everything else.
          Click any node below to highlight its connections.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 16, background: "#0d0d0d", borderRadius: 8, padding: 4, width: "fit-content", border: "1px solid #1e293b" }}>
        {["diagram", "flows"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "#1e293b" : "transparent",
              border: "none",
              color: activeTab === tab ? "#e2e8f0" : "#475569",
              padding: "6px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {tab === "diagram" ? "🗺 Architecture" : "↔ Data Flows"}
          </button>
        ))}
      </div>

      {activeTab === "diagram" && (
        <>
          {Object.entries(LAYER_NODE_MAP).map(([layerKey, nodeKeys]) => (
            <LayerSection
              key={layerKey}
              layerKey={layerKey}
              nodeKeys={nodeKeys}
              selected={selected}
              onSelect={handleSelect}
            />
          ))}

          {selected && relatedFlows.length > 0 && (
            <div
              style={{
                marginTop: 16,
                background: "#0d0d0d",
                borderRadius: 10,
                border: "1px solid #1e293b",
                padding: 14,
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                🔗 Connections for <span style={{ color: "#e2e8f0" }}>{NODES[selected]?.label}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {relatedFlows.map((f, i) => (
                  <ArrowFlow key={i} {...f} />
                ))}
              </div>
            </div>
          )}

          {selected && relatedFlows.length === 0 && (
            <div style={{ marginTop: 10, color: "#475569", fontSize: 12, padding: "8px 14px", background: "#0d0d0d", borderRadius: 8 }}>
              No direct data flows mapped for this node.
            </div>
          )}
        </>
      )}

      {activeTab === "flows" && (
        <div>
          <FlowLegend />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FLOWS.map((f, i) => (
              <ArrowFlow key={i} {...f} />
            ))}
          </div>

          <div style={{ marginTop: 20, background: "#0d0d0d", borderRadius: 10, border: "1px solid #1e293b", padding: 16 }}>
            <div style={{ color: "#94a3b8", fontWeight: 700, fontSize: 12, marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Backend Layer Dependencies (Clean Architecture)
            </div>
            {[
              { from: "Api Layer", to: "Application Layer", note: "calls use cases" },
              { from: "Application Layer", to: "Domain Layer", note: "depends on interfaces" },
              { from: "Infrastructure Layer", to: "Application Layer", note: "implements interfaces" },
            ].map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 10px",
                  borderRadius: 6,
                  marginBottom: 5,
                  background: "#10b98110",
                  border: "1px solid #10b98122",
                }}
              >
                <span style={{ color: "#10b981", fontFamily: "monospace", fontSize: 11 }}>{d.from}</span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>→</span>
                <span style={{ color: "#10b981", fontFamily: "monospace", fontSize: 11 }}>{d.to}</span>
                <span style={{ color: "#475569", fontSize: 10, marginLeft: "auto", fontStyle: "italic" }}>{d.note}</span>
              </div>
            ))}

            <div style={{ color: "#94a3b8", fontWeight: 700, fontSize: 12, marginTop: 16, marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Caching Strategy
            </div>
            {[
              { layer: "Infrastructure (.NET)", cache: "IMemoryCache", ttl: "15 min", color: "#10b981" },
              { layer: "Frontend (Next.js)", cache: "ISR revalidation", ttl: "1 hour", color: "#0ea5e9" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  marginBottom: 5,
                  background: c.color + "10",
                  border: `1px solid ${c.color}22`,
                }}
              >
                <span style={{ color: c.color, fontSize: 11, fontWeight: 600 }}>{c.layer}</span>
                <span style={{ color: "#475569", fontSize: 11 }}>→</span>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{c.cache}</span>
                <Badge color={c.color} label={`TTL: ${c.ttl}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, textAlign: "center", color: "#1e293b", fontSize: 10, letterSpacing: "0.05em" }}>
        amrmadkour.com · github.com/AmrMadkour/amr-engineering-portfolio
      </div>
    </div>
  );
}
